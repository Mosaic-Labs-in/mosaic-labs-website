"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Overview", href: "/" as const },
  { label: "Data Operations", href: "/data-operations" as const },
  { label: "Market Intelligence", href: "/market-intelligence" as const },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const onInquiry = pathname === "/inquiry";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
        setIsMobileMenuOpen(false); // Close menu when scrolling down
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-5 py-5 sm:px-6 sm:py-8 md:px-12 z-40 transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Left side empty */}
      <div className="flex-1"></div>

      {/* Floating premium navbar */}
      <div className="flex items-center bg-[#f4efe6]/95 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#e8dfd1]/50 pl-5 pr-2 py-1.5 gap-4 lg:gap-10 lg:pl-10 lg:py-2 text-[13px] font-semibold tracking-wide text-[#5a544e]">
        {LINKS.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hidden lg:inline-block hover:text-brand-maroon transition-colors relative group"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-amber transition-all duration-300 group-hover:w-full"></span>
          </Link>
        ))}

        <Link
          href="/inquiry"
          aria-current={onInquiry ? "page" : undefined}
          className={`btn-wipe px-6 py-2.5 lg:px-7 lg:py-3 rounded-full flex items-center gap-2 lg:gap-3 lg:ml-2 text-[13px] font-semibold ${
            onInquiry ? "ring-2 ring-brand-amber ring-offset-2 ring-offset-[#f4efe6]" : ""
          }`}
        >
          Inquiry <span className="text-lg leading-none">&rarr;</span>
        </Link>
        
        {/* Hamburger Button (Mobile Only) */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-full hover:bg-[#e8dfd1]/50 transition-colors mr-1"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12"></line>
              <line x1="4" x2="20" y1="6" y2="6"></line>
              <line x1="4" x2="20" y1="18" y2="18"></line>
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      <div 
        className={`absolute top-full right-5 sm:right-6 mt-4 w-56 bg-[#f4efe6]/95 backdrop-blur-xl border border-[#e8dfd1]/50 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] overflow-hidden transition-all duration-300 transform origin-top-right lg:hidden ${
          isMobileMenuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col py-3">
          {LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="px-6 py-3 text-[14px] font-semibold text-[#5a544e] hover:bg-[#e8dfd1]/50 hover:text-brand-maroon transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
