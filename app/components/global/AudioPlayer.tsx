"use client";

import { useState, useEffect, useRef } from "react";
import { IoPlay, IoPause, IoMusicalNotes } from "react-icons/io5";
import { motion } from "framer-motion";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);

      // Reduce bass to make beats lighter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowshelf";
      filter.frequency.value = 200; // Target low frequencies
      filter.gain.value = -12; // Reduce bass by 12dB

      // Reduce overall volume
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.5; // 50% volume

      source.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
    }
    
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((err) => {
          console.error("Audio playback failed:", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (!isPlaying) {
      initAudio();
    }
    setIsPlaying(!isPlaying);
  };

  if (!hasMounted) return null;

  return (
    <div className="flex items-center gap-3 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/40 dark:border-zinc-700/50 p-2 pl-3 pr-4 rounded-2xl shadow-sm w-max transition-all duration-300 hover:shadow-md">
      
      {/* Native HTML5 Audio */}
      <audio
        ref={audioRef}
        src="/audio/catwoman.mp3"
        loop
        preload="auto"
      />

      {/* Album Art & Sliding Vinyl */}
      <div className="relative flex items-center w-[58px] h-10 flex-shrink-0">
        
        {/* The Vinyl Record */}
        <div 
          className={`absolute left-0.5 top-0.5 w-9 h-9 rounded-full overflow-hidden shadow-md transition-all duration-700 ease-out z-0 bg-[#1a2744]
            ${isPlaying ? 'translate-x-[18px]' : 'translate-x-0'}`}
        >
          <div className={`w-full h-full ${isPlaying ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/vinyl-record.png" alt="Vinyl Record" className="w-full h-full object-contain scale-[1.15]" />
          </div>
        </div>

        {/* The Album Cover */}
        <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm z-10 bg-zinc-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/catwoman-cover.png" alt="Catwoman Cover" className="w-full h-full object-cover" />
        </div>

      </div>

      {/* Song Info */}
      <div className="flex flex-col min-w-[100px] justify-center ml-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight truncate max-w-[120px]">
            Catwoman
          </span>
          {/* Equalizer */}
          <div className="flex items-end gap-[1.5px] h-[11px] ml-1">
            {[1, 2, 3, 4].map((bar) => (
              <motion.div
                key={bar}
                className="w-[2px] bg-zinc-800/80 dark:bg-zinc-300/80 rounded-full"
                animate={
                  isPlaying
                    ? { height: ["20%", "100%", "20%"] }
                    : { height: "20%" }
                }
                transition={
                  isPlaying
                    ? { repeat: Infinity, duration: 0.6, ease: "easeInOut", delay: bar * 0.12 }
                    : { duration: 0.3 }
                }
              />
            ))}
          </div>
        </div>
        <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold mt-0.5 truncate max-w-[120px]">
          Afrobeat
        </span>
      </div>

      {/* Controls */}
      <button onClick={handlePlayPause} className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/50 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all ml-1">
        {isPlaying ? <IoPause size={13} /> : <IoPlay size={13} className="ml-0.5" />}
      </button>
    </div>
  );
}
