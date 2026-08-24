"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Single instance so the route curtain can freeze/reset scrolling mid-transition. */
let instance: Lenis | null = null;

export function getLenis() {
  return instance;
}

/**
 * Site-wide inertial scrolling. Lenis still moves the real window scroll
 * position, so anything reading `window.scrollY` (the navbar's hide-on-scroll) keeps
 * working; ScrollTrigger is driven off Lenis' own tick instead of the
 * scroll event so pinned/scrubbed values never lag a frame behind.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      // expo-out: fast pickup, long settle — the "weighted" feel
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.6,
      wheelMultiplier: 1,
    });
    instance = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Same-page anchors (#what-we-do) should ride the same easing rather than
    // hard-jumping past it.
    const onAnchorClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor) return;
      const raw = anchor.getAttribute("href");
      if (!raw || !raw.startsWith("#") || raw === "#") return;
      const target = document.querySelector(raw);
      if (!target) return;
      event.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -96, duration: 1.4 });
    };

    document.addEventListener("click", onAnchorClick);

    return () => {
      document.removeEventListener("click", onAnchorClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      if (instance === lenis) instance = null;
    };
  }, []);

  return null;
}
