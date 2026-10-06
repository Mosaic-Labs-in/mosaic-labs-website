import type { Metadata } from "next";
import { JournalEntry } from "@/components/Cards";
import { ArchCrosses, WorkBanner } from "@/components/WorkBanner";

export const metadata: Metadata = {
  title: "Insights | Mosaic Labs",
  description:
    "Field notes, technical analysis, and strategic perspectives on real-world data infrastructure, privacy compliance, and physical AI.",
};

export default function InsightsPage() {
  return (
    <>
      <section className="section hero-section" style={{ minHeight: "52vh", paddingTop: 140 }}>
        <div className="container">
          <div className="section-eyebrow" data-reveal>
            Research &amp; Publications
          </div>
          <h1 className="section-title" style={{ fontSize: "clamp(36px, 5.5vw, 68px)" }} data-reveal>
            The Mosaic Journal.
          </h1>
          <p className="section-subtitle" data-reveal>
            Field notes, technical analysis, and strategic perspectives on real-world data infrastructure, privacy
            compliance, and physical AI.
          </p>
        </div>
      </section>

      <section className="section">
        <ArchCrosses />
        <div className="container">
          <div className="insights-journal-list">
            <JournalEntry
              reveal
              heading="h2"
              href="#"
              date="2026.08"
              category="STRATEGY"
              title="The Real-World Data Bottleneck: Why AI Progress Depends on Physical Ground-Truth"
            >
              Foundation models have consumed the public web. The next frontier in robotics, energy, and physical
              automation demands high-quality, ground-truth data from the physical layer that has never been digitized.
            </JournalEntry>
            <JournalEntry
              reveal
              heading="h2"
              href="#"
              date="2026.06"
              category="COMPLIANCE"
              title="Privacy by Design in Real-World Computer Vision: Automated Redaction at Scale"
            >
              How automated PII redaction, facial blurring, and license plate masking enable high-performance vision
              training while maintaining strict alignment with DPDP and international privacy frameworks.
            </JournalEntry>
            <JournalEntry
              reveal
              heading="h2"
              href="#"
              date="2026.04"
              category="DATA ARCHITECTURE"
              title="Beyond One-Off Datasets: Why Enterprises Are Moving to Data as a Service"
            >
              Physical operating environments evolve continuously. Why static benchmark datasets degrade rapidly and how
              subscription data feeds ensure model durability over time.
            </JournalEntry>
            <JournalEntry
              reveal
              heading="h2"
              href="#"
              date="2026.02"
              category="METHODOLOGY"
              title="Bridging the Agronomic Annotation Gap: From Raw Aerial Imagery to Actionable Yield Insights"
            >
              Examining why general-purpose crowd labeling fails on specialized agricultural data, and how domain-expert
              annotation networks produce high-fidelity crop health models.
            </JournalEntry>
          </div>
        </div>
      </section>

      <WorkBanner title="Build your domain's data foundation." />
    </>
  );
}
