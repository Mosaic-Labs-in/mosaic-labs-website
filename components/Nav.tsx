"use client";

import { useState } from "react";
import { NAV_ITEMS } from "@/lib/content";
import { LOGO_VIEWBOX, PATHS } from "@/lib/logo";
import styles from "./Nav.module.css";

type Props = {
  dark: boolean;
  logoRef: React.Ref<HTMLAnchorElement>;
};

export function Nav({ dark, logoRef }: Props) {
  const [open, setOpen] = useState<string | null>(null);

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
              <a href={m.href} className={styles.itemLink}>
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
