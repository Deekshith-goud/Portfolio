"use client";

import { useState, useEffect } from "react";

export type PerformanceTier = "low" | "high";

export function useDevicePerformance(): PerformanceTier {
  const [tier] = useState<PerformanceTier>(() => {
    if (typeof window === "undefined") {
      return "high";
    }

    const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    if (isIOS) {
      return "high";
    }

    let isConstrained = false;
    const nav = navigator as any;

    if (nav.deviceMemory && nav.deviceMemory <= 4) {
      isConstrained = true;
    }

    if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) {
      isConstrained = true;
    }
    
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isConstrained = true;
    }

    return isConstrained ? "low" : "high";
  });

  return tier;
}
