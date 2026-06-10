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
    r: Math.random() * 220 + 140,
    vx: (Math.random() - 0.5) * 0.03,
    vy: (Math.random() - 0.5) * 0.02,
    o: Math.random() * 0.07 + 0.03,
    oDir: Math.random() < 0.5 ? 1 : -1,
    oSpeed: Math.random() * 0.0002 + 0.00005,
  };
}

// ── Dust particle ─────────────────────────────────────────────────────────────
interface Dust {
  x: number; y: number;
  r: number;
  vy: number; vx: number;
  a: number; da: number; swing: number;
  o: number; oMin: number; oMax: number; oDir: number; oSpeed: number;
  ember: boolean;
}

function mkDust(w: number, h: number, atBottom = false, ember = false): Dust {
  const r = ember ? Math.random() * 1.5 + 2.5 : Math.random() * 2 + 1;
  const oMax = ember ? Math.random() * 0.2 + 0.7 : Math.random() * 0.55 + 0.35;
  return {
    x: Math.random() * w,
    y: atBottom ? h + r * 2 + Math.random() * 30 : Math.random() * h,
    r,
    // slow drift in any direction — floating-in-space feel
    vy: (Math.random() - 0.5) * 0.05,
    vx: (Math.random() - 0.5) * 0.04,
    a: Math.random() * Math.PI * 2,
    da: (Math.random() - 0.5) * 0.003 + 0.0005,
    swing: Math.random() * 0.06 + 0.015,
    o: Math.random() * oMax,
    oMin: ember ? 0.25 : 0.12, oMax,
    oDir: 1,
    oSpeed: Math.random() * 0.0006 + 0.0002,
    ember,
  };
}

const FOG_COUNT = 5;
const DUST_COUNT = 100;
const EMBER_COUNT = 8;

export default function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let raf = 0;
    let fogs: Fog[] = [];
    let dust: Dust[] = [];
    let W = 0;
    let H = 0;

    const resize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      // render at device resolution so motes stay crisp on retina screens
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fogs = Array.from({ length: FOG_COUNT }, () => mkFog(W, H));
      dust = [
        ...Array.from({ length: DUST_COUNT }, () => mkDust(W, H)),
        ...Array.from({ length: EMBER_COUNT }, () => mkDust(W, H, false, true)),
      ];
    };

    const draw = () => {
      ctx.clearRect(0, 0, W, H);

      // ── fog blobs ──────────────────────────────────────────────────────────
      for (const f of fogs) {
        const grd = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.r);
        grd.addColorStop(0, `rgba(205,152,60,${f.o.toFixed(4)})`);
        grd.addColorStop(0.5, `rgba(195,140,48,${(f.o * 0.45).toFixed(4)})`);
        grd.addColorStop(1, "rgba(180,120,30,0)");
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();
      }

      // ── dust motes — screen blend so overlapping motes glow brighter ─────
      ctx.globalCompositeOperation = "screen";
      for (const p of dust) {
        // soft halo under each mote so it reads as a glowing ember
        const haloR = p.r * (p.ember ? 5 : 4);
        const halo = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, haloR);
        halo.addColorStop(0, `rgba(220,170,80,${(p.o * 0.5).toFixed(3)})`);
        halo.addColorStop(1, "rgba(220,170,80,0)");
        ctx.beginPath();
        ctx.arc(p.x, p.y, haloR, 0, Math.PI * 2);
        ctx.fillStyle = halo;
        ctx.fill();

        // bright core
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,186,98,${p.o.toFixed(3)})`;
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const step = () => {
      for (const f of fogs) {
        f.x += f.vx;
        f.y += f.vy;
        f.o += f.oSpeed * f.oDir;
        if (f.o > 0.11) { f.o = 0.11; f.oDir = -1; }
        if (f.o < 0.03) { f.o = 0.03; f.oDir = 1; }
        // wrap around edges
        if (f.x < -f.r) f.x = W + f.r;
        if (f.x > W + f.r) f.x = -f.r;
        if (f.y < -f.r) f.y = H + f.r;
        if (f.y > H + f.r) f.y = -f.r;
      }

      for (const p of dust) {
        p.a += p.da;
        p.x += p.vx + Math.sin(p.a) * p.swing;
        p.y += p.vy;
        p.o += p.oSpeed * p.oDir;
        if (p.o >= p.oMax) { p.o = p.oMax; p.oDir = -1; }
        if (p.o <= p.oMin) { p.o = p.oMin; p.oDir = 1; }

        if (p.x < -6) p.x = W + 6;
        if (p.x > W + 6) p.x = -6;
        if (p.y < -6) p.y = H + 6;
        if (p.y > H + 6) p.y = -6;
      }
    };

    const frame = () => {
      step();
      draw();
      raf = requestAnimationFrame(frame);
    };

    const onResize = () => {
      resize();
      if (reducedMotion) draw();
    };

    resize();
    window.addEventListener("resize", onResize);

    if (reducedMotion) {
      // Reduce Motion: show a static golden-dust frame instead of nothing
      draw();
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
