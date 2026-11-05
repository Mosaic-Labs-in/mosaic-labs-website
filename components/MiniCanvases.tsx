"use client";

import { useCanvas } from "./useCanvas";

/** Small looping visual at the top of each What We Do panel. */
export function MiniViz({ type }: { type: "infra" | "intelligence" | "real" }) {
  const ref = useCanvas(() => {
    let t = 0;
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      t += 0.025;

      if (type === "infra") {
        // Ring-buffer stream
        for (let i = 0; i < 16; i++) {
          ctx.beginPath();
          ctx.arc((t * 40 + i * 22) % w, h / 2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? "#4d111c" : "#ffb502";
          ctx.fill();
        }
      } else if (type === "intelligence") {
        // Point-cloud convergence
        for (let i = 0; i < 20; i++) {
          const a = (i / 20) * Math.PI * 2 + t;
          const r = 24 + Math.sin(t * 2 + i) * 10;
          ctx.beginPath();
          ctx.arc(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? "#4d111c" : "#ffb502";
          ctx.fill();
        }
      } else {
        // Closed loop
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, 45, 20, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "#4d111c";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2 + Math.cos(t * 3) * 45, h / 2 + Math.sin(t * 3) * 20, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffb502";
        ctx.fill();
      }
    };
  });

  return <canvas ref={ref}></canvas>;
}

/** Energy & Utilities: drifting transmission waves. */
export function EnergyCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => {
    let time = 0;
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      time += 0.02;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 6; i++) {
        const y = 35 + i * 32;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < w; x += 20) {
          ctx.lineTo(x, y + Math.sin((x + time * 50) * 0.02 + i) * 6);
        }
        ctx.strokeStyle = i % 2 === 0 ? "#4d111c" : "#ffb502";
        ctx.stroke();
      }
    };
  });

  return <canvas ref={ref} className={className}></canvas>;
}

/** Roads & Transportation: mapped grid. */
export function InfraCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const cols = 8;
    const rows = 5;
    const cw = w / cols;
    const ch = h / rows;
    ctx.strokeStyle = "#e5ded2";
    ctx.lineWidth = 0.8;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        ctx.strokeRect(c * cw + 4, r * ch + 4, cw - 8, ch - 8);
        ctx.beginPath();
        ctx.arc(c * cw + cw / 2, r * ch + ch / 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = (c + r) % 3 === 0 ? "#ffb502" : "#4d111c";
        ctx.fill();
      }
    }
  });

  return <canvas ref={ref} className={className}></canvas>;
}
