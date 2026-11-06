"use client";

import { useCanvas } from "./useCanvas";

/** Small looping visual at the top of each What We Do panel. */
export function MiniViz({ type }: { type: "infra" | "intelligence" | "real" }) {
  const ref = useCanvas(() => {
    let t = 0;
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      t += 0.025;

      if (type === "infra") {
        // Ring-buffer stream
        for (let i = 0; i < 16; i++) {
          ctx.beginPath();
          ctx.arc((t * 40 + i * 22) % w, h / 2, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = i % 3 === 0 ? "#4d111c" : "#ffb502";
          ctx.fill();
        }
      } else if (type === "intelligence") {
        // Point-cloud convergence
        for (let i = 0; i < 20; i++) {
          const a = (i / 20) * Math.PI * 2 + t;
          const r = 24 + Math.sin(t * 2 + i) * 10;
          ctx.beginPath();
          ctx.arc(w / 2 + Math.cos(a) * r, h / 2 + Math.sin(a) * r, 2, 0, Math.PI * 2);
          ctx.fillStyle = i % 2 === 0 ? "#4d111c" : "#ffb502";
          ctx.fill();
        }
      } else {
        // Closed loop
        ctx.beginPath();
        ctx.ellipse(w / 2, h / 2, 45, 20, 0, 0, Math.PI * 2);
        ctx.strokeStyle = "#4d111c";
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(w / 2 + Math.cos(t * 3) * 45, h / 2 + Math.sin(t * 3) * 20, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffb502";
        ctx.fill();
      }
    };
  });

  return <canvas ref={ref}></canvas>;
}

/** Energy & Utilities: drifting transmission waves. */
export function EnergyCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => {
    let time = 0;
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      time += 0.02;
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 6; i++) {
        const y = 35 + i * 32;
        ctx.beginPath();
        ctx.moveTo(0, y);
        for (let x = 0; x < w; x += 20) {
          ctx.lineTo(x, y + Math.sin((x + time * 50) * 0.02 + i) * 6);
        }
        ctx.strokeStyle = i % 2 === 0 ? "#4d111c" : "#ffb502";
        ctx.stroke();
      }
    };
  });

  return <canvas ref={ref} className={className}></canvas>;
}

/** Roads & Transportation: mapped grid. */
export function InfraCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => (ctx, w, h) => {
    ctx.clearRect(0, 0, w, h);
    const cols = 8;
    const rows = 5;
    const cw = w / cols;
    const ch = h / rows;
    ctx.strokeStyle = "#e5ded2";
    ctx.lineWidth = 0.8;
    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        ctx.strokeRect(c * cw + 4, r * ch + 4, cw - 8, ch - 8);
        ctx.beginPath();
        ctx.arc(c * cw + cw / 2, r * ch + ch / 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = (c + r) % 3 === 0 ? "#ffb502" : "#4d111c";
        ctx.fill();
      }
    }
  });

  return <canvas ref={ref} className={className}></canvas>;
}

/** Artificial Intelligence: living neural network (layers 3-5-5-2). */
export function AiNetworkCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => {
    let t = 0;
    const layers = [3, 5, 5, 2];
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      t += 0.02;

      const layerX = layers.map((_, i) => (w / (layers.length + 1)) * (i + 1));
      const nodes = layers.map((count, l) => {
        const stepY = h / (count + 1);
        const list: Array<{ x: number; y: number }> = [];
        for (let i = 1; i <= count; i++) {
          list.push({ x: layerX[l], y: stepY * i + Math.sin(t + i) * 3 });
        }
        return list;
      });

      for (let l = 0; l < nodes.length - 1; l++) {
        for (let i = 0; i < nodes[l].length; i++) {
          for (let j = 0; j < nodes[l + 1].length; j++) {
            const a = nodes[l][i];
            const b = nodes[l + 1][j];
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            const active = Math.sin(t * 2 + i + j + l) > 0.4;
            ctx.strokeStyle = active ? "#ffb502" : "#e5ded2";
            ctx.lineWidth = active ? 1.2 : 0.6;
            ctx.stroke();
          }
        }
      }

      nodes.forEach((layerNodes, lIdx) => {
        layerNodes.forEach((n, nIdx) => {
          ctx.beginPath();
          ctx.arc(n.x, n.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = (lIdx + nIdx) % 2 === 0 ? "#4d111c" : "#ffb502";
          ctx.fill();
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1;
          ctx.stroke();
        });
      });
    };
  });

  return <canvas ref={ref} className={className}></canvas>;
}

/** Infrastructure & Inspection Data: road scan grid with defect boxes. */
export function InspectionCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => {
    let t = 0;
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      t += 0.015;

      // Road pavement grid lines
      ctx.strokeStyle = "#f0ebe1";
      ctx.lineWidth = 1;
      const gridSpacing = 28;
      const offset = (t * 25) % gridSpacing;
      for (let y = offset; y < h; y += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }
      for (let x = 0; x < w; x += gridSpacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }

      // Scanning sweep line
      const scanY = (Math.sin(t * 1.5) * 0.5 + 0.5) * (h - 40) + 20;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(w, scanY);
      ctx.strokeStyle = "#ffb502";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bounding box 1: Longitudinal Crack (IRC Standard)
      const b1x = w * 0.18;
      const b1y = h * 0.28 + Math.sin(t) * 4;
      ctx.strokeStyle = "#4d111c";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(b1x, b1y, 110, 48);
      ctx.fillStyle = "#4d111c";
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText("CRACK-L: SEV 2", b1x + 6, b1y - 6);

      // Defect crack squiggle inside box
      ctx.beginPath();
      ctx.moveTo(b1x + 12, b1y + 36);
      ctx.lineTo(b1x + 35, b1y + 24);
      ctx.lineTo(b1x + 58, b1y + 28);
      ctx.lineTo(b1x + 92, b1y + 12);
      ctx.strokeStyle = "#4d111c";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Bounding box 2: Pothole Detection
      const b2x = w * 0.58;
      const b2y = h * 0.45 - Math.sin(t * 1.2) * 5;
      ctx.strokeStyle = "#ffb502";
      ctx.lineWidth = 1.2;
      ctx.strokeRect(b2x, b2y, 88, 52);
      ctx.fillStyle = "#ffb502";
      ctx.fillText("POTHOLE: 16cm", b2x + 6, b2y - 6);

      // Defect ellipse
      ctx.beginPath();
      ctx.ellipse(b2x + 44, b2y + 26, 26, 14, 0.2, 0, Math.PI * 2);
      ctx.strokeStyle = "#ffb502";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Telemetry HUD tags
      ctx.fillStyle = "#827d73";
      ctx.fillText("SURVEY: NHAI-CORRIDOR-04", 16, h - 14);
      ctx.fillText("IRC-SPALL // VERIFIED", w - 140, h - 14);
    };
  });

  return <canvas ref={ref} className={className}></canvas>;
}

/** Voice & Speech Data: three language waveform tracks. */
export function VoiceCanvas({ className }: { className?: string }) {  const ref = useCanvas(() => {
    let t = 0;
    const tracks = [
      { label: "HINDI (HI-IN)", color: "#4d111c", yRatio: 0.28, freq: 0.03, amp: 22 },
      { label: "ENGLISH (EN-IN)", color: "#ffb502", yRatio: 0.54, freq: 0.04, amp: 18 },
      { label: "GUJARATI (GU-IN)", color: "#827d73", yRatio: 0.8, freq: 0.025, amp: 16 },
    ];
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      t += 0.025;

      tracks.forEach((tr, tIdx) => {
        const centerY = h * tr.yRatio;

        ctx.fillStyle = tr.color;
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText(tr.label, 16, centerY - 14);

        // Center guideline
        ctx.strokeStyle = "#f0ebe1";
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(16, centerY);
        ctx.lineTo(w - 16, centerY);
        ctx.stroke();

        // Audio waveform path
        ctx.beginPath();
        ctx.moveTo(16, centerY);
        for (let x = 16; x < w - 16; x += 4) {
          const envelope = Math.sin((x / w) * Math.PI);
          const wave1 = Math.sin((x + t * 45 + tIdx * 30) * tr.freq);
          const wave2 = Math.cos((x - t * 25) * (tr.freq * 2.1));
          const y = centerY + (wave1 * 0.7 + wave2 * 0.3) * tr.amp * envelope;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = tr.color;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });

      // Frequency spectrogram strip at the bottom
      ctx.fillStyle = "rgba(77, 17, 28, 0.05)";
      ctx.fillRect(0, h - 24, w, 24);
    };
  });

  return <canvas ref={ref} className={className}></canvas>;
}

/** Voice domain page hero: spectral bars, envelope curve and transcription markers. */
export function VoiceHeroCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => {
    let t = 0;
    const markers = [
      { label: '[00:01.2] "नमस्ते, मैं कैसे मदद करूँ?"', lang: "HINDI" },
      { label: '[00:03.8] "Confirm the payment gateway"', lang: "INDIAN ENGLISH" },
      { label: '[00:06.4] "કાલે સવારે આવી જઈશ"', lang: "KATHIYAWADI GUJARATI" },
    ];
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      t += 0.02;

      const isMobile = w < 550;
      // Frequency spectral bars
      const numBars = isMobile ? 32 : 54;
      const barPadding = isMobile ? 16 : 24;
      const barWidth = (w - barPadding * 2) / numBars;
      for (let i = 0; i < numBars; i++) {
        const barH = Math.abs(Math.sin(t * 2 + i * 0.28) * Math.cos(t + i * 0.15)) * (h * 0.45) + 8;
        const x = barPadding + i * barWidth;
        const y = h * 0.65 - barH;
        ctx.fillStyle = i % 3 === 0 ? "#4d111c" : i % 3 === 1 ? "#ffb502" : "#ded7cb";
        ctx.fillRect(x, y, Math.max(1, barWidth - 2), barH);
      }

      // Smooth envelope curve overlay
      ctx.beginPath();
      ctx.moveTo(barPadding, h * 0.35);
      for (let x = barPadding; x < w - barPadding; x += 6) {
        const y = h * 0.32 + Math.sin((x + t * 50) * 0.02) * 20 * Math.sin(x * 0.005);
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = "#4d111c";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Audio transcription alignment badges
      if (isMobile) {
        // Cycle 1 marker smoothly on mobile so it never collides
        const activeIdx = Math.floor((t * 0.4) % markers.length);
        const m = markers[activeIdx];
        const mx = w * 0.5;

        ctx.strokeStyle = "#ffb502";
        ctx.lineWidth = 1;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(mx, h * 0.16);
        ctx.lineTo(mx, h * 0.78);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.fillStyle = "#4d111c";
        ctx.font = '600 9.5px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText(m.lang, mx, h * 0.18);
        ctx.fillStyle = "#272727";
        ctx.font = '500 11px "Inter", sans-serif';
        ctx.fillText(m.label, mx, h * 0.26);
        ctx.textAlign = "left";

        // Mobile telemetry
        ctx.fillStyle = "#827d73";
        ctx.font = '9px "JetBrains Mono", monospace';
        ctx.fillText("48 KHZ / 24-BIT FLAC", 16, h - 24);
        ctx.fillText("14 REGIONAL ACCENTS", 16, h - 10);
      } else {
        const positions = [0.15, 0.48, 0.78];
        markers.forEach((m, idx) => {
          const mx = w * positions[idx];
          ctx.strokeStyle = "#ffb502";
          ctx.lineWidth = 1;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.moveTo(mx, h * 0.18);
          ctx.lineTo(mx, h * 0.82);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = "#4d111c";
          ctx.font = '10px "JetBrains Mono", monospace';
          ctx.fillText(m.lang, mx + 6, h * 0.22);
          ctx.fillStyle = "#272727";
          ctx.font = '11.5px "Inter", sans-serif';
          ctx.fillText(m.label, mx + 6, h * 0.28);
        });

        // Desktop HUD telemetry
        ctx.fillStyle = "#827d73";
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText("SAMPLING: 48 KHZ / 24-BIT FLAC", 24, h - 16);
        ctx.fillText("DIALECT VARIATIONS: 14 REGIONAL ACCENTS MAPPED", w - 360, h - 16);
      }
    };
  });

  return <canvas ref={ref} className={className}></canvas>;
}

/** Infrastructure domain page hero: highway perspective corridor with defect boxes. */
export function InspectionHeroCanvas({ className }: { className?: string }) {
  const ref = useCanvas(() => {
    let t = 0;
    return (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h);
      t += 0.018;

      // Highway perspective corridor lines
      ctx.strokeStyle = "#ded7cb";
      ctx.lineWidth = 1;
      const centerX = w * 0.5;
      const horizonY = h * 0.22;

      // Vanishing point lines
      [-0.45, -0.28, -0.1, 0.1, 0.28, 0.45].forEach((ratio) => {
        ctx.beginPath();
        ctx.moveTo(centerX, horizonY);
        ctx.lineTo(centerX + w * ratio, h);
        ctx.stroke();
      });

      // Transverse road markings moving down
      const stepDist = 32;
      const scroll = (t * 35) % stepDist;
      for (let y = horizonY + scroll; y < h; y += stepDist) {
        const spread = (y - horizonY) / (h - horizonY);
        ctx.beginPath();
        ctx.moveTo(centerX - w * 0.45 * spread, y);
        ctx.lineTo(centerX + w * 0.45 * spread, y);
        ctx.strokeStyle = `rgba(222, 215, 203, ${0.15 + spread * 0.8})`;
        ctx.stroke();
      }

      const isMobile = w < 550;
      const b1w = isMobile ? 95 : 110;
      const b2w = isMobile ? 110 : 130;

      // Detection Box 1: Pothole with depth
      const p1x = isMobile ? Math.max(16, centerX - w * 0.38) : centerX - w * 0.22;
      const p1y = h * 0.58;
      ctx.strokeStyle = "#ffb502";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(p1x, p1y, b1w, 45);
      ctx.fillStyle = "#ffb502";
      ctx.font = isMobile ? '9px "JetBrains Mono", monospace' : '10px "JetBrains Mono", monospace';
      ctx.fillText("POTHOLE [D: 18cm]", p1x, p1y - 6);
      ctx.fillText(isMobile ? "IRC: HIGH" : "SEVERITY: HIGH (IRC-SP-84)", p1x, p1y + 58);

      // Detection Box 2: Alligator Cracking
      const p2x = isMobile ? Math.min(w - b2w - 16, centerX + w * 0.06) : centerX + w * 0.12;
      const p2y = h * 0.44;
      ctx.strokeStyle = "#4d111c";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(p2x, p2y, b2w, 55);
      ctx.fillStyle = "#4d111c";
      ctx.fillText(isMobile ? "ALLIGATOR CRACK" : "ALLIGATOR CRACK // 4.8m²", p2x, p2y - 6);
      ctx.fillText(isMobile ? "QA: PASSED" : "STRUCTURAL QA: REVIEWS PASSED", p2x, p2y + 68);

      // Overlay status telemetry
      ctx.font = isMobile ? '9px "JetBrains Mono", monospace' : '11px "JetBrains Mono", monospace';
      if (isMobile) {
        ctx.fillStyle = "#272727";
        ctx.fillText("SCAN: 240 KM/D", 16, 22);
        ctx.fillText("KM 184+620", 16, 36);
        ctx.fillStyle = "#4d111c";
        ctx.fillText("ACC: 99.2%", w - 85, 22);
      } else {
        ctx.fillStyle = "#272727";
        ctx.fillText("SCAN RATE: 240 KM/DAY", 24, 30);
        ctx.fillText("CHAINAGE: KM 184+620", 24, 48);
        ctx.fillStyle = "#4d111c";
        ctx.fillText("ACCURACY: 99.2% AGREEMENT WITH CLIENT BENCHMARK", w - 380, 30);
      }
    };
  });

  return <canvas ref={ref} className={className}></canvas>;
}
