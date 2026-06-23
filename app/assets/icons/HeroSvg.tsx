"use client";

import React, { useEffect, useState } from "react";

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
          src="https://my.spline.design/stackableglass-FQ4kmIx3cjy8bKHEpuujITrn-0N0/" 
          frameBorder="0" 
          width="100%" 
          height="100%"
          className="w-full h-full absolute inset-0 z-10"
        />

        {/* Loading state while the 3D model loads */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-transparent">
            <div className="w-8 h-8 border-4 border-zinc-200 dark:border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
          </div>
        )}

      </div>
    </div>
  );
}