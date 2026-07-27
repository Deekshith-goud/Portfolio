"use client";
import { useEffect, useState, useRef } from "react";
import { useInView, m as motion } from "framer-motion";

const SYMBOLS = "!@#$%^&*()_+{}[]\\|:;<>?,./~";

export function TextReveal({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");
  const [isReady, setIsReady] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  
  const ref = useRef<HTMLSpanElement>(null!);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  useEffect(() => {
    if (!isInView) return;
    setIsReady(true);
  }, [isInView]);

  useEffect(() => {
    if (!isReady) return;

    let iteration = 0;
    let interval: NodeJS.Timeout;

    interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((letter, index) => {
            if (index < Math.floor(iteration)) {
              return text[index];
            }
            if (index === Math.floor(iteration)) {
              if (letter === " ") return " ";
              return SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            }
            return ""; 
          })
          .join("")
      );

      if (iteration >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }

      iteration += 1 / 4; 
    }, 40);

    return () => clearInterval(interval);
  }, [text, isReady]);

  // Removes local alias to use motion directly

  return (
    <motion.span 
      ref={ref} 
      className="inline-block min-h-[1.5em]" 
      style={{ whiteSpace: "pre-wrap" }}
      animate={isComplete ? {
        x: [0, -3, 3, -2, 2, 0],
        filter: [
          "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
          "drop-shadow(-3px 0px 0px rgba(255,0,0,0.8)) drop-shadow(3px 0px 0px rgba(0,255,255,0.8))",
          "drop-shadow(3px 0px 0px rgba(255,0,0,0.8)) drop-shadow(-3px 0px 0px rgba(0,255,255,0.8))",
          "drop-shadow(0px 0px 0px rgba(0,0,0,0))"
        ]
      } : {}}
      transition={{ duration: 0.35, ease: "easeInOut" }}
    >
      {displayText}
      {!isComplete && (
        <span className="animate-pulse ml-[2px] opacity-80">_</span>
      )}
    </motion.span>
  );
}
