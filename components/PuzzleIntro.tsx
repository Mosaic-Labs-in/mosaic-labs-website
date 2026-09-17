"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  GROUPS,
  LOGO_H,
  LOGO_VIEWBOX,
  LOGO_W,
  PATHS,
  ROT,
} from "@/lib/logo";
import type { Stage } from "./Experience";
import styles from "./PuzzleIntro.module.css";

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

const slotSize = (vw: number, vh: number) => {
  const w = clamp(Math.min(vw * 0.36, vh * 0.4), 190, 400);
  return { w, h: (w * LOGO_H) / LOGO_W };
};

type Props = {
  stage: Stage;
  fills: string[];
  onComplete: () => void;
  onExplore: () => void;
};

export function PuzzleIntro({ stage, fills, onComplete, onExplore }: Props) {
  const [size, setSize] = useState<{ vw: number; vh: number } | null>(null);
  const [placed, setPlaced] = useState([false, false, false, false]);
  const [ready, setReady] = useState(false);

  const els = useRef<(HTMLDivElement | null)[]>([]);
  const offsets = useRef(GROUPS.map(() => ({ x: 0, y: 0 })));
  const rotations = useRef([...ROT]);
  const scattered = useRef(false);

  const apply = useCallback(
    (i: number, x: number, y: number, rot: number, transition?: string) => {
      const el = els.current[i];
      if (!el) return;
      el.style.transition = transition ?? "none";
      el.style.transform = `translate(${x}px,${y}px) rotate(${rot}deg)`;
    },
    [],
  );

  useEffect(() => {
    const update = () =>
      setSize({ vw: window.innerWidth, vh: window.innerHeight });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Deal the pieces out around the slot, once, on first measure.
  useEffect(() => {
    if (!size || scattered.current) return;
    scattered.current = true;
    const { vw, vh } = size;
    const s = slotSize(vw, vh);
    const spread =
      vw < 640
        ? [
            [-0.26, -0.3],
            [0.27, -0.24],
            [-0.28, 0.24],
            [0.25, 0.31],
          ]
        : [
            [-0.3, -0.29],
            [0.31, -0.23],
            [-0.32, 0.25],
            [0.28, 0.3],
          ];
    offsets.current = spread.map(([fx, fy]) => {
      const mx = vw / 2 - s.w / 2 - 16;
      const my = vh / 2 - s.h / 2 - 16;
      return { x: clamp(fx * vw, -mx, mx), y: clamp(fy * vh, -my, my) };
    });
    offsets.current.forEach((o, i) => apply(i, o.x, o.y, rotations.current[i]));
    setReady(true);
  }, [size, apply]);

  useEffect(() => {
    if (placed.every(Boolean)) onComplete();
  }, [placed, onComplete]);

  const onDown = (i: number, e: React.PointerEvent) => {
    if (placed[i] || stage !== "puzzle" || !size) return;
    const el = els.current[i];
    if (!el) return;
    el.style.zIndex = "5";

    const start = {
      px: e.clientX,
      py: e.clientY,
      ox: offsets.current[i].x,
      oy: offsets.current[i].y,
      r: rotations.current[i],
    };
    const radius = Math.max(110, slotSize(size.vw, size.vh).w * 0.42);

    const move = (ev: PointerEvent) => {
      let x = start.ox + (ev.clientX - start.px);
      let y = start.oy + (ev.clientY - start.py);
      // Inside the slot radius the piece is drawn toward home.
      const d = Math.hypot(x, y);
      if (d < radius) {
        const pull = 1 - d / radius;
        const k = 1 - 0.38 * pull * pull;
        x *= k;
        y *= k;
      }
      const tilt = clamp(d / (radius * 1.6), 0, 1);
      offsets.current[i] = { x, y };
      rotations.current[i] = start.r * tilt;
      apply(i, x, y, rotations.current[i]);
    };

    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      const d = Math.hypot(offsets.current[i].x, offsets.current[i].y);
      const snap = Math.max(58, slotSize(size.vw, size.vh).w * 0.24);
      if (d < snap) {
        offsets.current[i] = { x: 0, y: 0 };
        rotations.current[i] = 0;
        apply(i, 0, 0, 0, "transform .62s cubic-bezier(.19,1,.22,1)");
        el.style.zIndex = "2";
        setPlaced((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      } else {
        el.style.zIndex = "";
        apply(
          i,
          offsets.current[i].x,
          offsets.current[i].y,
          rotations.current[i],
          "transform .4s cubic-bezier(.22,1,.3,1)",
        );
      }
    };

    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    e.preventDefault();
  };

  const settled = stage === "logo" || stage === "intro" || stage === "dark";
  const idle = stage !== "puzzle";

  let slotTransform = "none";
  const s = size ? slotSize(size.vw, size.vh) : null;
  if (size && s) {
    const cap = size.vw < 760 ? 1.25 : 1.85;
    // The reveal enlarges the mark, then settles it small in the top-left.
    const scale =
      Math.min(cap, (size.vh * 0.34) / s.h, (size.vw * 0.42) / s.w) * 0.2;
    const mT = clamp(size.vh * 0.055, 22, 54);
    const mL = clamp(size.vw * 0.055, 20, 64);
    const tx = settled ? mL + (s.w * scale) / 2 - size.vw / 2 : 0;
    const ty = settled ? mT + (s.h * scale) / 2 - size.vh / 2 : 0;
    slotTransform = `translate(${tx.toFixed(1)}px,${ty.toFixed(1)}px) scale(${
      settled ? scale : 1
    })`;
  }

  const showIntroText = stage === "intro";

  return (
    <div
      data-intro-layer
      className={styles.layer}
      aria-hidden={stage === "home"}
      style={{
        opacity: stage === "home" ? 0 : 1,
        pointerEvents: stage === "home" || stage === "dark" ? "none" : "auto",
      }}
    >
      <div
        className={styles.prompt}
        style={{
          opacity: stage === "puzzle" && !placed.every(Boolean) ? 1 : 0,
        }}
      >
        {stage === "puzzle" ? "Complete the mosaic" : ""}
      </div>

      {s && (
        <div
          className={styles.slot}
          style={{ width: s.w, height: s.h, transform: slotTransform }}
        >
          <svg
            className={styles.outline}
            viewBox={LOGO_VIEWBOX}
            aria-hidden="true"
            style={{ opacity: stage === "puzzle" ? 1 : 0 }}
          >
            {PATHS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="var(--rule-strong)"
                strokeWidth={7}
                strokeLinejoin="round"
              />
            ))}
          </svg>

          {GROUPS.map((group, i) => (
            <div
              key={i}
              className={styles.piece}
              ref={(el) => {
                els.current[i] = el;
              }}
              onPointerDown={(e) => onDown(i, e)}
            >
              <svg
                viewBox={LOGO_VIEWBOX}
                role="img"
                aria-label={`Mosaic Labs logo piece ${i + 1} of 4`}
                className={`${styles.pieceSvg} ${ready ? styles.ready : ""}`}
                style={{
                  filter:
                    placed[i] || idle
                      ? "none"
                      : "drop-shadow(0 14px 26px rgba(39,39,39,.16))",
                }}
              >
                {group.map((k) => (
                  <path
                    key={k}
                    d={PATHS[k]}
                    fill={fills[i]}
                    className={styles.tile}
                    style={{
                      cursor: placed[i] || idle ? "default" : "grab",
                    }}
                  />
                ))}
              </svg>
            </div>
          ))}
        </div>
      )}

      <div
        className={styles.introText}
        style={{
          opacity: showIntroText ? 1 : 0,
          transform: showIntroText ? "none" : "translateY(26px)",
          pointerEvents: showIntroText ? "auto" : "none",
        }}
      >
        <h1 className={styles.introHeading}>Hi, we&rsquo;re Mosaic Labs.</h1>
        <p className={styles.introSub}>Here for all your data needs.</p>
        <div className={styles.exploreRow}>
          <button type="button" className={styles.explore} onClick={onExplore}>
            See what we build <span className={styles.arrow}>↓</span>
          </button>
        </div>
      </div>
    </div>
  );
}
