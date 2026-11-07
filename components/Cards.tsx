import Link from "next/link";
import type { ReactNode } from "react";

type Metric = [value: string, label: string];

export function WorldMetrics({ metrics, style }: { metrics: Metric[]; style?: React.CSSProperties }) {
  return (
    <div className="world-metrics" style={style}>
      {metrics.map(([val, lbl]) => (
        <div key={val}>
          <div className="world-metric-val">{val}</div>
          <div className="world-metric-lbl">{lbl}</div>
        </div>
      ))}
    </div>
  );
}

export function WorldCard({
  eyebrow,
  title,
  metrics,
  canvas,
  href,
  ariaLabel,
  explore,
  children,
}: {
  eyebrow: string;
  title: string;
  metrics: Metric[];
  canvas?: ReactNode;
  /** When set, the whole card becomes a link to the domain page. */
  href?: string;
  ariaLabel?: string;
  /** Shows the "Explore More →" action row used by linked domain cards. */
  explore?: boolean;
  children: ReactNode;
}) {
  const inner = (
    <>
      {canvas && <div className="world-canvas-container">{canvas}</div>}
      <div className="world-card-content">
        <div className="world-eyebrow">{eyebrow}</div>
        <h3 className="world-title">{title}</h3>
        <p className="world-desc">{children}</p>
        <WorldMetrics metrics={metrics} />
        {explore && (
          <div className="world-card-action">
            <span className="card-explore-btn">
              Explore More <span className="arrow-icon">→</span>
            </span>
          </div>
        )}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="world-card world-card-link" aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }

  return <div className="world-card">{inner}</div>;
}

export function JournalEntry({
  href,
  date,
  title,
  category,
  heading: Heading = "h3",
  reveal,
  children,
}: {
  href: string;
  date: string;
  title: string;
  category: string;
  heading?: "h2" | "h3";
  reveal?: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="journal-entry" data-reveal={reveal || undefined}>
      <span className="journal-date">{date}</span>
      <div>
        <Heading className="journal-title">{title}</Heading>
        <p className="panel-body" style={{ marginTop: 8, marginBottom: 0 }}>
          {children}
        </p>
      </div>
      <span className="journal-category">{category}</span>
      <span className="journal-arrow">→</span>
    </Link>
  );
}

const AI_DOMAIN = (
  <>
    High-performing AI models depend entirely on the quality and integrity of their training data.
    <br />
    <br />
    We partner with engineering and research teams to build dependable data foundations: from multi-channel field
    sourcing and custom schema structuring to continuous verification. We turn complex physical-world signals into
    benchmark-grade datasets that teams can reliably build upon.
  </>
);

export function AiDomainCard({ eyebrow, canvas }: { eyebrow: string; canvas?: ReactNode }) {
  return (
    <WorldCard
      eyebrow={eyebrow}
      title="Artificial Intelligence"
      canvas={canvas}
      metrics={[
        ["MODEL TRAINING", "Purpose-built datasets"],
        ["CROSS-INDUSTRY", "Healthcare to Robotics"],
      ]}
    >
      {AI_DOMAIN}
    </WorldCard>
  );
}
