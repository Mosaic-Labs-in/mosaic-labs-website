"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  children: React.ReactNode;
  /** How far the element is allowed to travel toward the cursor, in px. */
  strength?: number;
  className?: string;
};

/**
 * Pulls its child toward the cursor while hovered, then springs back. Skipped
 * on touch, where there is no hover to pull with.
 */
export function Magnetic({ children, strength = 14, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = el.firstElementChild ?? el;
    const quickX = gsap.quickTo(target, "x", { duration: 0.5, ease: "power3.out" });
    const quickY = gsap.quickTo(target, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (event: PointerEvent) => {
      const box = el.getBoundingClientRect();
      // -1..1 from the centre, scaled to the travel budget
      const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
      const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
      quickX(gsap.utils.clamp(-1, 1, dx) * strength);
      quickY(gsap.utils.clamp(-1, 1, dy) * strength);
    };

    const onLeave = () => {
      quickX(0);
      quickY(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(target);
    };
  }, [strength]);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
