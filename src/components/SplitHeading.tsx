"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  /** Use \n to force a line break. Each line masks its own words. */
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  /** Play on mount instead of waiting to scroll into view (for heroes). */
  immediate?: boolean;
  /** Hold until the splash screen has cleared, matching the rest of the hero. */
  waitForSplash?: boolean;
};

/** The splash marks the document when it finishes; see SplashScreen. */
const SPLASH_SECONDS = 5.2;

/**
 * Headline that rises word by word out of a clipped line box. The mask is what
 * sells it — each line is overflow:hidden, so words slide up from nothing
 * rather than just fading in place.
 */
export function SplitHeading({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
  immediate = false,
  waitForSplash = false,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>(".split-word");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(words, { yPercent: 0, opacity: 1 });
      return;
    }

    // Read in the effect, never during render — it would not match the server.
    const splashPending =
      waitForSplash &&
      !document.documentElement.classList.contains("splash-played");
    const totalDelay = delay + (splashPending ? SPLASH_SECONDS : 0);

    const play = () =>
      gsap.to(words, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
        delay: totalDelay,
        stagger: 0.055,
        ease: "power3.out",
      });

    const ctx = gsap.context(() => {
      gsap.set(words, { yPercent: 115, opacity: 0 });

      if (immediate) {
        play();
        return;
      }

      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: play,
      });
    }, el);

    return () => ctx.revert();
  }, [delay, immediate, waitForSplash]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className}>
      {text.split("\n").map((line, lineIndex) => (
        <span key={lineIndex} className="split-line">
          {line.split(" ").map((word, wordIndex) => (
            <span key={wordIndex} className="split-word">
              {word}
              {wordIndex < line.split(" ").length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
