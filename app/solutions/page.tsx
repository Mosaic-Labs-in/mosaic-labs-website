import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AiDomainCard, WorldCard, WorldMetrics } from "@/components/Cards";
import { EnergyCanvas, InfraCanvas } from "@/components/MiniCanvases";
import { ArchCrosses, WorkBanner } from "@/components/WorkBanner";

export const metadata: Metadata = {
  title: "Solutions | Mosaic Labs",
  description:
    "Mosaic Labs solutions across physical domains: Agriculture, Energy & Utilities, Roads, Infrastructure, Disaster Response, and Manufacturing.",
};

function Sector({
  eyebrow,
  title,
  details,
  metrics,
  canvas,
  footer,
}: {
  eyebrow: string;
  title: string;
  details: string[];
  metrics: [string, string][];
  canvas: ReactNode;
  footer: [string, string][];
}) {
  return (
    <section className="section">
      <ArchCrosses />
      <div className="container">
        <div className="problem-grid" style={{ alignItems: "flex-start" }}>
          <div data-reveal>
            <div className="section-eyebrow">{eyebrow}</div>
            <h2 className="problem-statement">{title}</h2>
            {details.map((d) => (
              <p className="problem-detail" key={d}>
                {d}
              </p>
            ))}
            <WorldMetrics metrics={metrics} style={{ marginTop: 36 }} />
          </div>

          <div className="problem-visualizer" data-reveal>
            <div className="problem-canvas-container">{canvas}</div>
            <div className="problem-visual-footer">
              {footer.map(([label, tag]) => (
                <span key={label}>
                  {label}: <span className="metric-tag">{tag}</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function SolutionsPage() {
  return (
    <>
      <section className="section hero-section subpage-hero">
        <div className="container">
          <div className="section-eyebrow" data-reveal>
            Enterprise Domains
          </div>
          <h1 className="section-title" style={{ fontSize: "clamp(36px, 5.5vw, 68px)" }} data-reveal>
            Solutions for Complex Physical Worlds.
          </h1>
          <p className="section-subtitle" data-reveal>
            Physical industries require specialized data capture, expert annotation, and continuous ground-truth. We
            turn complex physical environments into structured datasets and applied models.
          </p>
        </div>
      </section>

      <Sector
        eyebrow="Sector 01"
        title="Energy & Utilities"
        details={[
          "Grid modernization, renewable energy expansion, and utility asset management require continuous visibility across thousands of distributed physical miles.",
          "Mosaic delivers transmission corridor mapping, solar and wind farm inspection imagery, vegetation encroachment tracking, and utility easement datasets formatted for immediate AI integration.",
        ]}
        metrics={[
          ["SUBSCRIPTION FEEDS", "Continuous temporal updates"],
          ["SPATIAL & VISUAL", "High-resolution inspection ground-truth"],
        ]}
        canvas={<EnergyCanvas />}
        footer={[
          ["ASSET CONDITION", "MONITORED"],
          ["TRANSMISSION CORRIDOR", "VERIFIED"],
        ]}
      />

      <Sector
        eyebrow="Sector 02"
        title="Roads & Transportation"
        details={[
          "Autonomous mobility, roadway asset management, and municipal transportation systems depend on survey-grade, geo-referenced, and privacy-compliant physical datasets.",
          "Mosaic captures and structures street-level pavement distress data, road sign and marking inventories, multi-angle lane geometry, and transport corridors with automated PII redaction.",
        ]}
        metrics={[
          ["GEO-REFERENCED", "Survey-grade road mapping"],
          ["PRIVACY-REDACTED", "Automated face & plate blur"],
        ]}
        canvas={<InfraCanvas />}
        footer={[
          ["ROAD NETWORK", "MAPPED"],
          ["PRIVACY REDACTION", "ENFORCED"],
        ]}
      />

      <section className="section">
        <ArchCrosses />
        <div className="container">
          <div data-reveal>
            <div className="section-eyebrow">Sector Breadth</div>
            <h2 className="section-title">Specialized Domain Coverage.</h2>
            <p className="section-subtitle">
              Beyond energy and transportation corridors, Mosaic builds custom pipelines and subscription feeds across
              core physical industries.
            </p>
          </div>

          <div className="solutions-world-grid" data-reveal>
            <WorldCard
              eyebrow="Domain 03"
              title="Agriculture & Food Systems"
              metrics={[
                ["MULTISPECTRAL", "Aerial & satellite feeds"],
                ["AGRONOMIC EXPERT", "Ground-truth labels"],
              ]}
            >
              Multispectral and hyperspectral crop health imagery, soil condition datasets, yield prediction training
              sets, agricultural machinery telemetry, and agronomic expert annotations.
            </WorldCard>

            <WorldCard
              eyebrow="Domain 04"
              title="Infrastructure & Built Environment"
              metrics={[
                ["ASSET INTEGRITY", "Sub-millimeter distress"],
                ["DIGITAL TWIN", "Photogrammetric 3D"],
              ]}
            >
              Construction progress aerial capture, structural inspection imagery, bridge and tunnel condition
              assessments, and urban digital twin baseline data with precise spatial referencing.
            </WorldCard>

            <WorldCard
              eyebrow="Domain 05"
              title="Disaster Response & Climate"
              metrics={[
                ["RAPID CAPTURE", "Emergency campaign dispatch"],
                ["MULTI-TEMPORAL", "Pre- & post-event baselines"],
              ]}
            >
              Post-storm damage assessment imagery, flood inundation tracking, wildfire perimeter monitoring, and
              climate resilience modeling datasets ready for rapid emergency response.
            </WorldCard>

            <WorldCard
              eyebrow="Domain 06"
              title="Manufacturing & Industrial AI"
              metrics={[
                ["HIGH DEFECT FIDELITY", "Micro-fracture & surface flaw"],
                ["BENCHMARK READY", "COCO & YOLO formatted"],
              ]}
            >
              Factory floor computer vision, defect inspection datasets, equipment condition monitoring, and industrial
              safety compliance verification feeds for manufacturing intelligence.
            </WorldCard>

            <AiDomainCard eyebrow="Domain 07" />
          </div>
        </div>
      </section>

      <WorkBanner title="Build your domain's data foundation." />
    </>
  );
}
