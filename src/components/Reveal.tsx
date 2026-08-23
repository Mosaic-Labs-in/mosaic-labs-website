"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Extra seconds on top of the scroll trigger. */
  delay?: number;
  /** Stagger direct children instead of moving the wrapper as one block. */
  stagger?: number;
  as?: "div" | "section" | "li" | "article";
};

/**
 * Fades content up the first time it scrolls into view. Uses IntersectionObserver
 * rather than GSAP ScrollTrigger so we stay on the gsap core package the rest of
 * the site already loads.
 */
export function Reveal({
  children,
  className = "",
  delay = 0,
  stagger,
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = stagger
      ? (Array.from(el.children) as HTMLElement[])
      : [el as HTMLElement];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(targets, { opacity: 1, y: 0, clearProps: "transform" });
      return;
    }

    gsap.set(targets, { opacity: 0, y: 28 });

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        observer.disconnect();

        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          delay,
          stagger: stagger ?? 0,
          ease: "power3.out",
          clearProps: "transform",
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, stagger]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {children}
    </Tag>
  );
}
