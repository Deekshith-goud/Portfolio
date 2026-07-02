// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring, useVelocity, useTransform, useMotionTemplate } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Theme from "./Theme";
import UnmountStudio from "./Unmount";
import MobileMenu from "./MobileMenu";
import Magnetic from "./Magnetic";
import SignatureNavLogo from "./SignatureNavLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const navRef = useRef<HTMLUListElement>(null);
  const [hoverStyle, setHoverStyle] = useState({ left: 0, width: 0, opacity: 0 });
  const [dotVisible, setDotVisible] = useState(false);

  // Velocity-based Rainbow Trail calculations
  const dotX = useSpring(0, { stiffness: 150, damping: 20 });
  const dotVelocity = useVelocity(dotX);
  const dotWidth = useTransform(dotVelocity, [-1500, 0, 1500], [100, 4, 100]);
  const rainbowOpacity = useTransform(dotVelocity, [-300, 0, 300], [1, 0, 1]);
  const solidDotOpacity = useTransform(dotVelocity, [-300, 0, 300], [0, 1, 0]);
  const finalX = useMotionTemplate`calc(${dotX}px - ${dotWidth}px / 2)`;

  useEffect(() => {
    if (!navRef.current) return;
    const activeIndex = data.findIndex(link => pathname === link.href);
    if (activeIndex !== -1) {
      const navItems = Array.from(navRef.current.querySelectorAll("li"));
      const activeEl = navItems[activeIndex] as HTMLElement;
      if (activeEl) {
        const center = activeEl.offsetLeft + activeEl.offsetWidth / 2;
        dotX.set(center);
        setDotVisible(true);
      }
    } else {
      setDotVisible(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (!navRef.current) return;
    if (hoveredIndex !== null) {
      const navItems = Array.from(navRef.current.querySelectorAll("li"));
      const hoverEl = navItems[hoveredIndex] as HTMLElement;
      if (hoverEl) {
        setHoverStyle({
          left: hoverEl.offsetLeft,
          width: hoverEl.offsetWidth,
          opacity: 1
        });
      }
    } else {
      setHoverStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [hoveredIndex]);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const data = [
    {
      title: "About",
      href: "/about",
    },
    {
      title: "Projects",
      href: "/projects",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Photos",
      href: "/photos",
    },
  ];

  return (
    <UnmountStudio>
      <>
        <div className="h-[83px] md:mb-28 mb-10" />
        <motion.header layoutRoot className="fixed top-0 left-0 right-0 z-50 text-sm py-4 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-200 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl transition-all duration-300">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center w-[120px]">
            <Link
              href="/"
              className="active:scale-90 transition-transform duration-300 inline-block relative h-[50px] w-full"
            >
              <div className="absolute top-1/2 left-0 -translate-y-1/2">
                <div className="w-[120px]">
                  <SignatureNavLogo />
                </div>
              </div>
            </Link>
          </div>

          <nav className="md:block hidden">
            <ul ref={navRef} className="flex items-center gap-x-2 relative">
              {/* Elastic Rainbow Motion Trail Dot */}
              <motion.div
                className="absolute bottom-1 h-1 flex items-center justify-center pointer-events-none"
                style={{ 
                  left: 0,
                  x: finalX,
                  width: dotWidth,
                }}
                initial={false}
              >
                {/* Standard Solid Dot (Visible when resting) */}
                <motion.div 
                  className="absolute w-1 h-1 rounded-full dark:bg-white bg-zinc-900"
                  style={{ opacity: dotVisible ? solidDotOpacity : 0 }}
                />
                {/* Glowing Rainbow Trail (Fades in when moving fast) */}
                <motion.div 
                  className="absolute w-full h-[2px] rounded-full bg-[linear-gradient(90deg,#8B5CF6_10%,#F97316_30%,#FBBF24_50%,#34D399_70%,#3B82F6_90%)] bg-[length:120px_100%] bg-center bg-no-repeat"
                  style={{ opacity: rainbowOpacity }}
                />
              </motion.div>

              {/* Hover Pill */}
              <motion.div
                className="absolute inset-y-0 my-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-full -z-10 pointer-events-none"
                initial={false}
                animate={hoverStyle}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
              />

              {data.map((link, id) => {
                const isActive = pathname === link.href;
                return (
                  <li
                    key={id}
                    onMouseEnter={() => setHoveredIndex(id)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="relative"
                  >
                    <Link
                      href={link.href}
                      className={`relative px-5 py-2 rounded-full font-incognito duration-300 text-base flex flex-col items-center justify-center ${
                        isActive
                          ? "dark:text-primary-color text-zinc-900 font-semibold"
                          : "dark:text-zinc-400 text-zinc-600 dark:hover:text-primary-color hover:text-zinc-900"
                      }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-x-4">
            <Theme />
            <MobileMenu />
          </div>
        </div>

        {/* Scroll Progress Indicator */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] dark:bg-primary-color bg-black origin-left"
          style={{ scaleX }}
        />
        </motion.header>
      </>
    </UnmountStudio>
  );
}
