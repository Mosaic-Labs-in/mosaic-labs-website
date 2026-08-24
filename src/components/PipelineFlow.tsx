"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  steps: readonly string[];
  /** "light" for maroon/ink on a pale ground, "dark" for white on maroon/ink. */
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The process as a run of stages joined by connectors that draw themselves in
 * sequence when the section scrolls in. Hovering a stage holds it lit and
 * dims the rest, so a long pipeline stays readable.
 */
export function PipelineFlow({ steps, tone = "dark", className = "" }: Props) {
  const ref = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const nodes = el.querySelectorAll<HTMLElement>(".flow__step");
    const lines = el.querySelectorAll<HTMLElement>(".flow__line i");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(nodes, { opacity: 1, y: 0 });
      gsap.set(lines, { scaleX: 1, scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(nodes, { opacity: 0, y: 16 });
      gsap.set(lines, { transformOrigin: "left center", scaleX: 0 });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
      });

      // Stage, connector, stage, connector — so it reads as flow, not a list.
      nodes.forEach((node, index) => {
        timeline.to(node, { opacity: 1, y: 0, duration: 0.45 }, index === 0 ? 0 : "-=0.15");
        const line = lines[index];
        if (line) timeline.to(line, { scaleX: 1, duration: 0.35 }, "-=0.1");
      });

      ScrollTrigger.create({
        trigger: el,
        start: "top 82%",
        once: true,
        onEnter: () => timeline.play(),
      });
    }, el);

    return () => ctx.revert();
  }, [steps]);

  return (
    <ol
      ref={ref}
      className={`flow flow--${tone} ${active !== null ? "is-focused" : ""} ${className}`}
      onPointerLeave={() => setActive(null)}
    >
      {steps.map((step, index) => (
        <li key={step} className="flow__item">
          <button
            type="button"
            className={`flow__step ${active === index ? "is-active" : ""}`}
            onPointerEnter={() => setActive(index)}
            onFocus={() => setActive(index)}
            onBlur={() => setActive(null)}
          >
            <span className="flow__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="flow__label">{step}</span>
          </button>

          {index < steps.length - 1 ? (
            <span className="flow__line" aria-hidden="true">
              <i />
            </span>
          ) : null}
        </li>
      ))}
    </ol>
  );
}
