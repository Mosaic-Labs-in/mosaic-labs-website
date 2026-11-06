"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "./BrandMark";
import { ConsultButton } from "./Consultation";

// The homepage nav scrolls between its own sections; every other page links across the site.
// On the dedicated domain pages the desktop CTA is a mailto "Contact" link (domains-branch parity).
const HOME_LINKS = [
  { href: "#data-river", label: "Data Pipeline" },
  { href: "#loop-narrative", label: "The Pipeline" },
  { href: "#what-we-do", label: "What We Do" },
  { href: "#solutions", label: "Domains" },
  { href: "#about", label: "Legal & Provenance" },
];

const PAGE_LINKS = [
  { href: "/#data-river", label: "Data Layer" },
  { href: "/what-we-do", label: "What We Do" },
  { href: "/solutions", label: "Solutions" },
  { href: "/about", label: "About" },
];

const DOMAIN_PAGES = new Set(["/voice-data", "/infrastructure-data"]);
const EMAIL = "mosaiclabs17@gmail.com";

const DOMAIN_SUB_LINKS = [
  { href: "/voice-data", label: "Voice & Speech Data", badge: "Domain 01" },
  { href: "/infrastructure-data", label: "Infrastructure Data", badge: "Domain 02" },
];

type DrawerItem = { key: string | null; href: string; label: string; sub?: boolean; badge?: string };

/**
 * Numbered drawer entries. Subpages link across the site (including Insights);
 * the homepage drawer scrolls its own sections and omits Insights — kept faithfully
 * from the domains-branch authoring.
 */
function drawerItems(pathname: string): DrawerItem[] {
  const subs: DrawerItem[] = DOMAIN_SUB_LINKS.map((s) => ({
    key: null,
    href: s.href,
    label: s.label,
    sub: true,
    badge: s.badge,
  }));

  if (pathname === "/") {
    return [
      { key: "01", href: "#data-river", label: "Data Pipeline" },
      { key: "02", href: "#loop-narrative", label: "The Pipeline" },
      { key: "03", href: "/what-we-do", label: "What We Do" },
      { key: "04", href: "/solutions", label: "Enterprise Domains" },
      ...subs,
      { key: "05", href: "/about", label: "Legal & Provenance" },
    ];
  }
  return [
    { key: "01", href: "/", label: "Home & Data Pipeline" },
    { key: "02", href: "/what-we-do", label: "What We Do" },
    { key: "03", href: "/solutions", label: "Enterprise Domains" },
    ...subs,
    { key: "04", href: "/about", label: "About & Provenance" },
    { key: "05", href: "/insights", label: "Insights" },
  ];
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const onDomainPage = DOMAIN_PAGES.has(pathname);
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

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy for the homepage's in-page nav.
  useEffect(() => {
    if (!isHome) return;
    const sections = HOME_LINKS.map((l) => document.getElementById(l.href.slice(1))).filter(
      (el) => el !== null,
    );
    const onScroll = () => {
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

  // Desktop nav: subpages label the domains link "Domains", highlighted also on the dedicated domain pages.
  const links = isHome
    ? HOME_LINKS
    : PAGE_LINKS.map((l) => (l.href === "/solutions" ? { ...l, label: onDomainPage ? "Domains" : "Solutions" } : l));

  const isActive = (href: string) => {
    if (isHome) return href === activeHash;
    if (href === "/solutions") return pathname === "/solutions" || DOMAIN_PAGES.has(pathname);
    return href === pathname;
  };

  const close = () => setMenuOpen(false);
  const items = drawerItems(pathname);

  return (
    <>
      <header className={`site-header${scrolled ? " scrolled" : ""}`}>
        <div className="header-inner">
          <Link href={isHome ? "#hero" : "/"} className="brand-link" aria-label="Mosaic Labs Home">
            <BrandMark />
            <span>MOSAIC LABS</span>
          </Link>

          <nav aria-label="Main Navigation">
            <ul className="nav-menu">
              {links.map((l) => {
                const cls = `nav-item-link${isActive(l.href) ? " active" : ""}`;
                return (
                  <li key={l.href}>
                    {isHome && l.href.startsWith("#") ? (
                      <a href={l.href} className={cls}>
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className={cls}>
                        {l.label}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="header-actions">
            <div className="header-cta">
              {onDomainPage ? (
                <a href={`mailto:${EMAIL}`} className="cta-pill cta-pill-solid header-cta-btn">
                  Contact <span className="arrow-icon">→</span>
                </a>
              ) : (
                <ConsultButton className="cta-pill cta-pill-solid header-cta-btn">
                  Work With Us <span className="arrow-icon">→</span>
                </ConsultButton>
              )}
            </div>
            <button
              type="button"
              className="mobile-nav-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
              <span className="hamburger-bar"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile navigation overlay & drawer */}
      <div
        className={`mobile-nav-overlay${menuOpen ? " open" : ""}`}
        id="mobile-nav-overlay"
        aria-hidden={!menuOpen}
        onClick={close}
      />
      <nav
        className={`mobile-nav-drawer${menuOpen ? " open" : ""}`}
        id="mobile-nav-menu"
        aria-label="Mobile Navigation"
        aria-hidden={!menuOpen}
      >
        <div className="mobile-nav-header">
          <div className="mobile-nav-brand">
            <BrandMark />
            <span>MOSAIC LABS</span>
          </div>
          <button className="mobile-nav-close" aria-label="Close navigation menu" onClick={close}>
            <span>✕</span>
          </button>
        </div>

        <div className="mobile-nav-body">
          <div>
            <div className="mobile-nav-section-label">Navigation</div>
            <ul className="mobile-nav-list">
              {items.map((item) => {
                const isHash = isHome && item.href.startsWith("#");
                const active = !isHome && !item.sub && item.href === pathname;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`mobile-nav-link${item.sub ? " mobile-sub-link" : ""}${active ? " active" : ""}`}
                      onClick={isHash ? undefined : close}
                    >
                      {item.sub ? (
                        <span className="nav-bullet">↳</span>
                      ) : (
                        <span className="nav-idx">{item.key}</span>
                      )}
                      <span>{item.label}</span>
                      {item.badge && <span className="badge-tag">{item.badge}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="mobile-nav-cta-wrapper">
              {onDomainPage ? (
                <a
                  href={`mailto:${EMAIL}`}
                  className="cta-pill cta-pill-solid mobile-nav-cta-btn"
                  style={{ textDecoration: "none", justifyContent: "center" }}
                >
                  Contact Mosaic Labs <span className="arrow-icon">→</span>
                </a>
              ) : (
                <ConsultButton className="cta-pill cta-pill-solid mobile-nav-cta-btn" onClick={close}>
                  Work With Us <span className="arrow-icon">→</span>
                </ConsultButton>
              )}
            </div>
          </div>

          <div className="mobile-nav-footer">
            <div className="mobile-contact-item">
              <span className="contact-lbl">Contact:</span>
              <a href={`mailto:${EMAIL}`} className="contact-val">
                {EMAIL}
              </a>
            </div>
            <div className="mobile-nav-status">DATA AS A SERVICE // PRIVACY BY DESIGN // DPDP ALIGNED</div>
          </div>
        </div>
      </nav>
    </>
  );
}
