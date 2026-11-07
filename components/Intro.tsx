"use client";

import { useEffect, useRef, useState } from "react";
import { LOGO_VB, PATHS } from "@/lib/logo";

const ASSEMBLE = 850;
const RESOLVE = 1150;
const DISSOLVE = 1450;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

// Plays once per page load, not again on client-side navigation back to home.
let played = false;

/** Logo fragments assemble on charcoal, resolve white, then dissolve into the page. */
export function Intro() {
  const [show] = useState(() => !played);
  const [done, setDone] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!show) return;
    played = true;
    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!overlay || !canvas || !ctx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    const paths = PATHS.map((d) => new Path2D(d));
    const full = new Path2D();
    paths.forEach((p) => full.addPath(p));
    const fragments = PATHS.map((_, i) => ({ angle: (i / 9) * Math.PI * 2, dist: 120 + (i % 3) * 60 }));

    let w = 0;
    let h = 0;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const toLogoSpace = (scale: number) => {
      ctx.scale(scale, scale);
      ctx.translate(-(LOGO_VB.x + LOGO_VB.w / 2), -(LOGO_VB.y + LOGO_VB.h / 2));
    };

    const start = performance.now();
    let raf = 0;
    const render = (now: number) => {
      const elapsed = now - start;
      ctx.fillStyle = "#272727";
      ctx.fillRect(0, 0, w, h);

      const scale = Math.min(w * 0.28, 110) / LOGO_VB.w;
      ctx.save();
      ctx.translate(w / 2, h / 2);

      if (elapsed < ASSEMBLE) {
        const p = easeOutCubic(elapsed / ASSEMBLE);
        paths.forEach((path, i) => {
          const offset = (1 - p) * fragments[i].dist;
          ctx.save();
          ctx.translate(Math.cos(fragments[i].angle) * offset, Math.sin(fragments[i].angle) * offset);
          toLogoSpace(scale);
          ctx.strokeStyle = `rgba(255, 255, 255, ${p * 0.75})`;
          ctx.lineWidth = 1.4;
          ctx.stroke(path);
          if (p > 0.4) {
            ctx.fillStyle = `rgba(255, 181, 2, ${(p - 0.4) * 0.35})`;
            ctx.fill(path);
          }
          ctx.restore();
        });
      } else if (elapsed < DISSOLVE) {
        if (elapsed >= RESOLVE) {
          const p = easeInOutCubic((elapsed - RESOLVE) / (DISSOLVE - RESOLVE));
          overlay.style.opacity = `${Math.max(0, 1 - p * 1.15)}`;
        }
        toLogoSpace(scale);
        ctx.fillStyle = "#ffffff";
        ctx.fill(full);
        if (elapsed < RESOLVE) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke(full);
        }
      } else {
        ctx.restore();
        setDone(true);
        return;
      }

      ctx.restore();
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [show]);

  if (!show) return null;

  return (
    <div className={`entrance-overlay${done ? " hidden" : ""}`} ref={overlayRef} aria-hidden="true">
      <canvas id="entranceCanvas" ref={canvasRef}></canvas>
      <div className="entrance-status">DATA AS A SERVICE · MOSAIC LABS</div>
    </div>
  );
}
