import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { cookies } from 'next/headers';
import { projectId, dataset, apiVersion } from '@/lib/env.api';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Create a tokenless client for reading
const readClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Ensure fresh reads
});

// Create a server-only client with write access
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  ignoreBrowserTokenWarning: true,
});

// Initialize Upstash Redis and Ratelimit.
// Returns null when Upstash is not configured — rate limiting is optional.
// Without it, the Sanity atomic transaction + cookie still prevent most duplicates.
const getRateLimiter = (): Ratelimit | null => {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null; // Skip rate limiting gracefully
  }
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Strict sliding window limit: 10 requests per minute per IP
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
  });
};

export async function POST(req: Request) {
  try {
    const { action, visitor_id } = await req.json().catch(() => ({ action: null, visitor_id: null }));
    const docId = 'site-stats';

    if (action === 'increment') {
      const origin = req.headers.get('origin');
      const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

      // Strict origin check for writes
      if (!origin || (origin !== allowedOrigin && origin !== 'https://deekshith-goud.vercel.app')) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      if (!process.env.SANITY_API_WRITE_TOKEN) {
        console.warn("SANITY_API_WRITE_TOKEN is missing. Visitor count won't be updated.");
        return NextResponse.json({ error: 'Missing Sanity API token' }, { status: 500 });
      }

      // Validate visitor_id as a valid 64-character SHA-256 hex string
      if (!visitor_id || typeof visitor_id !== 'string' || !/^[a-f0-9]{64}$/i.test(visitor_id)) {
        return NextResponse.json({ error: 'Missing or invalid visitor fingerprint' }, { status: 400 });
      }

      // Apply Upstash IP-based Rate Limit (fails closed in production, skips in dev)
      try {
        const ratelimit = getRateLimiter();
        if (ratelimit) {
          const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim()
            || req.headers.get('x-real-ip')
            || 'unknown';
          const { success } = await ratelimit.limit(`visitor_${ip}`);
          if (!success) {
            return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
          }
        }
      } catch (err) {
        console.error('Upstash Configuration Error:', err);
        return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
      }

      // Check secure cookie to prevent session-level duplicates
      const cookieStore = await cookies();
      const hasVisited = cookieStore.get('visitor_session');

      if (hasVisited) {
        // Return current count but NOT a position — client should use stored localStorage position
        const stats = await readClient.fetch(`*[_id == $id][0]`, { id: docId });
        return NextResponse.json({ count: stats?.views || 0, success: true });
      }

      // Database-backed duplicate protection using Sanity Atomic Transaction.
      // writeClient.create() on a doc with a known _id is atomic:
      // if the document already exists, Sanity throws 409 — aborting the whole transaction.
      const visitorDocId = `visitor-${visitor_id}`;

      // Ensure the stats document exists before we patch it in the transaction
      await writeClient.createIfNotExists({
        _id: docId,
        _type: 'siteStats',
        views: 0,
      });

      let newPosition: number;
      try {
        // Run create and increment in a single atomic transaction
        const result = await writeClient.transaction()
          .create({
            _id: visitorDocId,
            _type: 'visitor',
            visitorId: visitor_id,
            timestamp: new Date().toISOString(),
          })
          .patch(docId, (p) => p.inc({ views: 1 }))
          .commit();

        // The result from the transaction gives us the updated doc — but we need the view count
        // Fetch fresh count immediately after the committed transaction
        const updatedStats = await readClient.fetch(`*[_id == $id][0]`, { id: docId });
        newPosition = updatedStats?.views || 0;
      } catch (err: any) {
        // If it's a conflict (document exists), this is a duplicate visitor fingerprint
        if (err.statusCode === 409 || err.message?.includes('already exists')) {
          const stats = await readClient.fetch(`*[_id == $id][0]`, { id: docId });
          // Don't reveal position — client uses its stored localStorage value
          return NextResponse.json({ count: stats?.views || 0, success: true });
        }
        throw err;
      }

      // Set an HTTP-only cookie that expires in 7 days
      cookieStore.set('visitor_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7,
      });

      // Return count AND position — client should persist this position in localStorage
      return NextResponse.json({ count: newPosition, position: newPosition, success: true });
    } else {
      // Just fetch current count - NO token required, NO mutations
      const stats = await readClient.fetch(`*[_id == $id][0]`, { id: docId });
      const currentViews = stats?.views || 0;
      return NextResponse.json({ count: currentViews, success: true });
    }

  } catch (error: any) {
    console.error('Visitor API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
