"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  to: number;
  /** Rendered before/after the number, e.g. "%" or "k". */
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up to `to` the first time it scrolls into view. */
export function CountUp({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const write = (value: number) => {
      el.textContent = `${prefix}${value.toFixed(decimals)}${suffix}`;
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      write(to);
      return;
    }

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      write(0);

      ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        once: true,
        onEnter: () =>
          gsap.to(counter, {
            value: to,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => write(counter.value),
          }),
      });
    }, el);

    return () => ctx.revert();
  }, [to, prefix, suffix, decimals]);

  // Server-renders the final value so it is never blank without JS.
  return (
    <span ref={ref} className={className}>
      {`${prefix}${to.toFixed(decimals)}${suffix}`}
    </span>
  );
}
