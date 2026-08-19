"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { getStroke } from "perfect-freehand";

const r = (val: number) => Math.round(val * 10) / 10;

export function getSvgPathFromStroke(stroke: any[]) {
  if (!stroke.length) return "";
  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(r(x0), r(y0), r((x0 + x1) / 2), r((y0 + y1) / 2));
      return acc;
    },
    ["M", r(stroke[0][0]), r(stroke[0][1]), "Q"]
  );
  d.push("Z");
  return d.join(" ");
}

export type Point = { x: number; y: number; pressure: number };

export interface StrokeData {
  points: Point[];
  color: string;
  isEraser?: boolean;
  options: {
    size: number;
    thinning: number;
    smoothing: number;
    streamline: number;
    simulatePressure: boolean;
    start: { taper: number; easing: (t: number) => number; cap: boolean };
    end: { taper: number; easing: (t: number) => number; cap: boolean };
  };
}

export type Stroke = StrokeData;

interface CanvasDrawProps {
  onStrokeUpdate: (strokes: Stroke[]) => void;
  color: string;
  strokeWidth: number;
  strokes?: Stroke[];
  thinning?: number;
  smoothing?: number;
  streamline?: number;
  simulatePressure?: boolean;
  startTaper?: number;
  endTaper?: number;
  isEraser?: boolean;
}

export default function CanvasDraw({ 
  onStrokeUpdate, 
  color, 
  strokeWidth, 
  strokes = [],
  thinning = 0.5,
  smoothing = 0.5,
  streamline = 0.5,
  simulatePressure = true,
  startTaper = 0,
  endTaper = 0,
  isEraser = false
}: CanvasDrawProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);
  
  const currentOptions = React.useMemo(() => ({
    size: strokeWidth,
    thinning,
    smoothing,
    streamline,
    simulatePressure,
    start: {
      taper: startTaper,
      easing: (t: number) => t,
      cap: true
    },
    end: {
      taper: endTaper,
      easing: (t: number) => t,
      cap: true
    }
  }), [strokeWidth, thinning, smoothing, streamline, simulatePressure, startTaper, endTaper]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    target.setPointerCapture(e.pointerId); 
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCurrentPoints([{ x, y, pressure: e.pressure || 0.5 }]);
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (e.buttons !== 1) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (currentPoints.length > 0) {
      setCurrentPoints((prev) => [...prev, { x, y, pressure: e.pressure || 0.5 }]);
    }
  }, [currentPoints]);

  const handlePointerUp = useCallback(() => {
    if (currentPoints.length > 0) {
      const newStroke: Stroke = {
        points: currentPoints,
        color,
        options: currentOptions,
        isEraser
      };

      const newStrokes = [...strokes, newStroke];
      onStrokeUpdate(newStrokes);
      setCurrentPoints([]);
    }
  }, [currentPoints, isEraser, strokes, color, currentOptions, onStrokeUpdate]);

  const renderStrokes = () => {
    const groups: { id: string, normalStrokes: (Stroke & { index: number })[], erasersAfter: Stroke[] }[] = [];
    let currentNormalGroup: (Stroke & { index: number })[] = [];
    
    for (let i = 0; i < strokes.length; i++) {
      const stroke = strokes[i];
      if (!stroke.isEraser) {
        currentNormalGroup.push({ ...stroke, index: i });
      } else {
        if (currentNormalGroup.length > 0) {
          groups.push({ id: `g-${i}`, normalStrokes: currentNormalGroup, erasersAfter: [] });
          currentNormalGroup = [];
        }
        for (const g of groups) {
          g.erasersAfter.push(stroke);
        }
      }
    }
    
    if (currentNormalGroup.length > 0) {
      groups.push({ id: `g-last`, normalStrokes: currentNormalGroup, erasersAfter: [] });
    }

    if (currentPoints.length > 0 && isEraser) {
      const currentEraserStroke: Stroke = {
        points: currentPoints,
        color: 'black',
        options: currentOptions,
        isEraser: true
      };
      for (const g of groups) {
        g.erasersAfter.push(currentEraserStroke);
      }
    }

    return (
      <>
        {groups.map((g) => {
          if (g.erasersAfter.length === 0) {
            return (
              <g key={g.id}>
                {g.normalStrokes.map((s) => (
                  <path
                    key={`stroke-${s.index}`}
                    d={getSvgPathFromStroke(getStroke(s.points, s.options))}
                    fill={s.color}
                  />
                ))}
              </g>
            );
          } else {
            const maskId = `mask-preview-${g.id}`;
            return (
              <g key={g.id}>
                <defs>
                  <mask id={maskId}>
                    <rect width="100%" height="100%" fill="white" />
                    {g.erasersAfter.map((e, ei) => (
                      <path
                        key={`eraser-${g.id}-${ei}`}
                        d={getSvgPathFromStroke(getStroke(e.points, e.options))}
                        fill="black"
                      />
                    ))}
                  </mask>
                </defs>
                <g mask={`url(#${maskId})`}>
                  {g.normalStrokes.map((s) => (
                    <path
                      key={`stroke-${s.index}`}
                      d={getSvgPathFromStroke(getStroke(s.points, s.options))}
                      fill={s.color}
                    />
                  ))}
                </g>
              </g>
            );
          }
        })}
        {!isEraser && currentPoints.length > 0 && (
          <path
            d={getSvgPathFromStroke(getStroke(currentPoints, currentOptions))}
            fill={color}
          />
        )}
      </>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full aspect-square bg-[#FCFBF8] dark:bg-zinc-800/80 rounded-xl overflow-hidden touch-none shadow-inner border border-zinc-200 dark:border-zinc-700/50 transition-colors ${isEraser ? 'cursor-cell' : 'cursor-crosshair'}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <div className="absolute inset-0 pointer-events-none bg-[url('/images/noise.png')] dark:bg-[url('/images/noise-dark.png')] opacity-50 dark:opacity-20" />
      
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {renderStrokes()}
      </svg>
    </div>
  );
}
