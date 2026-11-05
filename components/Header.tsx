"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { ConsultButton } from "./Consultation";

// The homepage nav scrolls between its own sections; every other page links across the site.
const HOME_LINKS = [
  { href: "#data-river", label: "Data Pipeline" },
  { href: "#loop-narrative", label: "The Pipeline" },
  { href: "#what-we-do", label: "What We Do" },
  { href: "#solutions", label: "Domains" },
  { href: "#about", label: "Legal & Provenance" },
  { href: "#insights", label: "Insights" },
];

const PAGE_LINKS = [
  { href: "/#data-river", label: "Data Layer" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/solutions", label: "Solutions" },
  { href: "/about", label: "About" },
  { href: "/insights", label: "Insights" },
];

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const links = isHome ? HOME_LINKS : PAGE_LINKS;
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHash, setActiveHash] = useState<string | null>(null);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    const sections = isHome
      ? HOME_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter((el) => el !== null)
      : [];

    const onScroll = () => {
      setScrolled(window.scrollY > 30);

      // Scroll-spy: the last section whose top has passed 40% of the viewport.
      let current: string | null = null;
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= window.innerHeight * 0.4 && rect.bottom >= 100) current = `#${section.id}`;
      }
      if (current) setActiveHash(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const isActive = (href: string) => (isHome ? href === activeHash : href === pathname);

  const renderLinks = (className: string) =>
    links.map((l) => {
      const cls = `${className}${isActive(l.href) ? " active" : ""}`;
      const close = () => setMenuOpen(false);
      return (
        <li key={l.href}>
          {isHome ? (
            <a href={l.href} className={cls} onClick={close}>
              {l.label}
            </a>
          ) : (
            <Link href={l.href} className={cls} onClick={close}>
              {l.label}
            </Link>
          )}
        </li>
      );
    });

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}>
      <div className="header-inner">
        <Link href={isHome ? "#hero" : "/"} className="brand-link" aria-label="Mosaic Labs Home">
          <BrandMark />
          <span>MOSAIC LABS</span>
        </Link>

        <nav aria-label="Main Navigation">
          <ul className="nav-menu">{renderLinks("nav-item-link")}</ul>
        </nav>

        <div className="header-cta">
          <ConsultButton className="cta-pill cta-pill-solid">
            Work With Us <span className="arrow-icon">→</span>
          </ConsultButton>
          <button
            type="button"
            className="nav-toggle"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      <nav id="mobile-nav" className="mobile-nav" aria-label="Mobile Navigation">
        <ul>{renderLinks("")}</ul>
        <ConsultButton className="cta-pill cta-pill-solid" onClick={() => setMenuOpen(false)}>
          Work With Us <span className="arrow-icon">→</span>
        </ConsultButton>
      </nav>
    </header>
  );
}
