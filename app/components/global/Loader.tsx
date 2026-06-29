"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Constellation from "./Constellation";
import SignatureLogo from "./SignatureLogo";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);
  const [dest, setDest] = useState({ x: "-41vw", y: "-43vh", scale: 0.12 });

  useEffect(() => {
    // Dynamically calculate the exact center of the Navbar logo
    const targetEl = document.getElementById("navbar-logo");
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const targetX = rect.left + rect.width / 2;
      const targetY = rect.top + rect.height / 2;
      
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      
      const containerWidth = Math.min(window.innerWidth * 0.85, 768);
      const scaleToFit = rect.width / containerWidth;

      setDest({
        x: `${targetX - centerX}px`,
        y: `${targetY - centerY}px`,
        scale: scaleToFit,
      });
    }

    // Hide loader after animation finishes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2800); 
    
    return () => clearTimeout(timer);
  }, []);

  const overlayVariants = {
    exit: { 
      opacity: 0,
      transition: { duration: 0.7, delay: 0.3, ease: "easeInOut" } 
    }
  };

  const logoContainerVariants = {
    exit: {
      y: dest.y,
      x: dest.x,
      scale: dest.scale,
      transition: { 
        duration: 1.0, 
        ease: [0.76, 0, 0.24, 1]
      }
    }
  };

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0d1017] overflow-hidden"
          initial={{ opacity: 1 }}
          exit="exit"
          variants={overlayVariants}
        >
          <Constellation />
          <motion.div variants={logoContainerVariants} exit="exit" className="z-10 flex items-center justify-center">
            <SignatureLogo 
              isAnimated={true} 
              className="w-[85vw] max-w-3xl h-auto drop-shadow-2xl pointer-events-none" 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}