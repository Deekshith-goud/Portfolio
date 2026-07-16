"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MotionCircle = motion.circle as any;

export default function NativeStreakWidget() {
  const [data, setData] = useState<{
    totalCommits: number;
    longestStreak: number;
    totalPRs: number;
    totalIssues: number;
    grade: string;
    gradeColor: string;
    scorePercent: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Deekshith-goud";
        
        const cacheKey = `github_stats_${username}`;
        const cached = sessionStorage.getItem(cacheKey);
        if (cached) {
          setData(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const fetchWithTimeout = (url: string) => Promise.race([
          fetch(url),
          new Promise<Response>((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
        ]);
        const res = await fetchWithTimeout(`/api/github/stats`);
        if (!res.ok) throw new Error("Failed to fetch stats");
        
        const { commits: commitsData, prs: prsData, issues: issuesData } = await res.json();

        // Calculate total commits
        const totalCommits = commitsData.totalContributions || 0;
        
        // Calculate longest streak
        let currentStreak = 0;
        let maxStreak = 0;
        const flattened = commitsData.contributions?.flat() || [];
        for (const day of flattened) {
          if (day.contributionCount > 0) {
            currentStreak++;
            maxStreak = Math.max(maxStreak, currentStreak);
          } else {
            currentStreak = 0;
          }
        }
        const longestStreak = maxStreak;

        const totalPRs = prsData.total_count || 0;
        const totalIssues = issuesData.total_count || 0;

        // Calculate Grade
        let score = 0;
        
        // Commits (up to 40 points)
        if (totalCommits > 5000) score += 40;
        else if (totalCommits > 2000) score += 30;
        else if (totalCommits > 1000) score += 20;
        else if (totalCommits > 500) score += 15;
        else if (totalCommits > 200) score += 10;
        else if (totalCommits > 50) score += 5;
        
        // Streak (up to 20)
        if (longestStreak > 100) score += 20;
        else if (longestStreak > 50) score += 15;
        else if (longestStreak > 30) score += 10;
        else if (longestStreak > 10) score += 5;

        // PRs (up to 25)
        if (totalPRs > 100) score += 25;
        else if (totalPRs > 50) score += 20;
        else if (totalPRs > 20) score += 15;
        else if (totalPRs > 5) score += 10;
        else if (totalPRs > 0) score += 5;

        // Issues (up to 15)
        if (totalIssues > 50) score += 15;
        else if (totalIssues > 20) score += 10;
        else if (totalIssues > 5) score += 5;
        else if (totalIssues > 0) score += 2;

        let grade = "C";
        let gradeColor = "#ef4444"; // Red
        let scorePercent = 20;

        if (score >= 90) { grade = "S+"; gradeColor = "#8b5cf6"; scorePercent = 100; }
        else if (score >= 80) { grade = "S"; gradeColor = "#33E092"; scorePercent = 90; }
        else if (score >= 70) { grade = "A++"; gradeColor = "#0ea5e9"; scorePercent = 85; }
        else if (score >= 60) { grade = "A+"; gradeColor = "#0ea5e9"; scorePercent = 75; }
        else if (score >= 50) { grade = "A"; gradeColor = "#3b82f6"; scorePercent = 65; }
        else if (score >= 40) { grade = "B+"; gradeColor = "#eab308"; scorePercent = 55; }
        else if (score >= 30) { grade = "B"; gradeColor = "#f59e0b"; scorePercent = 45; }
        else if (score >= 25) { grade = "C+"; gradeColor = "#f97316"; scorePercent = 35; }

        const result = { totalCommits, longestStreak, totalPRs, totalIssues, grade, gradeColor, scorePercent };
        sessionStorage.setItem(cacheKey, JSON.stringify(result));
        setData(result);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div data-testid="streak-skeleton" className="min-h-[160px]" />;
  if (!data) return null;

  const radius = 42;
  const strokeWidth = 5;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (data.scorePercent / 100) * circumference;

  return (
    <div className="w-full relative z-10 font-incognito flex flex-col p-1">
      
      <div className="flex justify-between items-center mb-2 z-10 relative pointer-events-none">
        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-200">
          GitHub Stats
        </h3>
      </div>

      <div className="flex flex-row items-center justify-between w-full">
        {/* Left List of Stats */}
        <div className="flex flex-col gap-1 w-full pr-4">
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Total Commits:</span>
          <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{data.totalCommits}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Longest Streak:</span>
          <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{data.longestStreak}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Total PRs:</span>
          <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{data.totalPRs}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">Total Issues:</span>
          <span className="text-sm font-black text-zinc-900 dark:text-zinc-100">{data.totalIssues}</span>
        </div>

      </div>

      {/* Right Circular Grade Badge */}
      <div className="relative flex items-center justify-center pl-4">
        <svg height={80} width={80} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx="40"
            cy="40"
            r={32}
            fill="none"
            strokeWidth={4}
            className="stroke-zinc-200 dark:stroke-zinc-800"
          />
          
          {/* Animated Grade Ring */}
          <MotionCircle
            cx="40"
            cy="40"
            r={32}
            fill="none"
            strokeWidth={4}
            stroke={data.gradeColor}
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 32 + " " + 2 * Math.PI * 32}
            initial={{ strokeDashoffset: 2 * Math.PI * 32 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 32 - (data.scorePercent / 100) * 2 * Math.PI * 32 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          />
        </svg>
        
        {/* Grade Letter inside the circle */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pl-4">
          <span 
            className="text-2xl font-black"
            style={{ color: data.gradeColor }}
          >
            {data.grade}
          </span>
        </div>
      </div>
      
      </div>
    </div>
  );
}
