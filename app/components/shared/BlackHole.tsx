"use client";

import { useRef, useEffect } from "react";

export default function BlackHole() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Small resolution for chunky pixel art look
    const W = 80;
    const H = 60;
    canvas.width = W;
    canvas.height = H;

    const cx = W / 2;
    const cy = H / 2;

    const sphereR = 10;
    const diskInner = 11;
    const diskOuter = 36;

    let time = 0;
    let animId: number;

    const draw = () => {
      // 3D rotation of the disk plane
      const orbitY = time * 0.6; // main 3D orbit
      const wobbleX = Math.sin(time * 0.35) * 0.12; // slight up-down tilt

      const cosY = Math.cos(orbitY);
      const sinY = Math.sin(orbitY);
      const cosX = Math.cos(wobbleX);
      const sinX = Math.sin(wobbleX);

      const imageData = ctx.createImageData(W, H);
      const d = imageData.data;
      
      // Z-buffer for perfect depth sorting (closest pixels overwrite furthest)
      const zBuffer = new Float32Array(W * H).fill(-10000);

      const setPixel = (x: number, y: number, z: number, r: number, g: number, b: number, a: number = 255) => {
        if (x < 0 || x >= W || y < 0 || y >= H) return;
        const idx = y * W + x;
        // If this pixel is closer to the camera (higher Z), draw it
        if (z > zBuffer[idx]) {
          zBuffer[idx] = z;
          const i = idx * 4;
          d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = a;
        }
      };

      // ─── Texture Spin Angle ───
      const spinAngle = time * 1.5;

      // ─── 1. Draw Disk ───
      const angleSteps = 400; // dense sampling to avoid gaps
      const radiusSteps = 28;

      for (let ri = 0; ri < radiusSteps; ri++) {
        const r = diskInner + (ri / (radiusSteps - 1)) * (diskOuter - diskInner);
        const t = ri / (radiusSteps - 1); // 0=inner, 1=outer

        // Distinct color layers/bands getting brighter towards the center
        let cr: number, cg: number, cb: number;
        if (t < 0.15) {
          cr = 255; cg = 250; cb = 235; // white/cream
        } else if (t < 0.3) {
          cr = 255; cg = 240; cb = 80;  // yellow
        } else if (t < 0.5) {
          cr = 255; cg = 60; cb = 30;   // red/orange
        } else if (t < 0.7) {
          cr = 240; cg = 20; cb = 100;  // hot pink
        } else if (t < 0.85) {
          cr = 200; cg = 20; cb = 180;  // magenta
        } else {
          cr = 120; cg = 15; cb = 160;  // purple
        }

        for (let ai = 0; ai < angleSteps; ai++) {
          const angle = (ai / angleSteps) * Math.PI * 2;

          // Add spiral streaks for visible texture spinning
          const rotAngle = angle - spinAngle;
          const spiral = t * 2.0;
          const arm = Math.cos(rotAngle * 3 + spiral) * 0.3 + Math.sin(rotAngle * 2 + spiral * 0.7) * 0.15;
          const streak = Math.max(0, arm);
          
          const finalR = Math.min(255, Math.round(cr + streak * 90));
          const finalG = Math.min(255, Math.round(cg + streak * 65));
          const finalB = Math.min(255, Math.round(cb + streak * 45));

          // 3D coordinates (disk lies in XZ plane initially)
          const lx = r * Math.cos(angle);
          const lz = r * Math.sin(angle);
          const ly = 0;

          // Apply Wobble (X axis)
          const ry1 = ly * cosX - lz * sinX;
          const rz1 = ly * sinX + lz * cosX;
          const rx1 = lx;

          // Apply Orbit (Y axis)
          const rx2 = rx1 * cosY - rz1 * sinY;
          const rz2 = rx1 * sinY + rz1 * cosY;
          const ry2 = ry1;

          const screenX = Math.round(cx + rx2);
          const screenY = Math.round(cy + ry2);
          
          // Z depth: positive is toward viewer
          setPixel(screenX, screenY, rz2, finalR, finalG, finalB);
        }
      }

      // ─── 2. Draw Sphere (Event Horizon) ───
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const sx = px - cx;
          const sy = py - cy;
          const dist = Math.sqrt(sx * sx + sy * sy);

          if (dist <= sphereR) {
            // Calculate Z of the sphere surface
            const sz = Math.sqrt(Math.max(0, sphereR * sphereR - dist * dist));
            
            // Apply INVERSE 3D rotation to find the local surface coordinate on the sphere
            // This perfectly locks the sphere's texture to the disk's 3D rotation
            
            // 1. Undo Y axis (orbit)
            const rx1 = sx * cosY + sz * sinY;
            const rz1 = -sx * sinY + sz * cosY;
            const ry1 = sy;

            // 2. Undo X axis (wobble)
            const lx = rx1;
            const ly = ry1 * cosX + rz1 * sinX;
            const lz = -ry1 * sinX + rz1 * cosX;

            // Now we have the unrotated 3D point (lx, ly, lz) on the sphere
            // Calculate longitude and latitude
            const longitude = Math.atan2(lz, lx);
            const latitude = Math.asin(ly / sphereR);

            // Add the same spinAngle to longitude so it spins with the disk material
            const texLongitude = longitude + spinAngle;
            
            // Create a nice 3D swirl pattern
            const swirl = Math.sin(texLongitude * 3 + latitude * 6);
            
            // Dark purple base with the 3D rotating swirl added
            const gradient = dist / sphereR;
            const sr = Math.max(0, Math.min(255, Math.round(4 + gradient * 8 + swirl * 5)));
            const sg = Math.max(0, Math.min(255, Math.round(0 + swirl * 1)));
            const sb = Math.max(0, Math.min(255, Math.round(12 + gradient * 15 + swirl * 6)));
            
            setPixel(px, py, sz, sr, sg, sb);
          }
        }
      }

      // ─── 3. Draw White Pixelated Outline ───
      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const sx = px - cx;
          const sy = py - cy;
          const dist = Math.sqrt(sx * sx + sy * sy);
          
          if (dist > sphereR && dist <= sphereR + 1.2) {
            // The outline is a 3D ring. We rotate it exactly like the disk.
            // Wait, an outline is just a silhouette, it doesn't rotate in 3D, it's always at the edge.
            // But we DO want it to draw at the correct Z-depth (Z=0) so the disk overlaps it properly.
            setPixel(px, py, 0, 220, 225, 235);
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
      time += 0.016;
      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div className="w-full h-full min-h-[350px] flex items-center justify-center relative overflow-hidden bg-transparent">
      {/* Subtle ambient glow */}
      <div
        className="absolute rounded-full blur-3xl pointer-events-none max-w-full"
        style={{
          width: "min(260px, 80%)",
          height: "min(260px, 80%)",
          background: "radial-gradient(ellipse, rgba(180, 40, 160, 0.15), rgba(100, 20, 160, 0.08), transparent 70%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="relative z-10 max-w-full"
        style={{
          width: "min(400px, 100%)",
          height: "auto",
          aspectRatio: "4 / 3",
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
