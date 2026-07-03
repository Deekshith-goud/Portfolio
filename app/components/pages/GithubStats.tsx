"use client";

import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Slide } from "@/app/animation/Slide";
import CustomActivityGraph from "./CustomActivityGraph";

export default function GithubStats() {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Deekshith-goud";
  
  // Custom theme colors to blend with the portfolio seamlessly
  const textColor = isDark ? "a1a1aa" : "52525b";
  const titleColor = isDark ? "ffffff" : "18181b";
  const iconColor = isDark ? "33E092" : "16a34a"; // neon green
  const secondaryColor = isDark ? "8B5CF6" : "4F46E5"; // neon purple
  const bgColor = "00000000"; 

  return (
    <section className="mt-24 mb-24 font-incognito">
      <Slide delay={0.16} className="mb-8">
        <h2 className="text-4xl font-black tracking-tight mb-2">
          Coding Activity
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400">
          A real-time dashboard of my open-source contributions.
        </p>
      </Slide>

      <Slide delay={0.18}>
        {/* BENTO BOX GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
          
          {/* BENTO ITEM 1: Interactive Activity Graph (Spans 2 columns) */}
          <div className="lg:col-span-2 relative group bg-secondary-bg dark:bg-primary-bg border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl backdrop-blur-md shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-zinc-300 dark:hover:border-zinc-700 min-h-[400px]">
             <div className="absolute inset-0 bg-gradient-to-br from-primary-color/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
             <CustomActivityGraph />
             {/* Neon bottom glow */}
             <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-color to-transparent opacity-50" />
          </div>

          {/* BENTO COLUMN: Stacked Stats */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            
            {/* BENTO ITEM 2: Top Languages */}
            <div className="flex-1 relative group overflow-hidden bg-secondary-bg dark:bg-primary-bg border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl backdrop-blur-md shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-purple-500/30 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Light Mode Image */}
              <img 
                src={`https://github-readme-stats.vercel.app/api/top-langs?username=${username}&layout=compact&hide_border=true&bg_color=00000000&title_color=18181b&text_color=52525b&icon_color=4F46E5`}
                alt="Top Languages"
                className="w-full h-full object-contain relative z-10 drop-shadow-xl scale-100 group-hover:scale-105 transition-transform duration-500 block dark:hidden"
                loading="lazy"
              />
              
              {/* Dark Mode Image */}
              <img 
                src={`https://github-readme-stats.vercel.app/api/top-langs?username=${username}&layout=compact&hide_border=true&bg_color=00000000&title_color=ffffff&text_color=a1a1aa&icon_color=8B5CF6`}
                alt="Top Languages"
                className="w-full h-full object-contain relative z-10 drop-shadow-xl scale-100 group-hover:scale-105 transition-transform duration-500 hidden dark:block"
                loading="lazy"
              />

              {/* Neon bottom glow */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
            </div>

            {/* BENTO ITEM 3: Contribution Streak */}
            <div className="flex-1 relative group overflow-hidden bg-secondary-bg dark:bg-primary-bg border border-zinc-200 dark:border-zinc-800 p-5 rounded-3xl backdrop-blur-md shadow-2xl dark:shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-colors duration-300 hover:border-primary-color/30 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-bl from-primary-color/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Light Mode Image */}
              <img 
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=transparent&hide_border=true&title_color=18181b&text_color=52525b&sideNums=52525b&sideLabels=52525b&ring=16a34a&fire=16a34a&currStreakLabel=16a34a&currStreakNum=18181b`}
                alt="GitHub Streak"
                className="w-full h-full object-contain relative z-10 drop-shadow-xl scale-100 group-hover:scale-105 transition-transform duration-500 block dark:hidden"
                loading="lazy"
              />
              
              {/* Dark Mode Image */}
              <img 
                src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}&theme=transparent&hide_border=true&title_color=ffffff&text_color=a1a1aa&sideNums=a1a1aa&sideLabels=a1a1aa&ring=33E092&fire=33E092&currStreakLabel=33E092&currStreakNum=ffffff`}
                alt="GitHub Streak"
                className="w-full h-full object-contain relative z-10 drop-shadow-xl scale-100 group-hover:scale-105 transition-transform duration-500 hidden dark:block"
                loading="lazy"
              />

              {/* Neon bottom glow */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary-color to-transparent opacity-50" />
            </div>

          </div>
        </div>
      </Slide>
    </section>
  );
}
