import Link from "next/link";
import { EMAIL, PHONES, telHref } from "@/lib/inquiry";

const NAV = [
  { label: "Overview", href: "/" as const },
  { label: "Data Operations", href: "/data-operations" as const },
  { label: "Market Intelligence", href: "/market-intelligence" as const },
  { label: "Inquiry", href: "/inquiry" as const },
];

export function SiteFooter() {
  return (
    <footer className="bg-brand-maroon font-sans text-white">

      <div className="mx-auto w-full max-w-[1280px] px-6 py-16 md:px-10 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mosaic-mark-36.svg"
              alt="Mosaic Labs"
              className="h-9 w-auto object-contain brightness-0 invert"
            />
            <p className="mt-6 max-w-xs text-sm font-light leading-relaxed text-white/55">
              Raw reality in, decision-grade data out. One pipeline, two outputs.
            </p>
          </div>

          <nav className="md:col-span-3">
            <span className="eyebrow eyebrow--invert">Site</span>
            <ul className="mt-6 flex flex-col gap-3">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="underline-grow text-sm font-medium text-white/75 transition-colors hover:text-white"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <span className="eyebrow eyebrow--invert">Reach us</span>
            <ul className="mt-6 flex flex-col gap-3">
              <li>
                <a
                  href={`mailto:${EMAIL}`}
                  className="underline-grow text-sm font-medium text-white/75 transition-colors hover:text-white"
                >
                  {EMAIL}
                </a>
              </li>
              {PHONES.map((phone) => (
                <li key={phone}>
                  <a
                    href={telHref(phone)}
                    className="underline-grow font-mono text-sm text-white/75 tabular-nums transition-colors hover:text-white"
                  >
                    {phone}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-7 text-xs font-light text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <span>&copy; {new Date().getFullYear()} Mosaic Labs. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-brand-amber" aria-hidden="true" />
            Built in India
          </span>
        </div>
      </div>
    </footer>
  );
}
