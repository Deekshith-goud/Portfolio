"use client";

import { useEffect, useState } from "react";
import { m } from "framer-motion";

const languageColors: Record<string, string> = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Python: "#3572A5",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Go: "#00ADD8",
  Rust: "#dea584",
  Dart: "#00B4AB",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Vue: "#41b883",
  Svelte: "#ff3e00",
  Shell: "#89e051",
  Lua: "#000080",
};

export default function NativeTopLangsWidget() {
  const [langs, setLangs] = useState<{ name: string; percentage: number; color: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Deekshith-goud";
        const res = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`);
        if (!res.ok) throw new Error("Failed to fetch repos");
        
        const repos = await res.json();
        const langCounts: Record<string, number> = {};
        let totalCount = 0;

        repos.forEach((repo: any) => {
          if (!repo.fork && repo.language) {
            langCounts[repo.language] = (langCounts[repo.language] || 0) + 1;
            totalCount++;
          }
        });

        // Get Top 10 languages
        const sortedLangs = Object.entries(langCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([name, count]) => ({
            name,
            percentage: Math.round((count / totalCount) * 100),
            color: languageColors[name] || "#8B5CF6"
          }));

        setLangs(sortedLangs);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="min-h-[160px]" />;
  if (langs.length === 0) return null;

  return (
    <div className="w-full relative z-10 flex flex-col p-1">
      
      <div className="flex justify-between items-center mb-4 z-10 relative pointer-events-none">
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200 font-incognito">
          Most Used Languages
        </h3>
      </div>

      <div className="flex flex-col gap-4 w-full">
        {langs.map((lang, idx) => (
          <div key={lang.name} className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-1.5 w-full">
              <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {lang.name}
              </span>
              <span className="text-xs font-medium text-zinc-500">
                {lang.percentage}%
              </span>
            </div>
            
            {/* Minimal Progress Bar Track */}
            <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
              <m.div
                style={{ 
                  backgroundColor: lang.color, 
                  height: "100%", 
                  borderRadius: "9999px" 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ duration: 0.8, delay: idx * 0.1, ease: "easeOut" }}
              />
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
