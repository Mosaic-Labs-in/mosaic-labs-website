"use client";

import { useEffect, useRef } from "react";
import styles from "./DataScene.module.css";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

const KINDS = [
  "cells",
  "row",
  "num",
  "bar",
  "pie",
  "spark",
  "table",
  "point",
  "coord",
  "node",
  "cells",
  "row",
  "num",
  "point",
] as const;

type Kind = (typeof KINDS)[number];

type Fragment = {
  kind: Kind;
  seed: number;
  sc: number;
  u: number;
  off: number;
  esc: number;
  x: number;
  y: number;
  ax: number;
  ay: number;
  blink: number;
  duty: number;
  hue: number;
  num: string;
};

type Props = {
  active: boolean;
  visible: boolean;
  raised: boolean;
  showSkip: boolean;
  onRevealHome: () => void;
  onDone: () => void;
  onSkip: () => void;
};

/**
 * The dark scene: outlined MOSAIC LABS letterforms acting as windows onto a
 * world of data, whose fragments escape the glyph mask and gather into a wave
 * that flows down into the homepage.
 */
export function DataScene({
  active,
  visible,
  raised,
  showSkip,
  onRevealHome,
  onDone,
  onSkip,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const revealHomeRef = useRef(onRevealHome);
  const doneRef = useRef(onDone);
  revealHomeRef.current = onRevealHome;
  doneRef.current = onDone;

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    let raf = 0;
    let handedOver = false;
    let t0 = 0;
    let lastShuffle = 0;

    let cv = { w: 0, h: 0, dpr: 1 };
    let txt = { lines: ["MOSAIC", "LABS"], size: 0, lh: 0, cx: 0, cy: 0 };
    let mask: HTMLCanvasElement | null = null;
    let layer: HTMLCanvasElement | null = null;
    let anchors: [number, number][] = [];
    let frags: Fragment[] = [];

    // next/font generates hashed family names, so read them off the CSS vars.
    const cssVar = (name: string, fallback: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
      fallback;
    const fontStack = `${cssVar("--font-jost", "Jost")}, 'Century Gothic', Helvetica, sans-serif`;
    const monoStack = `${cssVar("--font-mono", "JetBrains Mono")}, monospace`;
    const setFont = (c: CanvasRenderingContext2D, s: number) => {
      c.font = `500 ${s}px ${fontStack}`;
      try {
        c.letterSpacing = `${s * 0.02}px`;
      } catch {
        /* letterSpacing is unsupported in some engines */
      }
    };

    const reanchor = (f: Fragment) => {
      if (!anchors.length) return;
      const p = anchors[(Math.random() * anchors.length) | 0];
      f.ax = p[0];
      f.ay = p[1];
    };

    const buildText = () => {
      const { w, h, dpr } = cv;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      setFont(ctx, 100);
      const wide =
        Math.max(
          ctx.measureText("MOSAIC").width,
          ctx.measureText("LABS").width,
        ) / 100;
      const size = Math.min((w * 0.88) / wide, h * 0.34);
      txt = {
        lines: ["MOSAIC", "LABS"],
        size,
        lh: size * 0.9,
        cx: w / 2,
        cy: h * 0.44,
      };
      setFont(ctx, size);

      const m = document.createElement("canvas");
      m.width = canvas.width;
      m.height = canvas.height;
      const mc = m.getContext("2d");
      if (!mc) return;
      mc.setTransform(dpr, 0, 0, dpr, 0, 0);
      mc.fillStyle = "#fff";
      mc.textAlign = "center";
      mc.textBaseline = "middle";
      mc.font = ctx.font;
      try {
        mc.letterSpacing = ctx.letterSpacing;
      } catch {
        /* letterSpacing is unsupported in some engines */
      }
      txt.lines.forEach((l, i) =>
        mc.fillText(l, txt.cx, txt.cy + (i - (txt.lines.length - 1) / 2) * txt.lh),
      );
      mask = m;

      layer = document.createElement("canvas");
      layer.width = m.width;
      layer.height = m.height;

      const data = mc.getImageData(0, 0, m.width, m.height).data;
      const step = Math.max(4, Math.round(6 * dpr));
      const next: [number, number][] = [];
      for (let y = 0; y < m.height; y += step) {
        for (let x = 0; x < m.width; x += step) {
          if (data[(y * m.width + x) * 4 + 3] > 140) {
            next.push([x / dpr, y / dpr]);
          }
        }
      }
      anchors = next;
      frags.forEach(reanchor);
    };

    const sizeCanvas = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth || window.innerWidth;
      const h = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      cv = { w, h, dpr };
      buildText();
    };

    const waveAt = (u: number, t: number, travel: number, off: number) => {
      const { w, h } = cv;
      const swirl = Math.max(0, 1 - u * 3.2);
      const ang = u * 9 + t * 0.9;
      const rad = txt.size * 0.85 * swirl;
      const spread = w * 0.22 * (0.3 + 0.7 * u);
      return {
        x:
          txt.cx +
          Math.sin(u * Math.PI * 1.9 + t * 0.55) * spread +
          Math.cos(ang) * rad +
          off * spread * 0.55,
        y:
          txt.cy -
          h * 0.05 +
          u * h * 1.05 +
          Math.sin(u * 7 + t * 1.3) * 14 +
          Math.sin(ang) * rad * 0.45 +
          travel * h * 1.0 +
          off * 36,
      };
    };

    const drawFrag = (
      c: CanvasRenderingContext2D,
      f: Fragment,
      alpha: number,
    ) => {
      if (alpha <= 0.02) return;
      const s = f.sc;
      const a = Math.min(1, alpha);
      c.save();
      c.globalAlpha = a;
      const ink = f.hue < 0.09 ? "#FFB502" : f.hue < 0.2 ? "#E5DED2" : "#ffffff";
      c.strokeStyle = ink;
      c.fillStyle = ink;
      c.lineWidth = 1;
      c.translate(f.x, f.y);
      switch (f.kind) {
        case "cells": {
          const u = 4 * s;
          for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
              if ((i + j + ((f.seed * 9) | 0)) % 4 === 0) {
                c.globalAlpha = a * 0.85;
                c.fillRect(i * u, j * u, u - 1, u - 1);
                c.globalAlpha = a;
              } else {
                c.strokeRect(i * u + 0.5, j * u + 0.5, u - 1, u - 1);
              }
            }
          }
          break;
        }
        case "row":
          for (let i = 0; i < 5; i++) {
            c.fillRect(
              i * 7 * s,
              0,
              (2 + ((i * 7 + f.seed * 13) % 5)) * s,
              1.4 * s,
            );
          }
          break;
        case "num":
          c.font = `${(9 * s).toFixed(1)}px ${monoStack}`;
          c.textAlign = "left";
          c.textBaseline = "middle";
          c.fillText(f.num, 0, 0);
          break;
        case "bar":
          for (let i = 0; i < 4; i++) {
            const hh = (4 + ((i * 5 + f.seed * 17) % 11)) * s;
            c.fillRect(i * 4.5 * s, -hh, 3 * s, hh);
          }
          break;
        case "pie": {
          const r = 7 * s;
          c.beginPath();
          c.arc(0, 0, r, 0, Math.PI * 2);
          c.stroke();
          c.beginPath();
          c.moveTo(0, 0);
          c.arc(0, 0, r, -1.2, -1.2 + 1.6 + f.seed * 2.4);
          c.closePath();
          c.globalAlpha = a * 0.75;
          c.fill();
          break;
        }
        case "spark": {
          c.beginPath();
          for (let i = 0; i < 7; i++) {
            const px = i * 4 * s;
            const py = -((3 + ((i * 11 + f.seed * 23) % 9)) * s);
            if (i) c.lineTo(px, py);
            else c.moveTo(px, py);
          }
          c.stroke();
          break;
        }
        case "table": {
          const wd = 26 * s;
          c.fillRect(0, 0, wd, 2 * s);
          for (let i = 1; i < 4; i++) {
            c.globalAlpha = a * 0.6;
            c.fillRect(0, i * 4 * s, wd * (0.4 + ((i * 7 + f.seed * 5) % 6) / 10), 1 * s);
          }
          break;
        }
        case "point":
          for (let i = 0; i < 4; i++) {
            const ang = f.seed * 6 + i * 1.7;
            c.fillRect(Math.cos(ang) * 7 * s, Math.sin(ang) * 7 * s, 2 * s, 2 * s);
          }
          break;
        case "coord": {
          const r = 6 * s;
          c.beginPath();
          c.moveTo(-r, 0);
          c.lineTo(r, 0);
          c.moveTo(0, -r);
          c.lineTo(0, r);
          c.stroke();
          c.fillRect(-1 * s, -1 * s, 2 * s, 2 * s);
          break;
        }
        case "node": {
          const pts = [
            [0, 0],
            [9 * s, -5 * s],
            [14 * s, 4 * s],
            [4 * s, 8 * s],
          ];
          c.beginPath();
          pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])));
          c.globalAlpha = a * 0.5;
          c.stroke();
          c.globalAlpha = a;
          pts.forEach((p) => {
            c.beginPath();
            c.arc(p[0], p[1], 1.6 * s, 0, Math.PI * 2);
            c.fill();
          });
          break;
        }
      }
      c.restore();
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (cancelled || !layer || !mask) return;
      const t = (performance.now() - t0) / 1000;
      const { w, h, dpr } = cv;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#0A0A0A";
      ctx.fillRect(0, 0, w, h);

      const appear = clamp((t - 0.45) / 0.8, 0, 1);
      const dataAlpha = clamp((t - 1.0) / 0.9, 0, 1);
      const escStart = 3.5;
      const travel = easeInOut(clamp((t - 5.0) / 2.6, 0, 1));
      const fade = 1 - clamp((t - 6.9) / 1.1, 0, 1);
      ctx.globalAlpha = fade;

      // While the data still lives in the letters it keeps rearranging.
      if (t < escStart && t - lastShuffle > 0.55) {
        lastShuffle = t;
        frags.forEach((f) => {
          if (Math.random() < 0.3) reanchor(f);
        });
      }

      const lay = layer.getContext("2d");
      if (!lay) return;
      lay.setTransform(1, 0, 0, 1, 0, 0);
      lay.clearRect(0, 0, layer.width, layer.height);
      lay.setTransform(dpr, 0, 0, dpr, 0, 0);

      const free: Fragment[] = [];
      frags.forEach((f) => {
        const escapeAt = escStart + f.seed * 1.15;
        f.esc = clamp((t - escapeAt) / 1.25, 0, 1);
        const blinkOn = ((t / f.blink + f.seed * 7) % 1) < f.duty;
        if (f.esc <= 0) {
          if (!blinkOn) return;
          f.x = f.ax + Math.sin(t * 1.4 + f.seed * 9) * 2;
          f.y = f.ay + Math.cos(t * 1.2 + f.seed * 5) * 2;
          drawFrag(
            lay,
            f,
            dataAlpha * (0.55 + 0.45 * Math.sin(t * 3 + f.seed * 11) ** 2),
          );
        } else {
          const p = easeOut(f.esc);
          const wp = waveAt(f.u, t, travel, f.off);
          f.x = f.ax + (wp.x - f.ax) * p;
          f.y = f.ay + (wp.y - f.ay) * p;
          free.push(f);
        }
      });

      // Clip the in-letter data to the glyph shapes.
      lay.globalCompositeOperation = "destination-in";
      lay.setTransform(1, 0, 0, 1, 0, 0);
      lay.drawImage(mask, 0, 0);
      lay.globalCompositeOperation = "source-over";

      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalAlpha = fade;
      ctx.drawImage(layer, 0, 0);
      ctx.restore();

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      setFont(ctx, txt.size);
      ctx.lineWidth = Math.max(1.4, txt.size * 0.022);
      ctx.lineJoin = "round";
      ctx.strokeStyle = `rgba(255,255,255,${(
        0.94 *
        appear *
        (1 - 0.55 * travel)
      ).toFixed(3)})`;
      txt.lines.forEach((l, i) =>
        ctx.strokeText(
          l,
          txt.cx,
          txt.cy + (i - (txt.lines.length - 1) / 2) * txt.lh,
        ),
      );

      free.forEach((f) =>
        drawFrag(
          ctx,
          f,
          (0.35 + 0.65 * f.esc) * (0.75 + 0.25 * Math.sin(t * 4 + f.seed * 10)),
        ),
      );

      if (travel > 0) {
        ctx.beginPath();
        for (let i = 0; i <= 60; i++) {
          const p = waveAt(i / 60, t, travel, 0);
          if (i) ctx.lineTo(p.x, p.y);
          else ctx.moveTo(p.x, p.y);
        }
        ctx.strokeStyle = `rgba(255,181,2,${(0.25 * travel).toFixed(3)})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      if (t > 6.2 && !handedOver) {
        handedOver = true;
        revealHomeRef.current();
      }
      if (t > 8.2) {
        cancelAnimationFrame(raf);
        doneRef.current();
      }
    };

    const start = () => {
      if (cancelled) return;
      sizeCanvas();
      const count = cv.w < 700 ? 78 : 150;
      frags = Array.from({ length: count }, (_, i) => {
        const f: Fragment = {
          kind: KINDS[(Math.random() * KINDS.length) | 0],
          seed: Math.random(),
          sc: 0.7 + Math.random() * 0.8,
          u: i / count,
          off: Math.random() - 0.5,
          esc: 0,
          x: 0,
          y: 0,
          ax: 0,
          ay: 0,
          blink: 1.1 + Math.random() * 2.2,
          duty: 0.45 + Math.random() * 0.4,
          hue: Math.random(),
          num: (Math.random() * 9000 + 120).toFixed(Math.random() < 0.4 ? 2 : 0),
        };
        reanchor(f);
        f.x = f.ax;
        f.y = f.ay;
        return f;
      });
      t0 = performance.now();
      raf = requestAnimationFrame(tick);
    };

    // The glyph mask is only correct once the webfont has actually loaded.
    document.fonts.ready.then(start, start);

    const onResize = () => {
      if (cv.w) sizeCanvas();
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [active]);

  return (
    <div
      className={styles.curtain}
      aria-hidden={!visible}
      style={{
        transform: raised ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
      }}
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <button
        type="button"
        className={styles.skip}
        onClick={onSkip}
        style={{
          opacity: showSkip ? 1 : 0,
          pointerEvents: showSkip ? "auto" : "none",
        }}
      >
        Skip →
      </button>
    </div>
  );
}
