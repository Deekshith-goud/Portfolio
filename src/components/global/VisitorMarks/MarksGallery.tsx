"use client";

import React, { useState, useEffect } from "react";
import { m as motion } from "framer-motion";
import dynamic from "next/dynamic";

const LeaveMarkModal = dynamic(() => import("./LeaveMarkModal"), {
  ssr: false,
});

export default function MarksGallery() {
  const [marks, setMarks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await fetch("/api/marks");
        if (res.ok) {
          const data = await res.json();
          if (data.marks) {
            setMarks(data.marks);
          }
        }
      } catch (err) {
        console.error("Failed to fetch marks", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMarks();
  }, []);

  const handleNewMark = (newMark: any) => {
    setMarks((prev) => [newMark, ...prev]);
  };

  return (
    <div className="w-full">
      <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 pb-8 border-b border-zinc-200 dark:border-zinc-800 opacity-0 animate-fade-in-up">
        <div className="max-w-2xl">
          <h1 className="max-w-3xl font-incognito font-semibold tracking-tight sm:text-5xl text-3xl mb-6 lg:leading-[3.7rem]">
            Visitor Canvas
          </h1>
          <p className="max-w-2xl text-base dark:text-zinc-400 text-zinc-600 leading-relaxed">
            A collaborative digital space. Leave a trace of your visit, draw something creative, or just say hello to the world.
          </p>
        </div>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="group flex w-max items-center gap-3 rounded-2xl border-2 border-dashed border-zinc-300 dark:border-zinc-700 px-6 py-3 transition-all duration-300 hover:scale-105 hover:border-zinc-900 hover:bg-zinc-900 dark:hover:border-zinc-100 dark:hover:bg-zinc-100"
        >
          <svg className="h-5 w-5 text-zinc-400 transition-colors group-hover:text-white dark:text-zinc-500 dark:group-hover:text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
          <span className="font-medium text-zinc-600 transition-colors group-hover:text-white dark:text-zinc-300 dark:group-hover:text-zinc-900">
            Scribble something 
          </span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-square bg-zinc-100 dark:bg-zinc-800/50 rounded-2xl" />
          ))}
        </div>
      ) : marks.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
          <span className="text-4xl mb-4">✨</span>
          <h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-300 mb-2">It&apos;s a blank canvas</h3>
          <p className="text-zinc-500 text-sm max-w-sm mb-6">Be the very first person to leave a mark on the wall.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-medium text-sm hover:scale-105 transition-transform"
          >
            Draw something
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {marks.map((mark, i) => (
            <motion.div
              key={mark._key}
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "50px" }}
              transition={{ delay: (i % 4) * 0.1, duration: 0.4 }}
              className="group flex flex-col gap-2"
            >
              {/* Canvas Card */}
              <div className="aspect-square bg-[#FCFBF8] dark:bg-zinc-800/40 rounded-2xl border border-zinc-200 dark:border-zinc-700/50 overflow-hidden relative shadow-sm group-hover:shadow-md transition-shadow">
                {/* Texture */}
                <div className="absolute inset-0 pointer-events-none bg-[url('/images/noise.png')] dark:bg-[url('/images/noise-dark.png')] opacity-50 dark:opacity-20" />
                
                <svg
                  viewBox={`0 0 ${mark.canvasWidth || 500} ${mark.canvasHeight || 400}`}
                  className="w-full h-full p-4 pointer-events-none drop-shadow-sm"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <defs>
                    <clipPath id={`clip-${mark._id}`}>
                      <rect x="0" y="0" width={mark.canvasWidth || 500} height={mark.canvasHeight || 400} rx="12" ry="12" />
                    </clipPath>
                  </defs>
                  <g clipPath={`url(#clip-${mark._id})`} dangerouslySetInnerHTML={{ __html: mark.svgContent }} />
                </svg>
              </div>
              
              {/* Meta */}
              <div className="px-1">
                <h4 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                  {mark.authorName}
                </h4>
                {mark.description && (
                  <p className="text-xs text-zinc-500 truncate mt-0.5">
                    {mark.description}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <LeaveMarkModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={handleNewMark} 
      />
    </div>
  );
}
