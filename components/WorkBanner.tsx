import type { CSSProperties } from "react";
import { ConsultButton } from "./Consultation";

export function WorkBanner({ title, sectionStyle }: { title: string; sectionStyle?: CSSProperties }) {
  return (
    <section className="section" style={{ borderBottom: "none", ...sectionStyle }}>
      <div className="container">
        <div className="work-banner" data-reveal>
          <div className="work-banner-inner">
            <div className="section-eyebrow" style={{ color: "var(--accent-amber)" }}>
              Initiate Pipeline
            </div>
            <h2 className="work-banner-title">{title}</h2>
            <p className="work-banner-desc">
              Whether you need targeted collection campaigns, continuous subscription feeds, or specialized model
              fine-tuning, Mosaic delivers reliable, structured datasets.
            </p>
            <ConsultButton className="cta-pill cta-pill-solid">
              Request Data Consultation <span className="arrow-icon">→</span>
            </ConsultButton>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The "+" registration marks at the top corners of a section. */
export function ArchCrosses() {
  return (
    <>
      <span className="arch-cross tl">+</span>
      <span className="arch-cross tr">+</span>
    </>
  );
}
