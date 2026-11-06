import type { Metadata } from "next";
import Link from "next/link";
import { ArchCrosses } from "@/components/WorkBanner";
import { InspectionHeroCanvas } from "@/components/MiniCanvases";

export const metadata: Metadata = {
  title: "Infrastructure Inspection Data | Mosaic Labs",
  description:
    "Processing labor and quality control on existing infrastructure inspection data: road surface scans, bridge and dam drone imagery, and highway footage.",
};

export default function InfrastructureDataPage() {
  return (
    <>
      {/* A. Hero */}
      <section
        className="section hero-section"
        style={{ minHeight: "auto", paddingTop: "clamp(88px, 12vw, 120px)", paddingBottom: 20 }}
      >
        <div className="container">
          <div className="domain-breadcrumb" data-reveal>
            <Link href="/#solutions">← Enterprise Domains</Link>
            <span className="crumb-sep">/</span>
            <span>Domain 02: Infrastructure Inspection</span>
          </div>

          <div className="section-eyebrow" data-reveal>
            Enterprise Domain 02 // Infrastructure
          </div>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(30px, 4.4vw, 52px)", maxWidth: 960 }}
            data-reveal
          >
            Inspection Data Labeling &amp; Quality Control
          </h1>
          <p
            className="section-subtitle"
            style={{ maxWidth: 800, fontSize: 15.5, lineHeight: 1.6 }}
            data-reveal
          >
            Infrastructure owners and survey contractors collect road surface scans, bridge and dam drone imagery, and
            highway dashcam footage, but defect review takes far longer than capture. Mosaic Labs reviews, annotates,
            and verifies existing inspection imagery against standard defect taxonomies and IRC standards, delivering
            structured datasets formatted directly to client specifications.
          </p>

          {/* Technical visual hero canvas */}
          <div className="domain-hero-visual" style={{ margin: "28px 0 0 0" }} data-reveal>
            <div className="domain-canvas-viewport" style={{ height: "clamp(200px, 26vw, 280px)" }}>
              <InspectionHeroCanvas className="world-canvas" />
            </div>
            <div className="domain-visual-meta">
              <div>
                <span>
                  DATA INTAKE: <span className="meta-tag">ROAD SCANS · DRONE IMAGERY · DASHCAM FOOTAGE</span>
                </span>
                <span style={{ marginLeft: 18 }}>
                  TAXONOMIES: <span className="meta-tag">IRC CODES · CLIENT DEFECT LISTS</span>
                </span>
              </div>
              <div>
                <span>OUTPUT: STRUCTURED DEFECT DATASETS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Domain overview */}
      <section className="section" style={{ padding: "40px 0" }}>
        <ArchCrosses />
        <div className="container">
          <div data-reveal style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Domain Overview</div>
            <h2
              className="problem-statement"
              style={{ fontSize: "clamp(24px, 3.2vw, 36px)", lineHeight: 1.25, maxWidth: 860 }}
            >
              The Data Bottleneck in Physical Infrastructure
            </h2>
            <p className="problem-detail" style={{ fontSize: 14.5, lineHeight: 1.65, maxWidth: 820 }}>
              Automated survey vehicles can capture hundreds of kilometres of highway a day, and drones routinely
              record thousands of high-resolution images of bridges and dams. However, turning raw visual records into
              actionable engineering data requires reviewing each frame for distress, categorizing defects by severity,
              and ensuring consistent reporting across entire networks.
            </p>
          </div>

          <div className="domain-tri-grid" style={{ marginTop: 0, gap: 18 }} data-reveal>
            <div className="domain-card-spec" style={{ padding: "24px 20px" }}>
              <div className="domain-step-num">01 / VOLUME</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Repeating Survey Volumes
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                Regular network surveys on national highways and state roads generate vast image sequences that quickly
                outpace manual in-house review bandwidth.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "24px 20px" }}>
              <div className="domain-step-num">02 / TAXONOMY</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Defect Standardization
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                Defects must be classified by type and severity against standardized criteria (such as IRC codes) to be
                legally valid and engineering-ready.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "24px 20px" }}>
              <div className="domain-step-num">03 / QUALITY</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Verification &amp; QA
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                Multi-reviewer sampling and consistency checks verify label accuracy, while correcting false detections
                from automated computer vision tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* C. What we deliver */}
      <section className="section" style={{ padding: "40px 0" }}>
        <ArchCrosses />
        <div className="container">
          <div data-reveal style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Capabilities &amp; Deliverables</div>
            <h2 className="section-title" style={{ fontSize: "clamp(24px, 3.4vw, 40px)", marginBottom: 8 }}>
              What We Deliver
            </h2>
            <p className="section-subtitle" style={{ fontSize: 14.5, marginBottom: 0 }}>
              A systematic data processing service transforming raw visual inspection feeds into verified defect
              records.
            </p>
          </div>

          <div className="domain-quad-grid" style={{ marginTop: 0, gap: 18 }} data-reveal>
            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <div className="domain-step-num">01 / DATA INTAKE</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Inspection Imagery
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Road surface scans, vehicle-mounted camera frames, drone photography of bridges and dams, and highway
                dashcam footage collected during field surveys.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <div className="domain-step-num">02 / ANNOTATION</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Defect Labeling
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Systematic marking and classification of defects—including cracks, potholes, ravelling, spalling, and
                corrosion—graded by type and severity against standard defect lists.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <div className="domain-step-num">03 / VERIFICATION</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Quality Control
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Rigorous sampling and reviewer checks measuring agreement with reference standards. Includes human
                verification and correction of automated AI detection outputs.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <div className="domain-step-num">04 / OUTPUT</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Structured Datasets
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Cleaned, verified defect datasets mapped to client-specified defect codes, database schemas, and export
                formats ready for maintenance management systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* D. Applications */}
      <section className="section" style={{ padding: "40px 0" }}>
        <ArchCrosses />
        <div className="container">
          <div data-reveal style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Real-World Use Cases</div>
            <h2 className="section-title" style={{ fontSize: "clamp(24px, 3.4vw, 40px)", marginBottom: 8 }}>
              Applications
            </h2>
            <p className="section-subtitle" style={{ fontSize: 14.5, marginBottom: 0 }}>
              Where structured inspection data supports operational decisions and compliance.
            </p>
          </div>

          <div className="domain-quad-grid" style={{ marginTop: 0, gap: 18 }} data-reveal>
            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                HIGHWAYS
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                Pavement Condition Audits
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Supporting network surveys and pavement evaluation on national and state highways through structured
                visual distress logs.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                STRUCTURES
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                Bridge &amp; Dam Inspections
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                High-resolution drone imagery review and defect mapping across bridge decks, piers, and dam faces under
                structural and dam safety rules.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                OPERATIONS
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                Maintenance Planning
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Structured defect logs and severity metrics that enable asset owners to prioritize repair schedules and
                justify maintenance budgets.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                AI MODELS
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                AI Model Verification
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Ground-truth human-annotated datasets used to train, benchmark, and correct automated defect detection
                computer vision models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E. Closing (minimal, no forms) */}
      <section className="section" style={{ padding: "36px 0 56px 0", borderBottom: "none" }}>
        <ArchCrosses />
        <div className="container">
          <div
            style={{
              borderTop: "1px solid var(--border-line)",
              paddingTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              alignItems: "flex-start",
            }}
            data-reveal
          >
            <div className="section-eyebrow" style={{ color: "var(--burgundy)", marginBottom: 0 }}>
              Mosaic Labs // Infrastructure Inspection Data
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink-secondary)", maxWidth: 680, marginBottom: 4 }}>
              To discuss infrastructure inspection data processing, defect taxonomies, or custom delivery requirements,
              contact our team at{" "}
              <a
                href="mailto:mosaiclabs17@gmail.com"
                style={{ color: "var(--burgundy)", fontWeight: 500, textDecoration: "underline" }}
              >
                mosaiclabs17@gmail.com
              </a>
              .
            </p>
            <Link
              href="/#solutions"
              className="panel-tag"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
              }}
            >
              <span>← Return to Enterprise Domains</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
