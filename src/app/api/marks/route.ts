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

export async function GET() {
  try {
    // Fetch all parts
    const query = `*[_type == "visitorMarksGallery"] { marks }`;
    const parts = await readClient.fetch(query);
    
    // Combine all marks into one flat array
    let allMarks: any[] = [];
    if (parts && parts.length > 0) {
      for (const part of parts) {
        if (part.marks) {
          allMarks = [...allMarks, ...part.marks];
        }
      }
    }
    
    // Sort all marks by createdAt descending (newest first)
    allMarks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return NextResponse.json({ marks: allMarks, success: true });
  } catch (error: any) {
    console.error('Visitor Marks API GET Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorName, description, svgContent, color, canvasWidth, canvasHeight } = body;

    if (!authorName || !svgContent) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.SANITY_API_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Missing Sanity API token' }, { status: 500 });
    }

    const newMark = {
      _key: Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10),
      authorName,
      description: description || '',
      svgContent,
      color: color || '#000000',
      canvasWidth: canvasWidth || 500,
      canvasHeight: canvasHeight || 400,
      createdAt: new Date().toISOString(),
    };

    // Calculate approximate byte size of the new mark
    const markSize = new TextEncoder().encode(JSON.stringify(newMark)).length;

    // Sanity document max size is 32MB. We roll over at 30,000,000 (~30MB) to be safe.
    const SAFE_LIMIT = 30000000;

    // Fetch ALL gallery documents to find the first one with enough space (Bin Packing)
    const partsQuery = `*[_type == "visitorMarksGallery"] | order(partIndex asc) { _id, partIndex, estimatedBytes }`;
    const allParts = await readClient.fetch(partsQuery);

    let targetPart = null;
    let maxPartIndex = 0;

    for (const part of allParts) {
      if (part.partIndex > maxPartIndex) {
        maxPartIndex = part.partIndex;
      }
      // If this part has enough space for the new drawing, we select it!
      if ((part.estimatedBytes || 0) + markSize <= SAFE_LIMIT) {
        targetPart = part;
        break; // Stop at the first available bin
      }
    }

    if (targetPart) {
      // Append to the found available document
      await writeClient
        .patch(targetPart._id)
        .setIfMissing({ marks: [] })
        .append('marks', [newMark])
        .inc({ estimatedBytes: markSize })
        .commit({ autoGenerateArrayKeys: true });
    } else {
      // ALL existing documents are full (or none exist)! Create a new one.
      const newPartIndex = maxPartIndex + 1;
      await writeClient.create({
        _type: 'visitorMarksGallery',
        partIndex: newPartIndex,
        estimatedBytes: markSize,
        marks: [newMark],
      });
    }

    return NextResponse.json({ success: true, mark: newMark });
  } catch (error: any) {
    console.error('Visitor Marks API POST Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
