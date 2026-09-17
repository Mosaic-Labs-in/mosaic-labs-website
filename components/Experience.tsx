"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BASE_FILL } from "@/lib/logo";
import { DataScene } from "./DataScene";
import { Nav } from "./Nav";
import { PuzzleIntro } from "./PuzzleIntro";
import { useRevealOnScroll, useSiteMotion } from "./useSiteMotion";
import styles from "./Experience.module.css";

export type Stage = "puzzle" | "hold" | "logo" | "intro" | "dark" | "home";

/** Assembly resolves through value, then brand, then black — never yellow. */
const REVEAL_SEQUENCE: [number, string][] = [
  [1120, "#4D111C"],
  [1620, "#111"],
];

/**
 * Drives the whole story: assemble the mosaic, reveal the mark, cross into the
 * dark data world, then hand over to the homepage.
 */
export function Experience({ children }: { children: React.ReactNode }) {
  const [stage, setStage] = useState<Stage>("puzzle");
  const [fills, setFills] = useState<string[]>(BASE_FILL);
  const [darkOn, setDarkOn] = useState(false);
  const [curtainRaised, setCurtainRaised] = useState(false);
  const [homeVisible, setHomeVisible] = useState(false);

  const { pageRef, rayRef, navLogoRef, navDark } = useSiteMotion(homeVisible);
  useRevealOnScroll();

  const timers = useRef<number[]>([]);
  const completed = useRef(false);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setStage("home");
      setHomeVisible(true);
      return;
    }
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const onComplete = useCallback(() => {
    if (completed.current) return;
    completed.current = true;
    const at = (ms: number, fn: () => void) =>
      timers.current.push(window.setTimeout(fn, ms));
    at(620, () => {
      setStage("hold");
      setFills(["#2A2A2A", "#2A2A2A", "#2A2A2A", "#2A2A2A"]);
    });
    REVEAL_SEQUENCE.forEach(([ms, colour]) =>
      at(ms, () => setFills([colour, colour, colour, colour])),
    );
    at(2120, () => setStage("logo"));
    at(2680, () => setStage("intro"));
  }, []);

  const onExplore = useCallback(() => {
    setStage("dark");
    setDarkOn(true);
    setCurtainRaised(true);
  }, []);

  const revealHome = useCallback(() => {
    setHomeVisible(true);
    document.body.style.overflow = "";
  }, []);

  const finish = useCallback(() => {
    setStage("home");
    setDarkOn(false);
    setHomeVisible(true);
    document.body.style.overflow = "";
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <>
      <PuzzleIntro
        stage={stage}
        fills={fills}
        onComplete={onComplete}
        onExplore={onExplore}
      />

      <DataScene
        active={darkOn}
        visible={darkOn}
        raised={curtainRaised}
        showSkip={stage === "dark"}
        onRevealHome={revealHome}
        onDone={finish}
        onSkip={finish}
      />

      <div
        data-site
        ref={pageRef}
        className={styles.page}
        style={{ opacity: homeVisible ? 1 : 0 }}
      >
        <div ref={rayRef} className={styles.ray} aria-hidden="true">
          <div className={styles.rayLine} />
          <div className={styles.rayGlow} />
          <div className={styles.rayTip} />
        </div>

        <Nav dark={navDark} logoRef={navLogoRef} />
        {children}
      </div>
    </>
  );
}
