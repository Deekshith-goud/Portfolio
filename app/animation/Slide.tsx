// @ts-nocheck
"use client";
import { m, useInView, useAnimation, AnimationProps } from "framer-motion";
import { useRef, useEffect, RefObject } from "react";
import { useDevicePerformance } from "../hooks/useDevicePerformance";

interface SlideProps extends AnimationProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export const Slide = ({ children, className, delay }: SlideProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInview = useInView(ref as RefObject<Element>, { once: true });
  const controls = useAnimation();

  useEffect(() => {
    if (isInview) {
      controls.start("stop");
    }
  }, [controls, isInview]);

  const tier = useDevicePerformance();
  const isLowEnd = tier === "low";

  return (
    <m.div
      ref={ref}
      variants={{
        start: { opacity: 0, translateY: 15, filter: isLowEnd ? "none" : "blur(8px)" },
        stop: { opacity: 1, translateY: 0, filter: isLowEnd ? "none" : "blur(0px)" },
      }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100,
        delay: delay,
      }}
      animate={controls}
      initial="start"
    >
      <div className={className}>{children}</div>
    </m.div>
  );
};
