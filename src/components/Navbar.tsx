"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { label: "Overview", href: "/" as const },
  { label: "Data Operations", href: "/" as const },
  { label: "Market Intelligence", href: "/" as const },
];

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const onInquiry = pathname === "/inquiry";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-5 py-5 sm:px-6 sm:py-8 md:px-12 z-40 transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Left side empty */}
      <div className="flex-1"></div>

      {/* Floating premium navbar */}
      <div className="flex items-center bg-[#f4efe6]/95 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#e8dfd1]/50 pl-5 pr-2 py-1.5 gap-6 lg:pl-10 lg:py-2 lg:gap-10 text-[13px] font-semibold tracking-wide text-[#5a544e]">
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
          className={`btn-wipe px-7 py-3 rounded-full flex items-center gap-3 ml-2 text-[13px] font-semibold ${
            onInquiry ? "ring-2 ring-brand-amber ring-offset-2 ring-offset-white" : ""
          }`}
        >
          Inquiry <span className="text-lg leading-none">&rarr;</span>
        </Link>
      </div>
    </header>
  );
}
