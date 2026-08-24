"use client";

import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import ServiceCards from "@/components/ServiceCards";
import { MosaicField } from "@/components/MosaicField";
import { SplitHeading } from "@/components/SplitHeading";
import { Magnetic } from "@/components/Magnetic";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);


export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hasPlayed = document.documentElement.classList.contains('splash-played');
    const delay = hasPlayed ? 0 : 5.2;

    const ctx = gsap.context(() => {
      // 1. Hero section elements: animate immediately with delay (for splash screen)
      gsap.fromTo(
        "main .gsap-reveal, .absolute.gsap-reveal",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.15,
          ease: "power3.out",
          delay: delay,
        }
      );

      // 2. Below-the-fold sections: animate when scrolled into view
      const sections = gsap.utils.toArray("section");
      sections.forEach((section: any) => {
        const reveals = section.querySelectorAll(".gsap-reveal");
        if (reveals.length > 0) {
          gsap.fromTo(
            reveals,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1.2,
              stagger: 0.15,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none"
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen bg-[#f9f8f6] font-sans relative overflow-x-hidden">
      <Navbar />
      
      {/* Absolute Logo (Scrolls with page) */}
      <div className="absolute top-0 left-0 px-6 md:px-12 py-8 z-30 gsap-reveal opacity-0">
        <img src="/mosaic-mark-36.svg" alt="Mosaic" style={{ height: '36px', width: 'auto' }} className="object-contain" />
      </div>
      
      {/* Main Content Area */}
      <main className="relative isolate flex flex-col flex-1 w-full min-h-dvh px-6 md:px-10 lg:px-12 pt-24 lg:flex-row items-center overflow-hidden">
        <MosaicField size={92} low={0.09} high={0.26} radius={230} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#f9f8f6]"
        />

        {/* Left Column: Text */}
        <div className="relative flex-1 flex flex-col items-start text-left max-w-[650px]">
          {/* Headline — words rise out of their line boxes once the splash clears */}
          <SplitHeading
            as="h1"
            immediate
            waitForSplash
            text={"Raw reality in.\nDecision-grade\ndata out."}
            className="text-[clamp(2.5rem,9vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-[#361117] mb-8 font-sans"
          />

          {/* Paragraph */}
          <p className="text-lg md:text-xl font-normal text-[#635d58] leading-relaxed mb-12 max-w-[500px] gsap-reveal opacity-0">
            We turn messy, unstructured real-world data into two things your teams can actually use: clean, purpose-built datasets for AI training, and clear market intelligence for business decisions. One pipeline, two outputs.
          </p>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-5 gsap-reveal opacity-0">
            <Magnetic strength={10}>
              <Link
                href="/inquiry"
                className="btn-wipe group inline-flex items-center gap-3 px-8 py-4 font-semibold text-sm"
              >
                Book a demo
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </Link>
            </Magnetic>

            <Magnetic strength={8}>
              <a
                href="#what-we-do"
                className="inline-block bg-transparent text-[#361117] border border-[#dcd7d0] px-8 py-4 font-semibold text-sm transition-all duration-300 hover:border-[#361117] hover:bg-white"
              >
                See how it works
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right Column: Empty placeholder for future visual */}
        <div className="flex-1 w-full lg:w-auto mt-16 lg:mt-0 relative flex items-center justify-center gsap-reveal opacity-0">
        </div>
      </main>

      {/* Section 02 — What We Do */}
      <section
        id="what-we-do"
        className="px-6 md:px-10 lg:px-12 py-24 bg-brand-maroon w-full min-h-dvh flex items-center scroll-mt-24"
      >
        <div className="max-w-[1280px] mx-auto w-full">
          <div className="mb-12 gsap-reveal opacity-0">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight leading-[1.05]">
              Two ways we put<br />data to work.
            </h2>
            <p className="mt-5 text-white/60 text-base md:text-lg max-w-xl leading-relaxed">
              Two connected areas — building the data you need, and finding the answers inside the data you already have.
            </p>
          </div>
          
          <ServiceCards />
        </div>
      </section>

      {/* Section 04 — Why Mosaic? */}
      <section className="px-6 md:px-10 lg:px-12 py-32 bg-[#f9f8f6] w-full min-h-dvh flex items-center">
        <div className="max-w-[1280px] mx-auto w-full">
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-brand-maroon mb-16 gsap-reveal opacity-0 flex items-center gap-3">
            <span className="w-2 h-2 bg-brand-amber inline-block"></span>
            Why Mosaic?
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
            <div className="group gsap-reveal opacity-0 border-t border-brand-ink/10 pt-6 transition-colors duration-300 hover:border-brand-maroon/40">
              <span aria-hidden="true" className="mb-4 block h-2 w-2 bg-brand-sand transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber" />
              <h4 className="text-xl font-bold text-brand-ink mb-4">Purpose-Built Data</h4>
              <p className="text-brand-ink/70 leading-relaxed">Every project starts with the client's actual requirement.</p>
            </div>
            
            <div className="group gsap-reveal opacity-0 border-t border-brand-ink/10 pt-6 transition-colors duration-300 hover:border-brand-maroon/40">
              <span aria-hidden="true" className="mb-4 block h-2 w-2 bg-brand-sand transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber" />
              <h4 className="text-xl font-bold text-brand-ink mb-4">Real-World Collection</h4>
              <p className="text-brand-ink/70 leading-relaxed">We focus on gathering relevant information from the environments and markets that matter.</p>
            </div>

            <div className="group gsap-reveal opacity-0 border-t border-brand-ink/10 pt-6 transition-colors duration-300 hover:border-brand-maroon/40">
              <span aria-hidden="true" className="mb-4 block h-2 w-2 bg-brand-sand transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber" />
              <h4 className="text-xl font-bold text-brand-ink mb-4">Data Quality</h4>
              <p className="text-brand-ink/70 leading-relaxed">Data is cleaned, processed, and validated before delivery.</p>
            </div>

            <div className="group gsap-reveal opacity-0 border-t border-brand-ink/10 pt-6 transition-colors duration-300 hover:border-brand-maroon/40">
              <span aria-hidden="true" className="mb-4 block h-2 w-2 bg-brand-sand transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber" />
              <h4 className="text-xl font-bold text-brand-ink mb-4">Contextual Research</h4>
              <p className="text-brand-ink/70 leading-relaxed">We don't believe in one-size-fits-all market reports.</p>
            </div>

            <div className="group gsap-reveal opacity-0 border-t border-brand-ink/10 pt-6 transition-colors duration-300 hover:border-brand-maroon/40">
              <span aria-hidden="true" className="mb-4 block h-2 w-2 bg-brand-sand transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber" />
              <h4 className="text-xl font-bold text-brand-ink mb-4">Actionable Insights</h4>
              <p className="text-brand-ink/70 leading-relaxed">Our work is designed to support decisions, not just generate reports.</p>
            </div>
          </div>
        </div>
      </section>
      
      <SiteFooter />
    </div>
  );
}
