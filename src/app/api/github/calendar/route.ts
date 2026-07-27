import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

async function fetchFromGitHubGraphQL(username: string) {
  const joinYear = Number(process.env.NEXT_PUBLIC_GITHUB_JOIN_YEAR) || 2024;
  const currentYear = new Date().getFullYear();

  let yearQueries = "";
  for (let year = joinYear; year <= currentYear; year++) {
    yearQueries += `
      y${year}: contributionsCollection(from: "${year}-01-01T00:00:00Z", to: "${year}-12-31T23:59:59Z") {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
            }
          }
        }
      }
    `;
  }

  const query = `
    query($username: String!) {
      user(login: $username) {
        ${yearQueries}
      }
    }
  `;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `bearer ${GITHUB_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, variables: { username } }),
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) return null;

    const json = await res.json();
    const user = json?.data?.user;
    if (!user) return null;

    const allDaysMap = new Map<string, number>();

    for (let year = joinYear; year <= currentYear; year++) {
      const weeks = user[`y${year}`]?.contributionCalendar?.weeks || [];
      for (const w of weeks) {
        for (const d of w.contributionDays) {
          allDaysMap.set(d.date, d.contributionCount);
        }
      }
    }

    const allDays = Array.from(allDaysMap.entries())
      .map(([date, contributionCount]) => ({ date, contributionCount }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return allDays;
  } catch (err) {
    console.error("GitHub GraphQL Fetch Failed:", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchFromFallbackAPI(username: string) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`, {
      signal: controller.signal,
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.contributions?.flat() || [];
  } catch (err) {
    console.error("Fallback GitHub API Fetch Failed:", err);
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function GET() {
  try {
    const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || 'Deekshith-goud';

    let rawDays: any[] | null = null;

    if (GITHUB_TOKEN) {
      rawDays = await fetchFromGitHubGraphQL(username);
    }

    if (!rawDays) {
      rawDays = await fetchFromFallbackAPI(username);
    }

    if (!rawDays || rawDays.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch GitHub calendar data' }, { status: 500 });
    }

    const nonZeroCounts = rawDays
      .map((d: any) => d.contributionCount)
      .filter((c: number) => c > 0)
      .sort((a: number, b: number) => a - b);

    let p25 = 1, p50 = 2, p75 = 3;
    if (nonZeroCounts.length > 0) {
      p25 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.25)];
      p50 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.50)];
      p75 = nonZeroCounts[Math.floor(nonZeroCounts.length * 0.75)];
    }

    const activities = rawDays.map((day: any) => {
      let level = 0;
      if (day.contributionCount === 0) level = 0;
      else if (day.contributionCount <= p25) level = 1;
      else if (day.contributionCount <= p50) level = 2;
      else if (day.contributionCount <= p75) level = 3;
      else level = 4;

      return {
        date: typeof day.date === 'string' ? day.date.split('T')[0] : day.date,
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
