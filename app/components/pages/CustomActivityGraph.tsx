"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";

// Bypass Framer Motion / Sanity TS type collisions 
const MotionDiv = motion.div as any;
type Contribution = {
  date: string;
  contributionCount: number;
};

// --- CSS 3D Cube Component ---
const Cube = React.memo(({ 
  count, 
  isDark, 
  isHovered, 
  onHover,
  index,
  isTop5,
  dayData
}: { 
  count: number; 
  isDark: boolean; 
  isHovered: boolean;
  onHover: (day: any) => void;
  index: number;
  isTop5?: boolean;
  dayData: any;
}) => {
  const size = 14; 
  const baseHeight = 4; 
  const heightMultiplier = 4; 
  const height = baseHeight + (count * heightMultiplier);

  // Volumetric Colors & Gradients
  let colorTop, gradientLeft, gradientRight, borderStyle;
  
  if (count === 0) {
    // High-Tech Metallic (Dark) vs Crisp Silver Bezel (Light)
    colorTop = isDark 
      ? "linear-gradient(135deg, rgba(63, 63, 70, 0.6), rgba(24, 24, 27, 0.8))" 
      : "linear-gradient(135deg, rgba(255, 255, 255, 1) 0%, rgba(228, 228, 231, 0.8) 100%)";
    gradientLeft = isDark 
      ? "rgba(24, 24, 27, 0.8)" 
      : "rgba(161, 161, 170, 0.5)"; // Darker side for 3D depth
    gradientRight = isDark 
      ? "rgba(39, 39, 42, 0.8)" 
      : "rgba(212, 212, 216, 0.5)"; // Mid side for 3D depth
    borderStyle = isDark ? 'rgba(161, 161, 170, 0.15)' : 'rgba(161, 161, 170, 0.7)'; // Boosted light mode border opacity
  } else {
    // Volumetric Neon Tubes
    const intensity = Math.min(1, count / 5);
    
    // Glossy bright top face
    colorTop = isDark 
      ? `rgba(51, 224, 146, ${0.5 + intensity * 0.5})`
      : `linear-gradient(135deg, rgba(134, 239, 172, ${0.7 + intensity * 0.3}) 0%, rgba(34, 197, 94, ${0.6 + intensity * 0.4}) 100%)`;
    
    // Fades downwards into darkness (Dark Mode) or icy fog (Light Mode)
    const baseDark = isDark ? 'rgba(9, 9, 11, 0.6)' : 'rgba(255, 255, 255, 0.2)';
    const topGreenLeft = isDark ? `rgba(22, 163, 74, ${0.6 + intensity * 0.4})` : `rgba(34, 197, 94, ${0.7 + intensity * 0.3})`;
    const topGreenRight = isDark ? `rgba(20, 83, 45, ${0.6 + intensity * 0.4})` : `rgba(21, 128, 61, ${0.7 + intensity * 0.3})`;
    
    gradientLeft = `linear-gradient(to bottom, ${topGreenLeft}, ${baseDark})`;
    gradientRight = `linear-gradient(to bottom, ${topGreenRight}, ${baseDark})`;
    borderStyle = isDark ? 'rgba(51, 224, 146, 0.4)' : 'rgba(22, 163, 74, 0.8)'; // Boosted light mode green border
  }

  // Hover override
  if (isHovered && count > 0) {
    colorTop = isDark ? "#4ade80" : "linear-gradient(135deg, #4ade80, #22c55e)"; 
    gradientLeft = isDark ? `linear-gradient(to bottom, #22c55e, rgba(22, 163, 74, 0.2))` : `linear-gradient(to bottom, #16a34a, rgba(255, 255, 255, 0.4))`;
    gradientRight = isDark ? `linear-gradient(to bottom, #16a34a, rgba(20, 83, 45, 0.2))` : `linear-gradient(to bottom, #15803d, rgba(255, 255, 255, 0.4))`;
  } else if (isHovered && count === 0) {
    colorTop = isDark ? "rgba(113, 113, 122, 0.9)" : "rgba(255, 255, 255, 1)";
    gradientLeft = isDark ? "rgba(82, 82, 91, 0.9)" : "rgba(240, 240, 240, 1)";
    gradientRight = isDark ? "rgba(82, 82, 91, 0.9)" : "rgba(240, 240, 240, 1)";
  }

  // Outline color for wireframes (needs to be darker in light mode so it doesn't vanish on white)
  const wireframeColor = isDark ? "#33E092" : "#16a34a";
  const hoverOutline = isHovered && count > 0 ? `inset 0 0 0 1px ${wireframeColor}` : 'none';
  const baseOutline = count > 0 ? `inset 0 0 0 1px ${borderStyle}` : `inset 0 0 0 1px ${borderStyle}`;

  return (
    <div 
      className="relative cursor-pointer" 
      style={{ width: size, height: size, transformStyle: 'preserve-3d' }}
      onMouseEnter={() => onHover(dayData)}
      onMouseLeave={() => onHover(null)}
    >
      <div 
        className="w-full h-full absolute transition-transform duration-300 ease-out" 
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)' 
        }}
      >
        {/* Top Face */}
        <div className="absolute w-full h-full transition-transform duration-300 box-border" style={{ 
          background: colorTop, 
          boxShadow: baseOutline,
          transform: `translateZ(${height}px)`
        }} />
        
        {/* Front Face (Y-axis) */}
        <div className="absolute origin-bottom transition-transform duration-300 box-border" style={{ 
          background: gradientLeft, 
          boxShadow: baseOutline,
          width: size, 
          height: height, 
          top: size - height,
          transform: `rotateX(-90deg)`
        }} />

        {/* Right Face (X-axis) */}
        <div className="absolute origin-left transition-transform duration-300 box-border" style={{ 
          background: gradientRight,
          boxShadow: baseOutline,
          width: height, 
          height: size, 
          left: size,
          top: 0,
          transform: `rotateY(-90deg)`
        }} />

        {/* --- Dynamic Hover Wireframes (Back, Left, Bottom) --- */}
        {/* Back Face (Y-axis) */}
        <div className="absolute origin-bottom transition-transform duration-300 box-border" style={{ 
          background: 'transparent', 
          boxShadow: hoverOutline,
          opacity: isHovered ? 1 : 0,
          width: size, 
          height: height, 
          top: -height,
          transform: `rotateX(-90deg)`
        }} />

        {/* Left Face (X-axis) */}
        <div className="absolute origin-left transition-transform duration-300 box-border" style={{ 
          background: 'transparent', 
          boxShadow: hoverOutline,
          opacity: isHovered ? 1 : 0,
          width: height, 
          height: size, 
          left: 0,
          top: 0,
          transform: `rotateY(-90deg)`
        }} />

        {/* Bottom Face (Base Footprint) */}
        <div className="absolute w-full h-full transition-transform duration-300 box-border" style={{ 
          background: 'transparent', 
          boxShadow: hoverOutline,
          opacity: isHovered ? 1 : 0,
          transform: `translateZ(0px)`
        }} />

        {/* Data Particles for high activity */}
        {isTop5 && (
          <div className="absolute w-full h-full pointer-events-none" style={{ transform: `translateZ(${height}px)`, transformStyle: 'preserve-3d' }}>
             {[...Array(5)].map((_, i) => {
                const size = Math.random() > 0.5 ? 'w-1 h-1' : 'w-0.5 h-0.5';
                const color = Math.random() > 0.7 
                  ? (isDark ? 'bg-white shadow-[0_0_5px_white]' : 'bg-zinc-500 shadow-[0_0_5px_rgba(113,113,122,0.5)]') 
                  : (isDark ? 'bg-[#33E092] shadow-[0_0_8px_#33E092]' : 'bg-[#16a34a] shadow-[0_0_8px_#16a34a]');
                return (
                  <MotionDiv
                    key={i}
                    className={`absolute rounded-full ${size} ${color}`}
                    style={{ 
                      left: `${Math.random() * 60 + 20}%`, 
                      top: `${Math.random() * 60 + 20}%` 
                    }}
                    animate={{ 
                      translateZ: [0, 40 + Math.random() * 50],
                      x: [0, (Math.random() - 0.5) * 15],
                      y: [0, (Math.random() - 0.5) * 15],
                      opacity: [0, 1, 0],
                      scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 3,
                      ease: "easeOut"
                    }}
                  />
                );
             })}
          </div>
        )}
      </div>
    </div>
  );
});

Cube.displayName = "Cube";


export default function CustomActivityGraph() {
  const { theme, systemTheme } = useTheme();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [hoveredBlock, setHoveredBlock] = useState<any>(null);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Framer Motion 3D Rotation State
  const rotateX = useMotionValue(60);
  const rotateZ = useMotionValue(-45);
  
  const handleDrag = (event: any, info: PanInfo) => {
    rotateX.set(Math.max(0, Math.min(90, rotateX.get() - info.delta.y * 0.5)));
    rotateZ.set(rotateZ.get() - info.delta.x * 0.5);
  };

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "Deekshith-goud";
        const res = await fetch(`https://github-contributions-api.deno.dev/${username}.json`);
        
        if (!res.ok) throw new Error("Failed to fetch");
        
        const json = await res.json();
        const allContributions: Contribution[] = json.contributions.flat();
        
        const last91Days = allContributions.slice(-91).map(c => {
          const dateObj = new Date(c.date);
          const formattedDate = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          return {
            date: formattedDate,
            count: c.contributionCount,
            fullDate: c.date
          };
        });
        
        // Find the top 5 highest commit days for the particles
        const sorted = [...last91Days].filter(d => d.count > 0).sort((a, b) => b.count - a.count);
        const top5Set = new Set(sorted.slice(0, 5).map(d => d.fullDate));
        
        const finalData = last91Days.map(d => ({
          ...d,
          isTop5: top5Set.has(d.fullDate)
        }));

        setData(finalData);
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const weeks: { id: number; days: any[] }[] = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push({ id: i, days: data.slice(i, i + 7) });
  }

  // Stable hover handler to prevent re-renders
  const handleHover = useCallback((day: any) => {
    setHoveredBlock(day);
  }, []);

  if (loading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-[#33E092] animate-pulse font-incognito tracking-widest uppercase text-sm">
        [ Initializing Data Scanners... ]
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-incognito h-full relative overflow-hidden">
      <div className="flex justify-between items-center mb-6 z-10 relative pointer-events-none">
        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-200">
          Activity Matrix
        </h3>
      </div>

      <div className="w-full h-[280px] relative">
        <AnimatePresence mode="wait">
          <MotionDiv 
            key="city"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center overflow-visible"
            onMouseLeave={() => setHoveredBlock(null)}
            style={{ perspective: '1200px' }}
          >
            {/* Cyberpunk Grid Floor */}
            <MotionDiv 
              className="absolute inset-[-200px] pointer-events-none opacity-40 dark:opacity-40"
              style={{
                backgroundImage: isDark 
                  ? 'linear-gradient(to right, rgba(51, 224, 146, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(51, 224, 146, 0.1) 1px, transparent 1px)'
                  : 'linear-gradient(to right, rgba(22, 163, 74, 0.25) 1px, transparent 1px), linear-gradient(to bottom, rgba(22, 163, 74, 0.25) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                backgroundPosition: 'center center',
                WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
                transformStyle: 'preserve-3d',
                rotateX,
                rotateZ,
                translateZ: -20 // Push slightly below the city
              }}
            />

            {/* Interactive Draggable Container */}
            <MotionDiv
              className="flex gap-2 p-8 cursor-grab active:cursor-grabbing relative z-10"
              drag
              dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
              dragElastic={0}
              onDrag={handleDrag}
              style={{ 
                transformStyle: 'preserve-3d',
                rotateX, 
                rotateZ 
              }}
            >
              {weeks.map((week, wIndex) => {
                const dateObj = new Date(week.days[0].fullDate);
                const monthStr = dateObj.toLocaleDateString("en-US", { month: "short" });
                const prevDateObj = wIndex > 0 ? new Date(weeks[wIndex - 1].days[0].fullDate) : null;
                const prevMonthStr = prevDateObj ? prevDateObj.toLocaleDateString("en-US", { month: "short" }) : null;
                const isNewMonth = monthStr !== prevMonthStr;

                return (
                  <div key={week.id} className="flex flex-col gap-2 relative" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Floating 3D Axis Label (Months) */}
                    {isNewMonth && (
                      <div 
                        className="absolute -bottom-8 left-0 text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest whitespace-nowrap"
                        style={{ 
                          transform: `translateZ(0px) rotateZ(-45deg)`, // Lay flat on the floor
                          transformStyle: 'preserve-3d'
                        }}
                      >
                        {monthStr}
                      </div>
                    )}
                    
                    {week.days.map((day, dIndex) => {
                      const flatIndex = wIndex * 7 + dIndex;
                      return (
                        <Cube 
                          key={day.fullDate} 
                          count={day.count} 
                          isDark={isDark} 
                          isHovered={hoveredBlock?.fullDate === day.fullDate}
                          onHover={handleHover}
                          index={flatIndex}
                          isTop5={day.isTop5}
                          dayData={day}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </MotionDiv>
          </MotionDiv>
        </AnimatePresence>
      </div>

      {/* Sleek Side Card for Commit Details (Hops in on hover) */}
      <AnimatePresence>
        {hoveredBlock && (
          <MotionDiv
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="absolute top-8 right-4 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 shadow-lg p-5 rounded-xl pointer-events-none flex flex-col min-w-[160px]"
          >
            {/* Minimalist Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-xl ${hoveredBlock.count > 0 ? 'bg-[#33E092]' : 'bg-zinc-300 dark:bg-zinc-700'}`} />

            <div className="flex items-center gap-2 mb-3">
               <div className={`w-2 h-2 rounded-full ${hoveredBlock.count > 0 ? 'bg-[#33E092] animate-pulse' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
               <span className="text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                 {hoveredBlock.isTop5 ? "Peak Output" : hoveredBlock.count > 0 ? "Activity Log" : "Offline"}
               </span>
            </div>

            <div className="flex items-baseline gap-1.5">
              <span className={`text-5xl font-bold tracking-tighter ${hoveredBlock.count > 0 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-600'}`}>
                {hoveredBlock.count}
              </span>
              <span className="text-sm font-semibold text-zinc-500 dark:text-zinc-400">
                {hoveredBlock.count === 1 ? 'commit' : 'commits'}
              </span>
            </div>

            <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-2">
              {hoveredBlock.date}
            </span>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
