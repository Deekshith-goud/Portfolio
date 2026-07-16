import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Cache for 1 hour globally

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

function fetchWithAbort(url: string, timeoutMs = 8000, extraHeaders?: HeadersInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const headers: HeadersInit = {
    Accept: 'application/vnd.github.v3+json',
    ...(GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {}),
    ...extraHeaders,
  };
  return fetch(url, { signal: controller.signal, next: { revalidate: 3600 }, headers })
    .finally(() => clearTimeout(timer));
}

export async function GET(req: Request) {
  try {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Deekshith-goud';

    // Fetch the data from the external APIs
    const [commitsRes, prsRes, issuesRes] = await Promise.all([
      fetchWithAbort(`https://github-contributions-api.deno.dev/${username}.json`, 8000, {}),
      fetchWithAbort(`https://api.github.com/search/issues?q=author:${username}+type:pr`),
      fetchWithAbort(`https://api.github.com/search/issues?q=author:${username}+type:issue`),
    ]);

    if (!commitsRes.ok || !prsRes.ok || !issuesRes.ok) {
      return NextResponse.json({ error: 'Failed to fetch GitHub data' }, { status: 500 });
    }

    const [commits, prs, issues] = await Promise.all([
      commitsRes.json(),
      prsRes.json(),
      issuesRes.json(),
    ]);

    return NextResponse.json({ commits, prs, issues });
  } catch (error) {
    console.error('GitHub API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
