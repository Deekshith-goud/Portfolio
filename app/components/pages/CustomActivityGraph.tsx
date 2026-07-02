"use client";

import { useEffect, useState, useRef } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence, useMotionValue, PanInfo } from "framer-motion";

type Contribution = {
  date: string;
  contributionCount: number;
};

// --- CSS 3D Cube Component ---
const Cube = ({ 
  count, 
  isDark, 
  isHovered, 
  onHover 
}: { 
  count: number; 
  isDark: boolean; 
  isHovered: boolean;
  onHover: () => void;
}) => {
  const size = 14; 
  const baseHeight = 4; 
  const heightMultiplier = 4; 
  const height = baseHeight + (count * heightMultiplier);

  let colorTop, colorLeft, colorRight;
  if (count === 0) {
    colorTop = isDark ? "rgba(39, 39, 42, 0.4)" : "rgba(228, 228, 231, 0.4)";
    colorLeft = isDark ? "rgba(24, 24, 27, 0.6)" : "rgba(212, 212, 216, 0.6)";
    colorRight = isDark ? "rgba(63, 63, 70, 0.4)" : "rgba(244, 244, 245, 0.4)";
  } else {
    const intensity = Math.min(1, count / 5);
    colorTop = `rgba(51, 224, 146, ${0.4 + intensity * 0.6})`;
    colorLeft = `rgba(22, 163, 74, ${0.4 + intensity * 0.6})`;
    colorRight = `rgba(20, 83, 45, ${0.4 + intensity * 0.6})`;
  }

  // Hover override
  if (isHovered && count > 0) {
    colorTop = "#4ade80"; 
    colorLeft = "#22c55e";
    colorRight = "#16a34a";
  } else if (isHovered && count === 0) {
    colorTop = isDark ? "rgba(82, 82, 91, 0.8)" : "rgba(161, 161, 170, 0.8)";
    colorLeft = isDark ? "rgba(63, 63, 70, 0.8)" : "rgba(113, 113, 122, 0.8)";
    colorRight = isDark ? "rgba(113, 113, 122, 0.8)" : "rgba(212, 212, 216, 0.8)";
  }

  return (
    <div 
      className="relative cursor-pointer transition-transform duration-300" 
      style={{ width: size, height: size, transformStyle: 'preserve-3d' }}
      onMouseEnter={onHover}
    >
      <div 
        className="w-full h-full absolute transition-all duration-300 ease-out" 
        style={{ 
          transformStyle: 'preserve-3d', 
          transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)' 
        }}
      >
        {/* Top Face */}
        <div className="absolute w-full h-full transition-all duration-300 box-border" style={{ 
          backgroundColor: colorTop, 
          border: `1px solid ${count > 0 ? 'rgba(51, 224, 146, 0.4)' : 'rgba(161, 161, 170, 0.2)'}`,
          transform: `translateZ(${height}px)`,
          boxShadow: count > 0 ? `0 0 ${8 + count*2}px ${colorTop}` : 'none'
        }} />
        
        {/* Front Face (Y-axis) */}
        <div className="absolute origin-bottom transition-all duration-300 box-border" style={{ 
          backgroundColor: colorLeft, 
          border: `1px solid ${count > 0 ? 'rgba(51, 224, 146, 0.4)' : 'rgba(161, 161, 170, 0.2)'}`,
          width: size, 
          height: height, 
          top: size - height,
          transform: `rotateX(-90deg)`
        }} />

        {/* Right Face (X-axis) */}
        <div className="absolute origin-left transition-all duration-300 box-border" style={{ 
          backgroundColor: colorRight,
          border: `1px solid ${count > 0 ? 'rgba(51, 224, 146, 0.4)' : 'rgba(161, 161, 170, 0.2)'}`,
          width: height, 
          height: size, 
          left: size,
          top: 0,
          transform: `rotateY(-90deg)`
        }} />

        {/* Back Face (Y-axis) - Appears on hover */}
        <div className="absolute origin-bottom transition-all duration-300 box-border" style={{ 
          backgroundColor: 'transparent', 
          border: isHovered && count > 0 ? `1px solid #33E092` : 'none',
          opacity: isHovered ? 1 : 0,
          width: size, 
          height: height, 
          top: -height,
          transform: `rotateX(-90deg)`
        }} />

        {/* Left Face (X-axis) - Appears on hover */}
        <div className="absolute origin-left transition-all duration-300 box-border" style={{ 
          backgroundColor: 'transparent', 
          border: isHovered && count > 0 ? `1px solid #33E092` : 'none',
          opacity: isHovered ? 1 : 0,
          width: height, 
          height: size, 
          left: 0,
          top: 0,
          transform: `rotateY(-90deg)`
        }} />

        {/* Bottom Face (Base Footprint) - Appears on hover */}
        <div className="absolute w-full h-full transition-all duration-300 box-border" style={{ 
          backgroundColor: 'transparent', 
          border: isHovered && count > 0 ? `1px solid #33E092` : 'none',
          opacity: isHovered ? 1 : 0,
          transform: `translateZ(0px)`
        }} />
      </div>
    </div>
  );
};


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
        
        setData(last91Days);
      } catch (error) {
        console.error("Failed to fetch GitHub data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, []);

  const weeks = [];
  for (let i = 0; i < data.length; i += 7) {
    weeks.push({ id: i, days: data.slice(i, i + 7) });
  }

  if (loading) {
    return (
      <div className="h-[300px] w-full flex items-center justify-center text-[#33E092] animate-pulse font-incognito tracking-widest uppercase text-sm">
        [ Initializing Data Scanners... ]
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col font-incognito h-full relative">
      <div className="flex justify-between items-center mb-6 z-10 relative pointer-events-none">
        <h3 className="text-lg font-bold tracking-widest uppercase bg-clip-text text-transparent bg-gradient-to-r from-[#33E092] to-purple-500 hidden sm:block">
          Activity Matrix
        </h3>
      </div>

      <div className="w-full h-[280px] relative">
        <AnimatePresence mode="wait">
          <motion.div 
            key="city"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute inset-0 flex items-center justify-center overflow-visible"
            onMouseLeave={() => setHoveredBlock(null)}
            style={{ perspective: '1200px' }}
          >
            {/* Interactive Draggable Container */}
            <motion.div
              className="flex gap-2 p-8 cursor-grab active:cursor-grabbing"
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
              {weeks.map((week) => (
                <div key={week.id} className="flex flex-col gap-2" style={{ transformStyle: 'preserve-3d' }}>
                  {week.days.map((day) => (
                    <Cube 
                      key={day.fullDate} 
                      count={day.count} 
                      isDark={isDark} 
                      isHovered={hoveredBlock?.fullDate === day.fullDate}
                      onHover={() => setHoveredBlock(day)}
                    />
                  ))}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sleek Side Card for Commit Details (Hops in on hover) */}
      <AnimatePresence>
        {hoveredBlock && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="absolute top-10 right-0 z-50 bg-secondary-bg dark:bg-primary-bg/80 backdrop-blur-xl border border-zinc-200 dark:border-zinc-700 shadow-2xl p-4 rounded-2xl pointer-events-none flex flex-col gap-1 min-w-[140px]"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${hoveredBlock.count > 0 ? 'bg-[#33E092] animate-pulse shadow-[0_0_8px_#33E092]' : 'bg-zinc-500'}`} />
              <span className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">Activity</span>
            </div>
            <span className="text-2xl font-black text-[#33E092] drop-shadow-md">
              {hoveredBlock.count} <span className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">commits</span>
            </span>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300 mt-1">{hoveredBlock.date}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
