"use client";

import Image from "next/image";
import Link from "next/link";
import { m as motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState, memo } from "react";
import { HobbyType } from "@/types";
import { urlFor } from "@/sanity/lib/sanity.image";
import { BiHeart } from "react-icons/bi";
import * as BiIcons from "react-icons/bi";

const LazyIcon = memo(({ iconName, className }: { iconName: string; className?: string }) => {
  const IconComponent = (BiIcons as any)[iconName] || BiHeart;
  return <IconComponent className={className || "text-2xl"} />;
});
LazyIcon.displayName = "LazyIcon";

interface HobbyCardProps {
  hobby: HobbyType;
  index: number;
  layout?: "grid" | "grid-sm" | "horizontal" | "tile";
}

export default function HobbyCard({ hobby, index, layout = "grid" }: HobbyCardProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = (iconName: string) => {
    return <LazyIcon iconName={iconName} className="text-2xl" />;
  };

  if (!mounted) return null;

  return (
    <motion.div
      className="w-full h-full"
      whileHover="hover"
      initial={{ y: 20, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1, rotate: index % 2 === 0 ? -1 : 1 }}
      viewport={{ once: true, margin: "50px" }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 20, delay: (index % 4) * 0.1 }}
    >
      <Link
        href={`/hobbies/${hobby.slug}`}
        className={`w-full flex group overflow-hidden border dark:border-zinc-800 border-zinc-200 dark:bg-zinc-900 bg-white hover:border-primary-color duration-500 relative ${
          layout === "grid" ? "flex-col rounded-[2.5rem]" : layout === "grid-sm" ? "flex-col rounded-3xl" : layout === "horizontal" ? "flex-row h-48 rounded-3xl" : "flex-col aspect-square rounded-3xl h-64 md:h-auto"
        }`}
      >
        {/* Playful Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary-color to-secondary-color opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />

        <div className={`relative ${layout === "grid" ? "w-full h-80" : layout === "grid-sm" ? "w-full h-56" : layout === "horizontal" ? "w-2/5 h-full shrink-0" : "absolute inset-0 w-full h-full"} overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center`}>
          {hobby.thumbnail ? (
            <Image
              src={urlFor(hobby.thumbnail).width(800).url()}
              alt={hobby.name}
              fill
              className="object-cover group-hover:scale-110 duration-1000 transition-transform"
              placeholder={hobby.lqip ? "blur" : "empty"}
              blurDataURL={hobby.lqip || ""}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex flex-col items-center gap-y-4 opacity-50">
              <span className="text-8xl">{getIcon(hobby.iconName)}</span>
              <p className="text-xs uppercase tracking-widest font-black italic">
                Missing Piece
              </p>
            </div>
          )}

          {layout === "tile" && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent group-hover:opacity-80 transition-opacity duration-500 z-10" />
          )}
        </div>

        <div className={`${layout === "grid" ? "p-8" : layout === "grid-sm" ? "p-6" : layout === "horizontal" ? "p-6 w-full justify-center" : "absolute inset-0 p-6 justify-end"} flex flex-col ${layout === "grid-sm" ? "gap-y-3" : "gap-y-4"} relative ${layout === "tile" ? "z-20" : "bg-white dark:bg-zinc-900"}`}>
          <div className="flex items-center gap-x-4">
            <div className={layout === "grid-sm" ? "scale-75 origin-left" : ""}>
            {hobby.name.toLowerCase().includes("formula") ? (
              <div className="rounded-2xl bg-primary-color bg-opacity-10 text-primary-color relative overflow-hidden flex items-center justify-center w-[100px] h-[40px]">

                {/* Natural smoke effect */}
                <div className="absolute inset-0 pointer-events-none z-0">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={`smoke-${i}`}
                      className="absolute bottom-[2px] left-[8px] w-6 h-6 opacity-0 group-hover:animate-smoke"
                      style={{
                        animationDelay: `${i * 0.15}s`,
                        background: "radial-gradient(circle, rgba(156,163,175,0.7) 0%, rgba(156,163,175,0.2) 50%, transparent 100%)",
                      }}
                    />
                  ))}
                </div>

                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="relative z-10 w-full flex justify-center group-hover:animate-drive-by">
                    <Image
                      src={resolvedTheme === "dark" ? "/images/image.png" : "/images/image-light.png"}
                      alt="Formula 1 Car"
                      width={400}
                      height={150}
                      quality={95}
                      className="object-contain w-[90px] h-auto"
                    />
                  </div>
                </div>
              </div>
            ) : hobby.name.toLowerCase().includes("gaming") ? (
              <motion.div
                variants={{
                  hover: {
                    x: [0, -1, 1, -2, 2, -4, 4, 0],
                    rotate: [0, -1, 1, -1, 1, -2, 2, 0],
                    transition: { duration: 2.5, times: [0, 0.7, 0.8, 1] }
                  }
                }}
                className="p-3 rounded-2xl relative overflow-visible flex items-center justify-center bg-primary-color/10"
              >
                {/* Shockwave */}
                <motion.div
                  variants={{
                    initial: { opacity: 0, scale: 0.5 },
                    hover: {
                      scale: [0.5, 2.5],
                      opacity: [0, 0.6, 0],
                      transition: { duration: 0.4, delay: 1.8 }
                    }
                  }}
                  className="absolute w-full h-full border-2 border-white/40 rounded-full pointer-events-none z-0"
                />

                {/* Blast Particles */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {[...Array(8)].map((_, i) => {
                    const random1 = (i * 17) % 100 / 100;
                    const random2 = (i * 31) % 100 / 100;

                    const angle = (i / 8) * Math.PI * 2;
                    const distance = 30 + random1 * 60;
                    const x = Math.cos(angle) * distance;
                    const y = Math.sin(angle) * distance;
                    const size = 4 + random2 * 6;

                    const grayShade = Math.floor(40 + random1 * 100);
                    const startColor = `rgb(${grayShade}, ${grayShade}, ${grayShade})`;

                    return (
                      <motion.div
                        key={i}
                        variants={{
                          initial: { opacity: 0, scale: 0, x: 0, y: 0 },
                          hover: {
                            x: [0, x],
                            y: [0, y],
                            scale: [0, 1.2, 0],
                            backgroundColor: [startColor, "#ffffff"],
                            opacity: [0, 1, 0],
                            transition: {
                              duration: 0.4,
                              delay: 1.8 + random2 * 0.1,
                              ease: "easeOut"
                            }
                          }
                        }}
                        className="absolute rounded-sm"
                        style={{
                          width: size,
                          height: size,
                          backgroundColor: startColor,
                        }}
                      />
                    );
                  })}
                </div>

                <motion.div
                  variants={{
                    hover: {
                      scale: [1, 1.1, 1.05, 1.2, 1.15, 1.4, 0, 0, 1],
                      rotate: [0, -8, 8, -10, 10, -15, 0, 0, 0],
                      transition: { duration: 2.5, times: [0, 0.2, 0.4, 0.6, 0.7, 0.8, 0.85, 0.95, 1] }
                    }
                  }}
                  className="relative z-10"
                >
                  <svg
                    viewBox="0 0 100 100"
                    width="28"
                    height="28"
                    className="rounded-md shadow-md overflow-hidden"
                    style={{ shapeRendering: "crispEdges" }}
                  >
                    {isDark ? (
                      <>
                        <g>
                          <rect x="0" y="0" width="20" height="20" fill="#4caf50" />
                          <rect x="20" y="0" width="20" height="20" fill="#388e3c" />
                          <rect x="40" y="0" width="20" height="20" fill="#2e7d32" />
                          <rect x="60" y="0" width="20" height="20" fill="#43a047" />
                          <rect x="80" y="0" width="20" height="20" fill="#1b5e20" />
                          <rect x="0" y="20" width="20" height="20" fill="#2e7d32" />
                          <rect x="20" y="20" width="20" height="20" fill="#4caf50" />
                          <rect x="40" y="20" width="20" height="20" fill="#43a047" />
                          <rect x="60" y="20" width="20" height="20" fill="#388e3c" />
                          <rect x="80" y="20" width="20" height="20" fill="#2e7d32" />
                          <rect x="0" y="40" width="20" height="20" fill="#1b5e20" />
                          <rect x="20" y="40" width="20" height="20" fill="#388e3c" />
                          <rect x="40" y="40" width="20" height="20" fill="#4caf50" />
                          <rect x="60" y="40" width="20" height="20" fill="#2e7d32" />
                          <rect x="80" y="40" width="20" height="20" fill="#43a047" />
                          <rect x="0" y="60" width="20" height="20" fill="#388e3c" />
                          <rect x="20" y="60" width="20" height="20" fill="#2e7d32" />
                          <rect x="40" y="60" width="20" height="20" fill="#1b5e20" />
                          <rect x="60" y="60" width="20" height="20" fill="#4caf50" />
                          <rect x="80" y="60" width="20" height="20" fill="#388e3c" />
                          <rect x="0" y="80" width="20" height="20" fill="#43a047" />
                          <rect x="20" y="80" width="20" height="20" fill="#1b5e20" />
                          <rect x="40" y="80" width="20" height="20" fill="#388e3c" />
                          <rect x="60" y="80" width="20" height="20" fill="#2e7d32" />
                          <rect x="80" y="80" width="20" height="20" fill="#4caf50" />
                        </g>
                        <rect x="20" y="20" width="20" height="20" fill="#000" />
                        <rect x="60" y="20" width="20" height="20" fill="#000" />
                        <path d="M40,40 H60 V50 H70 V80 H60 V70 H40 V80 H30 V50 H40 Z" fill="#000" />
                      </>
                    ) : (
                      <>
                        <rect width="100" height="100" fill="#111" />
                        <rect x="20" y="20" width="20" height="20" fill="white" />
                        <rect x="60" y="20" width="20" height="20" fill="white" />
                        <path d="M40,40 H60 V50 H70 V80 H60 V70 H40 V80 H30 V50 H40 Z" fill="white" />
                      </>
                    )}
                  </svg>
                </motion.div>
              </motion.div>
            ) : hobby.name.toLowerCase().includes("space") ? (
              <motion.div
                className="rounded-2xl relative overflow-visible flex items-center justify-center w-[52px] h-[52px]"
                style={{
                  background: isDark
                    ? "radial-gradient(ellipse at 30% 20%, #1a1a3e 0%, #0a0b1a 70%, #050510 100%)"
                    : "radial-gradient(ellipse at 30% 20%, #ffffff 0%, #f0fdfa 70%, #ccfbf1 100%)"
                }}
              >
                {/* Tiny twinkling stars inside container */}
                <svg viewBox="0 0 52 52" className="absolute inset-0 w-full h-full pointer-events-none" style={{ borderRadius: "1rem" }}>
                  {[
                    { cx: 8, cy: 8, r: 0.7, o: 0.5 }, { cx: 42, cy: 6, r: 0.9, o: 0.7 },
                    { cx: 14, cy: 38, r: 0.6, o: 0.4 }, { cx: 46, cy: 42, r: 0.8, o: 0.6 },
                    { cx: 6, cy: 24, r: 0.5, o: 0.3 }, { cx: 38, cy: 18, r: 0.7, o: 0.8 },
                    { cx: 24, cy: 4, r: 0.6, o: 0.5 }, { cx: 48, cy: 30, r: 0.5, o: 0.4 },
                    { cx: 18, cy: 48, r: 0.7, o: 0.6 }, { cx: 34, cy: 46, r: 0.5, o: 0.3 },
                    { cx: 4, cy: 44, r: 0.6, o: 0.5 }, { cx: 28, cy: 14, r: 0.4, o: 0.6 },
                  ].map((s, i) => (
                    <circle key={i} cx={s.cx} cy={s.cy} r={s.r} fill={isDark ? "#fff" : "#14b8a6"} opacity={isDark ? s.o : s.o * 0.3} />
                  ))}
                </svg>

                {/* Twinkling star animation */}
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={`twinkle-${i}`}
                    className={`absolute rounded-full pointer-events-none ${isDark ? "bg-white" : "bg-teal-400"}`}
                    style={{
                      width: 2,
                      height: 2,
                      top: [10, 6, 40][i],
                      left: [40, 12, 8][i],
                    }}
                    animate={{
                      opacity: [0.2, 0.9, 0.2],
                      scale: [0.8, 1.3, 0.8],
                    }}
                    transition={{
                      duration: [2.5, 1.8, 3.2][i],
                      repeat: Infinity,
                      delay: i * 0.7,
                    }}
                  />
                ))}

                {/* Smoke puffs — billow downward and outward on ignition */}
                {[...Array(12)].map((_, i) => {
                  const spread = (i - 5.5) * 7;
                  const downDrift = 12 + Math.abs(spread) * 0.5 + (i % 3) * 4;
                  const size = 4 + (i % 4) * 2;
                  return (
                    <motion.div
                      key={`smoke-${i}`}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        width: size,
                        height: size,
                        bottom: 0,
                        left: "50%",
                        marginLeft: -size / 2,
                        background: isDark
                          ? "radial-gradient(circle, rgba(200,200,210,0.7) 0%, rgba(160,160,175,0.3) 60%, transparent 100%)"
                          : "radial-gradient(circle, rgba(100,116,139,0.7) 0%, rgba(148,163,184,0.3) 60%, transparent 100%)",
                      }}
                      variants={{
                        initial: { opacity: 0, scale: 0 },
                        hover: {
                          x: [0, spread * 0.4, spread],
                          y: [0, downDrift * 0.5, downDrift],
                          scale: [0, 1.2, 2.5, 3],
                          opacity: [0, 0.6, 0.35, 0],
                          transition: {
                            duration: 2,
                            delay: 0.6 + i * 0.04,
                            ease: "easeOut",
                          },
                        },
                      }}
                    />
                  );
                })}

                {/* Rocket + flame assembly */}
                <motion.div
                  className="relative z-10"
                  variants={{
                    initial: { y: 0, rotate: 0 },
                    hover: {
                      y: [0, 1, -1, 1.5, -1, 1, -1, 0, -3, -8, -80],
                      rotate: [0, -0.8, 0.8, -1, 1, -0.5, 0.5, 0, 0, 0, 0],
                      opacity: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
                      transition: {
                        duration: 3,
                        times: [0, 0.06, 0.12, 0.18, 0.24, 0.3, 0.36, 0.5, 0.6, 0.7, 1],
                        ease: "easeIn",
                      },
                    },
                  }}
                >
                  <svg viewBox="0 0 100 120" width="40" height="48" className="overflow-visible">
                    <defs>
                      <filter id="flame-glow" x="-50%" y="-20%" width="200%" height="200%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="fg-orange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#c2410c" stopOpacity="0.4" />
                      </linearGradient>
                      <linearGradient id="fg-yellow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.5" />
                      </linearGradient>
                      <linearGradient id="fg-pale" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fef9c3" />
                        <stop offset="100%" stopColor="#fde68a" stopOpacity="0.6" />
                      </linearGradient>
                    </defs>

                    {/* === FLICKERING FIRE — turbulent, high-velocity exhaust === */}
                    <motion.g
                      filter="url(#flame-glow)"
                      variants={{
                        initial: { opacity: 0, scaleY: 0.2 },
                        hover: {
                          opacity: [0, 0, 0, 0, 0, 0.5, 1, 1, 1, 1, 1],
                          scaleY: [0.2, 0.2, 0.2, 0.2, 0.2, 0.5, 1, 1.3, 1.8, 2.3, 2.8],
                          transition: {
                            duration: 3,
                            times: [0, 0.1, 0.2, 0.3, 0.4, 0.48, 0.55, 0.6, 0.7, 0.85, 1],
                          },
                        },
                      }}
                      style={{ originX: "50px", originY: "88px" }}
                    >
                      {/* --- Left tongue (orange) --- */}
                      <motion.path
                        d="M 36,88 C 37,88 35,92 37,100 C 38,108 36,116 38,124 C 39,130 40,134 41,132 C 42,128 40,120 41,112 C 42,104 40,96 42,88 C 40,88 38,88 36,88 Z"
                        fill="url(#fg-orange)"
                        variants={{
                          hover: {
                            scaleY: [0.5, 1.2, 0.6, 1.3, 0.8, 1.4, 0.7, 1.1, 0.5, 1.3, 0.8],
                            x: [0, -1, 1, -0.5, 0.5, -1, 0.5, 0, -0.5, 1, 0],
                            y: [0, 2, -1, 3, 0, 4, 1, 2, 0, 3, 0],
                            transition: { duration: 0.6, repeat: Infinity, ease: "linear" },
                          },
                        }}
                        style={{ originX: "39px", originY: "88px" }}
                      />

                      {/* --- Left-center tongue (yellow-orange) --- */}
                      <motion.path
                        d="M 40,88 C 41,88 39,96 41,106 C 42,114 40,122 42,132 C 43,138 44,142 45,140 C 46,136 44,128 45,118 C 46,108 44,98 46,88 C 44,88 42,88 40,88 Z"
                        fill="url(#fg-yellow)"
                        variants={{
                          hover: {
                            scaleY: [0.6, 1.3, 0.7, 1.4, 0.8, 1.2, 0.9, 1.5, 0.7, 1.3, 0.8],
                            x: [0, 0.5, -0.5, 1, -1, 0.5, 0, -0.5, 1, -0.5, 0],
                            y: [0, 3, 0, 4, 1, 2, -1, 3, 0, 2, 0],
                            transition: { duration: 0.5, repeat: Infinity, ease: "linear" },
                          },
                        }}
                        style={{ originX: "43px", originY: "88px" }}
                      />

                      {/* --- Center tongue (bright — the tallest) --- */}
                      <motion.path
                        d="M 44,88 C 45,88 43,98 45,112 C 46,122 44,132 47,144 C 48,150 49,154 50,156 C 51,154 52,150 53,144 C 56,132 54,122 55,112 C 57,98 55,88 56,88 C 54,88 52,88 50,88 C 48,88 46,88 44,88 Z"
                        fill="url(#fg-pale)"
                        variants={{
                          hover: {
                            scaleY: [0.7, 1.4, 0.8, 1.5, 0.9, 1.3, 0.8, 1.6, 0.9, 1.4, 0.8],
                            y: [0, 4, 1, 5, 2, 4, 0, 5, 1, 4, 0],
                            transition: { duration: 0.4, repeat: Infinity, ease: "linear" },
                          },
                        }}
                        style={{ originX: "50px", originY: "88px" }}
                      />
                      {/* White hot core */}
                      <motion.path
                        d="M 47,88 C 47,88 46,96 48,108 C 49,118 48,128 49,136 C 49.5,140 50,142 50,142 C 50,142 50.5,140 51,136 C 52,128 51,118 52,108 C 54,96 53,88 53,88 C 52,88 51,88 50,88 C 49,88 48,88 47,88 Z"
                        fill="#fff"
                        opacity="0.95"
                        variants={{
                          initial: { opacity: 0 },
                          hover: {
                            scaleY: [0.8, 1.3, 0.85, 1.4, 0.9, 1.2, 0.9, 1.5, 0.8, 1.3, 0.9],
                            opacity: [0.7, 1, 0.8, 1, 0.75, 0.95, 0.85, 1, 0.9, 1, 0.8],
                            y: [0, 3, 0, 4, 1, 3, 0, 4, 1, 3, 0],
                            transition: { duration: 0.3, repeat: Infinity, ease: "linear" },
                          },
                        }}
                        style={{ originX: "50px", originY: "88px" }}
                      />

                      {/* --- Right-center tongue (yellow-orange) --- */}
                      <motion.path
                        d="M 54,88 C 56,98 54,108 55,118 C 56,128 54,136 55,140 C 56,142 57,138 58,132 C 60,122 58,114 59,106 C 61,96 59,88 60,88 C 58,88 56,88 54,88 Z"
                        fill="url(#fg-yellow)"
                        variants={{
                          hover: {
                            scaleY: [0.6, 1.2, 0.7, 1.3, 0.8, 1.4, 0.7, 1.2, 0.9, 1.3, 0.7],
                            x: [0, -0.5, 0.5, -1, 0.5, 0, -0.5, 1, -0.5, 0.5, 0],
                            y: [0, 2, -1, 3, 0, 4, 1, 2, 0, 3, 0],
                            transition: { duration: 0.55, repeat: Infinity, ease: "linear" },
                          },
                        }}
                        style={{ originX: "57px", originY: "88px" }}
                      />

                      {/* --- Right tongue (orange) --- */}
                      <motion.path
                        d="M 58,88 C 60,96 58,104 59,112 C 60,120 58,128 59,132 C 60,134 61,130 62,124 C 64,116 62,108 63,100 C 65,92 63,88 64,88 C 62,88 60,88 58,88 Z"
                        fill="url(#fg-orange)"
                        variants={{
                          hover: {
                            scaleY: [0.5, 1.3, 0.7, 1.1, 1.3, 0.8, 1.2, 0.9, 1.4, 0.7, 1.0],
                            x: [0, 1, -0.5, 0.5, -1, 0.5, 0, 1, -0.5, 0, 0.5],
                            y: [0, 3, 0, 4, 1, 2, -1, 3, 0, 2, 0],
                            transition: { duration: 0.65, repeat: Infinity, ease: "linear" },
                          },
                        }}
                        style={{ originX: "61px", originY: "88px" }}
                      />
                    </motion.g>

                    {/* === IGNITION SPARKS (before liftoff) === */}
                    {[...Array(6)].map((_, i) => {
                      const sx = (i - 2.5) * 6;
                      const sy = 8 + (i % 3) * 5;
                      return (
                        <motion.circle
                          key={`spark-${i}`}
                          cx={50 + sx * 0.2}
                          cy="90"
                          r={1 + (i % 2)}
                          fill="#fbbf24"
                          variants={{
                            initial: { opacity: 0, r: 0 },
                            hover: {
                              cx: [50, 50 + sx],
                              cy: [90, 90 + sy],
                              opacity: [0, 0, 1, 0],
                              r: [0, 0, 1.5, 0],
                              transition: {
                                duration: 1.5,
                                delay: 0.4 + i * 0.08,
                                times: [0, 0.2, 0.6, 1],
                              },
                            },
                          }}
                        />
                      );
                    })}

                    {/* === ROCKET BODY === */}
                    <g>
                      {/* Main fuselage */}
                      <path
                        d="M 50,8 C 41,20 36,42 36,64 L 36,86 L 64,86 L 64,64 C 64,42 59,20 50,8 Z"
                        fill={isDark ? "#dde4ee" : "#e2e8f0"}
                        stroke={isDark ? "#8896a8" : "#64748b"}
                        strokeWidth="1.2"
                      />
                      {/* Left highlight */}
                      <path
                        d="M 50,8 C 44,18 40,38 38,60 L 38,86 L 42,86 L 42,60 C 42,40 45,22 50,12 Z"
                        fill={isDark ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.05)"}
                      />

                      {/* Nose cone */}
                      <path
                        d="M 50,8 C 45,18 43,28 42,36 L 58,36 C 57,28 55,18 50,8 Z"
                        fill={isDark ? "#f87171" : "#06b6d4"}
                      />

                      {/* Window */}
                      <circle cx="50" cy="50" r="6" fill={isDark ? "#0f2847" : "#1e293b"} stroke={isDark ? "#4a90d9" : "#38bdf8"} strokeWidth="1.2" />
                      <circle cx="48" cy="48" r="2.5" fill="rgba(120,180,255,0.35)" />
                      <circle cx="47" cy="47" r="1" fill="rgba(255,255,255,0.5)" />

                      {/* Body stripes */}
                      <rect x="36" y="62" width="28" height="2.5" fill={isDark ? "#f87171" : "#06b6d4"} />
                      <rect x="36" y="68" width="28" height="1.2" fill={isDark ? "#fca5a5" : "#22d3ee"} opacity="0.5" />

                      {/* Left fin */}
                      <path d="M 36,68 L 24,88 L 36,85 Z" fill={isDark ? "#f87171" : "#06b6d4"} />
                      <path d="M 36,68 L 30,78 L 36,77 Z" fill={isDark ? "#fca5a5" : "#22d3ee"} opacity="0.4" />

                      {/* Right fin */}
                      <path d="M 64,68 L 76,88 L 64,85 Z" fill={isDark ? "#f87171" : "#06b6d4"} />

                      {/* Nozzle */}
                      <path d="M 42,86 L 39,94 L 61,94 L 58,86 Z" fill={isDark ? "#556677" : "#64748b"} />
                      <path d="M 44,86 L 42,92 L 58,92 L 56,86 Z" fill={isDark ? "#667788" : "#94a3b8"} />
                    </g>
                  </svg>
                </motion.div>
              </motion.div>
            ) : hobby.name.toLowerCase().includes("chess") ? (
              <motion.div
                className="p-3 rounded-2xl bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center w-14 h-14 border border-white/10"
                whileHover="hover"
              >
                <div className="absolute inset-0 opacity-5">
                  <svg width="100%" height="100%">
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>
                <motion.div
                  variants={{
                    hover: {
                      rotateX: 45,
                      rotateZ: 45,
                      transition: { duration: 0.8, ease: "easeOut" }
                    }
                  }}
                >
                  <svg viewBox="0 0 100 100" width="36" height="36" className="overflow-visible">
                    {/* Isometric Strategy Grid */}
                    <path d="M 50,20 L 80,40 L 50,60 L 20,40 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <path d="M 50,40 L 80,60 L 50,80 L 20,60 Z" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />

                    {/* Active Strategic Node */}
                    <motion.circle
                      cx="50" cy="40" r="4"
                      fill="#fff"
                      variants={{
                        hover: {
                          y: [-5, 5, -5],
                          boxShadow: "0 0 15px #fff",
                          transition: { duration: 2, repeat: Infinity }
                        }
                      }}
                      filter="url(#tech-glow)"
                    />
                    <line x1="50" y1="40" x2="50" y2="80" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2 2" />
                  </svg>
                </motion.div>
              </motion.div>
            ) : hobby.name.toLowerCase().includes("spanish") ? (
              <motion.div
                className="p-3 rounded-2xl bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center w-14 h-14 border border-white/10"
                whileHover="hover"
              >
                <motion.div
                  variants={{
                    hover: {
                      rotate: 15,
                      scale: 1.05,
                      transition: { duration: 0.5 }
                    }
                  }}
                >
                  <svg viewBox="0 0 100 100" width="38" height="38">
                    {/* Technical Globe */}
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <ellipse cx="50" cy="50" rx="40" ry="15" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    <ellipse cx="50" cy="50" rx="15" ry="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />

                    <text x="50" y="58" fontSize="20" textAnchor="middle" fill="#fff" className="font-mono tracking-widest uppercase">ESP</text>
                    <motion.rect
                      x="30" y="65" width="40" height="1"
                      fill="#3b82f6"
                      initial={{ scaleX: 0 }}
                      variants={{
                        hover: { scaleX: 1, transition: { duration: 0.5 } }
                      }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            ) : hobby.name.toLowerCase().includes("art") ? (
              <motion.div
                className="p-3 rounded-2xl bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center w-14 h-14 border border-white/10"
                whileHover="hover"
              >
                <motion.div
                  variants={{
                    hover: {
                      rotate: -10,
                      transition: { duration: 0.5 }
                    }
                  }}
                >
                  <svg viewBox="0 0 100 100" width="36" height="36">
                    {/* Golden Spiral / Technical Curve */}
                    <motion.path
                      d="M 20,80 Q 20,20 80,20"
                      fill="none"
                      stroke="rgba(255,255,255,0.2)"
                      strokeWidth="1"
                    />
                    <motion.path
                      d="M 20,80 Q 20,20 80,20"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="100"
                      initial={{ strokeDashoffset: 100 }}
                      variants={{
                        hover: { strokeDashoffset: 0, transition: { duration: 1 } }
                      }}
                      filter="url(#tech-glow)"
                    />
                    <rect x="18" y="78" width="4" height="4" fill="#fff" />
                    <rect x="78" y="18" width="4" height="4" fill="#fff" />
                    <text x="50" y="90" fontSize="8" fill="rgba(255,255,255,0.3)" className="font-mono">VER. 1.0.4</text>
                  </svg>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                whileHover={{ rotate: 360, scale: 1.2 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 10,
                }}
                className="p-3 rounded-2xl bg-primary-color bg-opacity-10 text-primary-color"
              >
                {getIcon(hobby.iconName)}
              </motion.div>
            )}
            </div>
            <h3 className={`${layout === "grid" ? "text-2xl" : "text-xl"} font-semibold tracking-tight duration-300 ${layout === "tile" ? "text-white" : "group-hover:text-primary-color"}`}>
              {hobby.name}
            </h3>
          </div>

          {layout !== "tile" && (
            <p className={`dark:text-zinc-400 text-zinc-600 leading-relaxed ${layout === "horizontal" || layout === "grid-sm" ? "line-clamp-2 text-sm" : "line-clamp-3 text-base"}`}>
              {hobby.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
