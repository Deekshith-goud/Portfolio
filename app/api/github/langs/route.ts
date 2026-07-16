import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour globally

export async function GET(req: Request) {
  try {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Deekshith-goud';

    const headers: Record<string, string> = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const fetchWithTimeout = (url: string) => Promise.race([
      fetch(url, {
        headers,
        next: { revalidate: 3600 }
      }),
      new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('GitHub API Timeout')), 8000))
    ]);

    const response = await fetchWithTimeout(`https://api.github.com/users/${username}/repos?per_page=100`);

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
