"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { IoPlay, IoPause } from "react-icons/io5";

export default function AudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationRef = useRef<number | null>(null);
  const barsRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  const vinylRef = useRef<HTMLDivElement>(null);
  const isPlayingRef = useRef(isPlaying);
  
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createMediaElementSource(audioRef.current);

      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // 32 bins
      analyser.smoothingTimeConstant = 0.85; // Makes the bar drops smoother
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);

      // Reduce bass to make beats lighter
      const filter = ctx.createBiquadFilter();
      filter.type = "lowshelf";
      filter.frequency.value = 200; // Target low frequencies
      filter.gain.value = -12; // Reduce bass by 12dB

      // Reduce overall volume
      const gainNode = ctx.createGain();
      gainNode.gain.value = 0.5; // 50% volume

      // Connect analyser before filter to get raw beats
      source.connect(analyser);
      analyser.connect(filter);
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

  useEffect(() => {
    let rotation = 0;
    let currentSpeed = 0;

    const updateLoop = () => {
      const playing = isPlayingRef.current;

      // 1. Equalizer Logic
      if (playing && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        const BARS_COUNT = 12;
        // Arrange bins symmetrically so bass is in the center, forming a natural wave shape
        const bins = [11, 9, 7, 5, 3, 1, 2, 4, 6, 8, 10, 12];

        for (let i = 0; i < BARS_COUNT; i++) {
          const bar = barsRef.current[i];
          if (bar) {
            const binIndex = bins[i];
            const value = dataArrayRef.current[binIndex]; 
            
            // Higher frequencies naturally have less energy, so we boost them slightly
            const boost = 1 + (binIndex * 0.1); 
            let heightPercent = 15 + ((value / 255) * 85 * boost);
            heightPercent = Math.min(100, heightPercent); // Cap at 100%

            bar.style.height = `${heightPercent}%`;
          }
        }
      } else {
        barsRef.current.forEach(bar => {
          if (bar) bar.style.height = "15%";
        });
      }

      // 2. Vinyl Momentum Logic
      const targetSpeed = playing ? 1.5 : 0; // 1.5 degrees per frame when playing
      currentSpeed += (targetSpeed - currentSpeed) * 0.05; // Smooth acceleration/deceleration
      rotation += currentSpeed;

      if (vinylRef.current) {
        vinylRef.current.style.transform = `rotate(${rotation}deg)`;
      }

      // 3. Progress Bar Logic
      if (audioRef.current && progressRef.current) {
        const { currentTime, duration } = audioRef.current;
        const progressPercent = (currentTime / duration) * 100 || 0;
        progressRef.current.style.width = `${progressPercent}%`;
      }

      animationRef.current = requestAnimationFrame(updateLoop);
    };

    animationRef.current = requestAnimationFrame(updateLoop);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handlePlayPause = () => {
    if (!isPlaying) {
      initAudio();
    }
    setIsPlaying(!isPlaying);
  };

  if (!hasMounted) return null;

  return (
    <div className="flex items-center gap-3 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-white/40 dark:border-zinc-700/50 p-2 pl-3 pr-4 rounded-2xl shadow-sm w-max max-w-full transition-all duration-300 hover:shadow-md relative">
      
      {/* Native HTML5 Audio */}
      <audio
        ref={audioRef}
        src="/audio/catwoman.mp3"
        loop
        preload="none"
      />

      {/* Album Art & Sliding Vinyl */}
      <div className="relative flex items-center w-[58px] h-10 flex-shrink-0">
        
        {/* The Vinyl Record */}
        <div 
          className={`absolute left-0.5 top-0.5 w-9 h-9 rounded-full overflow-hidden shadow-md transition-all duration-700 ease-out z-0 bg-[#1a2744]
            ${isPlaying ? 'translate-x-[18px]' : 'translate-x-0'}`}
        >
          <div ref={vinylRef} className="w-full h-full scale-[1.15]">
            <Image src="/images/vinyl-record.png" alt="Vinyl Record" width={160} height={160} quality={95} className="w-full h-full object-contain scale-[1.15]" />
          </div>
        </div>

        {/* The Album Cover */}
        <div className="relative w-10 h-10 rounded-md overflow-hidden shadow-sm z-10 bg-zinc-800">
          <Image src="/images/catwoman-cover.png" alt="Catwoman Cover" width={160} height={160} quality={95} className="w-full h-full object-cover" />
        </div>

      </div>

      {/* Song Info */}
      <div className="flex flex-col min-w-[100px] justify-center ml-1">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-zinc-800 dark:text-zinc-100 tracking-tight truncate max-w-[120px]">
            Catwoman
          </span>
          {/* Equalizer */}
          <div className="flex items-end gap-[1px] h-[11px] ml-1">
            {Array.from({ length: 12 }).map((_, index) => {
              // Center bars (5, 6) represent heavy bass. Edges represent light treble.
              const dist = Math.abs(index - 5.5);
              
              let opacity = "opacity-40";
              
              if (dist < 1) {
                opacity = "opacity-100";
              } else if (dist < 3) {
                opacity = "opacity-80";
              } else if (dist < 5) {
                opacity = "opacity-60";
              }

              // Light mode uses the Hokusai wave blues, dark mode uses the custom brand greens
              const colors = [
                "bg-sky-200 dark:bg-tertiary-color", 
                "bg-sky-300 dark:bg-secondary-color", 
                "bg-sky-400 dark:bg-secondary-color", 
                "bg-blue-400 dark:bg-primary-color", 
                "bg-blue-500 dark:bg-primary-color", 
                "bg-blue-600 dark:bg-primary-color",
                "bg-blue-600 dark:bg-primary-color", 
                "bg-blue-500 dark:bg-primary-color", 
                "bg-blue-400 dark:bg-primary-color", 
                "bg-sky-400 dark:bg-secondary-color", 
                "bg-sky-300 dark:bg-secondary-color", 
                "bg-sky-200 dark:bg-tertiary-color"
              ];

              return (
                <div
                  key={index}
                  ref={(el) => { barsRef.current[index] = el; }}
                  className={`w-[1.5px] ${colors[index]} rounded-full ${opacity}`}
                  style={{ height: "15%", transition: "height 0.05s ease-out" }}
                />
              );
            })}
          </div>
        </div>
        <div className="flex flex-col mt-0.5">
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase tracking-widest font-semibold truncate max-w-[120px]">
            Afrobeat
          </span>
          {/* Micro Progress Bar */}
          <div className="w-full h-[2px] bg-zinc-200 dark:bg-zinc-700/50 rounded-full mt-1 overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-blue-500 dark:bg-primary-color rounded-full" 
              style={{ width: "0%" }} 
            />
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        onClick={handlePlayPause}
        aria-label={isPlaying ? "Pause music" : "Play music"}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-300/50 dark:hover:bg-zinc-700/50 transition-colors"
      >
        {isPlaying ? <IoPause size={13} /> : <IoPlay size={13} className="ml-0.5" />}
      </button>
    </div>
  );
}
