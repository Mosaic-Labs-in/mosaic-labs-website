"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { MosaicField } from "@/components/MosaicField";
import { Reveal } from "@/components/Reveal";
import { SplitHeading } from "@/components/SplitHeading";
import { Magnetic } from "@/components/Magnetic";
import { CountUp } from "@/components/CountUp";
import { PipelineFlow } from "@/components/PipelineFlow";
import { CapabilityCards } from "@/components/CapabilityCards";
import type { ServicePage } from "@/lib/services";

/** Shared layout for both service routes; only the content differs. */
export function ServicePageBody({ page }: { page: ServicePage }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white font-sans text-brand-ink">
      <Navbar />

      <div className="absolute top-0 left-0 px-6 md:px-12 py-8 z-30">
        <Link href="/" aria-label="Mosaic Labs home" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/mosaic-mark-36.svg"
            alt="Mosaic Labs"
            className="h-9 w-auto object-contain transition-opacity duration-300 hover:opacity-60"
          />
        </Link>
      </div>

      <main className="flex-1">
        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="relative isolate flex w-full min-h-dvh items-center overflow-hidden px-6 md:px-10 lg:px-12 pt-24 pb-20">
          <MosaicField size={92} low={0.1} high={0.3} radius={230} />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
          />

          <div className="relative max-w-[1280px] mx-auto w-full">
            <Reveal>
              <span className="eyebrow">{page.eyebrow}</span>
            </Reveal>

            <SplitHeading
              text={page.headline}
              as="h1"
              immediate
              delay={0.15}
              className="mt-6 max-w-4xl text-[clamp(2rem,7.5vw,4.5rem)] font-black leading-[1.10] tracking-[0.04em] text-brand-maroon font-molgan"
            />

            <Reveal delay={0.3}>
              <p className="mt-8 max-w-2xl text-base font-light leading-relaxed text-brand-ink/65 md:text-lg">
                {page.intro}
              </p>
            </Reveal>

            <Reveal delay={0.4}>
              <Magnetic strength={10}>
                <Link
                  href="/inquiry"
                  className="btn-wipe group mt-10 inline-flex items-center gap-3 px-8 py-4 text-sm font-bold tracking-wide"
                >
                  Start an inquiry
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </Magnetic>
            </Reveal>

            {/* Stats. Ruled, not filled: a tinted container reads as a bare
                slab for as long as its cells are still animating in. */}
            <Reveal
              className="mt-16 grid gap-y-9 border-t border-brand-maroon/15 pt-10 sm:grid-cols-3 sm:gap-y-0 md:mt-20"
              stagger={0.12}
            >
              {page.stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className={`group sm:pr-8 ${
                    index > 0 ? "sm:border-l sm:border-brand-maroon/15 sm:pl-8" : ""
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <CountUp
                      to={stat.value}
                      prefix={stat.prefix}
                      suffix={stat.suffix}
                      className="text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-tight text-brand-maroon tabular-nums"
                    />
                    <span
                      aria-hidden="true"
                      className="h-2 w-2 shrink-0 bg-brand-sand transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber"
                    />
                  </div>
                  <p className="mt-4 max-w-[15rem] text-sm font-light leading-relaxed text-brand-ink/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Pipeline ─────────────────────────────────────────────────── */}
        <section className="px-6 md:px-10 lg:px-12 py-24 bg-brand-ink text-white w-full min-h-dvh flex items-center">
          <div className="max-w-[1280px] mx-auto w-full">
            <Reveal>
              <span className="eyebrow eyebrow--invert">How the work runs</span>
            </Reveal>

            <SplitHeading
              text={"Every project moves\nthrough the same gates."}
              className="mt-6 max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.22] tracking-[0.04em] text-white font-molgan"
            />

            <div className="mt-14">
              <PipelineFlow steps={page.pipeline} tone="dark" />
            </div>

            <Reveal delay={0.2}>
              <p className="mt-12 max-w-xl text-sm font-light leading-relaxed text-white/50">
                Hover a stage to isolate it. Nothing moves to the next gate until
                the previous one is signed off.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── Capabilities ─────────────────────────────────────────────── */}
        <section className="px-6 md:px-10 lg:px-12 py-24 w-full min-h-dvh flex items-center">
          <div className="max-w-[1280px] mx-auto w-full">
            <Reveal>
              <span className="eyebrow">What we take on</span>
            </Reveal>

            <SplitHeading
              text={"Pick the one that\nsounds like your problem."}
              className="mt-6 mb-14 max-w-3xl text-[clamp(1.75rem,4.5vw,3rem)] font-bold leading-[1.22] tracking-[0.04em] text-brand-maroon font-molgan"
            />

            <CapabilityCards items={page.capabilities} />
          </div>
        </section>

        {/* ── Deliverables ─────────────────────────────────────────────── */}
        <section className="px-6 md:px-10 lg:px-12 py-24 bg-brand-sand/40 w-full min-h-dvh flex items-center">
          <div className="max-w-[1280px] mx-auto w-full">
            <Reveal>
              <span className="eyebrow">What lands on your side</span>
            </Reveal>

            <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-3">
              {page.deliverables.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08}>
                  <div className="group border-t border-brand-maroon/15 pt-6">
                    <span className="font-mono text-xs tracking-widest text-brand-ink/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-4 text-xl font-extrabold tracking-tight text-brand-maroon">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm font-light leading-relaxed text-brand-ink/65">
                      {item.body}
                    </p>
                    <span
                      aria-hidden="true"
                      className="mt-6 block h-[3px] w-0 bg-brand-amber transition-all duration-500 ease-out group-hover:w-16"
                    />
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Closing CTA ──────────────────────────────────────────────── */}
        <section className="relative isolate px-6 md:px-10 lg:px-12 py-24 bg-brand-maroon text-white w-full min-h-dvh flex items-center overflow-hidden">
          <MosaicField
            size={78}
            tile="#ffffff"
            glow="var(--color-brand-amber)"
            low={0.04}
            high={0.14}
            radius={200}
          />

          <div className="relative max-w-[1280px] mx-auto w-full">
            <SplitHeading
              text={page.closing.headline}
              className="max-w-3xl text-[clamp(2rem,6vw,4rem)] font-black leading-[1.2] tracking-[0.04em] text-white font-molgan"
            />

            <Reveal delay={0.2}>
              <p className="mt-7 max-w-xl text-base font-light leading-relaxed text-white/60">
                {page.closing.body}
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <Magnetic strength={12}>
                <Link
                  href="/inquiry"
                  className="group mt-10 inline-flex items-center gap-3 bg-brand-amber px-8 py-4 text-sm font-bold tracking-wide text-brand-maroon transition-transform duration-300 hover:-translate-y-0.5"
                >
                  Start an inquiry
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
