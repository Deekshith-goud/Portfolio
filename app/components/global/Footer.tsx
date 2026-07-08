"use client";
import Image from "next/image";
import sanitylogo from "@/public/sanity.png";
import vercellogo from "@/public/vercel.svg";
import nextjslogo from "@/public/nextjs.svg";
import UnmountStudio from "./Unmount";
import AudioPlayer from "./AudioPlayer";
import { useEffect, useState } from "react";
import { BiUser } from "react-icons/bi";

function getOrdinalSuffix(i: number) {
  const j = i % 10,
        k = i % 100;
  if (j === 1 && k !== 11) return "st";
  if (j === 2 && k !== 12) return "nd";
  if (j === 3 && k !== 13) return "rd";
  return "th";
}

export default function Footer() {
  const [visitorData, setVisitorData] = useState<{ count: number; position: number } | null>(null);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        let visitorId = localStorage.getItem("visitor_id");
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          localStorage.setItem("visitor_id", visitorId);
        }

        const res = await fetch("/api/visitor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.count && data.position) {
            setVisitorData({ count: data.count, position: data.position });
          }
        }
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    fetchVisitorCount();
  }, []);

  return (
    <UnmountStudio>
      <footer className="border-t dark:border-zinc-800 border-zinc-100 mt-44 lg:min-h-[250px] min-h-full relative">
        <div className="max-w-7xl mx-auto flex flex-col gap-y-10 md:px-16 px-6 py-16">
          {/* Top Section */}
          <div className="flex justify-between items-center w-full">
            {visitorData !== null ? (
              <div className="group flex items-center gap-x-2 font-sans transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 duration-700">
                <div className="p-2 transition-all duration-300">
                  <BiUser className="w-7 h-7 dark:text-zinc-400 text-zinc-500" />
                </div>
                <span className="font-thin tracking-wide flex items-baseline">
                  <span className="text-2xl dark:text-zinc-400 text-zinc-500">You are </span>
                  <span className="text-3xl font-light dark:text-zinc-200 text-zinc-800 ml-2">
                    {visitorData.position}
                    <sup className="text-lg font-thin dark:text-zinc-400 text-zinc-500 ml-0.5">{getOrdinalSuffix(visitorData.position)}</sup>
                  </span>
                  <span className="text-2xl dark:text-zinc-500 text-zinc-400 px-2 font-thin">/</span>
                  <span className="text-2xl font-thin dark:text-zinc-400 text-zinc-500">
                    {visitorData.count.toLocaleString()}
                  </span>
                  <span className="text-2xl font-thin dark:text-zinc-400 text-zinc-500 ml-1.5">visitors</span>
                </span>
              </div>
            ) : (
              <div />
            )}
            <AudioPlayer />
          </div>

          {/* Divider */}
          <hr className="border-t border-dashed dark:border-zinc-800 border-zinc-200" />

          {/* Bottom Footer Details */}
          <div className="flex lg:flex-row flex-col items-center lg:justify-between justify-center gap-y-4 pt-2">
            <div className="flex md:flex-row flex-col items-center gap-x-2">
              <h3 className="font-inter">Built with:</h3>
              <ul className="flex items-center gap-x-2 text-sm dark:text-zinc-600 text-zinc-400 md:mt-0 mt-3">
                <li>
                  <a
                    href="https://sanity.io"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="flex items-center gap-x-2 dark:text-white text-zinc-600 hover:underline"
                  >
                    <Image
                      src={sanitylogo}
                      width={20}
                      height={20}
                      alt="sanity logo"
                    />{" "}
                    Sanity
                  </a>
                </li>
                <li>
                  <a
                    href="https://nextjs.org"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="flex items-center gap-x-2 dark:text-white text-zinc-600 hover:underline"
                  >
                    <Image
                      src={nextjslogo}
                      width={20}
                      height={20}
                      alt="nextjs logo"
                    />{" "}
                    Next.js
                  </a>
                </li>
                <li>
                  <a
                    href="https://vercel.com"
                    rel="noreferrer noopener"
                    target="_blank"
                    className="flex items-center gap-x-2 dark:text-white text-zinc-600 hover:underline"
                  >
                    <Image
                      src={vercellogo}
                      width={20}
                      height={20}
                      alt="vercel logo"
                    />{" "}
                    Vercel
                  </a>
                </li>
              </ul>
            </div>

            <div className="flex flex-col lg:items-end items-center lg:text-start text-center">
              <small className="text-zinc-500">
                Copyright &copy; Deekshith Goud {new Date().getFullYear()} All rights
                Reserved
              </small>
            </div>
          </div>
        </div>
      </footer>
    </UnmountStudio>
  );
}
