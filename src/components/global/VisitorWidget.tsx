"use client";

import { useState, useEffect } from "react";
import { m as motion, AnimatePresence } from "framer-motion";

export default function VisitorWidget() {
  const [time, setTime] = useState<Date | null>(null);
  const [location, setLocation] = useState<{ region: string; country: string; timezone: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        const cachedLoc = sessionStorage.getItem("visitor_region_data_v1");
        if (cachedLoc) {
          setLocation(JSON.parse(cachedLoc));
          setLoading(false);
          return;
        }

        const res = await fetch("https://ipinfo.io/json");
        if (res.ok) {
          const data = await res.json();
          if (data.region && data.country && data.timezone) {
            const locData = { region: data.region, country: data.country, timezone: data.timezone };
            setLocation(locData);
            sessionStorage.setItem("visitor_region_data_v1", JSON.stringify(locData));
          }
        }
      } catch (err) {
        console.error("Failed to fetch location", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();

    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading || !time) return null;

  let hour = time.getHours();
  let timeString = time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  
  if (location?.timezone) {
    try {
      const options: Intl.DateTimeFormatOptions = { 
        timeZone: location.timezone, 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: false 
      };
      hour = parseInt(new Intl.DateTimeFormat('en-US', options).format(time).split(':')[0], 10);
      timeString = time.toLocaleTimeString('en-US', { timeZone: location.timezone, hour: 'numeric', minute: '2-digit' });
    } catch (e) {}
  }

  let greeting = "GOOD EVENING";
  if (hour >= 5 && hour < 12) greeting = "GOOD MORNING";
  else if (hour >= 12 && hour < 18) greeting = "GOOD AFTERNOON";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 mb-6"
      >
        <span className="text-[10px] md:text-xs font-mono font-semibold tracking-widest uppercase text-emerald-600 dark:text-emerald-400">
          ✦ {greeting} VISITOR FROM {location ? `${location.region}, ${location.country}` : 'EARTH'} • {timeString}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
