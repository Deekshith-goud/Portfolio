"use client";

import React, { useEffect, useState } from "react";
import Constellation from "./Constellation";
import dynamic from "next/dynamic";
import { useDevicePerformance } from "../../hooks/useDevicePerformance";

const SignatureLogo = dynamic(() => import("./SignatureLogo"), { ssr: false });

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";
const SCRAMBLE_TICK_MS = 30;
const SCRAMBLE_STEP = 0.25;

const randomChar = () => SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
const randomTail = (length: number) => Array.from({ length }, randomChar).join("");

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
  const [revealCount, setRevealCount] = useState(reducedMotion ? text.length : 0);
  const [tail, setTail] = useState(() => (reducedMotion ? "" : randomTail(text.length)));

  useEffect(() => {
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
      <span
        className={`inline-block w-1.5 h-3 ml-1 bg-zinc-300 transition-opacity duration-300 ${
          isComplete ? "animate-[pulse_0.8s_ease-in-out_infinite]" : "opacity-0"
        }`}
      />
    </span>
  );
};

export default function Loader() {
  const tier = useDevicePerformance();
  const prefersReducedMotion = usePrefersReducedMotion();
  
  const [isMounted, setIsMounted] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Start progress bar animation right after mount
    const rafId = requestAnimationFrame(() => setProgressVisible(true));
    
    // Simulate easeInOut progress text (0 to 100 over 2.6s)
    let start = performance.now();
    let frame: number;
    const duration = 2600;
    
    const update = (time: number) => {
      const elapsed = time - start;
      const p = Math.min(100, (elapsed / duration) * 100);
      // easeInOutSine approximation
      const eased = -(Math.cos(Math.PI * (p / 100)) - 1) / 2 * 100;
      setProgress(Math.round(eased));
      if (elapsed < duration) {
        frame = requestAnimationFrame(update);
      }
    };
    frame = requestAnimationFrame(update);

    const exitTimer = setTimeout(() => {
      setIsExiting(true);
    }, 3200);

    const unmountTimer = setTimeout(() => {
      setIsMounted(false);
    }, 5000); // Wait for 1.8s exit animation to finish

    return () => {
      cancelAnimationFrame(rafId);
      cancelAnimationFrame(frame);
      clearTimeout(exitTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!isMounted) return null;

  const easeCubic = "cubic-bezier(0.65, 0, 0.35, 1)";
  
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1017] overflow-hidden transition-opacity`}
      style={{
        opacity: isExiting ? 0 : 1,
        transitionDuration: "1000ms",
        transitionDelay: isExiting ? "800ms" : "0ms",
        transitionTimingFunction: "ease-in-out"
      }}
    >
      {/* Background */}
      <div 
        className="absolute inset-0 w-full h-full pointer-events-none transition-all"
        style={{
          opacity: isExiting ? 0 : 0.6,
          transform: isExiting && !prefersReducedMotion ? "scale(1.35)" : "scale(1)",
          transitionDuration: prefersReducedMotion ? "600ms" : "1800ms",
          transitionTimingFunction: prefersReducedMotion ? "ease-in-out" : easeCubic
        }}
      >
        <Constellation />
      </div>

      <div className="z-10 flex flex-col items-center justify-center w-full">
        {/* Signature */}
        <div
          className="transition-all"
          style={{
            opacity: isExiting ? 0 : 1,
            transform: isExiting ? (prefersReducedMotion ? "scale(1)" : "scale(0.6)") : "scale(1)",
            filter: isExiting && tier !== "low" && !prefersReducedMotion ? "blur(16px)" : "none",
            transitionDuration: prefersReducedMotion ? "600ms" : "1800ms",
            transitionTimingFunction: easeCubic
          }}
        >
          <SignatureLogo
            isAnimated={true}
            className="w-[85vw] max-w-3xl h-auto drop-shadow-2xl pointer-events-none mb-12"
          />
        </div>

        {/* Progress Indicator */}
        <div
          className="flex flex-col items-center gap-4 transition-all"
          style={{
            opacity: isExiting ? 0 : (progressVisible ? 1 : 0),
            transform: isExiting ? "scale(0.9)" : (progressVisible ? "translateY(0)" : "translateY(10px)"),
            transitionDuration: isExiting ? "1800ms" : "1200ms",
            transitionTimingFunction: isExiting ? easeCubic : "ease-out"
          }}
        >
          <div className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase flex items-center gap-6">
            <ScrambleText text="INITIALIZING" reducedMotion={prefersReducedMotion} />
            <span className="text-zinc-300 w-8 text-right">{progress}%</span>
          </div>

          <div className="w-64 h-[1px] bg-zinc-800/50 relative">
            <div
              className="absolute inset-y-0 left-0 w-full origin-left bg-gradient-to-r from-transparent via-blue-400/80 to-blue-200 transition-transform"
              style={{
                transform: progressVisible ? "scaleX(1)" : "scaleX(0)",
                transitionDuration: "2600ms",
                transitionTimingFunction: "ease-in-out"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}