"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { PhotoType } from "@/types";
import { urlFor } from "@/lib/sanity.image";

export default function PhotoCard({ photo }: { photo: PhotoType }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const hasCaption = !!photo.caption;

  return (
    <div className="relative mb-6 break-inside-avoid group perspective-1000">
      <motion.div
        className="relative w-full h-full transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 200, damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => hasCaption && setIsFlipped(!isFlipped)}
      >
        {/* Front Side */}
        <div 
          className="relative w-full h-full"
          style={{ backfaceVisibility: "hidden" }}
        >
          <Image
            src={urlFor(photo.image).url()}
            alt={photo.alt || "Photo"}
            width={600}
            height={800}
            quality={95}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder={photo.lqip ? "blur" : "empty"}
            blurDataURL={photo.lqip || ""}
            className="w-full h-auto object-cover rounded-3xl shadow-sm border border-zinc-200 dark:border-zinc-800"
          />
          {hasCaption && (
            <div className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white opacity-0 group-hover:opacity-100 transition-opacity">
              Click to Flip
            </div>
          )}
        </div>

        {/* Back Side (Caption) */}
        {hasCaption && (
          <div
            className="absolute inset-0 w-full h-full bg-zinc-50 dark:bg-zinc-900 rounded-3xl border-2 border-primary-color/30 flex flex-col items-center justify-center p-8 text-center"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            <span className="text-primary-color mb-4 opacity-50">
               <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z" strokeLinecap="round" strokeLinejoin="round"/>
               </svg>
            </span>
            <p className="text-2xl font-incognito font-bold italic leading-tight dark:text-zinc-200 text-zinc-800">
              &quot;{photo.caption}&quot;
            </p>
            <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 w-full">
               <p className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
                  Memory Captured
               </p>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
