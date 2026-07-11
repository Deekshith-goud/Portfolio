"use client";
import React, { useState } from "react";
import { m } from "framer-motion";
import { useDevicePerformance } from "../../hooks/useDevicePerformance";

export default function SignatureNavLogo() {
  const [isHovered, setIsHovered] = useState(false);
  const tier = useDevicePerformance();
  const isLowEnd = tier === "low";

  const drawMain = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.8, ease: "easeOut" },
        opacity: { duration: 0.01 }
      }
    }
  };

  const drawUnderline = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 0.4, ease: "easeOut", delay: 0.7 },
        opacity: { duration: 0.01, delay: 0.7 }
      }
    }
  };

  const PATH_D = "M 154.500,86.667 C 154.500,89.500 154.500,89.500 154.500,92.333 C 154.500,96.833 154.500,96.833 154.500,101.333 C 154.241,105.517 154.500,105.500 154.500,109.667 C 154.912,113.514 154.741,113.517 155.500,117.333 C 154.838,121.400 155.912,120.014 156.500,122.667 C 160.190,124.147 158.338,124.067 162.500,122.667 C 165.769,118.284 166.690,119.981 169.500,114.333 C 174.342,109.325 174.269,109.284 179.500,104.667 C 184.753,100.065 184.676,99.992 190.167,95.667 C 192.599,93.278 192.753,93.565 195.500,91.667 C 201.648,88.097 201.599,88.278 208.167,85.667 C 216.090,84.210 211.481,84.431 215.167,84.333 C 208.657,84.087 213.590,84.544 203.167,86.333 C 197.882,89.482 197.657,88.587 193.167,93.333 C 187.811,97.672 187.882,97.649 183.167,102.667 C 178.835,107.188 178.978,107.172 175.500,112.333 C 172.844,116.299 173.002,116.188 171.500,120.667 C 167.915,128.471 170.177,124.966 170.167,129.667 C 176.965,129.440 173.249,131.304 182.167,126.333 C 188.416,121.084 188.965,122.273 194.167,115.333 C 200.891,108.529 200.916,108.584 207.167,101.333 C 213.560,94.288 213.391,94.196 219.167,86.667 C 223.866,79.521 224.227,79.788 228.500,72.333 C 232.148,66.920 232.033,66.854 235.500,61.333 C 239.384,54.550 237.148,58.586 238.500,55.667 C 233.737,62.436 236.218,58.550 229.167,69.333 C 224.652,76.324 224.570,76.270 220.167,83.333 C 216.519,88.746 216.652,88.824 213.167,94.333 C 208.099,102.379 211.019,97.913 209.167,101.667 C 214.672,96.389 211.099,100.379 219.167,90.333 C 226.245,79.885 226.672,80.222 233.167,69.333 C 239.934,59.063 239.912,59.051 246.500,48.667 C 252.944,40.498 251.934,40.063 257.167,31.333 C 264.131,20.558 260.777,23.498 262.167,14.667 C 256.299,10.702 260.797,10.558 250.500,11.333 C 238.820,13.344 239.466,12.535 228.500,18.333 C 213.713,26.109 213.653,25.511 200.167,35.667 C 183.640,47.377 183.713,47.276 168.500,60.667 C 154.027,74.201 153.640,73.711 140.167,88.333 C 128.153,99.940 128.527,100.201 117.500,112.667 C 109.622,122.750 109.320,122.440 102.500,133.333 C 97.348,140.533 97.622,140.583 93.500,148.333 C 91.413,153.242 91.181,153.033 90.167,158.333 C 87.679,162.846 89.413,161.409 89.500,164.667 C 94.913,168.736 92.846,168.013 100.500,168.667 C 108.907,167.530 108.413,168.569 116.500,164.333 C 127.903,159.164 127.907,159.530 138.500,152.667 C 150.749,145.044 150.737,145.164 162.167,136.333 C 173.047,127.573 173.249,127.878 183.500,118.333 C 191.861,111.176 191.713,111.073 199.500,103.333 C 204.214,98.161 204.361,98.343 208.500,92.667 C 213.300,87.467 210.714,89.828 212.500,86.667 C 208.608,87.569 211.634,85.800 205.167,89.333 C 202.147,91.102 202.108,90.902 199.500,93.333 C 193.443,98.130 193.647,98.268 188.167,103.667 C 183.267,108.889 183.277,108.797 179.167,114.667 C 176.040,119.358 175.934,119.222 173.500,124.333 C 169.475,130.282 172.040,127.192 171.167,130.333 C 178.369,128.405 174.975,130.449 184.500,124.667 C 191.679,119.380 192.035,120.072 198.500,113.667 C 204.972,108.147 205.012,108.213 211.167,102.333 C 215.613,97.778 215.805,97.980 220.167,93.333 C 224.249,87.902 222.613,90.945 225.167,88.667 C 224.886,92.708 226.249,89.568 224.167,96.667 C 221.205,101.229 223.553,100.041 222.500,103.333 C 226.369,106.266 223.872,105.563 229.500,105.333 C 233.972,102.163 234.202,103.933 238.167,98.667 C 242.280,93.016 240.972,96.329 243.500,93.667 C 243.567,97.528 244.780,94.349 243.167,101.333 C 240.704,106.821 242.901,103.862 242.167,106.333 C 249.072,102.327 246.704,104.821 255.167,97.333 C 260.940,92.254 261.072,92.494 266.167,86.667 C 270.333,81.667 270.607,81.920 274.500,76.667 C 278.149,70.763 277.000,73.667 279.500,70.667 C 280.001,73.664 280.482,70.597 279.167,76.333 C 276.454,81.364 277.501,81.664 274.500,86.667 C 273.105,90.955 272.954,90.864 272.167,95.333 C 269.907,99.428 271.605,97.955 271.500,100.667 C 276.830,103.713 274.407,102.928 281.167,102.333 C 287.914,98.665 287.830,100.213 293.500,93.667 C 300.309,86.930 300.580,87.332 306.500,79.667 C 312.587,72.066 312.809,72.264 318.500,64.333 C 323.460,57.923 323.420,57.899 328.167,51.333 C 334.977,41.764 330.960,47.423 333.500,43.333 C 325.230,52.789 329.644,47.430 317.500,62.667 C 310.310,72.033 310.230,71.956 303.500,81.667 C 296.615,91.359 296.644,91.366 290.167,101.333 C 284.079,110.688 284.115,110.693 278.500,120.333 C 274.665,127.929 274.246,127.688 270.500,135.333";
  const UNDERLINE_D = "M 140,111 Q 250,105 365,79";

  return (
    <div 
      className="flex items-center justify-center cursor-pointer group transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <m.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="70 -10 310 190"
        className="w-[120px] h-auto overflow-visible drop-shadow-lg"
      >
        <defs>
          {/* Dark Mode Gradient (Early Metallic Tubes) */}
          <linearGradient id="chrome-nav-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="25%" stopColor="#E2E8F0" />
            <stop offset="50%" stopColor="#94A3B8" />
            <stop offset="75%" stopColor="#64748B" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Mathematical 3D Tube Lighting Filter (Tuned tightly to prevent intersection blobs) */}
          <filter id="tube-3d-light" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.5" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="2" specularConstant="1.2" specularExponent="30" lightingColor="#FFFFFF" result="specOut">
              <fePointLight x="0" y="-50" z="100" />
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0" result="litPaint" />
            <feDropShadow dx="1" dy="4" stdDeviation="3.5" floodColor="#000000" floodOpacity="0.25" />
          </filter>



          {/* Dark Mode Drop Shadow */}
          <filter id="shadow-dark" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#000000" floodOpacity="0.8" />
          </filter>

          {/* Emerald 3D Tube Gradient for Drawing Animation (Light Mode) */}
          <linearGradient id="emerald-nav" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="40%" stopColor="#059669" />
            <stop offset="100%" stopColor="#022C22" />
          </linearGradient>

          {/* Emerald 3D Tube Gradient for Drawing Animation (Dark Mode - Brighter Core) */}
          <linearGradient id="emerald-nav-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#6EE7B7" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#065F46" />
          </linearGradient>

          <mask id="reveal-mask-main">
            <m.path
              d={PATH_D}
              stroke="white"
              strokeWidth="5" 
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              variants={drawMain}
            />
          </mask>
          
          <mask id="reveal-mask-underline">
            <m.path
              d={UNDERLINE_D}
              stroke="white"
              strokeWidth="5" 
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
              initial="hidden"
              animate={isHovered ? "visible" : "hidden"}
              variants={drawUnderline}
            />
          </mask>
        </defs>

        {/* 1. Base Static 3D Logos (Single Path to Guarantee Zero Edge Aliasing) */}
        
        {/* LIGHT MODE: Polished Obsidian Tube */}
        <g className="dark:hidden transition-opacity duration-300" style={{ opacity: isHovered ? 0.1 : 1 }}>
          <path d={PATH_D} stroke="#18181B" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#tube-3d-light)"} />
          <path d={UNDERLINE_D} stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#tube-3d-light)"} />
        </g>

        {/* DARK MODE: Early Metallic Tubes */}
        <g className="hidden dark:block transition-opacity duration-300" style={{ opacity: isHovered ? 0.1 : 1 }}>
          <path d={PATH_D} stroke="url(#chrome-nav-dark)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#shadow-dark)"} />
          <path d={PATH_D} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isLowEnd ? 0 : 0.8} transform="translate(0 -1)" />
          <path d={PATH_D} stroke="#0F172A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isLowEnd ? 0 : 0.4} transform="translate(0 1.5)" />

          <path d={UNDERLINE_D} stroke="url(#chrome-nav-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#shadow-dark)"} />
          <path d={UNDERLINE_D} stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isLowEnd ? 0 : 0.8} transform="translate(0 -0.5)" />
        </g>

        {/* 2. Magical 3D Emerald Drawing Animation */}
        <g>
          {/* ----- LIGHT MODE DRAWING ----- */}
          <g className="dark:hidden">
            <g mask="url(#reveal-mask-main)">
              <path d={PATH_D} stroke="url(#emerald-nav)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#tube-3d-light)"} />
            </g>
            <g mask="url(#reveal-mask-underline)">
              <path d={UNDERLINE_D} stroke="url(#emerald-nav)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#tube-3d-light)"} />
            </g>
          </g>

          {/* ----- DARK MODE DRAWING (Matches Early Metallic Tubes Depth) ----- */}
          <g className="hidden dark:block">
            <g mask="url(#reveal-mask-main)">
              <path d={PATH_D} stroke="url(#emerald-nav-dark)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#shadow-dark)"} />
              <path d={PATH_D} stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isLowEnd ? 0 : 0.8} transform="translate(0 -1)" />
              <path d={PATH_D} stroke="#022C22" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isLowEnd ? 0 : 0.8} transform="translate(0 1.5)" />
            </g>
            <g mask="url(#reveal-mask-underline)">
              <path d={UNDERLINE_D} stroke="url(#emerald-nav-dark)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" filter={isLowEnd ? "none" : "url(#shadow-dark)"} />
              <path d={UNDERLINE_D} stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity={isLowEnd ? 0 : 0.8} transform="translate(0 -0.5)" />
            </g>
          </g>
        </g>
      </m.svg>
    </div>
  );
}
