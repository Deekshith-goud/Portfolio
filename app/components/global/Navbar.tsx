// @ts-nocheck
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect } from "react";
import Theme from "./Theme";
import UnmountStudio from "./Unmount";
import MobileMenu from "./MobileMenu";
import Magnetic from "./Magnetic";
import SignatureNavLogo from "./SignatureNavLogo";

export default function Navbar() {
  const pathname = usePathname();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
      <header className="sticky top-0 z-50 text-sm py-4 md:px-16 px-6 border-b dark:border-zinc-800 border-zinc-200 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl transition-all duration-300 md:mb-28 mb-10">
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
            <ul className="flex items-center gap-x-2">
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
                      {isActive && (
                        <motion.span
                          layoutId="active-dot"
                          className="absolute bottom-1 w-1 h-1 rounded-full dark:bg-white bg-zinc-900"
                          transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 20,
                          }}
                        />
                      )}
                      {hoveredIndex === id && (
                        <motion.span
                          layoutId="hover-pill"
                          className="absolute inset-0 bg-zinc-100 dark:bg-zinc-800/50 rounded-full -z-10"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 150,
                            damping: 20,
                          }}
                        />
                      )}
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
      </header>
    </UnmountStudio>
  );
}
