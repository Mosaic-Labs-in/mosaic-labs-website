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
  children,
}: {
  eyebrow: string;
  title: string;
  metrics: Metric[];
  canvas?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="world-card">
      {canvas && <div className="world-canvas-container">{canvas}</div>}
      <div className="world-card-content">
        <div className="world-eyebrow">{eyebrow}</div>
        <h3 className="world-title">{title}</h3>
        <p className="world-desc">{children}</p>
        <WorldMetrics metrics={metrics} />
      </div>
    </div>
  );
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
    AI is changing every industry, but every AI system starts with the same foundation: the right data.
    <br />
    <br />
    We work with AI companies across industries to build the data infrastructure behind their intelligence. From
    sourcing and structuring data to creating high-quality, purpose-built datasets, we help turn real-world
    information into data that AI can learn from.
    <br />
    <br />
    Whether you&apos;re building AI for healthcare, mobility, finance, retail, robotics, or something entirely new,
    we help you build the data your models need to perform in the real world.
  </>
);

export function AiDomainCard({ eyebrow }: { eyebrow: string }) {
  return (
    <WorldCard
      eyebrow={eyebrow}
      title="Artificial Intelligence"
      metrics={[
        ["MODEL TRAINING", "Purpose-built datasets"],
        ["CROSS-INDUSTRY", "Healthcare to Robotics"],
      ]}
    >
      {AI_DOMAIN}
    </WorldCard>
  );
}
