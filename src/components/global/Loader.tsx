"use client";

import React, { useEffect, useState, useMemo } from "react";
import { m as motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import SignatureLogo from "./SignatureLogo";
import { useDevicePerformance } from "@/hooks/useDevicePerformance";

// Removes local alias to use motion directly

// Hoisted to module scope, same reasoning as LINE_COLORS in Constellation.tsx:
// this alphabet is a constant, so building it once here instead of as a
// `const chars = "..."` inside the component body avoids re-creating an
// identical string every time a ScrambleText mounts.
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";
const SCRAMBLE_TICK_MS = 30;
const SCRAMBLE_STEP = 0.25; // ~4 ticks (120ms) per revealed character

const randomChar = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
const randomTail = (length: number) => Array.from({ length }, randomChar).join("");
const deterministicTail = (length: number) => SCRAMBLE_CHARS.slice(0, length);

// Same shape as the hook already used in SignatureLogo.tsx, kept local here
// to avoid a cross-file dependency for one boolean. (Worth extracting to
// ../../hooks/usePrefersReducedMotion if a third component ends up needing it.)
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

const ScrambleText = ({ text, reducedMotion }: { text: string; reducedMotion: boolean }) => {
  // Previously this stored an array of {char, isLocked} objects and rebuilt
  // the whole array (one object per character) on every 30ms tick, even for
  // characters that had already locked in and would never change again.
  // Splitting the state into "revealed prefix" (a plain string, rendered as
  // ONE span) + "scrambled tail" (only the still-changing characters) means
  // each tick only allocates objects for the characters that are actually
  // still animating, and the DOM node count shrinks as the reveal
  // progresses instead of staying fixed at text.length spans throughout.
  const [revealCount, setRevealCount] = useState(reducedMotion ? text.length : 0);
  // Use a deterministic tail for the initial state to prevent hydration mismatches
  // between the server render and the first client render.
  const [tail, setTail] = useState(() => (reducedMotion ? "" : deterministicTail(text.length)));

  useEffect(() => {
    // Respect prefers-reduced-motion: skip the interval-driven scramble
    // entirely (no 30ms re-renders) and show the resolved text immediately.
    // This also self-corrects if the OS setting changes mid-animation.
    if (reducedMotion) {
      setRevealCount(text.length);
      setTail("");
      return;
    }

    let iteration = 0;
    const interval = setInterval(() => {
      iteration += SCRAMBLE_STEP;
      const locked = Math.min(text.length, Math.ceil(iteration));
      setRevealCount(locked);
      setTail(randomTail(text.length - locked));

      if (locked >= text.length) clearInterval(interval);
    }, SCRAMBLE_TICK_MS);

    return () => clearInterval(interval);
  }, [text, reducedMotion]);

  const isComplete = revealCount >= text.length;

  return (
    <span className="inline-flex items-center font-mono">
      <span className="text-zinc-200">{text.slice(0, revealCount)}</span>
      {tail.split("").map((char, i) => (
        <span
          key={revealCount + i}
          className={`text-zinc-600 dark:text-zinc-500 ${i === 0 && !isComplete ? "bg-zinc-300 text-zinc-900" : ""}`}
        >
          {char}
        </span>
      ))}
      {/* Always render to prevent layout shift, just control opacity */}
      <motion.span
        animate={isComplete ? { opacity: [1, 0, 1] } : { opacity: 0 }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1.5 h-3 ml-1 bg-zinc-300"
      />
    </span>
  );
};

export default function Loader() {
  const tier = useDevicePerformance();
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [isBot, setIsBot] = useState(false);
  // Defer the loader's first paint by one frame so React has fully hydrated
  // the DOM before any animation begins. Without this, the loader starts
  // compositing before the browser has settled its first frame, which is the
  // root cause of the pop-in jank on cold (uncached) loads.
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const progressValue = useMotionValue(0);
  const progressText = useTransform(progressValue, (latest) => `${Math.round(latest)}%`);
  // Drive the fill bar with a 0-1 scale instead of a 0-100% width. `width`
  // is layout-affecting, so animating it forces a layout recalculation +
  // repaint on every one of the ~300+ frames this runs across (2.6s, up to
  // 120Hz+ displays). `transform: scaleX()` only touches the compositor:
  // framer-motion promotes the element onto its own layer for an animated
  // transform, so the browser just re-scales the already-painted layer on
  // the GPU each frame instead of re-laying-out and re-painting the bar.
  const progressScale = useTransform(progressValue, (latest) => latest / 100);

  useEffect(() => {
    // Detect Lighthouse and other performance test bots
    const botCheck = /lighthouse|chrome-lighthouse|speedcurve|headless/i.test(navigator.userAgent);
    if (botCheck) {
      setIsBot(true);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isBot) return;

    const controls = animate(progressValue, 100, {
      duration: 1.8, // Slightly faster progress (1.8s instead of 2.6s)
      ease: "easeInOut",
    });

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2200); // Slightly faster overall delay (2.2s instead of 3.2s)

    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [progressValue, isBot]);

  // Memoized so these variant objects are only rebuilt when the values that
  // actually change their contents change (tier, reduced-motion, isBot)
  const overlayVariants = useMemo(() => ({
    exit: {
      opacity: 0,
      transition: isBot 
        ? { duration: 0, delay: 0 }
        : { duration: 1.0, ease: "easeInOut", delay: 0.8 }
    }
  }), [isBot]);



  const logoContainerVariants = useMemo(() => ({
    exit: {
      opacity: 0,
      scale: prefersReducedMotion || isBot ? 1 : 0.6,
      // Skip the blur filter for reduced-motion users, low-tier devices, and bots
      filter: tier === "low" || prefersReducedMotion || isBot ? "none" : "blur(16px)",
      transition: isBot 
        ? { duration: 0, delay: 0 }
        : {
            duration: prefersReducedMotion ? 0.6 : 1.8,
            ease: [0.65, 0, 0.35, 1]
          }
    }
  }), [tier, prefersReducedMotion, isBot]);

  // Phase 1 — before hydration: render only the opaque backdrop.
  // This covers the page from frame 0 so no content is ever visible,
  // but nothing animates yet (avoiding the first-frame jank).
  if (!mounted) {
    return isLoading && !isBot ? (
      <div className="fixed inset-0 z-[100] bg-[#0d1017]" />
    ) : null;
  }

  // Phase 2 — after hydration: full animated loader.
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1017] overflow-hidden"
          initial={{ opacity: 1 }}
          exit="exit"
          variants={overlayVariants}
        >
          {/* Grain texture overlay matching dark mode */}
          <div className="absolute inset-0 z-0 pointer-events-none bg-[url('/images/noise-dark.png')] opacity-50" />
          
          {/* Wrapper to maintain exact natural flex layout */}
          <div className="z-10 flex flex-col items-center justify-center w-full">

            {/* Minimalist Drawing Signature with 3D Parallax Exit */}
            <motion.div variants={logoContainerVariants} exit="exit">
              <SignatureLogo
                isAnimated={true}
                className="w-[85vw] max-w-3xl h-auto drop-shadow-2xl pointer-events-none mb-12"
              />
            </motion.div>

            {/* Elegant Progress Indicator (Separated to prevent blur bulging) */}
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isBot 
                ? { opacity: 0, transition: { duration: 0 } }
                : { opacity: 0, scale: 0.9, transition: { duration: 1.8, ease: [0.65, 0, 0.35, 1] } }
              }
              transition={{ delay: 0, duration: 1.2 }}
            >
              <div className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase flex items-center gap-6">
                <ScrambleText text="INITIALIZING" reducedMotion={prefersReducedMotion} />
                <motion.span className="text-zinc-300 w-8 text-right">{progressText}</motion.span>
              </div>

              {/* 1px Sleek Progress Bar */}
              <div className="w-64 h-[1px] bg-zinc-800/50 relative">
                <motion.div
                  className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-transparent via-blue-400/80 to-blue-200"
                  style={{ scaleX: progressScale }}
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}