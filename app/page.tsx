import { AiDomainCard, JournalEntry, WorldCard } from "@/components/Cards";
import { DataRiver } from "@/components/DataRiver";
import { Intro } from "@/components/Intro";
import { EnergyCanvas, InfraCanvas, MiniViz } from "@/components/MiniCanvases";
import { PipelineLoop } from "@/components/PipelineLoop";
import { ArchCrosses, WorkBanner } from "@/components/WorkBanner";

const CAPABILITIES = [
  {
    viz: "infra",
    num: "01",
    tag: "Acquisition",
    title: "Multi-Channel Data Sourcing",
    body: "We acquire data where others cannot, combining open digital archives, active field deployments, and direct operational integrations with physical asset operators.",
    specs: [
      "Download: Public archives, government portals, and open APIs",
      "Capture: Drones, cameras, dashcams, and mobile sensory kits",
      "Partner: Bilateral data structuring with utilities and enterprises",
    ],
  },
  {
    viz: "intelligence",
    num: "02",
    tag: "Structuring & QA",
    title: "Annotation, Structuring & QA",
    body: "Raw signals are transformed into consistent, schema-standardized formats. Every record is cleaned, labeled, and validated against defined quality standards.",
    specs: [
      "Automated deduplication, format normalization, and cleanup",
      "High-precision domain annotation and semantic tagging",
      "Pre-delivery quality assurance benchmarks and schema validation",
    ],
  },
  {
    viz: "real",
    num: "03",
    tag: "Delivery & DaaS",
    title: "Data as a Service & Applied Models",
    body: "Mosaic is an ongoing partner, not a one-time vendor. We deliver versioned datasets, continuous feeds, full provenance documentation, and models trained on your data.",
    specs: [
      "Full chain-of-custody documentation and DPDP alignment",
      "Ongoing subscription feeds that refresh as reality changes",
      "Applied AI models tuned directly to your operating environment",
    ],
  },
] as const;

export default function HomePage() {
  return (
    <>
      <Intro />

      {/* 1. Hero & the living data river */}
      <section className="section hero-section" id="hero">
        <div className="container">
          <div className="hero-heading-block" data-reveal>
            <div className="section-eyebrow">Data as a Service</div>
            <h1 className="hero-display">
              Turning fragmented real-world data into <span className="accent-word">AI-ready datasets</span>.
            </h1>
            <p className="hero-desc">
              Every industry runs on data it cannot use: locked in PDFs, scattered across vendors, sitting unstructured
              in field reports, or never captured at all. Mosaic collects, processes, and structures real-world data
              into validated, high-integrity datasets that companies and institutions can actually build on.
            </p>
          </div>

          <DataRiver />
        </div>
      </section>

      {/* 2. The 7-stage pipeline */}
      <section className="section" id="loop-narrative">
        <ArchCrosses />
        <div className="container">
          <div data-reveal>
            <div className="section-eyebrow">The End-to-End Pipeline</div>
            <h2 className="section-title">From fragmented signals to AI-ready datasets.</h2>
            <p className="section-subtitle">
              AI models are only as good as the data behind them. Mosaic sits between raw, fragmented physical-world
              signals and the AI systems that need clean, structured, trustworthy data to work.
            </p>
          </div>

          <PipelineLoop />
        </div>
      </section>

      {/* 3. What we do */}
      <section className="section" id="what-we-do">
        <ArchCrosses />
        <div className="container">
          <div data-reveal>
            <div className="section-eyebrow">Core Capabilities</div>
            <h2 className="section-title">Engineered to deliver trustworthy data at scale.</h2>
            <p className="section-subtitle">
              Three interconnected capabilities spanning acquisition, rigorous structuring, and ongoing subscription
              delivery.
            </p>
          </div>

          <div className="capabilities-panels" data-reveal>
            {CAPABILITIES.map((c) => (
              <div className="editorial-panel" key={c.num}>
                <div>
                  <div className="panel-mini-viz">
                    <MiniViz type={c.viz} />
                  </div>
                  <div className="panel-header">
                    <span className="panel-num">{c.num}</span>
                    <span className="panel-tag">{c.tag}</span>
                  </div>
                  <h3 className="panel-title">{c.title}</h3>
                  <p className="panel-body">{c.body}</p>
                  <ul className="panel-specs">
                    {c.specs.map((s) => (
                      <li className="panel-spec-item" key={s}>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Domains */}
      <section className="section" id="solutions">
        <ArchCrosses />
        <div className="container">
          <div data-reveal>
            <div className="section-eyebrow">Enterprise Domains</div>
            <h2 className="section-title">Physical domains we empower.</h2>
            <p className="section-subtitle">
              Physical industries require specialized capture, expert annotation, and continuous ground-truth. We turn
              complex physical environments into structured datasets and applied models.
            </p>
          </div>

          <div className="solutions-world-grid" data-reveal>
            <WorldCard
              eyebrow="Domain 01"
              title="Energy & Utilities"
              canvas={<EnergyCanvas className="world-canvas" />}
              metrics={[
                ["SUBSCRIPTION FEEDS", "Continuous temporal updates"],
                ["SPATIAL & VISUAL", "Multi-modal ground-truth"],
              ]}
            >
              High-resolution solar and wind farm inspection imagery, transmission corridor mapping, vegetation
              encroachment tracking, and continuous asset condition monitoring feeds.
            </WorldCard>

            <WorldCard
              eyebrow="Domain 02"
              title="Roads & Transportation"
              canvas={<InfraCanvas className="world-canvas" />}
              metrics={[
                ["GEO-REFERENCED", "Survey-grade road mapping"],
                ["PRIVACY-REDACTED", "Automated face & plate blur"],
              ]}
            >
              Street-level pavement distress mapping, road sign and marking inventories, multi-angle lane geometry, and
              transport corridor datasets with automated privacy redaction.
            </WorldCard>

            <AiDomainCard eyebrow="Domain 03" />
          </div>
        </div>
      </section>

      {/* 5. About */}
      <section className="section" id="about">
        <ArchCrosses />
        <div className="container">
          <div className="about-manifesto" data-reveal>
            <div className="section-eyebrow">Our Foundation</div>
            <h2 className="about-headline">
              &quot;We are building the data layer between the physical world and artificial intelligence.&quot;
            </h2>

            <div className="about-pillars">
              <div>
                <div className="pillar-label">OUR MISSION</div>
                <h3 className="pillar-statement">Bridge the physical-to-digital intelligence gap.</h3>
                <p className="pillar-body">
                  Artificial intelligence is transforming every industry, but models are starved of high-quality,
                  ground-truth physical data. We acquire, clean, structure, and verify the physical datasets that power
                  the next generation of autonomy and enterprise intelligence.
                </p>
              </div>

              <div>
                <div className="pillar-label">LEGAL &amp; ETHICAL FOUNDATION</div>
                <h3 className="pillar-statement">Privacy by design and verifiable provenance.</h3>
                <p className="pillar-body">
                  Every dataset delivered by Mosaic adheres to strict chain-of-custody documentation, transparent
                  collection licensing, and automated PII redaction aligned with DPDP and international privacy
                  frameworks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Insights */}
      <section className="section" id="insights">
        <ArchCrosses />
        <div className="container">
          <div data-reveal>
            <div className="section-eyebrow">Perspectives &amp; Research</div>
            <h2 className="section-title">Field notes on real-world data infrastructure.</h2>
            <p className="section-subtitle">
              Insights on multi-modal acquisition, automated privacy redaction, and the shift from static datasets to
              continuous Data as a Service.
            </p>
          </div>

          <div className="insights-journal-list" data-reveal>
            <JournalEntry
              href="/insights"
              date="2026.08"
              category="STRATEGY"
              title="The Real-World Data Bottleneck: Why AI Progress Depends on Physical Ground-Truth"
            >
              Foundation models have consumed the public internet. The next breakthrough in robotics, energy, and
              infrastructure demands structured physical data that has never been indexed.
            </JournalEntry>
            <JournalEntry
              href="/insights"
              date="2026.06"
              category="COMPLIANCE"
              title="Privacy by Design in Real-World Computer Vision: Automated Redaction at Scale"
            >
              How automated PII redaction, facial blurring, and license plate masking enable high-performance vision
              training while maintaining strict alignment with privacy regulations.
            </JournalEntry>
            <JournalEntry
              href="/insights"
              date="2026.04"
              category="FOUNDATIONS"
              title="Beyond One-Off Datasets: Why Enterprises Are Moving to Data as a Service"
            >
              Physical operating environments evolve continuously. Why static benchmark datasets degrade rapidly and how
              subscription data feeds ensure model durability over time.
            </JournalEntry>
          </div>
        </div>
      </section>

      {/* 6.5 Blogs */}
      <section className="section" id="blogs">
        <ArchCrosses />
        <div className="container">
          <div data-reveal>
            <div className="section-eyebrow">Blogs</div>
            <h2 className="section-title">Latest Updates &amp; Stories.</h2>
            <p className="section-subtitle">
              News, company updates, and deeper dives into our ongoing projects and team culture.
            </p>
          </div>

          <div className="insights-journal-list" data-reveal>
            <JournalEntry
              href="#"
              date="2026.09"
              category="COMPANY"
              title="Welcome to Mosaic Labs: Our Vision for the Future"
            >
              A look into why we started Mosaic Labs and our mission to structure the physical world for AI models.
            </JournalEntry>
          </div>
        </div>
      </section>

      {/* 7. Work with us */}
      <WorkBanner title="Turn your physical domain into AI-ready intelligence." sectionStyle={{ paddingBottom: 40 }} />
    </>
  );
}
