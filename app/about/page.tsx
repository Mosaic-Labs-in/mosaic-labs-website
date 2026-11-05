import type { Metadata } from "next";
import { ArchCrosses, WorkBanner } from "@/components/WorkBanner";

export const metadata: Metadata = {
  title: "About | Mosaic Labs",
  description:
    "We are building the data layer between the physical world and artificial intelligence. Turning fragmented real-world data into AI-ready datasets.",
};

const BARRIERS = [
  [
    "1. Fragmented",
    "Real-world data is scattered across thousands of disconnected sensors, regional operators, public archives, and legacy databases with no central standard.",
  ],
  [
    "2. Unstructured",
    "Raw physical video, aerial imagery, and sensor telemetry lack consistent coordinate systems, temporal alignment, and normalized metadata.",
  ],
  [
    "3. Inaccessible",
    "High-value physical domains lack legal, commercial, and operational channels for acquiring clean, compliant data at production scale.",
  ],
  [
    "4. Unlabeled",
    "Machine learning models require domain-expert annotations, such as crop disease identification or structural defect classification, that commodity crowd-labeling cannot reliably deliver.",
  ],
  [
    "5. Untrustworthy",
    "Without documented chain of custody, verified licensing, and automated PII redaction, enterprise models face catastrophic compliance and performance liabilities.",
  ],
];

export default function AboutPage() {
  return (
    <>
      <section className="section hero-section" style={{ minHeight: "65vh", paddingTop: 160 }}>
        <div className="container">
          <div className="section-eyebrow" data-reveal>
            About Mosaic Labs
          </div>
          <h1 className="hero-display" style={{ maxWidth: 980 }} data-reveal>
            &quot;We are building the data layer between the physical world and artificial intelligence.&quot;
          </h1>
          <p className="hero-desc" style={{ maxWidth: 680 }} data-reveal>
            Artificial intelligence models are hungry for real-world understanding, but physical data is messy,
            fragmented, and locked away. We solve the entire pipeline to turn physical reality into structured,
            AI-ready datasets.
          </p>
        </div>
      </section>

      <section className="section">
        <ArchCrosses />
        <div className="container">
          <div className="about-pillars">
            <div data-reveal>
              <div className="pillar-label">OUR MISSION</div>
              <h2 className="pillar-statement">Bridge the physical-to-digital intelligence gap.</h2>
              <p className="pillar-body">
                Compute and algorithm architectures have accelerated exponentially, but physical data capture remains
                analog, noisy, and fragmented. We acquire, clean, structure, and verify real-world data so machine
                learning models can perceive and reason about physical reality.
              </p>
            </div>

            <div data-reveal>
              <div className="pillar-label">LEGAL &amp; ETHICAL STANDARD</div>
              <h2 className="pillar-statement">Privacy by design and verifiable provenance.</h2>
              <p className="pillar-body">
                We treat legal compliance, privacy, and data ethics as engineering absolutes. Every dataset delivered by
                Mosaic undergoes automated PII redaction, adheres to transparent licensing frameworks, and maintains
                auditable chain-of-custody documentation aligned with DPDP and international privacy standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <ArchCrosses />
        <div className="container">
          <div data-reveal style={{ maxWidth: 860 }}>
            <div className="section-eyebrow">The Real-World Problem</div>
            <h2 className="section-title">The Five Barriers to Physical AI</h2>
            <p className="section-subtitle" style={{ marginBottom: 32 }}>
              Web text and synthetic images are abundant, but training physical AI requires ground-truth data from the
              actual world. Today, that data suffers from five fundamental problems:
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {BARRIERS.map(([title, body]) => (
                <div key={title} style={{ borderLeft: "2px solid var(--burgundy)", paddingLeft: 20 }}>
                  <h3
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 20,
                      fontWeight: 600,
                      color: "var(--ink-primary)",
                      marginBottom: 6,
                    }}
                  >
                    {title}
                  </h3>
                  <p className="panel-body" style={{ margin: 0 }}>
                    {body}
                  </p>
                </div>
              ))}
            </div>

            <p className="section-subtitle" style={{ marginTop: 36 }}>
              Mosaic Labs eliminates these five barriers by building an integrated, end-to-end data pipeline:
              multi-channel sourcing, automated redaction, expert annotation, rigorous quality assurance, and ongoing
              Data as a Service delivery.
            </p>
          </div>
        </div>
      </section>

      <WorkBanner title="Build your domain's data foundation." />
    </>
  );
}
