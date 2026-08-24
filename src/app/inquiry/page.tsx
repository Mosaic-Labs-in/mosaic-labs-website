import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { MosaicField } from "@/components/MosaicField";
import { Reveal } from "@/components/Reveal";
import { InquiryForm } from "@/components/InquiryForm";
import { DIRECT, STEPS } from "@/lib/inquiry";

const DESCRIPTION =
  "Send Mosaic Labs a sample, a schema, or just the problem. A person reads every inquiry that arrives, and you get a scoped reply within one working day.";

export const metadata: Metadata = {
  title: "Inquiry | Mosaic Labs",
  description: DESCRIPTION,
  alternates: { canonical: "/inquiry" },
  openGraph: {
    type: "website",
    title: "Inquiry | Mosaic Labs",
    description: DESCRIPTION,
    url: "/inquiry",
  },
  twitter: {
    card: "summary_large_image",
    title: "Inquiry | Mosaic Labs",
    description: DESCRIPTION,
  },
};

const SIGNALS = [
  { value: "1 day", label: "First reply, on a working day" },
  { value: "NDA", label: "Signed before any sample moves" },
  { value: "No lock-in", label: "Pilot first, commit after" },
];

export default function InquiryPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col bg-white font-sans text-brand-ink">
      <Navbar />

      {/* Logo, scrolls away with the page like it does on the home route */}
      <div className="absolute left-0 top-0 z-30 px-5 py-5 sm:px-6 sm:py-8 md:px-12">
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
        <section className="relative isolate overflow-hidden">
          <MosaicField size={92} low={0.1} high={0.3} radius={230} />

          {/* Fades the tile field out toward the form below it */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white"
          />

          <div className="relative mx-auto w-full max-w-[1280px] px-5 pb-16 pt-28 sm:px-6 sm:pt-32 md:px-10 md:pb-24 md:pt-44 lg:pt-48">
            <Reveal>
              <h1 className="max-w-4xl text-[clamp(2rem,8.5vw,5rem)] font-black leading-[1.10] tracking-[0.04em] text-brand-maroon font-molgan">
                Bring us the data
                <br className="hidden sm:block" />{" "}
                that won&apos;t behave.
              </h1>

              <p className="mt-8 max-w-xl text-base font-light leading-relaxed text-brand-ink/65 md:text-lg">
                Send a sample, a schema, or just the problem. The more you can tell
                us about where the data comes from and where it breaks, the more
                useful the first reply will be.
              </p>
            </Reveal>

            {/* Signal band */}
            <Reveal
              // White ground with divider rules rather than a tinted container
              // behind gap-px: the cells fade in, and a tinted container shows
              // through as a bare slab until they land.
              className="mt-14 grid divide-y divide-brand-maroon/12 overflow-hidden border border-brand-maroon/12 bg-white sm:grid-cols-3 sm:divide-x sm:divide-y-0 md:mt-20"
              stagger={0.12}
            >
              {SIGNALS.map((signal) => (
                <div
                  key={signal.value}
                  className="group bg-white p-6 transition-colors duration-300 hover:bg-brand-sand/50 md:p-8"
                >
                  <div className="flex items-center gap-3">
                    <span
                      aria-hidden="true"
                      className="h-2.5 w-2.5 bg-brand-sand transition-all duration-300 group-hover:rotate-45 group-hover:bg-brand-amber"
                    />
                    <span className="text-xl font-extrabold tracking-tight text-brand-maroon md:text-2xl">
                      {signal.value}
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-light leading-relaxed text-brand-ink/55">
                    {signal.label}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Form + sidebar ───────────────────────────────────────────── */}
        <section className="relative isolate overflow-hidden">
          <MosaicField
            className="mosaic-field--edges hidden lg:block"
            size={92}
            low={0.07}
            high={0.2}
            radius={230}
          />

          <div className="relative mx-auto w-full max-w-[1280px] px-5 pb-20 sm:px-6 md:px-10 md:pb-32">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
              <Reveal className="lg:col-span-7">
                <div className="border border-brand-maroon/15 bg-white p-5 sm:p-8 md:p-11">
                  {/* The form reads ?service= to preselect a chip when someone
                      arrives from a service page, and useSearchParams needs a
                      boundary for this route to stay statically prerendered. */}
                  <Suspense fallback={<div className="min-h-[760px]" />}>
                    <InquiryForm />
                  </Suspense>
                </div>
              </Reveal>

              <div className="lg:col-span-5">
                {/* What happens next */}
                <Reveal delay={0.08}>
                  <span className="eyebrow">What happens next</span>

                  <ol className="mt-8 flex flex-col">
                    {STEPS.map((step) => (
                      <li
                        key={step.index}
                        className="group flex gap-5 border-b border-brand-maroon/10 py-7 first:pt-0 last:border-b-0"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-brand-sand font-mono text-xs font-bold tracking-widest text-brand-maroon transition-colors duration-300 group-hover:bg-brand-amber">
                          {step.index}
                        </span>
                        <div>
                          <h3 className="text-base font-extrabold tracking-tight text-brand-maroon">
                            {step.title}
                          </h3>
                          <p className="mt-2.5 text-sm font-light leading-relaxed text-brand-ink/60">
                            {step.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Reveal>

                {/* Direct contact */}
                <Reveal delay={0.16}>
                  <div className="mt-12 bg-brand-maroon p-7 text-white md:p-9">
                    <span className="eyebrow eyebrow--invert">Or reach us directly</span>

                    <dl className="mt-7 flex flex-col">
                      {DIRECT.map((item, index) => (
                        <div
                          key={`${item.label}-${index}`}
                          className="flex flex-col gap-1 border-b border-white/10 py-3.5 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                        >
                          <dt className="text-xs font-light text-white/45">{item.label}</dt>
                          <dd className="text-sm text-white/90">
                            {item.href ? (
                              <a href={item.href} className="transition-colors hover:text-brand-amber">
                                {item.value}
                              </a>
                            ) : (
                              item.value
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </Reveal>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
