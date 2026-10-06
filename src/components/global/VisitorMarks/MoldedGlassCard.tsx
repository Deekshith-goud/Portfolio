import React from "react";

interface MoldedGlassCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "gallery" | "modal";
  seed?: string;
}

// Drastically reduced opacity so they tint the crystal rather than overpowering it.
const AURORA_COLORS = [
  ["bg-amber-100/30", "bg-sky-200/20", "bg-cyan-100/30", "bg-orange-100/20"],
  ["bg-blue-100/30", "bg-purple-100/20", "bg-sky-100/30", "bg-emerald-50/20"],
  ["bg-rose-100/20", "bg-amber-100/30", "bg-sky-100/30", "bg-yellow-50/20"],
  ["bg-cyan-100/30", "bg-emerald-100/20", "bg-blue-100/30", "bg-violet-100/20"],
  ["bg-orange-100/30", "bg-rose-100/20", "bg-amber-100/30", "bg-sky-100/20"],
];

export function MoldedGlassCard({
  children,
  className,
  variant = "gallery",
  seed = "default",
}: MoldedGlassCardProps) {
  const hash = seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
  const palette = AURORA_COLORS[hash % AURORA_COLORS.length];

  return (
    <div
      className={[
        "relative isolate overflow-hidden rounded-[16px] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "shadow-[0_15px_40px_rgba(70,80,100,0.1),0_4px_10px_rgba(70,80,100,0.05)]",
        "dark:shadow-[0_15px_40px_rgba(0,0,0,0.4),0_4px_10px_rgba(0,0,0,0.2)]",
        "hover:shadow-[0_20px_45px_rgba(70,80,100,0.18),0_6px_12px_rgba(70,80,100,0.08)]",
        "dark:hover:shadow-[0_20px_45px_rgba(0,0,0,0.6),0_6px_12px_rgba(0,0,0,0.3)]",
        className || ""
      ].join(" ").trim()}
    >
      {/* Layer 0: Environmental Refraction (z-0) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Soft Aurora Blobs */}
        <div className={`absolute -top-[10%] -left-[10%] h-[60%] w-[60%] rounded-full ${palette[0]} blur-[50px] dark:opacity-30`} />
        <div className={`absolute -top-[10%] -right-[10%] h-[60%] w-[60%] rounded-full ${palette[1]} blur-[50px] dark:opacity-30`} />
        <div className={`absolute -bottom-[10%] -left-[10%] h-[60%] w-[60%] rounded-full ${palette[2]} blur-[50px] dark:opacity-30`} />
        <div className={`absolute -bottom-[10%] -right-[10%] h-[60%] w-[60%] rounded-full ${palette[3]} blur-[50px] dark:opacity-30`} />

        {/* Dark Mode Central Contrast Glow (crucial so black ink doesn't vanish into the page bg) */}
        <div
          className="absolute inset-0 hidden dark:block"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 50%, transparent 80%)",
          }}
        />
      </div>

      {/* Layer 10: Physical Glass Pane (z-10) - Pure Transparent */}
      <div
        className={[
          "absolute inset-0 z-10 pointer-events-none",
          "bg-transparent dark:bg-white/[0.02]",
          variant === "modal"
            ? "backdrop-blur-[16px] backdrop-saturate-[120%]"
            : "backdrop-blur-[12px] backdrop-saturate-[120%]"
        ].join(" ")}
      />

      {/* Layer 20: Surface Details (z-20) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        
        {/* Microscopic Crystal Grain (prevents it from looking like flat vector plastic) */}
        <div className="absolute inset-0 opacity-[0.15] dark:opacity-[0.08] mix-blend-overlay">
          <svg className="absolute inset-0 w-full h-full opacity-50">
            <filter id={`noise-${seed}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch" />
            </filter>
            <rect width="100%" height="100%" filter={`url(#noise-${seed})`} />
          </svg>
        </div>

        {/* Liquid Smooth Surface Glare (Curved Lens Reflection) */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/0 to-white/5 dark:from-white/10 dark:via-transparent dark:to-transparent" />

        {/* Original Bevel (Inner Shadows) */}
        <div className="absolute inset-0 rounded-[16px] shadow-[inset_1px_1px_2px_rgba(255,255,255,0.85),inset_-1px_-1px_2px_rgba(100,110,130,0.08)] dark:shadow-[inset_1px_1px_2px_rgba(255,255,255,0.28),inset_-1px_-1px_3px_rgba(0,0,0,0.45)]" />

        {/* Crisp, slightly darker 1px Outer Rim */}
        <div className="absolute inset-0 rounded-[16px] border border-black/[0.08] dark:border-white/10" />

        {/* Sharp Liquid Corner Highlights (Lens Flares) */}
        {/* Top-left: Intense reflection */}
        <div
          className="absolute -top-1 -left-1 w-24 h-24 blur-[3px] dark:opacity-10"
          style={{
            background: "radial-gradient(circle at 25% 25%, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5) 30%, transparent 60%)",
          }}
        />

        {/* Top-right: Secondary reflection */}
        <div
          className="absolute -top-1 -right-1 w-20 h-20 blur-[3px] dark:opacity-[0.08]"
          style={{
            background: "radial-gradient(circle at 75% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.3) 30%, transparent 60%)",
          }}
        />
        
        {/* Bottom-left: Ambient reflection */}
        <div
          className="absolute -bottom-1 -left-1 w-20 h-20 blur-[4px] dark:opacity-5"
          style={{
            background: "radial-gradient(circle at 25% 75%, rgba(255,255,255,0.7) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Layer 30: Ink/Content (z-30) */}
      <div className="relative z-30 w-full h-full drop-shadow-[0_2px_3px_rgba(0,0,0,0.15)] dark:drop-shadow-[0_2px_5px_rgba(0,0,0,0.5)]">
        {children}
      </div>
    </div>
  );
}
