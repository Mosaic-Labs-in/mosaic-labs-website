"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Props = {
  /** Edge length of one tile, in px, including its gutter. */
  size?: number;
  /** Resting tile colour. */
  tile?: string;
  /** Colour of the tiles the pointer lights up. */
  glow?: string;
  /** Opacity range the idle drift animates between. */
  low?: number;
  high?: number;
  /** Radius of the pointer spotlight, in px. */
  radius?: number;
  className?: string;
};

const GUTTER = 6;
const MAX_TILES = 420;

/**
 * Deterministic pseudo-random in [0, 1). Tiles are only built after mount, so
 * this is not about hydration — it keeps the field identical across re-renders
 * so tiles do not re-shuffle when the section resizes.
 */
function noise(n: number): number {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * The tiled backdrop that gives the page its name. Two identical grids are
 * stacked: the lower one rests in `tile`, the upper one is `glow` and is
 * masked to a soft circle that follows the pointer, so tiles light up as the
 * cursor sweeps across them.
 */
export function MosaicField({
  size = 76,
  tile = "var(--color-brand-sand)",
  glow = "var(--color-brand-amber)",
  low = 0.22,
  high = 0.75,
  radius = 190,
  className = "",
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (!box || box.width === 0) return;

      let cols = Math.ceil(box.width / size) + 1;
      let rows = Math.ceil(box.height / size) + 1;

      // Keep the node count sane on very large viewports.
      while (cols * rows > MAX_TILES) {
        cols = Math.ceil(cols * 0.9);
        rows = Math.ceil(rows * 0.9);
      }

      setGrid((prev) =>
        prev.cols === cols && prev.rows === rows ? prev : { cols, rows },
      );
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [size]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Touch pointers have no hover, and the spotlight would just stick where
    // the last tap landed.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let queued = false;
    let x = 0;
    let y = 0;

    const paint = () => {
      queued = false;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      x = event.clientX - box.left;
      y = event.clientY - box.top;

      const inside =
        x > -radius && y > -radius && x < box.width + radius && y < box.height + radius;
      el.style.setProperty("--glow-opacity", inside ? "1" : "0");
      if (!inside) return;

      if (!queued) {
        queued = true;
        frame = requestAnimationFrame(paint);
      }
    };

    const onLeave = () => el.style.setProperty("--glow-opacity", "0");

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, [radius]);

  const tiles = useMemo(() => {
    const cells: { key: string; style: React.CSSProperties }[] = [];

    for (let row = 0; row < grid.rows; row++) {
      for (let col = 0; col < grid.cols; col++) {
        const seed = row * 97 + col * 31;
        const span = high - low;

        cells.push({
          key: `${row}-${col}`,
          style: {
            left: col * size,
            top: row * size,
            width: size - GUTTER,
            height: size - GUTTER,
            // A quarter of the tiles sit noticeably brighter so the field
            // reads as a mosaic rather than a uniform screen.
            ["--tile-low" as string]: `${low + noise(seed) * span * 0.35}`,
            ["--tile-high" as string]: `${low + span * (0.5 + noise(seed + 7) * 0.5)}`,
            ["--tile-delay" as string]: `${-noise(seed + 13) * 9}s`,
            ["--tile-duration" as string]: `${5 + noise(seed + 29) * 6}s`,
          },
        });
      }
    }

    return cells;
  }, [grid.cols, grid.rows, size, low, high]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-ready={grid.cols > 0}
      className={`mosaic-field ${className}`}
      style={{ ["--glow-radius" as string]: `${radius}px` }}
    >
      <div className="mosaic-layer">
        {tiles.map((cell) => (
          <span
            key={cell.key}
            className="mosaic-tile"
            style={{ ...cell.style, background: tile }}
          />
        ))}
      </div>

      <div className="mosaic-layer mosaic-layer--glow">
        {tiles.map((cell) => (
          <span
            key={cell.key}
            className="mosaic-tile"
            style={{ ...cell.style, background: glow }}
          />
        ))}
      </div>
    </div>
  );
}
