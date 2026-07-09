"use client";

import { useEffect, useState } from "react";
import { BiCompass } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { HobbyType } from "@/types";
import { Slide } from "../../animation/Slide";
import HobbyCard from "../shared/HobbyCard";
import BlackHole from "../shared/BlackHole";
import Link from "next/link";

export default function Hobbies({ hobbies }: { hobbies: HobbyType[] }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || hobbies.length === 0) return null;

  return (
    <section className="mt-32">
      <Slide delay={0.1}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-4 mb-8">
          <div className="flex items-center gap-x-3">
            <h2 className="text-4xl font-bold tracking-tight">
              Hobbies & Interests
            </h2>
          </div>

          {hobbies.length > 2 && (
            <Link
              href="/hobbies"
              className="group relative flex items-center justify-center gap-x-2 dark:bg-primary-bg bg-secondary-bg border dark:border-zinc-800 border-zinc-200 hover:border-primary-color rounded-full py-2 px-6 transition-all duration-300 font-semibold text-sm overflow-hidden hover:scale-105"
            >
              <div className="absolute inset-0 bg-primary-color/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              <span className="relative z-10">Explore All</span>
              <HiArrowNarrowRight className="relative z-10 group-hover:translate-x-1 transition-transform duration-300 text-lg" />
            </Link>
          )}
        </div>
      </Slide>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-stretch w-full">
        {/* Hobby 1 */}
        {hobbies.length > 0 && (
          <div className="w-full lg:w-[360px] shrink-0 h-full order-1">
            <Slide delay={0}>
              <HobbyCard hobby={hobbies[0]} index={0} layout="grid-sm" />
            </Slide>
          </div>
        )}

        {/* Black Hole */}
        <div className="flex-1 w-full flex flex-col gap-6 h-full order-2 lg:order-3">
           <Slide delay={0.3} className="h-full">
             <div className="w-full h-full flex items-center justify-center">
               <BlackHole />
             </div>
           </Slide>
        </div>

        {/* Hobby 2 */}
        {hobbies.length > 1 && (
          <div className="w-full lg:w-[360px] shrink-0 h-full order-3 lg:order-2">
            <Slide delay={0.1}>
              <HobbyCard hobby={hobbies[1]} index={1} layout="grid-sm" />
            </Slide>
          </div>
        )}
      </div>
    </section>
  );
}
