"use client";

import { useEffect, useRef } from "react";

// ── Fog blob ─────────────────────────────────────────────────────────────────
interface Fog {
  x: number; y: number;
  r: number;
  vx: number; vy: number;
  o: number; oDir: number; oSpeed: number;
}

function mkFog(w: number, h: number): Fog {
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 160 + 80,
    vx: (Math.random() - 0.5) * 0.12,
    vy: (Math.random() - 0.5) * 0.08,
    o: Math.random() * 0.025 + 0.008,
    oDir: Math.random() < 0.5 ? 1 : -1,
    oSpeed: Math.random() * 0.0003 + 0.0001,
  };
}

// ── Dust particle ─────────────────────────────────────────────────────────────
interface Dust {
  x: number; y: number;
  r: number;
  vy: number; vx: number;
  a: number; da: number; swing: number;
  o: number; oMin: number; oMax: number; oDir: number; oSpeed: number;
}

function mkDust(w: number, h: number, atBottom = false): Dust {
  const r = Math.random() * 1.1 + 0.35;
  const oMax = Math.random() * 0.24 + 0.06;
  return {
    x: Math.random() * w,
    y: atBottom ? h + r * 2 + Math.random() * 30 : Math.random() * h,
    r,
    vy: -(Math.random() * 0.2 + 0.07),
    vx: (Math.random() - 0.5) * 0.06,
    a: Math.random() * Math.PI * 2,
    da: (Math.random() - 0.5) * 0.007 + 0.002,
    swing: Math.random() * 0.32 + 0.08,
    o: Math.random() * oMax,
    oMin: 0.02, oMax,
    oDir: 1,
    oSpeed: Math.random() * 0.0012 + 0.0004,
  };
}

const FOG_COUNT = 5;
const DUST_COUNT = 85;

export default function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf: number;
    let fogs: Fog[] = [];
    let dust: Dust[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      fogs = Array.from({ length: FOG_COUNT }, () => mkFog(canvas.width, canvas.height));
      dust = Array.from({ length: DUST_COUNT }, () => mkDust(canvas.width, canvas.height));
    };
    resize();
    window.addEventListener("resize", resize);

    const frame = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ── fog blobs ──────────────────────────────────────────────────────────
      for (const f of fogs) {
        f.x += f.vx;
        f.y += f.vy;
        f.o += f.oSpeed * f.oDir;
        if (f.o > 0.038) { f.o = 0.038; f.oDir = -1; }
        if (f.o < 0.006) { f.o = 0.006; f.oDir = 1; }
        // bounce off walls
        if (f.x < -f.r) f.x = W + f.r;
        if (f.x > W + f.r) f.x = -f.r;
        if (f.y < -f.r) f.y = H + f.r;
        if (f.y > H + f.r) f.y = -f.r;

        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        grd.addColorStop(0, `rgba(200,148,56,${f.o.toFixed(4)})`);
        grd.addColorStop(0.5, `rgba(190,135,45,${(f.o * 0.4).toFixed(4)})`);
        grd.addColorStop(1, "rgba(180,120,30,0)");
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // ── dust motes ────────────────────────────────────────────────────────
      for (const p of dust) {
        p.a += p.da;
        p.x += p.vx + Math.sin(p.a) * p.swing;
        p.y += p.vy;
        p.o += p.oSpeed * p.oDir;
        if (p.o >= p.oMax) { p.o = p.oMax; p.oDir = -1; }
        if (p.o <= p.oMin) { p.o = p.oMin; p.oDir = 1; }

        if (p.x < -4) p.x = W + 4;
        if (p.x > W + 4) p.x = -4;
        if (p.y < -4) {
          Object.assign(p, mkDust(W, H, true));
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,158,65,${p.o.toFixed(3)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
