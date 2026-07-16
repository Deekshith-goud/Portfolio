import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 86400; // Cache for 24 hours

function fetchWithAbort(url: string, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { signal: controller.signal, next: { revalidate: 86400 } })
    .finally(() => clearTimeout(timer));
}

export async function GET() {
  try {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Deekshith-goud';

    const res = await fetchWithAbort(`https://github-contributions-api.deno.dev/${username}.json`);

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch GitHub calendar data' }, { status: res.status });
    }

    const data = await res.json();

    // Convert the deno API format to the react-activity-calendar format
    // react-activity-calendar expects: { date: string, count: number, level: 0|1|2|3|4 }

    const flattened = data.contributions?.flat() || [];

    // Calculate "GitHub-like" percentiles for heatmap coloring.
    // NOTE: This is a best-effort approximation of GitHub's proprietary
    // contribution level algorithm using quartiles. Colors may differ slightly
    // from GitHub's own profile page.
    const nonZeroCounts = flattened
      .map((d: any) => d.contributionCount)
      .filter((c: number) => c > 0)
      .sort((a: number, b: number) => a - b);

    let p25 = 1, p50 = 2, p75 = 3;
    if (nonZeroCounts.length > 0) {
      p25 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.25)];
      p50 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.50)];
      p75 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.75)];
    }

    const activities = flattened.map((day: any) => {
      // "GitHub-like" percentile-based level mapping (approximation)
      let level = 0;
      if (day.contributionCount === 0) level = 0;
      else if (day.contributionCount <= p25) level = 1;
      else if (day.contributionCount <= p50) level = 2;
      else if (day.contributionCount <= p75) level = 3;
      else level = 4;

      return {
        date: day.date.split('T')[0],
        count: day.contributionCount,
        level: level,
      };
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('GitHub Calendar Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
