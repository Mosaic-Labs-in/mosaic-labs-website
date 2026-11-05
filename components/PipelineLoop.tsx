"use client";

import { useEffect, useRef, useState } from "react";
import { useCanvas } from "./useCanvas";

const STAGES = [
  {
    num: "STAGE 01 - RAW SIGNALS",
    title: "The Physical World Generates Data It Cannot Use",
    body: "Every industry runs on data trapped in paper documents, legacy PDFs, siloed equipment logs, or field reports. It is fragmented across vendors, unstructured, unannotated, and impossible for machine learning models to consume.",
  },
  {
    num: "STAGE 02 - COLLECTION",
    title: "Multi-Channel Ingestion: Download, Capture, Partner",
    body: "We source data through whichever method is fastest and most defensible: downloading licensed public archives, capturing fresh telemetry via cameras, drones, and sensors, or partnering with utility and equipment operators.",
  },
  {
    num: "STAGE 03 - PRE-PROCESSING",
    title: "Validation, Deduplication & Early Redaction",
    body: "Privacy and compliance are built into the pipeline at ingest. Personal data like faces and license plates is redacted at the point of collection, duplicate entries are pruned, and noise is filtered before storage.",
  },
  {
    num: "STAGE 04 - ANNOTATION & STRUCTURING",
    title: "Transforming Raw Signals into Schema-Driven Formats",
    body: "Disparate imagery, spatial readings, and tabular records are normalized into clean, standardized schemas. Every asset is consistently tagged, segmented, and structured for downstream machine learning workloads.",
  },
  {
    num: "STAGE 05 - QUALITY ASSURANCE",
    title: "Auditing Against Rigorous Domain Benchmarks",
    body: "Every dataset is checked against defined accuracy thresholds and integrity benchmarks before it ships. We verify label consistency, schema adherence, and boundary precision to ensure production reliability.",
  },
  {
    num: "STAGE 06 - PROVENANCE",
    title: "Full Chain-of-Custody Documentation",
    body: "Every asset carries a transparent provenance report detailing its source, collection methodology, DPDP-aligned consent basis, and validation history so enterprise buyers can build with complete legal trust.",
  },
  {
    num: "STAGE 07 - DELIVERY (DaaS)",
    title: "Data as a Service, Continuous Feeds & Applied Models",
    body: "Delivered as custom datasets, recurring subscription feeds, or applied AI models trained on customer data. Because datasets are continuously refreshed and versioned, their value compounds over time.",
  },
];

const STATUS = [
  "01 RAW REAL-WORLD SIGNALS",
  "02 COLLECTION: DOWNLOAD, CAPTURE, PARTNER",
  "03 PRE-PROCESSING & ANONYMIZATION",
  "04 ANNOTATION & SCHEMA STRUCTURING",
  "05 QUALITY ASSURANCE & AUDITING",
  "06 PROVENANCE & CHAIN OF CUSTODY",
  "07 DELIVERY: DATASETS, FEEDS & MODELS",
];

export function PipelineLoop() {
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState(STATUS[0]);
  const activeRef = useRef(0);
  const cards = useRef<(HTMLDivElement | null)[]>([]);

  // The card closest to the middle of the viewport is the active stage.
  useEffect(() => {
    const update = () => {
      const centerY = window.innerHeight * 0.5;
      let best = activeRef.current;
      let min = Infinity;
      cards.current.forEach((card, i) => {
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const dist = Math.abs(rect.top + rect.height / 2 - centerY);
        if (dist < min) {
          min = dist;
          best = i;
        }
      });
      activeRef.current = best;
      setActive(best);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  const canvasRef = useCanvas(() => {
    let time = 0;
    let visual = 0;
    let frames = 0;

    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      time += 0.02;

      // Step one stage at a time toward the active card.
      if (visual !== activeRef.current) {
        frames++;
        if (frames > 8) {
          visual += Math.sign(activeRef.current - visual);
          frames = 0;
          setStatus(STATUS[visual]);
        }
      }

      const cx = w / 2;
      const cy = h / 2;

      ctx.strokeStyle = "#e5ded2";
      ctx.lineWidth = 1;
      ctx.strokeRect(20, 20, w - 40, h - 40);

      if (visual === 0) {
        // Raw real-world signals
        for (let i = 0; i < 18; i++) {
          const px = 40 + (i % 6) * ((w - 80) / 5);
          const py = 50 + Math.floor(i / 6) * ((h - 100) / 2);
          ctx.beginPath();
          ctx.arc(px, py, 4 + Math.sin(time * 2 + i) * 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? "#ffb502" : "#4d111c";
          ctx.fill();
        }
      } else if (visual <= 2) {
        // Raw packets entering the pipeline
        for (let i = 0; i < 24; i++) {
          const t = ((time + i * 0.15) % 3) / 3;
          ctx.beginPath();
          ctx.arc(40 + t * (w - 80), cy + Math.sin(t * 10 + i) * (visual === 1 ? 28 : 5), 2.8, 0, Math.PI * 2);
          ctx.fillStyle = visual === 2 ? "#4d111c" : "#ffb502";
          ctx.fill();
        }
      } else if (visual <= 4) {
        // Structured matrix
        const cols = 6;
        const rows = h < 260 ? 4 : 6;
        const cellW = (w - 100) / cols;
        const cellH = (h - 100) / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const px = 50 + c * cellW;
            const py = 50 + r * cellH;
            ctx.strokeStyle = "#e5ded2";
            ctx.strokeRect(px, py, cellW - 4, cellH - 4);
            if ((r + c + Math.floor(time * 2)) % 4 === 0) {
              ctx.fillStyle = "#ffb502";
              ctx.fillRect(px + 4, py + 4, cellW - 12, cellH - 12);
            }
          }
        }
      } else {
        // Delivery loop
        const radius = Math.min(64, h / 2 - 30);
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.strokeStyle = "#4d111c";
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(cx + Math.cos(time * 3) * radius, cy + Math.sin(time * 3) * radius, 6, 0, Math.PI * 2);
        ctx.fillStyle = "#ffb502";
        ctx.fill();

        ctx.font = '600 10px "Inter", sans-serif';
        ctx.fillStyle = "#272727";
        ctx.textAlign = "center";
        ctx.fillText("DATA AS A SERVICE", cx, cy - 4);
        ctx.fillText("PIPELINE", cx, cy + 10);
        ctx.textAlign = "start";
      }
    };
  });

  return (
    <div className="loop-narrative-container">
      <div className="stages-scroller">
        {STAGES.map((stage, i) => (
          <div
            key={stage.num}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className={`stage-card${active === i ? " active-stage" : ""}`}
          >
            <div className="stage-num">{stage.num}</div>
            <h3 className="stage-title">{stage.title}</h3>
            <p className="stage-body">{stage.body}</p>
          </div>
        ))}
      </div>

      <div className="sticky-stage-viz">
        <div className="section-eyebrow" style={{ marginBottom: 14 }}>
          Pipeline Visualizer
        </div>
        <div className="stage-canvas-box">
          <canvas id="stageCanvas" ref={canvasRef}></canvas>
        </div>
        <div className="stage-viz-footer">
          <span>{status}</span>
          <span style={{ color: "var(--accent-amber)" }}>PIPELINE ACTIVE</span>
        </div>
      </div>
    </div>
  );
}
