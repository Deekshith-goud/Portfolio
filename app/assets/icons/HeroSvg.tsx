"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SiReact, SiNextdotjs, SiTailwindcss, SiTypescript } from "react-icons/si";

const FloatingBadge = ({ children, className, delay }: { children: React.ReactNode, className: string, delay: number }) => (
  <motion.div
    initial={{ y: 0 }}
    animate={{ y: [-10, 10, -10] }}
    transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay }}
    className={`absolute z-20 flex items-center justify-center w-12 h-12 rounded-xl bg-white/80 dark:bg-zinc-800/80 backdrop-blur-lg border border-zinc-200 dark:border-zinc-700/50 shadow-xl ${className}`}
  >
    {children}
  </motion.div>
);

export default function HeroSvg() {
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="absolute -inset-1 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-900 rounded-[2.5rem] blur-2xl opacity-50"></div>
      
      {/* The Spline container */}
      <div className="relative w-full h-full flex items-center justify-center">
        
        <iframe 
          src="https://my.spline.design/stackableglass-OdIy9jdBNAgSdsTQC6ncSxTj-fHo/" 
          frameBorder="0" 
          width="100%" 
          height="100%" 
          className="w-full h-full absolute inset-0 z-10 scale-[1.35]"
          style={{  
            colorScheme: "light",
            clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 70px), calc(100% - 170px) calc(100% - 70px), calc(100% - 170px) 100%, 0 100%)"
          }}
        />

        {/* Floating Tech Badges */}
        <FloatingBadge className="top-10 left-10 md:top-14 md:left-14 text-[#61DAFB]" delay={0}>
          <SiReact className="w-6 h-6" />
        </FloatingBadge>
        <FloatingBadge className="top-16 right-6 md:top-20 md:right-10 text-black dark:text-white" delay={1.5}>
          <SiNextdotjs className="w-6 h-6" />
        </FloatingBadge>
        <FloatingBadge className="bottom-20 left-8 md:bottom-28 md:left-12 text-[#3178C6]" delay={3}>
          <SiTypescript className="w-5 h-5" />
        </FloatingBadge>
        <FloatingBadge className="bottom-10 right-14 md:bottom-14 md:right-20 text-[#38B2AC]" delay={2}>
          <SiTailwindcss className="w-6 h-6" />
        </FloatingBadge>

        {/* Loading state while the 3D model loads */}
        {isLoading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-transparent">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}

      </div>
    </div>
  );
}