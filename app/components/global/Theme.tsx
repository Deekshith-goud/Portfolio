"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import SunIcon from "../../assets/icons/SunIcon";
import MoonIcon from "../../assets/icons/MoonIcon";

import { flushSync } from "react-dom";

export default function Theme() {
  const { systemTheme, theme, setTheme } = useTheme();
  const [hasMounted, setHasMounted] = useState(false);
  const currentTheme = theme === "system" ? systemTheme : theme;

  function toggleTheme(event: React.MouseEvent<HTMLButtonElement>) {
    const isDark = currentTheme === "dark";
    const nextTheme = isDark ? "light" : "dark";

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    const x = event.clientX;
    const y = event.clientY;

    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y)
    );

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];
      document.documentElement.animate(
        {
          clipPath: clipPath,
        },
        {
          duration: 500,
          easing: "ease-in",
          pseudoElement: "::view-transition-new(root)",
        }
      );
    });
  }
  useEffect(() => setHasMounted(true), []);

  if (!hasMounted)
    return (
      <span className="animate-pulse min-w-[28px] min-h-[28px] p-2 rounded-full dark:bg-zinc-800 bg-zinc-200 border dark:border-zinc-700 border-zinc-300"></span>
    );

  return (
    <button
      onClick={toggleTheme}
      className={`dark:bg-primary-bg bg-zinc-100 dark:text-primary-color text-zinc-500 border dark:border-zinc-800 border-zinc-200 rounded-full p-2 duration-300 transition-transform group: ${
        currentTheme === "light" ? "-rotate-180" : "rotate-0"
      }`}
      aria-label="Toggle Theme"
    >
      {currentTheme === "light" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
