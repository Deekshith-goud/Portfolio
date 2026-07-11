// @ts-nocheck
"use client";

import { m, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";
import { 
  LuCrown, 
  LuMonitorSmartphone, 
  LuRocket, 
  LuAward, 
  LuShapes 
} from "react-icons/lu";

const principles = [
  {
    title: "Latest Tech",
    description: "Stay ahead with cutting-edge frameworks and libraries for a modern web experience.",
    icon: LuCrown,
    className: "md:col-span-2 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-500/15 dark:to-purple-500/15 hover:border-indigo-500/50 dark:hover:border-indigo-400/60 dark:border-white/5",
    iconClass: "text-indigo-500 dark:text-indigo-400",
    badgeClass: "dark:bg-indigo-500/20 dark:border-indigo-500/40",
    glowColor: "rgba(99, 102, 241, 0.15)",
    darkGlowColor: "rgba(99, 102, 241, 0.35)"
  },
  {
    title: "Beautiful UX",
    description: "Aesthetic designs that blend style with usability for a polished interface.",
    icon: LuShapes,
    className: "md:col-span-1 bg-gradient-to-br from-teal-500/5 to-emerald-500/5 dark:from-teal-500/15 dark:to-emerald-500/15 hover:border-teal-500/50 dark:hover:border-teal-400/60 dark:border-white/5",
    iconClass: "text-teal-500 dark:text-teal-400",
    badgeClass: "dark:bg-teal-500/20 dark:border-teal-500/40",
    glowColor: "rgba(20, 184, 166, 0.15)",
    darkGlowColor: "rgba(20, 184, 166, 0.35)"
  },
  {
    title: "Responsiveness",
    description: "Seamless adaptation across devices for a flawless user experience everywhere.",
    icon: LuMonitorSmartphone,
    className: "md:col-span-1 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 dark:from-blue-500/15 dark:to-cyan-500/15 hover:border-blue-500/50 dark:hover:border-blue-400/60 dark:border-white/5",
    iconClass: "text-blue-500 dark:text-blue-400",
    badgeClass: "dark:bg-blue-500/20 dark:border-blue-500/40",
    glowColor: "rgba(59, 130, 246, 0.15)",
    darkGlowColor: "rgba(59, 130, 246, 0.35)"
  },
  {
    title: "Performance",
    description: "Optimized for speed and efficiency, delivering lightning-fast experiences.",
    icon: LuRocket,
    className: "md:col-span-1 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/15 dark:to-orange-500/15 hover:border-amber-500/50 dark:hover:border-amber-400/60 dark:border-white/5",
    iconClass: "text-amber-500 dark:text-amber-400",
    badgeClass: "dark:bg-amber-500/20 dark:border-amber-500/40",
    glowColor: "rgba(245, 158, 11, 0.15)",
    darkGlowColor: "rgba(245, 158, 11, 0.35)"
  },
  {
    title: "Beautiful UI",
    description: "Crafting intuitive and enjoyable interactions that keep users engaged.",
    icon: LuAward,
    className: "md:col-span-1 bg-gradient-to-br from-pink-500/5 to-rose-500/5 dark:from-pink-500/15 dark:to-rose-500/15 hover:border-pink-500/50 dark:hover:border-pink-400/60 dark:border-white/5",
    iconClass: "text-pink-500 dark:text-pink-400",
    badgeClass: "dark:bg-pink-500/20 dark:border-pink-500/40",
    glowColor: "rgba(236, 72, 153, 0.15)",
    darkGlowColor: "rgba(236, 72, 153, 0.35)"
  }
];

function PrincipleCard({ item }: { item: typeof principles[0] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the parallax effect
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  
  // Transform mouse position into slight rotations/translations for the watermark
  const watermarkX = useTransform(springX, [0, 500], [-10, 10]);
  const watermarkY = useTransform(springY, [0, 500], [-10, 10]);
  const watermarkRotate = useTransform(springX, [0, 500], [-12, -8]);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const Icon = item.icon;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <m.div
      variants={itemVariants}
      // @ts-ignore
      onMouseMove={handleMouseMove}
      className={`group relative overflow-hidden rounded-3xl p-8 flex flex-col gap-y-4 backdrop-blur-md bg-white/50 dark:bg-zinc-900/60 border border-zinc-200 transition-all duration-500 cursor-default shadow-sm hover:shadow-xl hover:-translate-y-1 ${item.className}`}
    >
      {/* Light Mode Spotlight Glow Effect */}
      <m.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 dark:hidden"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              400px circle at ${mouseX}px ${mouseY}px,
              ${item.glowColor},
              transparent 80%
            )
          `,
        }}
      />
      
      {/* Dark Mode Spotlight Glow Effect (Stronger) */}
      <m.div
        className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100 hidden dark:block"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              450px circle at ${mouseX}px ${mouseY}px,
              ${item.darkGlowColor},
              transparent 80%
            )
          `,
        }}
      />

      {/* Magnetic Watermark Icon */}
      <m.div 
        style={{ x: watermarkX, y: watermarkY, rotate: watermarkRotate }}
        className="absolute -right-6 -bottom-6 opacity-5 dark:opacity-20 group-hover:opacity-10 dark:group-hover:opacity-40 transition-opacity duration-500 pointer-events-none"
      >
        <Icon className={`text-9xl ${item.iconClass}`} />
      </m.div>
      
      <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-sm border border-zinc-200 group-hover:scale-110 transition-transform duration-500 ${item.badgeClass}`}>
        <Icon className={`text-2xl ${item.iconClass}`} />
      </div>
      
      <div className="mt-auto relative z-10">
        <h3 className="font-incognito font-semibold text-2xl mb-2 text-zinc-900 dark:text-zinc-100">
          {item.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium pointer-events-none">
          {item.description}
        </p>
      </div>
    </m.div>
  );
}

export default function Principles() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section className="mt-32 mb-16">
      <h2 className="font-incognito font-semibold tracking-tight text-4xl mb-8">
        Principles
      </h2>
      <m.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-50px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-auto md:auto-rows-[220px]"
      >
        {principles.map((item, index) => (
          <PrincipleCard key={index} item={item} />
        ))}
      </m.div>
    </section>
  );
}
