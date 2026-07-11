"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { HiHome, HiUser, HiBeaker, HiBookmarkAlt, HiCamera } from "react-icons/hi";

const navItems = [
  { title: "Home", href: "/", icon: HiHome },
  { title: "About", href: "/about", icon: HiUser },
  { title: "Projects", href: "/projects", icon: HiBeaker },
  { title: "Blog", href: "/blog", icon: HiBookmarkAlt },
  { title: "Photos", href: "/photos", icon: HiCamera },
];

export default function MobileDock() {
  const pathname = usePathname();
  const [localActive, setLocalActive] = useState(pathname);
  const [isCompact, setIsCompact] = useState(false);

  // Sync local active state with actual pathname (for browser back/forward buttons)
  useEffect(() => {
    setLocalActive(pathname);
  }, [pathname]);

  // Native scroll listener replacing framer-motion useScroll
  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsCompact(true);
      } else if (currentScrollY < lastScrollY) {
        setIsCompact(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const activeIndex = navItems.findIndex((item) => 
    item.href === "/" ? localActive === "/" : localActive.startsWith(item.href)
  );
  const safeActiveIndex = activeIndex === -1 ? 0 : activeIndex;
  
  // Calculate exact sliding offset: 48px width + 4px gap per item
  const activeX = isCompact ? 0 : safeActiveIndex * 52;
  const springEasing = "cubic-bezier(0.175, 0.885, 0.32, 1.275)";

  return (
    <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex justify-center">
      <div
        className="relative flex items-center bg-white/70 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 p-1 shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden transition-all duration-300"
        style={{ 
          borderRadius: 32, 
          height: "56px", 
          gap: isCompact ? "0px" : "4px",
          transitionTimingFunction: springEasing
        }}
      >
        {/* The single, unified sliding ring */}
        <div
          className="absolute left-1 top-1 w-12 h-12 rounded-full z-0 p-[1.5px] bg-[linear-gradient(135deg,#8B5CF6,#F97316,#FBBF24,#34D399,#3B82F6)] shadow-md transition-transform duration-300"
          style={{ 
            transform: `translateX(${activeX}px)`,
            transitionTimingFunction: springEasing 
          }}
        >
          <div className="w-full h-full bg-white dark:bg-zinc-900 rounded-full" />
        </div>

        {navItems.map((item) => {
          const isActive = item.href === "/" 
            ? localActive === "/" 
            : localActive.startsWith(item.href);
          const showItem = !isCompact || isActive;

          return (
            <div
              key={item.title}
              className="overflow-hidden z-10 transition-all duration-300"
              style={{ 
                width: showItem ? 48 : 0,
                opacity: showItem ? 1 : 0,
                transform: `scale(${showItem ? 1 : 0.8})`,
                transitionTimingFunction: springEasing
              }}
            >
                <Link
                  href={item.href}
                  aria-label={item.title}
                  className="relative w-12 h-12 flex items-center justify-center"
                  onClick={() => {
                    setIsCompact(false);
                    setLocalActive(item.href); // Instant visual feedback
                  }}
                >
                  <div
                    className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${
                      isActive
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300"
                    }`}
                    style={{ 
                      transform: isActive && !isCompact ? "translateY(-2px)" : "translateY(0)",
                      transitionTimingFunction: springEasing
                    }}
                  >
                    <item.icon className="text-xl" />
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </div>
  );
}
