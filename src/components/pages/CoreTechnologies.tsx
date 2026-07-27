"use client";

import { useState } from "react";
import {
  SiHtml5,
  SiCss3,
  SiJavascript,
  SiReact,
  SiTypescript,
  SiTailwindcss,
  SiNextdotjs,
  SiSass,
  SiNodedotjs,
  SiGit,
  SiAdobephotoshop,
  SiFigma,
  SiFirebase,
  SiMongodb,
  SiSupabase,
  SiVercel,
  SiSanity,
  SiPrisma,
  SiGraphql,
  SiNetlify,
  SiMysql,
  SiPostgresql,
  SiSqlite,
  SiGithub,
  SiNpm,
  SiPython,
} from "react-icons/si";
import { FaJava, FaEraser } from "react-icons/fa";
import { BiGridAlt, BiListUl, BiSliderAlt } from "react-icons/bi";

export default function CoreTechnologies() {
  const [activeView, setActiveView] = useState<"list" | "slider" | "grid">("slider");

  const techIcons = [
    { icon: SiHtml5, color: "#E34F26", name: "HTML5", category: "Frontend" },
    { icon: SiCss3, color: "#1572B6", name: "CSS3", category: "Frontend" },
    { icon: SiJavascript, color: "#F7DF1E", name: "JavaScript", category: "Frontend" },
    { icon: SiReact, color: "#61DAFB", name: "React", category: "Frontend" },
    { icon: SiTypescript, color: "#3178C6", name: "TypeScript", category: "Frontend" },
    { icon: SiTailwindcss, color: "#06B6D4", name: "Tailwind CSS", category: "Frontend" },
    { icon: SiNextdotjs, color: "var(--next-icon-color, #000000)", name: "Next.js", category: "Frontend" },
    { icon: SiSass, color: "#CC6699", name: "Sass", category: "Frontend" },
    { icon: SiNodedotjs, color: "#339933", name: "Node.js", category: "Backend & Database" },
    { icon: SiFirebase, color: "#FFCA28", name: "Firebase", category: "Backend & Database" },
    { icon: SiMongodb, color: "#47A248", name: "MongoDB", category: "Backend & Database" },
    { icon: SiSupabase, color: "#3ECF8E", name: "Supabase", category: "Backend & Database" },
    { icon: SiPrisma, color: "#2D3748", name: "Prisma", category: "Backend & Database" },
    { icon: SiGraphql, color: "#E10098", name: "GraphQL", category: "Backend & Database" },
    { icon: SiGit, color: "#F05032", name: "Git", category: "Tools & Others" },
    { icon: SiAdobephotoshop, color: "#31A8FF", name: "Photoshop", category: "Tools & Others" },
    { icon: SiFigma, color: "#F24E1E", name: "Figma", category: "Tools & Others" },
    { icon: SiVercel, color: "var(--next-icon-color, #000000)", name: "Vercel", category: "Tools & Others" },
    { icon: SiSanity, color: "#F03E2F", name: "Sanity", category: "Tools & Others" },
    { icon: SiNetlify, color: "#00C7B7", name: "Netlify", category: "Tools & Others" },
    { icon: SiMysql, color: "#4479A1", name: "MySQL", category: "Backend & Database" },
    { icon: SiPostgresql, color: "#4169E1", name: "PostgreSQL", category: "Backend & Database" },
    { icon: SiSqlite, color: "#003B57", name: "SQLite", category: "Backend & Database" },
    { icon: SiGithub, color: "var(--next-icon-color, #000000)", name: "GitHub", category: "Tools & Others" },
    { icon: SiNpm, color: "#CB3837", name: "npm", category: "Tools & Others" },
    { icon: FaJava, color: "#007396", name: "Java", category: "Backend & Database" },
    { icon: SiPython, color: "#3776AB", name: "Python", category: "Backend & Database" },
    { icon: FaEraser, color: "var(--next-icon-color, #000000)", name: "Eraser", category: "Tools & Others" },
  ];

  const categories = Array.from(new Set(techIcons.map((t) => t.category)));
  const isDarkIcon = (name: string) => ["Next.js", "Vercel", "Prisma", "GitHub", "Eraser"].includes(name);

  return (
    <section className="mt-32 max-w-5xl flex flex-col overflow-hidden">
      <div className="flex w-full flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
        <div className="text-left">
          <h2 className="text-4xl font-bold tracking-tight mb-2">Tech Arsenal</h2>
          <p className="dark:text-zinc-400 text-zinc-600 text-sm md:text-base max-w-md">
            Favorite tools that help me bring ideas to life. See my{" "}
            <a
              href="https://stackshare.io/"
              target="_blank"
              rel="noreferrer"
              className="italic hover:underline dark:text-zinc-300 text-zinc-700"
            >
              Stackshare
            </a>{" "}
            for more.
          </p>
        </div>

        <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800/50 p-1 rounded-md">
          <button
            onClick={() => setActiveView("list")}
            className={`p-2 rounded-md transition-colors ${
              activeView === "list"
                ? "bg-white dark:bg-zinc-700 shadow-sm"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
            }`}
            title="List View"
          >
            <BiListUl size={20} />
          </button>
          <button
            onClick={() => setActiveView("slider")}
            className={`p-2 rounded-md transition-colors ${
              activeView === "slider"
                ? "bg-white dark:bg-zinc-700 shadow-sm"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
            }`}
            title="Slider View"
          >
            <BiSliderAlt size={20} />
          </button>
          <button
            onClick={() => setActiveView("grid")}
            className={`p-2 rounded-md transition-colors ${
              activeView === "grid"
                ? "bg-white dark:bg-zinc-700 shadow-sm"
                : "hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500"
            }`}
            title="Grid View"
          >
            <BiGridAlt size={20} />
          </button>
        </div>
      </div>

      <div className="w-full">
        {/* Grid View */}
        {activeView === "grid" && (
          <div className="flex flex-wrap items-center justify-center gap-6 max-w-3xl mx-auto">
            {techIcons.map((tech) => (
              <div
                key={tech.name}
                title={tech.name}
                className="group relative flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md shadow-zinc-200 dark:bg-zinc-800/50 dark:shadow-none border border-transparent dark:border-zinc-800 hover:border-transparent transition-all hover:-translate-y-2 hover:shadow-lg duration-300 overflow-hidden cursor-pointer"
              >
                <div
                  className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ borderColor: tech.color === "var(--next-icon-color, #000000)" ? (isDarkIcon(tech.name) ? "white" : "black") : tech.color }}
                />
                <tech.icon
                  className={`w-8 h-8 relative z-10 group-hover:scale-110 transition-transform duration-300 ${isDarkIcon(tech.name) ? "dark:text-white" : ""}`}
                  style={{ color: isDarkIcon(tech.name) ? undefined : tech.color }}
                />
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {activeView === "list" && (
          <div className="flex flex-col gap-8 w-full">
            {categories.map((category) => (
              <div key={category} className="flex flex-col gap-4">
                <h3 className="text-xl font-medium dark:text-zinc-200 text-zinc-800">
                  {category}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {techIcons
                    .filter((tech) => tech.category === category)
                    .map((tech) => (
                      <div
                        key={tech.name}
                        className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm shadow-zinc-200 dark:bg-zinc-800/50 dark:shadow-none border border-transparent dark:border-zinc-800 hover:border-transparent transition-all hover:-translate-y-1 hover:shadow-md duration-300 cursor-pointer"
                      >
                        <div
                          className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                          style={{ borderColor: tech.color === "var(--next-icon-color, #000000)" ? (isDarkIcon(tech.name) ? "white" : "black") : tech.color }}
                        />
                        <tech.icon
                          className={`w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300 ${isDarkIcon(tech.name) ? "dark:text-white" : ""}`}
                          style={{ color: isDarkIcon(tech.name) ? undefined : tech.color }}
                        />
                        <span className="text-sm font-medium dark:text-zinc-200 text-zinc-800 relative z-10">
                          {tech.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Slider View */}
        {activeView === "slider" && (
          <div
            className="w-full overflow-hidden flex flex-col gap-6 py-10 relative"
            style={{
              maskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
            }}
          >
            {/* Row 1: Frontend */}
            <div className="flex gap-4 animate-marquee whitespace-nowrap min-w-full">
              {Array.from({ length: 4 })
                .flatMap(() => techIcons.filter((t) => t.category === "Frontend"))
                .map((tech, i) => (
                  <div
                    key={`r1-${i}`}
                    className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm shrink-0 hover:border-transparent transition-all hover:shadow-md duration-300 cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ borderColor: tech.color === "var(--next-icon-color, #000000)" ? (isDarkIcon(tech.name) ? "white" : "black") : tech.color }}
                    />
                    <tech.icon
                      className={`w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300 ${isDarkIcon(tech.name) ? "dark:text-white" : ""}`}
                      style={{ color: isDarkIcon(tech.name) ? undefined : tech.color }}
                    />
                    <span className="text-sm font-medium dark:text-zinc-200 text-zinc-800 relative z-10">
                      {tech.name}
                    </span>
                  </div>
                ))}
            </div>

            {/* Row 2: Backend & Database */}
            <div className="flex gap-4 animate-marquee-reverse whitespace-nowrap min-w-full">
              {Array.from({ length: 4 })
                .flatMap(() => techIcons.filter((t) => t.category === "Backend & Database"))
                .map((tech, i) => (
                  <div
                    key={`r2-${i}`}
                    className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm shrink-0 hover:border-transparent transition-all hover:shadow-md duration-300 cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ borderColor: tech.color === "var(--next-icon-color, #000000)" ? (isDarkIcon(tech.name) ? "white" : "black") : tech.color }}
                    />
                    <tech.icon
                      className={`w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300 ${isDarkIcon(tech.name) ? "dark:text-white" : ""}`}
                      style={{ color: isDarkIcon(tech.name) ? undefined : tech.color }}
                    />
                    <span className="text-sm font-medium dark:text-zinc-200 text-zinc-800 relative z-10">
                      {tech.name}
                    </span>
                  </div>
                ))}
            </div>

            {/* Row 3: Tools & Others */}
            <div className="flex gap-4 animate-marquee whitespace-nowrap min-w-full">
              {Array.from({ length: 4 })
                .flatMap(() => techIcons.filter((t) => t.category === "Tools & Others"))
                .map((tech, i) => (
                  <div
                    key={`r3-${i}`}
                    className="group relative overflow-hidden flex items-center gap-2 px-4 py-2 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm shrink-0 hover:border-transparent transition-all hover:shadow-md duration-300 cursor-pointer"
                  >
                    <div
                      className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{ borderColor: tech.color === "var(--next-icon-color, #000000)" ? (isDarkIcon(tech.name) ? "white" : "black") : tech.color }}
                    />
                    <tech.icon
                      className={`w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300 ${isDarkIcon(tech.name) ? "dark:text-white" : ""}`}
                      style={{ color: isDarkIcon(tech.name) ? undefined : tech.color }}
                    />
                    <span className="text-sm font-medium dark:text-zinc-200 text-zinc-800 relative z-10">
                      {tech.name}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
