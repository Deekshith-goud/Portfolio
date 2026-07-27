"use client";
import { useTheme } from "next-themes";
import { ActivityCalendar } from "react-activity-calendar";
import { github } from "@/data/contribution-graph-theme";
import { useState, useEffect } from "react";
import YearButton from "../shared/YearButton";
import { getGitHubYears } from "@/utils/calculate-years";
import EmptyState from "../shared/EmptyState";
import { IoIosAnalytics } from "react-icons/io";

export default function ContributionGraph() {
  const [calendarYear, setCalendarYear] = useState<number | undefined>(undefined);
  const { theme, systemTheme } = useTheme();
  const [serverTheme, setServerTheme] = useState<"light" | "dark" | undefined>(
    undefined
  );
  const [data, setData] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);

  const scheme =
    theme === "light" ? "light" : theme === "dark" ? "dark" : systemTheme;

  useEffect(() => {
    setServerTheme(scheme);
  }, [scheme]);

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    fetch("/api/github/calendar", { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setData(data);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error(err);
        }
      })
      .finally(() => {
        clearTimeout(timeoutId);
        setLoading(false);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  const joinYear = Number(process.env.NEXT_PUBLIC_GITHUB_JOIN_YEAR);
  const years = getGitHubYears(joinYear);

  if (!joinYear)
    return (
      <EmptyState
        icon={<IoIosAnalytics />}
        title="Unable to load Contribution Graph"
        message="We could not find the year you joined GitHub in the .env file."
      />
    );

  if (loading) return <div className="min-h-[180px] w-full bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded-lg" />;
  
  if (!data || data.length === 0)
    return (
      <EmptyState
        icon={<IoIosAnalytics />}
        title="Unable to load Contribution Graph"
        message="Could not fetch GitHub calendar data. Please try again later."
      />
    );

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter data by year if year is selected, otherwise default to last 365 days ending today
  let filteredData = calendarYear 
    ? data.filter(d => d.date.startsWith(calendarYear.toString()))
    : data.filter(d => d.date <= todayStr).slice(-365);

  if (calendarYear) {
    const yearStartStr = `${calendarYear}-01-01`;
    const yearEndStr = `${calendarYear}-12-31`;

    if (filteredData.length === 0) {
      const yearStart = new Date(Date.UTC(calendarYear, 0, 1));
      const yearEnd = new Date(Date.UTC(calendarYear, 11, 31));
      let curr = new Date(yearStart);
      while (curr <= yearEnd) {
        filteredData.push({
          date: curr.toISOString().split('T')[0],
          count: 0,
          level: 0
        });
        curr.setDate(curr.getDate() + 1);
      }
    } else {
      const lastDateStr = filteredData[filteredData.length - 1].date;

      if (lastDateStr < yearEndStr) {
        let curr = new Date(lastDateStr);
        curr.setDate(curr.getDate() + 1);
        const targetEndDate = new Date(yearEndStr);
        while (curr <= targetEndDate) {
          filteredData.push({
            date: curr.toISOString().split('T')[0],
            count: 0,
            level: 0
          });
          curr.setDate(curr.getDate() + 1);
        }
      }
      
      const firstDateStr = filteredData[0].date;
      if (firstDateStr > yearStartStr) {
        let curr = new Date(yearStartStr);
        const firstDate = new Date(firstDateStr);
        const prefix = [];
        while (curr < firstDate) {
          prefix.push({
            date: curr.toISOString().split('T')[0],
            count: 0,
            level: 0
          });
          curr.setDate(curr.getDate() + 1);
        }
        filteredData = [...prefix, ...filteredData];
      }
    }
  }

  if (filteredData.length === 0) {
    return (
      <EmptyState
        icon={<IoIosAnalytics />}
        title="No Activity Data"
        message="There is no activity data available for this period."
      />
    );
  }

  return (
    <div className="flex xl:flex-row flex-col gap-4">
      <div className="dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 p-4 sm:p-8 rounded-lg max-w-full max-h-fit overflow-x-auto">
        <ActivityCalendar
          data={filteredData}
          theme={github}
          colorScheme={serverTheme}
          blockSize={13}
        />
      </div>
      <div className="flex justify-start xl:flex-col flex-row flex-wrap gap-2">
        {/* Display only the last five years */}
        {years.slice(0, 5).map((year) => (
          <YearButton
            key={year}
            year={year}
            currentYear={calendarYear}
            onClick={() =>
              setCalendarYear(year === calendarYear ? undefined : year)
            }
          />
        ))}
      </div>
    </div>
  );
}
