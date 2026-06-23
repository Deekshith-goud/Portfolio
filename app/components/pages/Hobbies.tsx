"use client";

import { useEffect, useState } from "react";
import { BiCompass } from "react-icons/bi";
import { HiArrowNarrowRight } from "react-icons/hi";
import { HobbyType } from "@/types";
import { Slide } from "../../animation/Slide";
import HobbyCard from "../shared/HobbyCard";
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
            <BiCompass className="text-3xl text-primary-color" />
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

      <div className="grid md:grid-cols-2 grid-cols-1 gap-10">
        {hobbies.slice(0, 2).map((hobby, index) => (
          <Slide key={hobby._id} delay={0.1 * index}>
            <HobbyCard hobby={hobby} index={index} layout="grid" />
          </Slide>
        ))}
      </div>
    </section>
  );
}
