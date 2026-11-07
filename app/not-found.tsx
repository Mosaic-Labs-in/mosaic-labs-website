import Link from "next/link";

export default function NotFound() {
  return (
    <section
      className="section hero-section"
      style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", paddingTop: 140, paddingBottom: 80 }}
    >
      <div className="container" style={{ textAlign: "center", maxWidth: 820 }}>
        <div className="hero-tag" style={{ justifyContent: "center", marginBottom: 24 }}>
          <span className="status-indicator" style={{ background: "var(--amber-gold)" }}></span>
          404 · PAGE NOT FOUND
        </div>
        <h1 className="hero-display" style={{ fontSize: "clamp(34px, 5vw, 68px)", margin: "0 auto 24px", lineHeight: 1.15 }}>
          &quot;The requested coordinate does not exist in the data layer.&quot;
        </h1>
        <p
          className="hero-desc"
          style={{ maxWidth: 580, margin: "0 auto 40px", fontSize: 17, lineHeight: 1.6, color: "var(--ink-secondary)" }}
        >
          The page, telemetry endpoint, or dataset resource you were looking for has moved, been archived, or never
          existed in this pipeline.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="cta-pill cta-pill-solid" style={{ padding: "14px 28px" }}>
            ← Return to Homepage
          </Link>
          <Link href="/solutions" className="cta-pill cta-pill-ghost" style={{ padding: "14px 28px" }}>
            Explore Solutions →
          </Link>
        </div>
      </div>
    </section>
  );
}
