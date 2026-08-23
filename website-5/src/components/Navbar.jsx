import { useState, useEffect } from "react";

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

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
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-8 z-40 transition-opacity duration-700 ease-in-out ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      {/* Left side empty */}
      <div className="flex-1"></div>

      {/* Floating premium navbar */}
      <div className="flex items-center bg-white/95 backdrop-blur-xl rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-white/40 pl-10 pr-2 py-2 gap-10 text-[13px] font-semibold tracking-wide text-[#5a544e]">
        <a href="#" className="hover:text-[#361117] transition-colors relative group">
          Overview
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#361117] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#" className="hover:text-[#361117] transition-colors relative group">
          Data Operations
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#361117] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <a href="#" className="hover:text-[#361117] transition-colors relative group">
          Market Intelligence
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-[#361117] transition-all duration-300 group-hover:w-full"></span>
        </a>
        <button className="bg-[#361117] hover:bg-[#1f090d] text-white px-7 py-3 rounded-full transition-all duration-300 flex items-center gap-3 ml-2 hover:shadow-lg hover:-translate-y-0.5">
          Inquiry <span className="text-lg leading-none">&rarr;</span>
        </button>
      </div>
    </header>
  );
}
