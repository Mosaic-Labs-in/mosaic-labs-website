"use client";

import { useEffect, useRef } from "react";

type Frame = (ctx: CanvasRenderingContext2D, w: number, h: number) => void;

/**
 * Sizes a canvas to its parent (DPR-aware, re-measured whenever the parent
 * resizes) and runs `setup()`'s frame function every animation frame while
 * the canvas is on screen. Per-canvas state lives in the `setup` closure.
 */
export function useCanvas(setup: () => Frame) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const frame = setup();
    let w = 0;
    let h = 0;
    let raf = 0;

    const ro = new ResizeObserver(() => {
      const rect = parent.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    ro.observe(parent);

    const loop = () => {
      frame(ctx, w, h);
      raf = requestAnimationFrame(loop);
    };

    // Off-screen canvases stop drawing, which matters on phones.
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return ref;
}
