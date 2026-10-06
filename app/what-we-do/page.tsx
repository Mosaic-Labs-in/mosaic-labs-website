import type { Metadata } from "next";
import { MiniViz } from "@/components/MiniCanvases";
import { ArchCrosses, WorkBanner } from "@/components/WorkBanner";

export const metadata: Metadata = {
  title: "What We Do | Mosaic Labs",
  description:
    "Multi-channel data sourcing, annotation and quality assurance, and Data as a Service delivery for physical-world AI.",
};

const PANELS = [
  {
    viz: "infra",
    num: "01",
    tag: "Acquisition",
    title: "Multi-Channel Sourcing",
    body: "We acquire physical-world data across three primary channels: curated public repositories, targeted on-demand capture campaigns, and exclusive data partnerships with domain operators.",
    specs: [
      "Curated open-access & public repository ingestion with copyright auditing",
      "Custom field capture campaigns: aerial drones, LiDAR, dashcams, and IoT sensors",
      "Commercial partnership networks with fleet, utility, and infrastructure operators",
    ],
  },
  {
    viz: "intelligence",
    num: "02",
    tag: "Quality & Verification",
    title: "Annotation & Structuring",
    body: "Raw sensor signals are normalized, cleaned, and labeled to exacting standards. Automated PII redaction and domain-expert validation ensure privacy and benchmark-grade accuracy.",
    specs: [
      "Automated privacy redaction: facial blurring & license plate masking (DPDP-aligned)",
      "Domain-expert annotation: 2D/3D bounding boxes, semantic segmentation & spatial metadata",
      "Multi-tier QA: automated statistical validation + human expert peer review",
    ],
  },
  {
    viz: "real",
    num: "03",
    tag: "Delivery & Intelligence",
    title: "Data as a Service & Models",
    body: "We deliver structured datasets formatted for instant AI model consumption, provide ongoing subscription feeds that refresh as reality changes, and train applied domain models directly.",
    specs: [
      "Immediate format ingestion: COCO, YOLO, GeoJSON, Parquet, and custom schemas",
      "Ongoing subscription feeds that continuously refresh as physical environments change",
      "Specialized applied AI models tuned directly to your operating domain",
    ],
  },
] as const;

export default function WhatWeDoPage() {
  return (
    <>
      <section className="section hero-section" style={{ minHeight: "52vh", paddingTop: 140 }}>
        <div className="container">
          <div className="section-eyebrow" data-reveal>
            Core Capabilities
          </div>
          <h1 className="section-title" style={{ fontSize: "clamp(36px, 5.5vw, 68px)" }} data-reveal>
            The Architecture of Real-World Data.
          </h1>
          <p className="section-subtitle" data-reveal>
            Three integrated capabilities that turn fragmented physical reality into clean, structured, and auditable
            datasets for artificial intelligence.
          </p>
        </div>
      </section>

      <section className="section">
        <ArchCrosses />
        <div className="container">
          <div className="capabilities-panels">
            {PANELS.map((p) => (
              <div className="editorial-panel" data-reveal key={p.num}>
                <div>
                  <div className="panel-mini-viz">
                    <MiniViz type={p.viz} />
                  </div>
                  <div className="panel-header">
                    <span className="panel-num">{p.num}</span>
                    <span className="panel-tag">{p.tag}</span>
                  </div>
                  <h2 className="panel-title">{p.title}</h2>
                  <p className="panel-body">{p.body}</p>
                  <ul className="panel-specs">
                    {p.specs.map((s) => (
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

      <WorkBanner title="Turn your physical domain into AI-ready intelligence." />
    </>
  );
}
