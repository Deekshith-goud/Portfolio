"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { HiHome, HiUser, HiBeaker, HiBookmarkAlt, HiCamera } from "react-icons/hi";

const navItems = [
  { title: "Home", href: "/", icon: HiHome },
  { title: "About", href: "/about", icon: HiUser },
  { title: "Projects", href: "/projects", icon: HiBeaker },
  { title: "Blog", href: "/blog", icon: HiBookmarkAlt },
  { title: "Photos", href: "/photos", icon: HiCamera },
];

const springConfig = { type: "spring", bounce: 0.2, duration: 0.6 };

export default function MobileDock() {
  const pathname = usePathname();
  const [localActive, setLocalActive] = useState(pathname);
  const { scrollY } = useScroll();
  const [isCompact, setIsCompact] = useState(false);
  const [isHidden, setIsHidden] = useState(false);

  // Sync local active state with actual pathname (for browser back/forward buttons)
  useEffect(() => {
    setLocalActive(pathname);
  }, [pathname]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    if (latest > previous) {
      // Scrolling down
      if (latest > 150) {
        setIsHidden(true);
        setIsCompact(true);
      } else if (latest > 50) {
        setIsHidden(false);
        setIsCompact(true);
      }
    } else if (latest < previous) {
      // Scrolling up
      setIsHidden(false);
      setIsCompact(false);
    }
  });

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center overflow-visible">
      <motion.div
        layout
        transition={springConfig}
        animate={{ y: isHidden ? 100 : 0, opacity: isHidden ? 0 : 1, gap: isCompact ? "0px" : "4px" }}
        className="relative flex items-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden"
        style={{ borderRadius: 32, height: "56px" }}
      >
        {navItems.map((item) => {
          const isActive = item.href === "/" 
            ? localActive === "/" 
            : localActive.startsWith(item.href);
          const showItem = !isCompact || isActive;

          return (
            <motion.div
              layout
              key={item.title}
              initial={false}
              animate={{ 
                width: showItem ? 48 : 0,
                opacity: showItem ? 1 : 0,
                scale: showItem ? 1 : 0.8
              }}
              style={{ width: showItem ? 48 : 0 }}
              transition={springConfig}
              className="relative overflow-visible z-10 flex items-center justify-center"
            >
                {/* Active Ring using layoutId for butter-smooth FLIP animation */}
                {isActive && (
                  <motion.div
                    layoutId="active-dock-ring"
                    transition={springConfig}
                    className="absolute inset-0 w-12 h-12 rounded-full z-0 p-[1.5px] bg-[linear-gradient(135deg,#8B5CF6,#F97316,#FBBF24,#34D399,#3B82F6)] shadow-md"
                    style={{ willChange: "transform" }}
                  >
                    <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full" />
                  </motion.div>
                )}

                <Link
                  href={item.href}
                  aria-label={item.title}
                  className="relative w-12 h-12 flex items-center justify-center z-10 [-webkit-tap-highlight-color:transparent]"
                  onClick={() => {
                    setIsCompact(false);
                    setLocalActive(item.href); // Instant visual feedback
                  }}
                >
                  <motion.div
                    animate={{
                      y: isActive && !isCompact ? -2 : 0, 
                    }}
                    whileTap={{ scale: 0.85 }}
                    transition={springConfig}
                    className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
                      isActive
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    }`}
                  >
                    <item.icon className="text-xl" />
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
      </motion.div>
    </div>
  );
}
