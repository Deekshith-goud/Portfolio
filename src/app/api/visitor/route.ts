import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { projectId, dataset, apiVersion } from '@/sanity/lib/env.api';

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
const statsId = 'site-stats';
const visitorQuery = `*[_type == 'visitor' && visitorId == $visitorId][0]{_id, _createdAt, visitNumber}`;
const statsQuery = `*[_id == $id][0]{views, _rev}`;

export async function POST(req: Request) {
  try {
    const { visitor_id: visitorId } = await req.json().catch(() => ({ visitor_id: null }));

    if (!visitorId || typeof visitorId !== 'string' || !/^[a-f0-9]{64}$/i.test(visitorId)) {
      return NextResponse.json({ error: 'Missing or invalid visitor fingerprint' }, { status: 400 });
    }
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Missing Sanity API token' }, { status: 500 });
    }

    await writeClient.createIfNotExists({ _id: statsId, _type: 'siteStats', views: 0 });

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const [existingVisitor, stats] = await Promise.all([
        readClient.fetch<{ _id: string; _createdAt: string; visitNumber?: number } | null>(visitorQuery, { visitorId }),
        readClient.fetch<{ views?: number; _rev: string } | null>(statsQuery, { id: statsId }),
      ]);

      if (!stats) {
        // Sanity's read API can lag slightly behind the createIfNotExists call.
        // Wait 500ms and retry to let it sync.
        await new Promise((r) => setTimeout(r, 500));
        continue;
      }

      if (existingVisitor?.visitNumber) {
        return NextResponse.json({ count: stats.views ?? 0, position: existingVisitor.visitNumber, success: true });
      }

      // Visitors created before `visitNumber` was introduced are assigned their
      // original creation-order position once, then use the same normal path.
      if (existingVisitor) {
        const position = await readClient.fetch<number>(
          `count(*[_type == 'visitor' && (_createdAt < $createdAt || (_createdAt == $createdAt && _id <= $id))])`,
          { createdAt: existingVisitor._createdAt, id: existingVisitor._id },
        );
        await writeClient.patch(existingVisitor._id).set({ visitNumber: position }).commit();
        return NextResponse.json({ count: stats?.views ?? 0, position, success: true });
      }

      const count = stats?.views ?? 0;
      const position = count + 1;
      
      try {
        await writeClient.transaction()
          .create({
            _id: `visitor-${visitorId}`,
            _type: 'visitor',
            visitorId,
            visitNumber: position,
            timestamp: new Date().toISOString(),
          })
          .patch(statsId, (patch) => patch.ifRevisionId(stats!._rev).set({ views: position }))
          .commit();

        return NextResponse.json({ count: position, position, success: true });
      } catch (error: any) {
        // A concurrent request may have created this visitor or updated the total.
        if (error.statusCode === 409 || error.message?.includes('conflict') || error.message?.includes('already exists')) {
          continue;
        }
        throw error;
      }
    }

    return NextResponse.json({ error: 'Please retry your request' }, { status: 409 });

  } catch (error: any) {
    console.error('Visitor API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
