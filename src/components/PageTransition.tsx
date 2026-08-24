"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getLenis } from "@/components/SmoothScroll";

const COLUMNS = 6;

type Phase = "idle" | "covering" | "waiting" | "revealing";

/**
 * Route transitions as a mosaic shutter.
 *
 * Columns of maroon grow up from the bottom to cover the viewport, the route
 * swaps underneath while nothing is visible, then the same columns keep
 * travelling upward to uncover the new page — one continuous sweep, echoing
 * the splash screen's shutter.
 *
 * Internal links are intercepted at the document's capture phase instead of
 * being rewritten into a custom <Link>, so every existing anchor in the
 * navbar, footer, cards and CTAs joins in without being touched.
 */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();

  const rootRef = useRef<HTMLDivElement | null>(null);
  const columnsRef = useRef<HTMLSpanElement[]>([]);
  const markRef = useRef<HTMLDivElement | null>(null);

  const phaseRef = useRef<Phase>("idle");
  const pendingRef = useRef<string | null>(null);
  const failsafeRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const revealRef = useRef<(() => void) | null>(null);
  const pulseRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    const columns = columnsRef.current.filter(Boolean);
    const mark = markRef.current;
    if (!root || columns.length === 0) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const push = router.push as (href: string) => void;

    const settle = () => {
      phaseRef.current = "idle";
      pendingRef.current = null;
      root.classList.remove("is-active");
      getLenis()?.start();
      ScrollTrigger.refresh();
    };

    const reveal = () => {
      phaseRef.current = "revealing";
      pulseRef.current?.kill();
      pulseRef.current = null;
      // Origin flips to the top so the panels carry on moving up rather than
      // retreating back the way they came.
      gsap.set(columns, { transformOrigin: "top center" });

      const timeline = gsap.timeline();
      timeline
        .to(mark, { opacity: 0, scale: 1.08, duration: 0.22, ease: "power2.in" }, 0)
        .to(
          columns,
          {
            scaleY: 0,
            duration: 0.62,
            ease: "power3.inOut",
            stagger: { each: 0.04, from: "start" },
            // Hand scrolling back the instant the last panel clears; waiting
            // for the slower lift below would leave the wheel dead on a page
            // that already looks ready.
            onComplete: settle,
          },
          0.08
        );

      // The page rises a touch slower than the panels clearing it, so the two
      // planes separate instead of the content arriving flat. <main> is the
      // target rather than the page root because transforming an ancestor
      // would re-anchor the fixed navbar to it.
      const main = document.querySelector("main");
      if (main) {
        timeline.fromTo(
          main,
          { y: 36 },
          { y: 0, duration: 0.95, ease: "power3.out", clearProps: "transform" },
          0.12
        );
      }
    };

    revealRef.current = reveal;

    const cover = (href: string) => {
      phaseRef.current = "covering";
      pendingRef.current = href;
      root.classList.add("is-active");
      getLenis()?.stop();

      gsap.set(columns, { transformOrigin: "bottom center", scaleY: 0 });
      gsap.set(mark, { opacity: 0, scale: 0.82 });

      gsap
        .timeline({
          onComplete: () => {
            phaseRef.current = "waiting";
            // A slow breath while the route commits: on a cold or slow page
            // the hold is otherwise a dead maroon wall.
            pulseRef.current = gsap.to(mark, {
              scale: 1.06,
              duration: 1.1,
              ease: "sine.inOut",
              repeat: -1,
              yoyo: true,
            });
            window.scrollTo(0, 0);
            getLenis()?.scrollTo(0, { immediate: true });
            push(href);
            // If the route never commits, don't strand the user behind a wall.
            failsafeRef.current = setTimeout(() => {
              if (phaseRef.current === "waiting") reveal();
            }, 4000);
          },
        })
        .to(columns, {
          scaleY: 1,
          duration: 0.44,
          ease: "power3.inOut",
          stagger: { each: 0.04, from: "start" },
        })
        .to(mark, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" }, "-=0.22");
    };

    const onCapture = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as HTMLElement | null)?.closest?.("a");
      if (!anchor || anchor.hasAttribute("download")) return;
      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.dataset.noTransition !== undefined) return;

      const raw = anchor.getAttribute("href");
      if (!raw || raw.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return;

      // Reduced motion still gets the instant client navigation, just no sweep.
      if (reduced.matches) return;
      // Mid-transition clicks would fight the timeline; swallow them.
      if (phaseRef.current !== "idle") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      cover(url.pathname + url.search);
    };

    document.addEventListener("click", onCapture, true);
    return () => {
      document.removeEventListener("click", onCapture, true);
      pulseRef.current?.kill();
      revealRef.current = null;
      if (failsafeRef.current) clearTimeout(failsafeRef.current);
    };
  }, [router]);

  // The new route has committed underneath the shutter — open it back up.
  useEffect(() => {
    if (phaseRef.current !== "waiting") return;
    if (failsafeRef.current) clearTimeout(failsafeRef.current);
    const id = setTimeout(() => revealRef.current?.(), 160);
    return () => clearTimeout(id);
  }, [pathname]);

  return (
    <div ref={rootRef} className="page-curtain" aria-hidden="true">
      <div className="page-curtain__cols">
        {Array.from({ length: COLUMNS }).map((_, index) => (
          <span
            key={index}
            className="page-curtain__col"
            ref={(el) => {
              if (el) columnsRef.current[index] = el;
            }}
          />
        ))}
      </div>

      <div ref={markRef} className="page-curtain__mark">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/mosaic-mark-36.svg" alt="" className="h-14 w-auto object-contain md:h-16" />
      </div>
    </div>
  );
}
