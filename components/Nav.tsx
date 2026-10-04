"use client";

import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/lib/content";
import { LOGO_VIEWBOX, PATHS } from "@/lib/logo";
import styles from "./Nav.module.css";

type Props = {
  dark: boolean;
  logoRef: React.Ref<HTMLAnchorElement>;
};

export function Nav({ dark, logoRef }: Props) {
  const [open, setOpen] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const allIds = NAV_ITEMS.map((m) => m.href.replace("#", ""));
      let currentActive: string | null = null;
      
      for (const id of allIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Consider section active if its top is above the middle of viewport
          // and its bottom is below a small offset from top.
          if (rect.top <= window.innerHeight * 0.5 && rect.bottom >= 100) {
            currentActive = id;
          }
        }
      }
      setActiveSection(currentActive);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Check on initial load
    setTimeout(handleScroll, 100);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`${styles.header} ${dark ? styles.dark : ""}`}>
      <div className={styles.inner}>
        <a href="#top" ref={logoRef} className={styles.logo}>
          <svg
            viewBox={LOGO_VIEWBOX}
            className={styles.logoMark}
            role="img"
            aria-label="Mosaic Labs"
          >
            {PATHS.map((d, i) => (
              <path key={i} d={d} fill="currentColor" />
            ))}
          </svg>
          <span className={styles.logoText}>MOSAIC LABS</span>
        </a>

        <nav className={styles.menuRow} onMouseLeave={() => setOpen(null)}>
          {NAV_ITEMS.map((m) => (
            <div
              key={m.key}
              className={styles.item}
              onMouseEnter={() => setOpen(m.key)}
            >
              <a 
                href={m.href} 
                className={`${styles.itemLink} ${activeSection === m.href.replace('#', '') ? styles.active : ''}`}
              >
                {activeSection === m.href.replace('#', '') && (
                  <span className={styles.dash} aria-hidden="true">—</span>
                )}
                {m.label}
                <span className={styles.caret} aria-hidden="true">
                  ▼
                </span>
              </a>
              <div
                className={`${styles.dropdown} ${
                  open === m.key ? styles.open : ""
                }`}
              >
                {m.items.map((it) => (
                  <a key={it.href} href={it.href} className={styles.dropdownLink}>
                    <span className={styles.dropdownIndex}>{it.n}</span>
                    <span className={styles.dropdownLabel}>{it.label}</span>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <a href="#contact" className={styles.contact}>
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}
