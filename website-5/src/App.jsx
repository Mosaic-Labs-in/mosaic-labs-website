import { useEffect, useRef } from "react";
import Navbar from "./components/Navbar";
import SplashScreen from "./components/SplashScreen";
import gsap from "gsap";

function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".gsap-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: 5.2, // Wait for splash screen to clear
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <SplashScreen>
      <div ref={containerRef} className="flex flex-col min-h-screen bg-[#f9f8f6] font-sans relative overflow-x-hidden">
      <Navbar />
      
      {/* Absolute Logo (Scrolls with page) */}
      <div className="absolute top-0 left-0 px-6 md:px-12 py-8 z-30 gsap-reveal opacity-0">
        <img src="/mosaic-mark-36.svg" alt="Mosaic" style={{ height: '36px', width: 'auto' }} className="object-contain" />
      </div>
      
      {/* Main Content Area */}
      <main className="flex flex-col flex-1 w-full min-h-screen px-6 md:px-10 lg:px-12 pt-24 lg:flex-row items-center">
        {/* Left Column: Text */}
        <div className="flex-1 flex flex-col items-start text-left max-w-[650px]">
          {/* Headline */}
          <h1 className="text-[3.5rem] md:text-[4.5rem] font-bold leading-[1.05] tracking-tight text-[#361117] mb-8 font-sans gsap-reveal opacity-0">
            Raw reality in.<br />
            Decision-grade<br />
            data out.
          </h1>

          {/* Paragraph */}
          <p className="text-lg md:text-xl font-normal text-[#635d58] leading-relaxed mb-12 max-w-[500px] gsap-reveal opacity-0">
            We turn messy, unstructured real-world data into two things your teams can actually use: clean, purpose-built datasets for AI training, and clear market intelligence for business decisions. One pipeline, two outputs.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-5 gsap-reveal opacity-0">
            <button className="bg-[#361117] hover:bg-[#20090d] text-white px-8 py-4 font-semibold text-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              Book a demo
            </button>
            <button className="bg-transparent hover:bg-[#f9f8f6] text-[#361117] border border-[#dcd7d0] px-8 py-4 font-semibold text-sm transition-all duration-300 hover:shadow-sm hover:border-[#361117]">
              See how it works
            </button>
          </div>
        </div>

        {/* Right Column: Empty placeholder for future visual */}
        <div className="flex-1 w-full lg:w-auto mt-16 lg:mt-0 relative flex items-center justify-center gsap-reveal opacity-0">
        </div>
      </main>
      
        {/* Spacer for scroll testing */}
        <div className="h-[1000px] w-full"></div>
      </div>
    </SplashScreen>
  );
}

export default App;
