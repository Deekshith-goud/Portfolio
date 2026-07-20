"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDevicePerformance } from "../../hooks/useDevicePerformance";

// Reverting back to the tech stack icons
import { SiReact, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";

// Removes local alias to use motion directly

// --- Option: Blueprint Grid ---
const BlueprintGrid = () => (
  <motion.div
    animate={{ backgroundPosition: ['0px 0px', '40px 40px'] }}
    transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
    className="absolute -inset-20 z-0 opacity-40 dark:opacity-20 pointer-events-none"
    style={{
      backgroundImage: `linear-gradient(to right, #71717a 1px, transparent 1px), linear-gradient(to bottom, #71717a 1px, transparent 1px)`,
      backgroundSize: '40px 40px',
      WebkitMaskImage: 'radial-gradient(circle at center, black 25%, transparent 65%)',
      maskImage: 'radial-gradient(circle at center, black 25%, transparent 65%)',
    }}
  />
);

// --- Minimalist Expanding Badges ---
const ExpandingBadge = ({ icon: Icon, label, className, delay }: { icon: React.ElementType, label: string, className: string, delay: number }) => {
  return (
    <motion.div
      initial={{ y: 0, rotateZ: 0 }}
      animate={{ y: [-5, 5, -5], rotateZ: [-1, 1, -1] }}
      transition={{ y: { repeat: Infinity, duration: 12, ease: "easeInOut", delay }, rotateZ: { repeat: Infinity, duration: 16, ease: "easeInOut", delay } }}
      className={`absolute z-30 ${className}`}
    >
      <motion.div
        initial="rest"
        whileHover="hover"
        className="flex items-center h-12 md:h-14 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-lg cursor-pointer text-zinc-700 dark:text-zinc-300 transition-colors hover:bg-white/60 dark:hover:bg-white/10 overflow-hidden"
      >
        <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4 md:w-5 md:h-5" aria-label={label} role="img" />
        </div>
        <motion.span
          variants={{
            rest: { maxWidth: 0, opacity: 0, paddingRight: 0 },
            hover: { maxWidth: 140, opacity: 1, paddingRight: 16 }
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="font-medium text-xs md:text-sm whitespace-nowrap overflow-hidden block"
        >
          {label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

const FloatingStatement = ({ text, className, delay }: { text: string, className: string, delay: number }) => (
  <motion.div
    initial={{ y: 0, rotateZ: 0 }}
    animate={{ y: [-3, 3, -3], rotateZ: [-1, 1, -1] }}
    transition={{ y: { repeat: Infinity, duration: 12, ease: "easeInOut", delay }, rotateZ: { repeat: Infinity, duration: 16, ease: "easeInOut", delay } }}
    className={`absolute z-20 px-3 py-2 md:px-4 md:py-2.5 rounded-md bg-white/40 dark:bg-zinc-900/70 backdrop-blur-md border border-white/50 dark:border-zinc-700/50 border-l-2 border-l-emerald-500 dark:border-l-emerald-400 shadow-xl text-[10px] md:text-xs font-mono font-medium tracking-tight text-zinc-800 dark:text-zinc-200 max-w-[160px] md:max-w-[200px] ${className}`}
  >
    {text}
  </motion.div>
);

const ExpandingIconsOption = () => {
  return (
    <>
      {/* Tech Icons placed back into the asymmetrical layout with functional labels */}
      <ExpandingBadge icon={SiReact} label="UI Architecture" className="top-[8%] left-[20%] md:top-[12%] md:left-[18%]" delay={0} />
      <ExpandingBadge icon={SiNextdotjs} label="Full-Stack" className="top-[45%] right-[2%] md:top-[50%] md:-right-[2%]" delay={1.5} />
      <ExpandingBadge icon={SiTypescript} label="Type Safety" className="bottom-[35%] left-[2%] md:bottom-[40%] md:-left-[2%]" delay={3} />
      <ExpandingBadge icon={SiTailwindcss} label="Rapid Styling" className="bottom-[8%] right-[20%] md:bottom-[12%] md:right-[18%]" delay={2} />

      {/* Statements (Blocky Technical Tags, avoiding icons) */}
      <FloatingStatement text="The building is how I learn." className="top-[2%] right-[5%] md:top-[4%] md:right-[2%]" delay={1} />
      <FloatingStatement text="The learning is why I keep building." className="bottom-[2%] left-[5%] md:bottom-[4%] md:left-[2%]" delay={2.5} />
    </>
  );
};

export default function HeroSvg() {
  const [isLoading, setIsLoading] = useState(true);
  const tier = useDevicePerformance();
  const isLowEnd = tier === "low";

  useEffect(() => {
    // Hide loading spinner after a short delay allowing Spline to mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-[320px] h-[320px] sm:w-[380px] sm:h-[380px] lg:w-[440px] lg:h-[440px] xl:w-[480px] xl:h-[480px] shrink-0 mx-auto xl:ml-auto">

      {/* Decorative background glow behind the card */}
      <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] blur-2xl opacity-50 pointer-events-none"></div>

      {/* Blueprint Grid Backdrop */}
      <BlueprintGrid />

      {/* The Spline container */}
      <div className="relative w-full h-full flex items-center justify-center">

        {/* Holographic Glitch Wrapper */}
        <motion.div
          className="hidden md:block w-full h-full absolute inset-0 z-10 scale-[1.35]"
          animate={{
            x: isLowEnd ? 0 : [0, -3, 3, -1, 1, 0, 0],
            filter: isLowEnd ? "none" : [
              "drop-shadow(0px 0 0 rgba(255,0,0,0)) drop-shadow(0px 0 0 rgba(0,255,255,0))",
              "drop-shadow(-4px 0 0 rgba(255,0,0,0.6)) drop-shadow(4px 0 0 rgba(0,255,255,0.6))",
              "drop-shadow(4px 0 0 rgba(255,0,0,0.6)) drop-shadow(-4px 0 0 rgba(0,255,255,0.6))",
              "drop-shadow(0px 0 0 rgba(255,0,0,0)) drop-shadow(0px 0 0 rgba(0,255,255,0))",
              "drop-shadow(0px 0 0 rgba(255,0,0,0)) drop-shadow(0px 0 0 rgba(0,255,255,0))"
            ]
          }}
          transition={{ duration: 0.3, repeat: Infinity, repeatDelay: 10 }}
        >
          <iframe
            src="https://my.spline.design/stackableglass-FQ4kmIx3cjy8bKHEpuujITrn-0N0/"
            frameBorder="0"
            width="100%"
            height="100%"
            title="3D Spline Glass Design"
            className="w-full h-full"
            style={{
              colorScheme: "light",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 70px), calc(100% - 170px) calc(100% - 70px), calc(100% - 170px) 100%, 0 100%)"
            }}
          />
        </motion.div>

        {/* Dynamic Themed Icons & Statements */}
        <ExpandingIconsOption />

        {/* Loading state while the 3D model loads */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-transparent pointer-events-none">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}

      </div>

    </div>
  );
}