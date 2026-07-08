import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '@/lib/env.api';

// Create a server-only client with write access
const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Must be false for mutations and fresh data
  token: process.env.SANITY_API_WRITE_TOKEN,
  ignoreBrowserTokenWarning: true,
});

export async function POST(req: Request) {
  try {
    const { visitorId } = await req.json();

    if (!visitorId) {
      return NextResponse.json({ error: 'visitorId is required' }, { status: 400 });
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      console.warn("SANITY_API_WRITE_TOKEN is missing. Visitor count won't be updated.");
      return NextResponse.json({ error: 'Missing Sanity API token' }, { status: 500 });
    }

    // Use createIfNotExists with a deterministic _id to prevent race conditions
    // (e.g. React Strict Mode firing useEffect twice concurrently)
    const docId = `visitor-${visitorId}`;
    let visitor = await writeClient.createIfNotExists({
      _id: docId,
      _type: 'visitor',
      visitorId,
    });

    // Get the total count of visitors
    const totalCount = await writeClient.fetch(`count(*[_type == "visitor"])`);
    
    // Get the position of the current visitor
    const position = await writeClient.fetch(
      `count(*[_type == "visitor" && _createdAt <= $createdAt])`,
      { createdAt: visitor._createdAt }
    );

    return NextResponse.json({ count: totalCount, position, success: true });
  } catch (error: any) {
    console.error('Visitor API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
