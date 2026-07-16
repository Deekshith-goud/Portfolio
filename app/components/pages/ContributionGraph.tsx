"use client";
import { useTheme } from "next-themes";
import ActivityCalendar from "react-activity-calendar";
import { github } from "@/app/data/contribution-graph-theme";
import { useState, useEffect } from "react";
import YearButton from "../shared/YearButton";
import { getGitHubYears } from "@/app/utils/calculate-years";
import EmptyState from "../shared/EmptyState";
import { IoIosAnalytics } from "react-icons/io";

export default function ContributionGraph() {
  const [calendarYear, setCalendarYear] = useState<number | undefined>(
    undefined
  );
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
    fetch("/api/github/calendar")
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) setData(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date().getFullYear();
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

  // Filter data by year if year is selected
  const filteredData = calendarYear 
    ? data.filter(d => d.date.startsWith(calendarYear.toString()))
    : data.slice(-365); // Default to last 365 days

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
            currentYear={calendarYear ?? today}
            onClick={() =>
              setCalendarYear(year === calendarYear ? undefined : year)
            }
          />
        ))}
      </div>
    </div>
  );
}
