"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Slide } from "@/app/animation/Slide";
import CustomActivityGraph from "./CustomActivityGraph";
import NativeStreakWidget from "./NativeStreakWidget";
import NativeTopLangsWidget from "./NativeTopLangsWidget";

export default function GithubStats() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  return (
    <section className="mt-24 mb-24 font-incognito">
      <Slide delay={0.16} className="mb-8">
        <h2 className="text-4xl font-black tracking-tight mb-2">
          GitHub Metrics
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          A real-time dashboard of my open-source contributions.
        </p>
      </Slide>

      <Slide delay={0.18}>
        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          
          {/* BENTO ITEM 1: Interactive Activity Graph (Spans 2 columns) */}
          <div className="lg:col-span-2 relative group bg-secondary-bg dark:bg-primary-bg border border-zinc-200 dark:border-zinc-800 p-4 sm:p-6 rounded-2xl transition-colors duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 min-h-[350px]">
             <CustomActivityGraph />
          </div>

          {/* BENTO COLUMN: Stacked Stats */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* BENTO ITEM 2: Top Languages */}
            <div className="flex-1 relative group overflow-hidden bg-secondary-bg dark:bg-primary-bg border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl transition-colors duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center justify-center">
              <NativeTopLangsWidget />
            </div>

            {/* BENTO ITEM 3: Contribution Streak */}
            <div className="relative group overflow-hidden bg-secondary-bg dark:bg-primary-bg border border-zinc-200 dark:border-zinc-800 p-4 rounded-2xl transition-colors duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 flex items-center justify-center">
              <NativeStreakWidget />
            </div>

          </div>
        </div>
      </Slide>
    </section>
  );
}
