import { NextResponse } from 'next/server';

export const revalidate = 3600; // Cache for 1 hour globally

export async function GET(req: Request) {
  try {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Deekshith-goud';

    const headers: Record<string, string> = {};
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`, {
      headers,
      signal: controller.signal,
      next: { revalidate: 3600 }
    });
    
    clearTimeout(timeoutId);

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
