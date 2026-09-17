"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Tile = { el: HTMLElement; y: number; dark: boolean };
type Section = { top: number; bottom: number; dark: boolean };

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/**
 * Drives the scroll-linked ray of data: a beam anchored at the settled
 * wordmark that grows with scroll progress and wakes the mosaic tiles its
 * leading edge reaches. Also tracks whether the nav sits over a dark section.
 */
export function useSiteMotion(active: boolean) {
  const pageRef = useRef<HTMLDivElement>(null);
  const rayRef = useRef<HTMLDivElement>(null);
  const navLogoRef = useRef<HTMLAnchorElement>(null);

  const tiles = useRef<Tile[] | null>(null);
  const lit = useRef(new WeakSet<HTMLElement>());
  const timers = useRef<number[]>([]);

  const [navDark, setNavDark] = useState(false);

  const wake = useCallback((tile: Tile) => {
    const { el, dark } = tile;
    el.style.transition = "background .55s ease, box-shadow .55s ease";
    el.style.background = dark ? "var(--burgundy-lit)" : "var(--tile-lit)";
    el.style.boxShadow = dark
      ? "inset 0 0 26px rgba(255,181,2,.55)"
      : "inset 0 0 26px rgba(255,181,2,.6)";
    const settle = window.setTimeout(() => {
      el.style.transition = "background 1.5s ease, box-shadow 1.5s ease";
      el.style.background = dark ? "var(--burgundy)" : "#fff";
      el.style.boxShadow = "none";
    }, 700 + Math.random() * 500);
    timers.current.push(settle);
  }, []);

  const measure = useCallback(() => {
    const page = pageRef.current;
    if (!page || tiles.current) return;
    const base = page.getBoundingClientRect().top + window.scrollY;

    const found: Tile[] = [];
    page.querySelectorAll<HTMLElement>("[data-mosaic]").forEach((grid) => {
      const dark = !!grid.closest('[data-section="dark"]');
      Array.from(grid.children).forEach((child) => {
        const el = child as HTMLElement;
        const r = el.getBoundingClientRect();
        found.push({
          el,
          y: r.top + window.scrollY - base + r.height * 0.4,
          dark,
        });
      });
    });
    found.sort((a, b) => a.y - b.y);
    tiles.current = found;
  }, []);

  /** Read live — section offsets shift as webfonts settle. */
  const sectionAt = useCallback((y: number): Section | undefined => {
    const page = pageRef.current;
    if (!page) return undefined;
    return Array.from(page.querySelectorAll<HTMLElement>("[data-section]"))
      .map((el) => {
        const r = el.getBoundingClientRect();
        return {
          top: r.top + window.scrollY,
          bottom: r.bottom + window.scrollY,
          dark: el.getAttribute("data-section") === "dark",
        };
      })
      .find((s) => y >= s.top && y < s.bottom);
  }, []);

  const onScroll = useCallback(() => {
    const page = pageRef.current;
    if (!page) return;
    measure();

    const base = page.getBoundingClientRect().top + window.scrollY;
    const logo = navLogoRef.current?.getBoundingClientRect();
    const headH = logo ? logo.height + 36 : 60;
    const pad = logo ? logo.left - page.getBoundingClientRect().left : 40;
    // Keep the beam out in the gutter, never within 16px of the content column.
    const startX = clamp(8, pad * 0.42, Math.max(8, pad - 16));
    const startY = headH;
    const end = Math.max(
      startY,
      window.scrollY + window.innerHeight * 0.62 - base,
    );

    const ray = rayRef.current;
    if (ray) {
      ray.style.opacity = window.innerWidth < 600 ? "0" : "1";
      ray.style.transform = `translate(${startX}px,${startY}px)`;
      ray.style.height = `${end - startY}px`;
    }

    for (const tile of tiles.current ?? []) {
      if (tile.y > end) break;
      if (lit.current.has(tile.el)) continue;
      lit.current.add(tile.el);
      const delay = Math.min(520, Math.max(0, tile.y - (end - 260)) * 0.9);
      timers.current.push(window.setTimeout(() => wake(tile), delay));
    }

    setNavDark(!!sectionAt(window.scrollY + headH * 0.5)?.dark);
  }, [measure, sectionAt, wake]);

  useEffect(() => {
    if (!active) return;

    let queued = false;
    const handleScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        onScroll();
      });
    };
    const handleResize = () => {
      tiles.current = null;
      onScroll();
    };

    onScroll();
    // Tile offsets measured before the webfonts land are stale.
    let done = false;
    document.fonts.ready.then(() => {
      if (done) return;
      tiles.current = null;
      onScroll();
    });

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      done = true;
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [active, onScroll]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  return { pageRef, rayRef, navLogoRef, navDark };
}

/** Fades each [data-reveal] element up the first time it scrolls into view. */
export function useRevealOnScroll() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("ml-revealed");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12 },
    );
    document
      .querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
