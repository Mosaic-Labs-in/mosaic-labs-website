"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const HOVERABLE = "a, button, input, select, textarea, .emitter-chip, .editorial-panel, .world-card, .journal-entry";

/** Scroll reveal for [data-reveal] on every page, plus the custom cursor on mouse devices. */
export function SiteEffects() {
  const pathname = usePathname();

  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]:not(.revealed)");
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("revealed");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "custom-cursor-dot";
    ring.className = "custom-cursor-ring";
    document.body.append(dot, ring);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };
    const onOver = (e: MouseEvent) => {
      const hovering = e.target instanceof Element && e.target.closest(HOVERABLE) !== null;
      document.body.classList.toggle("cursor-hover", hovering);
    };
    const tick = () => {
      ringX += (mouseX - ringX) * 0.22;
      ringY += (mouseY - ringY) * 0.22;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
