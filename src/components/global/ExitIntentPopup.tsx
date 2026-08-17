"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoClose } from "react-icons/io5";

export default function ExitIntentPopup() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Check if the user has already seen the popup in this session
    const hasSeenPopup = sessionStorage.getItem("hasSeenVisitorPopup");

    // Don't show on the visitors page itself
    if (pathname === "/visitors" || hasSeenPopup === "true") {
      return;
    }

    const handleMouseOut = (e: MouseEvent) => {
      // If the mouse leaves the top of the viewport (exit intent)
      if (e.clientY <= 0) {
        // Check again inside the event listener in case it was closed during the same page load
        const alreadySeen = sessionStorage.getItem("hasSeenVisitorPopup");
        if (alreadySeen !== "true") {
          setIsVisible(true);
        }
      }
    };

    document.addEventListener("mouseleave", handleMouseOut);

    return () => {
      document.removeEventListener("mouseleave", handleMouseOut);
    };
  }, [pathname]);

  const closePopup = () => {
    setIsVisible(false);
    // Remember that the user closed it so we don't annoy them again this session
    sessionStorage.setItem("hasSeenVisitorPopup", "true");
  };

  const handleLinkClick = () => {
    setIsVisible(false);
    sessionStorage.setItem("hasSeenVisitorPopup", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[24rem] bg-zinc-900/95 backdrop-blur-xl border border-white/10 rounded-[24px] shadow-[0_0_40px_rgba(0,0,0,0.5)] p-2 text-left"
          >
            {/* Close Button */}
            <button
              onClick={closePopup}
              className="absolute top-5 right-5 text-zinc-500 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 p-2 rounded-full transition-all z-30"
              aria-label="Close popup"
            >
              <IoClose size={18} />
            </button>

            {/* Peeking Cat Image */}
            <div className="absolute left-full -translate-x-[20%] md:-translate-x-[26%] bottom-4 md:bottom-6 w-32 h-32 md:w-44 md:h-44 z-20 pointer-events-none">
              <Image
                src="/images/cat-popup-final.png"
                alt="Peeking Cat"
                width={200}
                height={200}
                className="object-contain w-full h-full drop-shadow-2xl"
              />
            </div>

            {/* Inner Border Container */}
            <div className="relative border border-white/5 rounded-[16px] p-6 pr-12 z-10 overflow-hidden">
              {/* Subtle gradient background for inner container */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
              
              <div className="relative z-20">
                <h2 className="text-xl font-semibold text-white mb-2 tracking-tight">
                  Leaving so soon?
                </h2>
                <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
                  Before you go, leave a trace on the visitor wall. Draw, write, or scribble something weird!
                </p>

                <Link
                  href="/visitors"
                  onClick={handleLinkClick}
                  className="inline-flex items-center justify-between w-full bg-white hover:bg-zinc-100 text-zinc-900 text-sm font-semibold py-3 px-4 rounded-xl transition-all duration-300 group shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
                >
                  <span>Add your drawing</span>
                  <div className="bg-zinc-200/60 text-zinc-900 p-1 rounded-lg group-hover:bg-zinc-200 transition-colors">
                    <svg
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
