"use client";

import React, { useState, useRef } from "react";
import { m as motion, AnimatePresence } from "framer-motion";
import { getStroke } from "perfect-freehand";
import CanvasDraw, { Stroke, getSvgPathFromStroke } from "./CanvasDraw";
import { LuUndo, LuTrash2, LuX, LuSettings2, LuPalette, LuEraser } from "react-icons/lu";

interface LeaveMarkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (mark: any) => void;
}

const COLORS = [
  '#18181b', // Zinc 900
  '#71717a', // Zinc 500 
  '#ef4444', // Red 500
  '#f97316', // Orange 500
  '#eab308', // Yellow 500
  '#22c55e', // Green 500
  '#3b82f6', // Blue 500
  '#a855f7', // Purple 500
  '#ec4899', // Pink 500
];

const SliderRow = ({ label, min, max, step, value, onChange }: any) => {
  const [localValue, setLocalValue] = React.useState(value);
  const isDragging = React.useRef(false);

  React.useEffect(() => {
    if (!isDragging.current) {
      setLocalValue(value);
    }
  }, [value]);

  const percentage = ((localValue - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setLocalValue(val);
    React.startTransition(() => {
      onChange(val);
    });
  };

  return (
    <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
      <label className="text-zinc-800 dark:text-zinc-300 font-medium">{label}</label>
      <div className="flex items-center gap-3 w-48">
        <input 
          type="range" min={min} max={max} step={step} value={localValue} 
          onChange={handleChange} 
          onMouseDown={() => isDragging.current = true}
          onMouseUp={() => isDragging.current = false}
          onTouchStart={() => isDragging.current = true}
          onTouchEnd={() => isDragging.current = false}
          className="flex-1 appearance-none h-2 rounded-full cursor-pointer focus:outline-none custom-theme-slider" 
          style={{ 
            background: `linear-gradient(to right, var(--slider-active) ${percentage}%, var(--slider-inactive) ${percentage}%)`,
            boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)',
            touchAction: 'none'
          }}
        />
        <span className="w-8 text-right text-xs font-mono">{localValue}</span>
      </div>
    </div>
  );
};

export default function LeaveMarkModal({ isOpen, onClose, onSuccess }: LeaveMarkModalProps) {
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  
  const [color, setColor] = useState(COLORS[0]);
  const [strokeWidth, setStrokeWidth] = useState(8);
  const [thinning, setThinning] = useState(0.5);
  const [smoothing, setSmoothing] = useState(0.5);
  const [streamline, setStreamline] = useState(0.5);
  const [simulatePressure, setSimulatePressure] = useState(true);
  const [startTaper, setStartTaper] = useState(0);
  const [endTaper, setEndTaper] = useState(0);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [activePanel, setActivePanel] = useState<'colors' | 'settings' | null>(null);
  const [isEraser, setIsEraser] = useState(false);
  const [applyToAll, setApplyToAll] = useState(false);

  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const togglePanel = (panel: 'colors' | 'settings') => {
    setActivePanel(prev => prev === panel ? null : panel);
    if (isEraser) setIsEraser(false);
  };

  const toggleEraser = () => {
    setIsEraser(!isEraser);
    setActivePanel(null);
  };

  const handleUpdateOptions = (updates: Partial<{
    color: string, size: number, thinning: number, smoothing: number, 
    streamline: number, simulatePressure: boolean, startTaper: number, endTaper: number
  }>) => {
    if (updates.color !== undefined) setColor(updates.color);
    if (updates.size !== undefined) setStrokeWidth(updates.size);
    if (updates.thinning !== undefined) setThinning(updates.thinning);
    if (updates.smoothing !== undefined) setSmoothing(updates.smoothing);
    if (updates.streamline !== undefined) setStreamline(updates.streamline);
    if (updates.simulatePressure !== undefined) setSimulatePressure(updates.simulatePressure);
    if (updates.startTaper !== undefined) setStartTaper(updates.startTaper);
    if (updates.endTaper !== undefined) setEndTaper(updates.endTaper);

    if (applyToAll) {
      setStrokes(prev => prev.map(s => {
        const newColor = updates.color !== undefined ? updates.color : s.color;
        const newOptions = { ...s.options };
        if (updates.size !== undefined) newOptions.size = updates.size;
        if (updates.thinning !== undefined) newOptions.thinning = updates.thinning;
        if (updates.smoothing !== undefined) newOptions.smoothing = updates.smoothing;
        if (updates.streamline !== undefined) newOptions.streamline = updates.streamline;
        if (updates.simulatePressure !== undefined) newOptions.simulatePressure = updates.simulatePressure;
        if (updates.startTaper !== undefined) newOptions.start.taper = updates.startTaper;
        if (updates.endTaper !== undefined) newOptions.end.taper = updates.endTaper;
        return { ...s, color: newColor, options: newOptions };
      }));
    }
  };

  const handleUndo = () => {
    if (strokes.length > 0) {
      setStrokes(prev => prev.slice(0, -1));
    }
  };

  const handleClear = () => {
    setStrokes([]);
  };

  const handleSubmit = async () => {
    if (strokes.length === 0 || !name.trim()) return;
    
    setIsSubmitting(true);
    const width = canvasWrapperRef.current?.clientWidth || 500;
    const height = canvasWrapperRef.current?.clientHeight || 400;

    const groups: { id: string, normalStrokes: typeof strokes, erasersAfter: typeof strokes }[] = [];
    let currentNormalGroup: typeof strokes = [];
    
    for (let i = 0; i < strokes.length; i++) {
      const stroke = strokes[i];
      if (!stroke.isEraser) {
        currentNormalGroup.push(stroke);
      } else {
        if (currentNormalGroup.length > 0) {
          groups.push({ id: `g-${i}-${Math.random().toString(36).substring(2, 10)}`, normalStrokes: currentNormalGroup, erasersAfter: [] });
          currentNormalGroup = [];
        }
        for (const g of groups) {
          g.erasersAfter.push(stroke);
        }
      }
    }
    
    if (currentNormalGroup.length > 0) {
      groups.push({ id: `g-last-${Math.random().toString(36).substring(2, 10)}`, normalStrokes: currentNormalGroup, erasersAfter: [] });
    }

    const groupsSvg = groups.map(g => {
      if (g.erasersAfter.length === 0) {
        const normalPaths = g.normalStrokes.map(s => `<path d="${getSvgPathFromStroke(getStroke(s.points, s.options))}" fill="${s.color}" />`).join("");
        return `<g>${normalPaths}</g>`;
      } else {
        const maskId = `mask-${g.id}`;
        const maskPaths = g.erasersAfter.map(e => `<path d="${getSvgPathFromStroke(getStroke(e.points, e.options))}" fill="black" />`).join("");
        const normalPaths = g.normalStrokes.map(s => `<path d="${getSvgPathFromStroke(getStroke(s.points, s.options))}" fill="${s.color}" />`).join("");
        
        return `
          <g>
            <defs>
              <mask id="${maskId}">
                <rect width="100%" height="100%" fill="white" />
                ${maskPaths}
              </mask>
            </defs>
            <g mask="url(#${maskId})">
              ${normalPaths}
            </g>
          </g>
        `;
      }
    }).join("");

    const finalSvgContent = `<g>${groupsSvg}</g>`;

    try {
      const res = await fetch("/api/marks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName: name,
          description,
          svgContent: finalSvgContent,
          color,
          canvasWidth: width,
          canvasHeight: height,
        }),
      });
      
      const data = await res.json();
      if (data.success) {
        onSuccess(data.mark);
        onClose();
        setStrokes([]);
        setName("");
        setDescription("");
      } else {
        alert("Failed to submit. Please try again.");
      }
    } catch (err) {
      alert("An error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };



  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Custom Theme Variables for Sliders */}
          <style dangerouslySetInnerHTML={{__html: `
            .custom-theme-slider {
              --slider-active: #18181b;
              --slider-inactive: #e4e4e7;
              --slider-thumb-bg: #18181b;
              --slider-thumb-border: #18181b;
            }
            .dark .custom-theme-slider {
              --slider-active: #ffffff;
              --slider-inactive: #52525b;
              --slider-thumb-bg: #ffffff;
              --slider-thumb-border: #d4d4d8;
            }
            .custom-theme-slider::-webkit-slider-thumb {
              -webkit-appearance: none;
              appearance: none;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: var(--slider-thumb-bg);
              border: 1px solid var(--slider-thumb-border);
              cursor: pointer;
              box-shadow: 0 1px 3px rgba(0,0,0,0.2);
            }
          `}} />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-zinc-900/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-6 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-[540px] flex flex-col sm:flex-row gap-3 sm:gap-4 overflow-visible"
            >
              
              <div className="flex-1 flex flex-col min-h-0 bg-white dark:bg-zinc-900 sm:rounded-2xl shadow-2xl shadow-zinc-900/20 dark:shadow-black/40 p-5 pointer-events-auto relative ring-1 ring-zinc-900/5 dark:ring-white/10">
                
                <div className="flex justify-between items-center mb-4 px-3">
                  <h2 className="font-semibold font-serif text-lg dark:text-zinc-100">Leave a mark</h2>
                  <div className="flex gap-2 relative z-50">
                    <button onClick={handleUndo} disabled={strokes.length === 0} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-50">
                      <LuUndo className="w-5 h-5" />
                    </button>
                    <button onClick={handleClear} disabled={strokes.length === 0} className="p-1.5 text-zinc-400 hover:text-red-500 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50">
                      <LuTrash2 className="w-5 h-5" />
                    </button>
                    <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                      <LuX className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-center shrink-0 mb-4 relative z-10">
                  <div className="w-full max-w-[300px] md:max-w-[400px]" ref={canvasWrapperRef}>
                    <CanvasDraw 
                      color={color} 
                      strokeWidth={strokeWidth} 
                      thinning={thinning}
                      smoothing={smoothing}
                      streamline={streamline}
                      simulatePressure={simulatePressure}
                      startTaper={startTaper}
                      endTaper={endTaper}
                      strokes={strokes} 
                      onStrokeUpdate={setStrokes} 
                      isEraser={isEraser}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 mt-auto relative z-20">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={30}
                    className="w-full px-5 py-3 bg-zinc-50/80 hover:bg-zinc-100/80 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 dark:text-zinc-100 transition-all placeholder:text-zinc-400 text-sm shadow-sm"
                  />
                  <input
                    type="text"
                    placeholder="Leave a short message... (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={60}
                    className="w-full px-5 py-3 bg-zinc-50/80 hover:bg-zinc-100/80 dark:bg-zinc-800/30 dark:hover:bg-zinc-800/50 border border-zinc-200/60 dark:border-zinc-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 dark:text-zinc-100 transition-all placeholder:text-zinc-400 text-sm shadow-sm"
                  />
                </div>

                <div className="mt-5 flex justify-end gap-3 shrink-0 relative z-20">
                  <button 
                    onClick={onClose}
                    className="px-5 py-2.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || strokes.length === 0 || !name.trim()}
                    className="px-6 py-2.5 text-sm font-medium bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-xl disabled:opacity-50 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                  >
                    {isSubmitting ? "Saving..." : "Save Sketch"}
                  </button>
                </div>
              </div>

              {/* Detached Tools Panel (White Rectangle-Pill) */}
              <div className="shrink-0 flex flex-row sm:flex-col justify-center items-center gap-3 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-2 sm:py-3 rounded-2xl shadow-2xl shadow-zinc-900/10 dark:shadow-black/40 relative z-50 h-fit mt-0 sm:mt-12 pointer-events-auto ring-1 ring-zinc-900/5 dark:ring-white/10 mx-auto sm:mx-0 w-max">
                <button 
                  onClick={() => togglePanel('colors')}
                  className={`p-3 rounded-xl transition-all ${activePanel === 'colors' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200/50 dark:ring-white/5' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  <LuPalette className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => togglePanel('settings')}
                  className={`p-3 rounded-xl transition-all ${activePanel === 'settings' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shadow-sm ring-1 ring-zinc-200/50 dark:ring-white/5' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  <LuSettings2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={toggleEraser}
                  className={`p-3 rounded-xl transition-all ${isEraser ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 shadow-sm ring-1 ring-red-200/50 dark:ring-red-500/20' : 'text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
                >
                  <LuEraser className="w-5 h-5" />
                </button>

                {/* Popovers */}
                <AnimatePresence>
                  {activePanel && (
                    <div className="absolute bottom-full mb-3 sm:bottom-auto sm:mb-0 sm:top-0 left-1/2 -translate-x-1/2 sm:left-full sm:translate-x-0 sm:ml-5 z-[110]">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className="min-w-[320px] bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-2xl shadow-zinc-900/20 dark:shadow-black/50 ring-1 ring-zinc-900/5 dark:ring-white/5 origin-bottom sm:origin-top-left"
                      >
                        {activePanel === 'colors' && (
                          <div className="p-6">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-5">Colors</h3>
                            <div className="flex flex-wrap gap-1">
                              {COLORS.map(c => (
                                <div key={c} className={`p-1 flex items-center justify-center rounded-xl transition-colors ${color === c ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}>
                                  <button
                                    onClick={() => handleUpdateOptions({ color: c })}
                                    className="block w-8 h-8 rounded-full shadow-sm border border-zinc-200 dark:border-white/10 transition-transform hover:scale-110 shrink-0"
                                    style={{ backgroundColor: c }}
                                  />
                                </div>
                              ))}
                              <div className={`p-1 flex items-center justify-center rounded-xl transition-colors shrink-0 ${!COLORS.includes(color) ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}>
                                 <div className="block relative w-8 h-8 rounded-full shadow-sm border border-zinc-200 dark:border-white/10 overflow-hidden cursor-pointer shrink-0" style={{ background: 'conic-gradient(red, yellow, lime, aqua, blue, magenta, red)' }}>
                                    <input 
                                      type="color" 
                                      value={COLORS.includes(color) ? "#000000" : color}
                                      onChange={(e) => handleUpdateOptions({ color: e.target.value })}
                                      className="absolute inset-[-10px] w-[50px] h-[50px] opacity-0 cursor-pointer"
                                    />
                                 </div>
                              </div>
                            </div>
                            
                            <label className="flex items-center gap-2 mt-6 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors">
                              <input 
                                type="checkbox" 
                                checked={applyToAll}
                                onChange={(e) => setApplyToAll(e.target.checked)}
                                className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                              />
                              Apply to all existing strokes
                            </label>
                          </div>
                        )}

                        {activePanel === 'settings' && (
                          <div className="p-6 space-y-5">
                            <h3 className="font-bold text-xs uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-2">Settings</h3>
                            
                            <SliderRow label="Size" min={2} max={32} step={1} value={strokeWidth} onChange={(v: number) => handleUpdateOptions({ size: v })} />
                            <SliderRow label="Thinning" min={-1} max={1} step={0.01} value={thinning} onChange={(v: number) => handleUpdateOptions({ thinning: v })} />
                            <SliderRow label="Smoothing" min={0} max={2} step={0.01} value={smoothing} onChange={(v: number) => handleUpdateOptions({ smoothing: v })} />
                            <SliderRow label="Streamline" min={0} max={1} step={0.01} value={streamline} onChange={(v: number) => handleUpdateOptions({ streamline: v })} />
                            
                            <div className="flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400 py-2">
                              <label className="text-zinc-800 dark:text-zinc-300 font-medium">Simulate Pressure</label>
                              <input 
                                type="checkbox" 
                                checked={simulatePressure} 
                                onChange={(e) => handleUpdateOptions({ simulatePressure: e.target.checked })} 
                                className="w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 accent-zinc-900 dark:accent-zinc-200" 
                              />
                            </div>

                            <SliderRow label="Start Taper" min={0} max={100} step={1} value={startTaper} onChange={(v: number) => handleUpdateOptions({ startTaper: v })} />
                            <SliderRow label="End Taper" min={0} max={100} step={1} value={endTaper} onChange={(v: number) => handleUpdateOptions({ endTaper: v })} />
                          </div>
                        )}
                      </motion.div>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
