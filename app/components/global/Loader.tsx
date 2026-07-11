"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from "framer-motion";
import Constellation from "./Constellation";
import dynamic from "next/dynamic";
import { useDevicePerformance } from "../../hooks/useDevicePerformance";

const SignatureLogo = dynamic(() => import("./SignatureLogo"), { ssr: false });

const MotionDiv = motion.div as any;
const MotionSpan = motion.span as any;

const ScrambleText = ({ text }: { text: string }) => {
  const [displayChars, setDisplayChars] = useState<{ char: string; isLocked: boolean }[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,./<>?";

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setCurrentIndex(Math.floor(iteration));
      setDisplayChars(
        text.split("").map((letter, index) => {
          if (index < iteration) {
            return { char: text[index], isLocked: true };
          }
          return { char: chars[Math.floor(Math.random() * chars.length)], isLocked: false };
        })
      );

      if (iteration >= text.length) {
        clearInterval(interval);
      }

      iteration += 1 / 4;
    }, 30);

    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="inline-flex items-center font-mono">
      {displayChars.map((item, i) => {
        const isCurrent = i === currentIndex && currentIndex < text.length;
        return (
          <span
            key={i}
            className={`
              ${item.isLocked ? "text-zinc-200" : "text-zinc-600 dark:text-zinc-500"}
              ${isCurrent ? "bg-zinc-300 text-zinc-900" : ""}
            `}
          >
            {item.char}
          </span>
        );
      })}
      {/* Always render to prevent layout shift, just control opacity */}
      <MotionSpan
        animate={currentIndex >= text.length ? { opacity: [1, 0, 1] } : { opacity: 0 }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-1.5 h-3 ml-1 bg-zinc-300"
      />
    </span>
  );
};

export default function Loader() {
  const tier = useDevicePerformance();
  const [isLoading, setIsLoading] = useState(true);
  const progressValue = useMotionValue(0);
  const progressText = useTransform(progressValue, (latest) => `${Math.round(latest)}%`);
  const progressWidth = useTransform(progressValue, (latest) => `${latest}%`);

  useEffect(() => {
    // Smoothly animate the progress value from 0 to 100 over 2.6 seconds
    const controls = animate(progressValue, 100, {
      duration: 2.6,
      ease: "easeInOut", // easeInOut makes the counting feel natural
    });

    // Wait for the signature to finish drawing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3200);

    return () => {
      controls.stop();
      clearTimeout(timer);
    };
  }, [progressValue]);

  const overlayVariants = {
    exit: {
      opacity: 0,
      transition: { duration: 1.0, ease: "easeInOut", delay: 0.8 }
    }
  };

  const backgroundVariants = {
    exit: {
      scale: 1.35,
      opacity: 0,
      transition: { duration: 1.8, ease: [0.65, 0, 0.35, 1] }
    }
  };

  const logoContainerVariants = {
    exit: {
      opacity: 0,
      scale: 0.6,
      filter: tier === "low" ? "none" : "blur(16px)",
      transition: {
        duration: 1.8,
        ease: [0.65, 0, 0.35, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <MotionDiv
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1017] overflow-hidden"
          initial={{ opacity: 1 }}
          exit="exit"
          variants={overlayVariants}
        >
          {/* Subtle Constellation Background that scales up */}
          <MotionDiv variants={backgroundVariants} exit="exit" className="absolute inset-0 w-full h-full pointer-events-none opacity-60">
            <Constellation />
          </MotionDiv>

          {/* Wrapper to maintain exact natural flex layout */}
          <div className="z-10 flex flex-col items-center justify-center w-full">
            
            {/* Minimalist Drawing Signature with 3D Parallax Exit */}
            <MotionDiv variants={logoContainerVariants} exit="exit">
              <SignatureLogo 
                isAnimated={true} 
                className="w-[85vw] max-w-3xl h-auto drop-shadow-2xl pointer-events-none mb-12" 
              />
            </MotionDiv>

            {/* Elegant Progress Indicator (Separated to prevent blur bulging) */}
            <MotionDiv 
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 1.8, ease: [0.65, 0, 0.35, 1] } }}
              transition={{ delay: 0, duration: 1.2 }}
            >
              <div className="text-zinc-500 font-mono text-xs tracking-[0.4em] uppercase flex items-center gap-6">
                <ScrambleText text="INITIALIZING" />
                <MotionSpan className="text-zinc-300 w-8 text-right">{progressText}</MotionSpan>
              </div>
              
              {/* 1px Sleek Progress Bar */}
              <div className="w-64 h-[1px] bg-zinc-800/50 relative">
                <MotionDiv 
                  className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-transparent via-blue-400/80 to-blue-200"
                  style={{ width: progressWidth }}
                />
              </div>
            </MotionDiv>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}