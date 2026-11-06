"use client";

import { useRef, useState } from "react";
import { useCanvas } from "./useCanvas";

const BURGUNDY = "#4d111c";
const AMBER = "#ffb502";
const INK = "#272727";
const PARCHMENT = "#e5ded2";
const MUTED = "#827d73";

const SOURCES = [
  {
    id: "DOWNLOAD",
    name: "Download Channels",
    yRatio: 0.24,
    telemetry: {
      ACQUISITION: "Public Portals, APIs & Open Archives",
      VERIFICATION: "Pre-Ingest Legal Usability Checks",
      PROCESSING: "Automated Deduplication & Cleanup",
      DELIVERY: "Standardized Schema-Driven Records",
    },
  },
  {
    id: "CAPTURE",
    name: "Field Capture",
    yRatio: 0.5,
    telemetry: {
      ACQUISITION: "Cameras, Drones, Dashcams & Sensors",
      COVERAGE: "Target Physical Deployments",
      PRIVACY: "Redaction at Point of Collection",
      DELIVERY: "AI-Ready Labeled Datasets",
    },
  },
  {
    id: "PARTNER",
    name: "Partner Data Streams",
    yRatio: 0.76,
    telemetry: {
      ACQUISITION: "Utilities & Infrastructure Operators",
      INGESTION: "Bilateral Enterprise Integration",
      COMPLIANCE: "DPDP-Aligned Consent & Governance",
      DELIVERY: "Ongoing Subscription Feeds",
    },
  },
];

const DECISIONS = [
  { label: "STRUCTURED_AI_DATASET", short: "AI DATASET", yRatio: 0.32 },
  { label: "PROVENANCE_REPORT", short: "PROVENANCE", yRatio: 0.5 },
  { label: "ONGOING_DATA_FEED", short: "LIVE FEED", yRatio: 0.68 },
];

const CHIPS = [
  { id: "ALL", label: "All Channels" },
  { id: "DOWNLOAD", label: "Download (Public & APIs)" },
  { id: "CAPTURE", label: "Capture (Sensors & Cameras)" },
  { id: "PARTNER", label: "Partner (Utilities & Operators)" },
];

/** Below this canvas width the river flows top-to-bottom instead of left-to-right. */
const COMPACT_WIDTH = 600;
const LANES = [0.2, 0.5, 0.8];

type Packet = {
  idx: number;
  sourceIdx: number;
  progress: number;
  speed: number;
  jitter: number;
  size: number;
};

function spawn(idx: number, progress = 0): Packet {
  return {
    idx,
    sourceIdx: Math.floor(Math.random() * SOURCES.length),
    progress,
    speed: 0.0035 + Math.random() * 0.0045,
    jitter: (Math.random() - 0.5) * 14,
    size: 2.4 + Math.random() * 1.6,
  };
}

export function DataRiver() {
  const [filter, setFilter] = useState("ALL");
  const [hudSource, setHudSource] = useState(SOURCES[0]);
  const filterRef = useRef(filter);

  const select = (id: string) => {
    filterRef.current = id;
    setFilter(id);
    const match = SOURCES.find((s) => s.id === id);
    if (match) setHudSource(match);
  };

  const canvasRef = useCanvas(() => {
    const packets = Array.from({ length: 75 }, (_, i) => spawn(i, Math.random()));
    const pulses: number[] = [];

    return (ctx, cw, ch) => {
      const active = filterRef.current;
      const compact = cw < COMPACT_WIDTH;
      ctx.clearRect(0, 0, cw, ch);

      // Parchment grid
      ctx.beginPath();
      for (let x = 0; x < cw; x += 36) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
      }
      for (let y = 0; y < ch; y += 36) {
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
      }
      ctx.strokeStyle = PARCHMENT;
      ctx.lineWidth = 0.8;
      ctx.stroke();

      const src = (i: number) =>
        compact ? { x: cw * LANES[i], y: 44 } : { x: 54, y: ch * SOURCES[i].yRatio };
      const out = (i: number) =>
        compact ? { x: cw * LANES[i], y: ch - 64 } : { x: cw - 64, y: ch * DECISIONS[i].yRatio };

      const mx = cw * 0.5;
      const my = compact ? ch * 0.5 : ch * 0.48;
      const mw = compact ? Math.min(cw - 64, 240) : Math.min(cw * 0.28, 220);
      const mh = compact ? Math.min(ch * 0.34, 200) : 220;
      const left = mx - mw / 2;
      const top = my - mh / 2;

      // 1. Physical emitter nodes
      ctx.textAlign = compact ? "center" : "left";
      SOURCES.forEach((s, i) => {
        const p = src(i);
        const selected = active === "ALL" || active === s.id;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = selected ? "rgba(77, 17, 28, 0.4)" : PARCHMENT;
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = selected ? BURGUNDY : INK;
        ctx.fill();

        ctx.font = '600 10.5px "Inter", sans-serif';
        ctx.fillStyle = selected ? BURGUNDY : MUTED;
        if (compact) ctx.fillText(s.id, p.x, p.y + 28);
        else ctx.fillText(s.id, p.x + 20, p.y + 3.5);
      });

      // 2. Central Mosaic data layer
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(left, top, mw, mh);
      ctx.strokeStyle = BURGUNDY;
      ctx.lineWidth = 1.2;
      ctx.strokeRect(left, top, mw, mh);

      ctx.textAlign = "left";
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = AMBER;
      ctx.fillText("+", left - 4, top + 4);
      ctx.fillText("+", left + mw - 4, top + 4);
      ctx.fillText("+", left - 4, top + mh + 4);
      ctx.fillText("+", left + mw - 4, top + mh + 4);

      const tw = (mw - 24) / 3;
      const th = (mh - 24) / 3;
      ctx.strokeStyle = PARCHMENT;
      ctx.lineWidth = 0.8;
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const tx = left + 12 + c * tw;
          const ty = top + 12 + r * th;
          ctx.strokeRect(tx + 2, ty + 2, tw - 4, th - 4);
          ctx.beginPath();
          ctx.arc(tx + tw / 2, ty + th / 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = (r + c) % 2 === 0 ? AMBER : BURGUNDY;
          ctx.fill();
        }
      }

      ctx.textAlign = "center";
      ctx.font = '600 10.5px "Inter", sans-serif';
      ctx.fillStyle = BURGUNDY;
      ctx.fillText("MOSAIC DATA LAYER", mx, top - 8);
      ctx.font = '500 9px "Inter", sans-serif';
      ctx.fillStyle = INK;
      ctx.fillText(
        compact ? "PROCESSING & ANNOTATION" : "PROCESSING & ANNOTATION // AI-READY QUALITY",
        mx,
        top + mh + 16,
      );

      // 3. Deliveries
      ctx.textAlign = compact ? "center" : "left";
      DECISIONS.forEach((d, i) => {
        const p = out(i);
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = AMBER;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(77, 17, 28, 0.4)";
        ctx.stroke();

        ctx.font = '600 9px "Inter", sans-serif';
        ctx.fillStyle = INK;
        if (compact) ctx.fillText(d.short, p.x, p.y + 28);
        else ctx.fillText(d.label, p.x - 146, p.y - 8);
      });

      // 4. Packets: fragmented on the way in, structured inside, delivered out
      const laneGap = compact ? Math.min(40, mw * 0.28) : 40;
      for (const p of packets) {
        p.progress += p.speed;
        if (p.progress > 1) {
          if (Math.random() > 0.6) pulses.push(0);
          Object.assign(p, spawn(p.idx));
        }

        const source = SOURCES[p.sourceIdx];
        if (active !== "ALL" && source.id !== active) continue;

        const lane = (p.sourceIdx - 1) * laneGap;
        const a = src(p.sourceIdx);
        const b = compact ? { x: mx + lane, y: top } : { x: left, y: my + lane };
        const c = compact ? { x: mx + lane, y: top + mh } : { x: left + mw, y: my + lane };
        const d = out(p.idx % 3);

        let x: number, y: number, color: string, alpha: number;
        if (p.progress < 0.38) {
          const t = p.progress / 0.38;
          const jitter = p.jitter * (1 - t);
          x = a.x + (b.x - a.x) * t + (compact ? jitter : 0);
          y = a.y + (b.y - a.y) * t + (compact ? 0 : jitter);
          color = source.id === active ? BURGUNDY : AMBER;
          alpha = 0.65 + Math.sin(t * Math.PI) * 0.35;
        } else if (p.progress < 0.7) {
          const t = (p.progress - 0.38) / 0.32;
          x = b.x + (c.x - b.x) * t;
          y = b.y + (c.y - b.y) * t;
          color = BURGUNDY;
          alpha = 1;
          if (p.idx % 3 === 0) {
            ctx.beginPath();
            if (compact) {
              ctx.moveTo(x - 6, y);
              ctx.lineTo(x + 6, y);
            } else {
              ctx.moveTo(x, y - 6);
              ctx.lineTo(x, y + 6);
            }
            ctx.strokeStyle = AMBER;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        } else {
          const t = (p.progress - 0.7) / 0.3;
          x = c.x + (d.x - c.x) * t;
          y = c.y + (d.y - c.y) * t;
          color = AMBER;
          alpha = 1 - t * 0.25;
        }

        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      // 5. Return conduit: deliveries feed back to the sources (closed loop)
      const from = compact ? { x: cw - 14, y: out(0).y } : { x: cw - 64, y: ch - 28 };
      const to = compact ? { x: cw - 14, y: src(0).y } : { x: 54, y: ch - 28 };
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = PARCHMENT;
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '600 9px "Inter", sans-serif';
      ctx.fillStyle = BURGUNDY;
      if (compact) {
        ctx.save();
        ctx.translate(from.x - 6, (from.y + to.y) / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "center";
        ctx.fillText("DAAS: CONTINUOUS REFRESH & VERSIONED DELIVERY →", 0, 0);
        ctx.restore();
      } else {
        ctx.textAlign = "left";
        ctx.fillText(
          "← DATA AS A SERVICE: CONTINUOUS REFRESH & VERSIONED DELIVERY PIPELINE",
          cw * 0.22,
          from.y - 6,
        );
      }

      ctx.fillStyle = AMBER;
      for (let i = pulses.length - 1; i >= 0; i--) {
        pulses[i] += 0.012;
        ctx.beginPath();
        ctx.arc(
          from.x + (to.x - from.x) * pulses[i],
          from.y + (to.y - from.y) * pulses[i],
          4,
          0,
          Math.PI * 2,
        );
        ctx.fill();
        if (pulses[i] >= 1) pulses.splice(i, 1);
      }
    };
  });

  return (
    <div className="data-river-wrapper" id="data-river" data-reveal>
      <div className="data-river-header">
        <div className="river-live-tag">
          <span className="pulse-dot"></span>
          <span>END-TO-END PIPELINE // SOURCING → VALIDATION → AI-READY DELIVERY</span>
        </div>

        <div className="river-legend">
          <div className="legend-step">
            <span>01 SOURCING</span>
            <span className="legend-arrow">→</span>
          </div>
          <div className="legend-step">
            <span>02 PRE-PROCESSING</span>
            <span className="legend-arrow">→</span>
          </div>
          <div className="legend-step" style={{ color: "var(--accent-amber)" }}>
            <span>03 ANNOTATION &amp; STRUCTURING</span>
            <span className="legend-arrow">→</span>
          </div>
          <div className="legend-step">
            <span>04 QUALITY ASSURANCE</span>
            <span className="legend-arrow">→</span>
          </div>
          <div className="legend-step">
            <span>05 DELIVERY (DaaS)</span>
          </div>
        </div>
      </div>

      <div className="emitter-sources-bar">
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            className={`emitter-chip${filter === chip.id ? " active" : ""}`}
            aria-pressed={filter === chip.id}
            onClick={() => select(chip.id)}
          >
            <span className="chip-dot"></span> {chip.label}
          </button>
        ))}
      </div>

      <div className="river-stage">
        <div className="river-viewport">
          <canvas id="dataRiverCanvas" ref={canvasRef}></canvas>
        </div>

        <div className={`source-inspection-hud${filter !== "ALL" ? " visible" : ""}`} aria-live="polite">
          <div className="hud-source-title">
            <span>{hudSource.name}</span>
            <span style={{ fontSize: 10, color: "var(--burgundy)", fontWeight: 600 }}>DPDP ALIGNED</span>
          </div>
          {Object.entries(hudSource.telemetry).map(([key, val]) => (
            <div className="hud-field" key={key}>
              <span className="hud-field-label">{key}:</span>
              <span className="hud-field-val">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="river-caption">
        <div className="river-caption-group">
          <span>
            SOURCING: <span className="metric-amber">DOWNLOAD · CAPTURE · PARTNER</span>
          </span>
          <span>
            VALIDATION: <span className="metric-amber">PRIVACY REDACTION &amp; QA</span>
          </span>
          <span>
            MODEL: <span className="metric-amber">DATA AS A SERVICE</span>
          </span>
        </div>
        <div>
          <span>SELECT ANY CHANNEL TO INSPECT INGESTION &amp; STRUCTURING SPECIFICATION</span>
        </div>
      </div>
    </div>
  );
}
