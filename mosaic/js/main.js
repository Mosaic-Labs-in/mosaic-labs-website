/**
 * MOSAIC LABS - THE LIVING DATA LAYER & RIVER ENGINE (STRICT EDITORIAL LIGHT THEME)
 * Palette:
 * - #4d111c (Burgundy)
 * - #ffffff (Pure White)
 * - #272727 (Dark Charcoal Ink)
 * - #ffb502 (Amber / Gold Accent)
 * - #e5ded2 (Parchment)
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. MINIMAL CUSTOM CURSOR WITH PARTICLE REACTIVITY
  // --------------------------------------------------------------------------
  const cursorDot = document.createElement('div');
  const cursorRing = document.createElement('div');
  cursorDot.className = 'custom-cursor-dot';
  cursorRing.className = 'custom-cursor-ring';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorRing);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  function updateCursor() {
    ringX += (mouseX - ringX) * 0.22;
    ringY += (mouseY - ringY) * 0.22;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    requestAnimationFrame(updateCursor);
  }
  requestAnimationFrame(updateCursor);

  const interactives = document.querySelectorAll('a, button, input, select, textarea, .emitter-chip, .editorial-panel, .world-card, .journal-entry');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // --------------------------------------------------------------------------
  // 2. THE LIVING DATA RIVER & MOSAIC LAYER ENGINE (#dataRiverCanvas)
  // --------------------------------------------------------------------------
  const riverCanvas = document.getElementById('dataRiverCanvas');
  const inspectionHud = document.getElementById('sourceInspectionHud');
  let activeSourceFilter = 'ALL';

  if (riverCanvas) {
    const ctx = riverCanvas.getContext('2d');
    let cw = 0, ch = 0, dpr = 1;

    function resizeRiver() {
      const rect = riverCanvas.parentElement.getBoundingClientRect();
      cw = rect.width;
      ch = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      riverCanvas.width = Math.floor(cw * dpr);
      riverCanvas.height = Math.floor(ch * dpr);
      ctx.scale(dpr, dpr);
    }
    resizeRiver();
    window.addEventListener('resize', resizeRiver);

    // Physical Sources (Mosaic Acquisition Channels - Left side)
    const SOURCES = [
      {
        id: 'DOWNLOAD',
        name: 'Download Channels',
        yRatio: 0.24,
        color: '#ffb502',
        telemetry: {
          'ACQUISITION': 'Public Portals, APIs & Open Archives',
          'VERIFICATION': 'Pre-Ingest Legal Usability Checks',
          'PROCESSING': 'Automated Deduplication & Cleanup',
          'DELIVERY': 'Standardized Schema-Driven Records'
        }
      },
      {
        id: 'CAPTURE',
        name: 'Field Capture',
        yRatio: 0.50,
        color: '#4d111c',
        telemetry: {
          'ACQUISITION': 'Cameras, Drones, Dashcams & Sensors',
          'COVERAGE': 'Target Physical Deployments',
          'PRIVACY': 'Redaction at Point of Collection',
          'DELIVERY': 'AI-Ready Labeled Datasets'
        }
      },
      {
        id: 'PARTNER',
        name: 'Partner Data Streams',
        yRatio: 0.76,
        color: '#272727',
        telemetry: {
          'ACQUISITION': 'Utilities & Infrastructure Operators',
          'INGESTION': 'Bilateral Enterprise Integration',
          'COMPLIANCE': 'DPDP-Aligned Consent & Governance',
          'DELIVERY': 'Ongoing Subscription Feeds'
        }
      }
    ];

    // Data Packets Pool
    const PACKET_COUNT = 75;
    const packets = [];

    class DataPacket {
      constructor(idx) {
        this.idx = idx;
        this.reset();
        this.progress = Math.random();
      }

      reset() {
        this.sourceIdx = Math.floor(Math.random() * SOURCES.length);
        this.source = SOURCES[this.sourceIdx];
        this.progress = 0;
        this.speed = 0.0035 + Math.random() * 0.0045;
        this.jitter = (Math.random() - 0.5) * 14;
        this.size = 2.4 + Math.random() * 1.6;
      }

      update() {
        this.progress += this.speed;
        if (this.progress > 1) {
          triggerActionPulse(this.sourceIdx);
          this.reset();
        }
      }
    }

    for (let i = 0; i < PACKET_COUNT; i++) {
      packets.push(new DataPacket(i));
    }

    // Return Action Feedback Conduit Pulses
    const actionPulses = [];
    function triggerActionPulse(sourceIdx) {
      if (Math.random() > 0.6) {
        actionPulses.push({
          sourceIdx: sourceIdx,
          progress: 0,
          speed: 0.012
        });
      }
    }

    // Emitter Chip Click / Filter
    const emitterChips = document.querySelectorAll('.emitter-chip');
    emitterChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        emitterChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeSourceFilter = chip.getAttribute('data-source') || 'ALL';

        if (activeSourceFilter !== 'ALL') {
          const matched = SOURCES.find(s => s.id === activeSourceFilter);
          if (matched) showHud(matched);
        } else {
          hideHud();
        }
      });
    });

    function showHud(src) {
      if (!inspectionHud) return;
      document.getElementById('hudTitle').textContent = src.name;
      const fieldsContainer = document.getElementById('hudFields');
      fieldsContainer.innerHTML = '';
      for (const [key, val] of Object.entries(src.telemetry)) {
        const row = document.createElement('div');
        row.className = 'hud-field';
        row.innerHTML = `<span class="hud-field-label">${key}:</span><span class="hud-field-val">${val}</span>`;
        fieldsContainer.appendChild(row);
      }
      inspectionHud.classList.add('visible');
    }

    function hideHud() {
      if (inspectionHud && activeSourceFilter === 'ALL') {
        inspectionHud.classList.remove('visible');
      }
    }

    // Main River Render Loop
    function renderRiver() {
      ctx.clearRect(0, 0, cw, ch);

      // Light Parchment grid lines
      ctx.strokeStyle = '#e5ded2';
      ctx.lineWidth = 0.8;
      for (let x = 0; x < cw; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, ch);
        ctx.stroke();
      }
      for (let y = 0; y < ch; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(cw, y);
        ctx.stroke();
      }

      // -------------------------------------------------------------
      // 1. RENDER PHYSICAL EMITTER NODES (REAL WORLD - LEFT)
      // -------------------------------------------------------------
      const leftX = 54;
      SOURCES.forEach((src, sIdx) => {
        const sy = ch * src.yRatio;
        const isSelected = activeSourceFilter === 'ALL' || activeSourceFilter === src.id;

        // Emitter pulse ring
        ctx.beginPath();
        ctx.arc(leftX, sy, 12, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? 'rgba(77, 17, 28, 0.4)' : '#e5ded2';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Emitter core dot
        ctx.beginPath();
        ctx.arc(leftX, sy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = isSelected ? '#4d111c' : '#272727';
        ctx.fill();

        // Label
        ctx.font = '600 10.5px "Inter", sans-serif';
        ctx.fillStyle = isSelected ? '#4d111c' : '#827d73';
        ctx.fillText(src.id, leftX + 20, sy + 3.5);
      });

      // -------------------------------------------------------------
      // 2. RENDER CENTRAL MOSAIC DATA LAYER (CENTER)
      // -------------------------------------------------------------
      const mosaicCx = cw * 0.50;
      const mosaicCy = ch * 0.48;
      const mosaicW = Math.min(cw * 0.28, 220);
      const mosaicH = 220;

      // Outer Layer Bounds & Hairline Frame
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(mosaicCx - mosaicW / 2, mosaicCy - mosaicH / 2, mosaicW, mosaicH);

      ctx.strokeStyle = '#4d111c';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(mosaicCx - mosaicW / 2, mosaicCy - mosaicH / 2, mosaicW, mosaicH);

      // Corner Cross Marks (+)
      ctx.font = '11px "JetBrains Mono", monospace';
      ctx.fillStyle = '#ffb502';
      ctx.fillText('+', mosaicCx - mosaicW / 2 - 4, mosaicCy - mosaicH / 2 + 4);
      ctx.fillText('+', mosaicCx + mosaicW / 2 - 4, mosaicCy - mosaicH / 2 + 4);
      ctx.fillText('+', mosaicCx - mosaicW / 2 - 4, mosaicCy + mosaicH / 2 + 4);
      ctx.fillText('+', mosaicCx + mosaicW / 2 - 4, mosaicCy + mosaicH / 2 + 4);

      // Central Geometric Facets (Mosaic Tiles)
      const tileCols = 3;
      const tileRows = 3;
      const tw = (mosaicW - 24) / tileCols;
      const th = (mosaicH - 24) / tileRows;

      for (let r = 0; r < tileRows; r++) {
        for (let c = 0; c < tileCols; c++) {
          const tx = (mosaicCx - mosaicW / 2 + 12) + c * tw;
          const ty = (mosaicCy - mosaicH / 2 + 12) + r * th;

          ctx.strokeStyle = '#e5ded2';
          ctx.lineWidth = 0.8;
          ctx.strokeRect(tx + 2, ty + 2, tw - 4, th - 4);

          // Internal activity dot
          ctx.beginPath();
          ctx.arc(tx + tw / 2, ty + th / 2, 2, 0, Math.PI * 2);
          ctx.fillStyle = (r + c) % 2 === 0 ? '#ffb502' : '#4d111c';
          ctx.fill();
        }
      }

      // Title over Mosaic Layer
      ctx.font = '600 10.5px "Inter", sans-serif';
      ctx.fillStyle = '#4d111c';
      ctx.fillText('MOSAIC DATA LAYER', mosaicCx - 58, mosaicCy - mosaicH / 2 - 8);

      // Subtitle status
      ctx.font = '500 9px "Inter", sans-serif';
      ctx.fillStyle = '#272727';
      ctx.fillText('PROCESSING & ANNOTATION // AI-READY QUALITY', mosaicCx - 110, mosaicCy + mosaicH / 2 + 16);

      // -------------------------------------------------------------
      // 3. RENDER INTELLIGENCE & DECISIONS (RIGHT)
      // -------------------------------------------------------------
      const rightX = cw - 64;
      const DECISIONS = [
        { label: 'STRUCTURED_AI_DATASET', yRatio: 0.32 },
        { label: 'PROVENANCE_REPORT',      yRatio: 0.50 },
        { label: 'ONGOING_DATA_FEED',     yRatio: 0.68 }
      ];

      DECISIONS.forEach((dec) => {
        const dy = ch * dec.yRatio;

        // Output Node
        ctx.beginPath();
        ctx.arc(rightX, dy, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb502';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(rightX, dy, 12, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(77, 17, 28, 0.4)';
        ctx.stroke();

        ctx.font = '600 9px "Inter", sans-serif';
        ctx.fillStyle = '#272727';
        ctx.fillText(dec.label, rightX - 146, dy - 8);
      });

      // -------------------------------------------------------------
      // 4. PACKETS STREAMING & STATE TRANSFORMATION
      // -------------------------------------------------------------
      packets.forEach((p) => {
        p.update();

        const isFiltered = activeSourceFilter !== 'ALL' && p.source.id !== activeSourceFilter;
        if (isFiltered) return;

        const startY = ch * p.source.yRatio;
        const targetY = mosaicCy + ((p.sourceIdx - 1.0) * 40);
        const exitY = ch * (0.32 + (p.idx % 3) * 0.18);

        let px, py;
        let pColor, pAlpha;

        if (p.progress < 0.38) {
          // STAGE 1: Real World -> Mosaic Entrance (JITTERY & FRAGMENTED)
          const t = p.progress / 0.38;
          px = leftX + (mosaicCx - mosaicW / 2 - leftX) * t;
          const currentJitter = p.jitter * (1 - t);
          py = startY + (targetY - startY) * t + currentJitter;
          pColor = (p.source.id === activeSourceFilter) ? '#4d111c' : '#ffb502';
          pAlpha = 0.65 + Math.sin(t * Math.PI) * 0.35;

        } else if (p.progress < 0.70) {
          // STAGE 2: INSIDE MOSAIC (ORGANIZING, STRUCTURED)
          const t = (p.progress - 0.38) / 0.32;
          px = (mosaicCx - mosaicW / 2) + mosaicW * t;
          py = targetY;
          pColor = '#4d111c';
          pAlpha = 1;

          if (p.idx % 3 === 0) {
            ctx.beginPath();
            ctx.moveTo(px, py - 6);
            ctx.lineTo(px, py + 6);
            ctx.strokeStyle = '#ffb502';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

        } else {
          // STAGE 3: EXITING MOSAIC INTO DELIVERIES
          const t = (p.progress - 0.70) / 0.30;
          px = (mosaicCx + mosaicW / 2) + (rightX - (mosaicCx + mosaicW / 2)) * t;
          py = targetY + (exitY - targetY) * t;
          pColor = '#ffb502';
          pAlpha = 1 - t * 0.25;
        }

        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = pColor;
        ctx.globalAlpha = Math.max(0, Math.min(1, pAlpha));
        ctx.fill();
        ctx.globalAlpha = 1;
      });

      // -------------------------------------------------------------
      // 5. THE RETURN ACTION FEEDBACK CONDUIT (CLOSED LOOP)
      // -------------------------------------------------------------
      const returnY = ch - 28;
      ctx.beginPath();
      ctx.moveTo(rightX, returnY);
      ctx.lineTo(leftX, returnY);
      ctx.strokeStyle = '#e5ded2';
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.font = '600 9px "Inter", sans-serif';
      ctx.fillStyle = '#4d111c';
      ctx.fillText('← DATA AS A SERVICE: CONTINUOUS REFRESH & VERSIONED DELIVERY PIPELINE', cw * 0.22, returnY - 6);

      // Return Pulses traveling from Right to Left
      for (let i = actionPulses.length - 1; i >= 0; i--) {
        const ap = actionPulses[i];
        ap.progress += ap.speed;

        const apx = rightX - (rightX - leftX) * ap.progress;

        ctx.beginPath();
        ctx.arc(apx, returnY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ffb502';
        ctx.fill();

        if (ap.progress >= 1) {
          actionPulses.splice(i, 1);
        }
      }

      requestAnimationFrame(renderRiver);
    }
    requestAnimationFrame(renderRiver);
  }

  // --------------------------------------------------------------------------
  // 3. SCROLL-DRIVEN 7-STAGE DATA LOOP VISUALIZER (#stageCanvas)
  // --------------------------------------------------------------------------
  const stageCanvas = document.getElementById('stageCanvas');
  let currentStageIndex = 0;

  if (stageCanvas) {
    const sctx = stageCanvas.getContext('2d');
    let scw = 0, sch = 0;

    function resizeStage() {
      const rect = stageCanvas.parentElement.getBoundingClientRect();
      scw = rect.width;
      sch = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      stageCanvas.width = Math.floor(scw * dpr);
      stageCanvas.height = Math.floor(sch * dpr);
      sctx.scale(dpr, dpr);
    }
    resizeStage();
    window.addEventListener('resize', resizeStage);

    // Scroll Observer for Stages
    const stageCards = document.querySelectorAll('.stage-card');
    if ('IntersectionObserver' in window) {
      const stageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            stageCards.forEach(c => c.classList.remove('active-stage'));
            entry.target.classList.add('active-stage');
            currentStageIndex = parseInt(entry.target.getAttribute('data-stage-num') || '0', 10);
            const statusEl = document.getElementById('stageStatusText');
            if (statusEl) {
              const titles = [
                '01 RAW REAL-WORLD SIGNALS',
                '02 COLLECTION: DOWNLOAD, CAPTURE, PARTNER',
                '03 PRE-PROCESSING & ANONYMIZATION',
                '04 ANNOTATION & SCHEMA STRUCTURING',
                '05 QUALITY ASSURANCE & AUDITING',
                '06 PROVENANCE & CHAIN OF CUSTODY',
                '07 DELIVERY: DATASETS, FEEDS & MODELS'
              ];
              statusEl.textContent = titles[currentStageIndex] || 'ACTIVE';
            }
          }
        });
      }, { threshold: 0.5 });

      stageCards.forEach(card => stageObserver.observe(card));
    }

    let stageTime = 0;
    function renderStage() {
      sctx.clearRect(0, 0, scw, sch);
      stageTime += 0.02;

      const cx = scw / 2;
      const cy = sch / 2;

      sctx.strokeStyle = '#e5ded2';
      sctx.strokeRect(20, 20, scw - 40, sch - 40);

      if (currentStageIndex === 0) {
        // Stage 1: Real World Physical Signals
        for (let i = 0; i < 18; i++) {
          const px = 40 + (i % 6) * ((scw - 80) / 5);
          const py = 50 + Math.floor(i / 6) * ((sch - 100) / 2);
          const r = 4 + Math.sin(stageTime * 2 + i) * 2;
          sctx.beginPath();
          sctx.arc(px, py, r, 0, Math.PI * 2);
          sctx.fillStyle = i % 3 === 0 ? '#ffb502' : '#4d111c';
          sctx.fill();
        }
      } else if (currentStageIndex <= 2) {
        // Stage 2 & 3: Raw Packets -> Entering Mosaic
        for (let i = 0; i < 24; i++) {
          const t = ((stageTime + i * 0.15) % 3) / 3;
          const px = 40 + t * (scw - 80);
          const py = cy + Math.sin(t * 10 + i) * (currentStageIndex === 1 ? 28 : 5);
          sctx.beginPath();
          sctx.arc(px, py, 2.8, 0, Math.PI * 2);
          sctx.fillStyle = currentStageIndex === 2 ? '#4d111c' : '#ffb502';
          sctx.fill();
        }
      } else if (currentStageIndex <= 4) {
        // Stage 4 & 5: Structured Matrix & Intelligence
        const cols = 6;
        const rows = 6;
        const cellW = (scw - 100) / cols;
        const cellH = (sch - 100) / rows;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const px = 50 + c * cellW;
            const py = 50 + r * cellH;
            sctx.strokeStyle = '#e5ded2';
            sctx.strokeRect(px, py, cellW - 4, cellH - 4);
            if ((r + c + Math.floor(stageTime * 2)) % 4 === 0) {
              sctx.fillStyle = '#ffb502';
              sctx.fillRect(px + 4, py + 4, cellW - 12, cellH - 12);
            }
          }
        }
      } else {
        // Stage 6 & 7: Deliveries & Ongoing Pipeline
        sctx.beginPath();
        sctx.arc(cx, cy, 64, 0, Math.PI * 2);
        sctx.strokeStyle = '#4d111c';
        sctx.lineWidth = 1.5;
        sctx.stroke();

        const ox = cx + Math.cos(stageTime * 3) * 64;
        const oy = cy + Math.sin(stageTime * 3) * 64;
        sctx.beginPath();
        sctx.arc(ox, oy, 6, 0, Math.PI * 2);
        sctx.fillStyle = '#ffb502';
        sctx.fill();

        sctx.font = '600 10px "Inter", sans-serif';
        sctx.fillStyle = '#272727';
        sctx.fillText('DATA AS A SERVICE PIPELINE', cx - 74, cy + 3.5);
      }

      requestAnimationFrame(renderStage);
    }
    requestAnimationFrame(renderStage);
  }

  // --------------------------------------------------------------------------
  // 4. EMBEDDED MINI VISUALIZERS (WHAT WE DO)
  // --------------------------------------------------------------------------
  function initMiniViz(canvasId, type) {
    const c = document.getElementById(canvasId);
    if (!c) return;
    const mctx = c.getContext('2d');
    let mw = 0, mh = 0;

    function resize() {
      const rect = c.parentElement.getBoundingClientRect();
      mw = rect.width;
      mh = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = Math.floor(mw * dpr);
      c.height = Math.floor(mh * dpr);
      mctx.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    let t = 0;
    function draw() {
      mctx.clearRect(0, 0, mw, mh);
      t += 0.025;

      if (type === 'infra') {
        // Zero-loss ring buffer stream
        for (let i = 0; i < 16; i++) {
          const x = ((t * 40 + i * 22) % mw);
          mctx.beginPath();
          mctx.arc(x, mh / 2, 2.5, 0, Math.PI * 2);
          mctx.fillStyle = i % 3 === 0 ? '#4d111c' : '#ffb502';
          mctx.fill();
        }
      } else if (type === 'intelligence') {
        // Multi-sensor point cloud convergence
        for (let i = 0; i < 20; i++) {
          const a = (i / 20) * Math.PI * 2 + t;
          const r = 24 + Math.sin(t * 2 + i) * 10;
          mctx.beginPath();
          mctx.arc(mw / 2 + Math.cos(a) * r, mh / 2 + Math.sin(a) * r, 2, 0, Math.PI * 2);
          mctx.fillStyle = i % 2 === 0 ? '#4d111c' : '#ffb502';
          mctx.fill();
        }
      } else {
        // Closed-loop physical actuation
        mctx.beginPath();
        mctx.ellipse(mw / 2, mh / 2, 45, 20, 0, 0, Math.PI * 2);
        mctx.strokeStyle = '#4d111c';
        mctx.stroke();
        const px = mw / 2 + Math.cos(t * 3) * 45;
        const py = mh / 2 + Math.sin(t * 3) * 20;
        mctx.beginPath();
        mctx.arc(px, py, 3.5, 0, Math.PI * 2);
        mctx.fillStyle = '#ffb502';
        mctx.fill();
      }

      requestAnimationFrame(draw);
    }
    requestAnimationFrame(draw);
  }

  initMiniViz('vizInfra', 'infra');
  initMiniViz('vizIntel', 'intelligence');
  initMiniViz('vizReal', 'real');

  // --------------------------------------------------------------------------
  // 5. EMBEDDED SOLUTIONS CANVASES
  // --------------------------------------------------------------------------
  const energyCanvas = document.getElementById('energyCanvas');
  if (energyCanvas) {
    const ectx = energyCanvas.getContext('2d');
    let ew = 0, eh = 0;
    function resizeE() {
      const rect = energyCanvas.parentElement.getBoundingClientRect();
      ew = rect.width;
      eh = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      energyCanvas.width = Math.floor(ew * dpr);
      energyCanvas.height = Math.floor(eh * dpr);
      ectx.scale(dpr, dpr);
    }
    resizeE();
    window.addEventListener('resize', resizeE);

    let eTime = 0;
    function renderE() {
      ectx.clearRect(0, 0, ew, eh);
      eTime += 0.02;

      for (let i = 0; i < 6; i++) {
        const y = 35 + i * 32;
        ectx.beginPath();
        ectx.moveTo(0, y);
        for (let x = 0; x < ew; x += 20) {
          const wave = Math.sin((x + eTime * 50) * 0.02 + i) * 6;
          ectx.lineTo(x, y + wave);
        }
        ectx.strokeStyle = i % 2 === 0 ? '#4d111c' : '#ffb502';
        ectx.lineWidth = 1.2;
        ectx.stroke();
      }
      requestAnimationFrame(renderE);
    }
    requestAnimationFrame(renderE);
  }

  const infraCanvas = document.getElementById('infraCanvas');
  if (infraCanvas) {
    const ictx = infraCanvas.getContext('2d');
    let iw = 0, ih = 0;
    function resizeI() {
      const rect = infraCanvas.parentElement.getBoundingClientRect();
      iw = rect.width;
      ih = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      infraCanvas.width = Math.floor(iw * dpr);
      infraCanvas.height = Math.floor(ih * dpr);
      ictx.scale(dpr, dpr);
    }
    resizeI();
    window.addEventListener('resize', resizeI);

    function renderI() {
      ictx.clearRect(0, 0, iw, ih);
      const cols = 8;
      const rows = 5;
      const cw = iw / cols;
      const ch = ih / rows;

      ictx.strokeStyle = '#e5ded2';
      ictx.lineWidth = 0.8;

      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          ictx.strokeRect(c * cw + 4, r * ch + 4, cw - 8, ch - 8);
          ictx.beginPath();
          ictx.arc(c * cw + cw / 2, r * ch + ch / 2, 2, 0, Math.PI * 2);
          ictx.fillStyle = (c + r) % 3 === 0 ? '#ffb502' : '#4d111c';
          ictx.fill();
        }
      }
      requestAnimationFrame(renderI);
    }
    requestAnimationFrame(renderI);
  }

  // AI Domain Canvas
  const aiCanvas = document.getElementById('aiCanvas');
  if (aiCanvas) {
    const actx = aiCanvas.getContext('2d');
    let aw = 0, ah = 0;
    function resizeAI() {
      const rect = aiCanvas.parentElement.getBoundingClientRect();
      aw = rect.width;
      ah = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      aiCanvas.width = Math.floor(aw * dpr);
      aiCanvas.height = Math.floor(ah * dpr);
      actx.scale(dpr, dpr);
    }
    resizeAI();
    window.addEventListener('resize', resizeAI);

    const layers = [3, 5, 5, 2];
    let aiTime = 0;
    function renderAI() {
      actx.clearRect(0, 0, aw, ah);
      aiTime += 0.02;

      const layerX = layers.map((_, idx) => (aw / (layers.length + 1)) * (idx + 1));
      const nodes = layers.map((count, lIdx) => {
        const x = layerX[lIdx];
        const stepY = ah / (count + 1);
        const list = [];
        for (let i = 1; i <= count; i++) {
          list.push({ x, y: stepY * i + Math.sin(aiTime + i) * 3 });
        }
        return list;
      });

      // Connections
      for (let l = 0; l < nodes.length - 1; l++) {
        const current = nodes[l];
        const next = nodes[l + 1];
        for (let i = 0; i < current.length; i++) {
          for (let j = 0; j < next.length; j++) {
            actx.beginPath();
            actx.moveTo(current[i].x, current[i].y);
            actx.lineTo(next[j].x, next[j].y);
            const active = Math.sin(aiTime * 2 + i + j + l) > 0.4;
            actx.strokeStyle = active ? '#ffb502' : '#e5ded2';
            actx.lineWidth = active ? 1.2 : 0.6;
            actx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach((layerNodes, lIdx) => {
        layerNodes.forEach((n, nIdx) => {
          actx.beginPath();
          actx.arc(n.x, n.y, 4, 0, Math.PI * 2);
          actx.fillStyle = (lIdx + nIdx) % 2 === 0 ? '#4d111c' : '#ffb502';
          actx.fill();
          actx.strokeStyle = '#ffffff';
          actx.lineWidth = 1;
          actx.stroke();
        });
      });

      requestAnimationFrame(renderAI);
    }
    requestAnimationFrame(renderAI);
  }

  // Infrastructure & Inspection Canvas (Card 04)
  const inspectionCanvas = document.getElementById('inspectionCanvas');
  if (inspectionCanvas) {
    const sctx = inspectionCanvas.getContext('2d');
    let sw = 0, sh = 0;
    function resizeInspection() {
      const rect = inspectionCanvas.parentElement.getBoundingClientRect();
      sw = rect.width;
      sh = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      inspectionCanvas.width = Math.floor(sw * dpr);
      inspectionCanvas.height = Math.floor(sh * dpr);
      sctx.scale(dpr, dpr);
    }
    resizeInspection();
    window.addEventListener('resize', resizeInspection);

    let inspTime = 0;
    function renderInspection() {
      sctx.clearRect(0, 0, sw, sh);
      inspTime += 0.015;

      // Road pavement grid lines
      sctx.strokeStyle = '#f0ebe1';
      sctx.lineWidth = 1;
      const gridSpacing = 28;
      const offset = (inspTime * 25) % gridSpacing;
      for (let y = offset; y < sh; y += gridSpacing) {
        sctx.beginPath();
        sctx.moveTo(0, y);
        sctx.lineTo(sw, y);
        sctx.stroke();
      }
      for (let x = 0; x < sw; x += gridSpacing) {
        sctx.beginPath();
        sctx.moveTo(x, 0);
        sctx.lineTo(x, sh);
        sctx.stroke();
      }

      // Scanning sweep line
      const scanY = (Math.sin(inspTime * 1.5) * 0.5 + 0.5) * (sh - 40) + 20;
      sctx.beginPath();
      sctx.moveTo(0, scanY);
      sctx.lineTo(sw, scanY);
      sctx.strokeStyle = '#ffb502';
      sctx.lineWidth = 1.5;
      sctx.stroke();

      // Bounding box 1: Longitudinal Crack (IRC Standard)
      const b1x = sw * 0.18;
      const b1y = sh * 0.28 + Math.sin(inspTime) * 4;
      sctx.strokeStyle = '#4d111c';
      sctx.lineWidth = 1.2;
      sctx.strokeRect(b1x, b1y, 110, 48);
      sctx.fillStyle = '#4d111c';
      sctx.font = '9px "JetBrains Mono", monospace';
      sctx.fillText('CRACK-L: SEV 2', b1x + 6, b1y - 6);

      // Defect crack squiggle inside box
      sctx.beginPath();
      sctx.moveTo(b1x + 12, b1y + 36);
      sctx.lineTo(b1x + 35, b1y + 24);
      sctx.lineTo(b1x + 58, b1y + 28);
      sctx.lineTo(b1x + 92, b1y + 12);
      sctx.strokeStyle = '#4d111c';
      sctx.lineWidth = 1.5;
      sctx.stroke();

      // Bounding box 2: Pothole Detection
      const b2x = sw * 0.58;
      const b2y = sh * 0.45 - Math.sin(inspTime * 1.2) * 5;
      sctx.strokeStyle = '#ffb502';
      sctx.lineWidth = 1.2;
      sctx.strokeRect(b2x, b2y, 88, 52);
      sctx.fillStyle = '#ffb502';
      sctx.fillText('POTHOLE: 16cm', b2x + 6, b2y - 6);

      // Defect ellipse
      sctx.beginPath();
      sctx.ellipse(b2x + 44, b2y + 26, 26, 14, 0.2, 0, Math.PI * 2);
      sctx.strokeStyle = '#ffb502';
      sctx.lineWidth = 1.5;
      sctx.stroke();

      // Telemetry HUD tags
      sctx.fillStyle = '#827d73';
      sctx.font = '9px "JetBrains Mono", monospace';
      sctx.fillText('SURVEY: NHAI-CORRIDOR-04', 16, sh - 14);
      sctx.fillText('IRC-SPALL // VERIFIED', sw - 140, sh - 14);

      requestAnimationFrame(renderInspection);
    }
    requestAnimationFrame(renderInspection);
  }

  // Voice & Speech Data Canvas (Card 05)
  const voiceCanvas = document.getElementById('voiceCanvas');
  if (voiceCanvas) {
    const vctx = voiceCanvas.getContext('2d');
    let vw = 0, vh = 0;
    function resizeVoice() {
      const rect = voiceCanvas.parentElement.getBoundingClientRect();
      vw = rect.width;
      vh = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      voiceCanvas.width = Math.floor(vw * dpr);
      voiceCanvas.height = Math.floor(vh * dpr);
      vctx.scale(dpr, dpr);
    }
    resizeVoice();
    window.addEventListener('resize', resizeVoice);

    let vTime = 0;
    function renderVoice() {
      vctx.clearRect(0, 0, vw, vh);
      vTime += 0.025;

      const tracks = [
        { label: 'HINDI (HI-IN)', color: '#4d111c', yRatio: 0.28, freq: 0.03, amp: 22 },
        { label: 'ENGLISH (EN-IN)', color: '#ffb502', yRatio: 0.54, freq: 0.04, amp: 18 },
        { label: 'GUJARATI (GU-IN)', color: '#827d73', yRatio: 0.80, freq: 0.025, amp: 16 }
      ];

      tracks.forEach((tr, tIdx) => {
        const centerY = vh * tr.yRatio;

        // Label
        vctx.fillStyle = tr.color;
        vctx.font = '9px "JetBrains Mono", monospace';
        vctx.fillText(tr.label, 16, centerY - 14);

        // Center guideline
        vctx.strokeStyle = '#f0ebe1';
        vctx.lineWidth = 0.8;
        vctx.beginPath();
        vctx.moveTo(16, centerY);
        vctx.lineTo(vw - 16, centerY);
        vctx.stroke();

        // Audio waveform path
        vctx.beginPath();
        vctx.moveTo(16, centerY);
        for (let x = 16; x < vw - 16; x += 4) {
          const envelope = Math.sin((x / vw) * Math.PI); // Window envelope
          const wave1 = Math.sin((x + vTime * 45 + tIdx * 30) * tr.freq);
          const wave2 = Math.cos((x - vTime * 25) * (tr.freq * 2.1));
          const y = centerY + (wave1 * 0.7 + wave2 * 0.3) * tr.amp * envelope;
          vctx.lineTo(x, y);
        }
        vctx.strokeStyle = tr.color;
        vctx.lineWidth = 1.4;
        vctx.stroke();
      });

      // Frequency spectrogram vertical spikes at bottom
      vctx.fillStyle = 'rgba(77, 17, 28, 0.05)';
      vctx.fillRect(0, vh - 24, vw, 24);

      requestAnimationFrame(renderVoice);
    }
    requestAnimationFrame(renderVoice);
  }

  // Hero Canvas for Dedicated Infrastructure Page
  const inspectionHeroCanvas = document.getElementById('inspectionHeroCanvas');
  if (inspectionHeroCanvas) {
    const ihctx = inspectionHeroCanvas.getContext('2d');
    let ihw = 0, ihh = 0;
    function resizeHeroInspection() {
      const rect = inspectionHeroCanvas.parentElement.getBoundingClientRect();
      ihw = rect.width;
      ihh = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      inspectionHeroCanvas.width = Math.floor(ihw * dpr);
      inspectionHeroCanvas.height = Math.floor(ihh * dpr);
      ihctx.scale(dpr, dpr);
    }
    resizeHeroInspection();
    window.addEventListener('resize', resizeHeroInspection);

    let hTime = 0;
    function renderHeroInspection() {
      ihctx.clearRect(0, 0, ihw, ihh);
      hTime += 0.018;

      // Highway perspective corridor lines
      ihctx.strokeStyle = '#ded7cb';
      ihctx.lineWidth = 1;
      const centerX = ihw * 0.5;
      const horizonY = ihh * 0.22;

      // Vanishing point lines
      [-0.45, -0.28, -0.1, 0.1, 0.28, 0.45].forEach(ratio => {
        ihctx.beginPath();
        ihctx.moveTo(centerX, horizonY);
        ihctx.lineTo(centerX + ihw * ratio, ihh);
        ihctx.stroke();
      });

      // Transverse road markings moving down
      const stepDist = 32;
      const scroll = (hTime * 35) % stepDist;
      for (let y = horizonY + scroll; y < ihh; y += stepDist) {
        const spread = (y - horizonY) / (ihh - horizonY);
        ihctx.beginPath();
        ihctx.moveTo(centerX - ihw * 0.45 * spread, y);
        ihctx.lineTo(centerX + ihw * 0.45 * spread, y);
        ihctx.strokeStyle = `rgba(222, 215, 203, ${0.15 + spread * 0.8})`;
        ihctx.stroke();
      }

      // Detection Box 1: Pothole with depth
      const p1x = centerX - ihw * 0.22;
      const p1y = ihh * 0.58;
      ihctx.strokeStyle = '#ffb502';
      ihctx.lineWidth = 1.5;
      ihctx.strokeRect(p1x, p1y, 110, 50);
      ihctx.fillStyle = '#ffb502';
      ihctx.font = '10px "JetBrains Mono", monospace';
      ihctx.fillText('POTHOLE [D: 18cm]', p1x, p1y - 8);
      ihctx.fillText('SEVERITY: HIGH (IRC-SP-84)', p1x, p1y + 64);

      // Detection Box 2: Alligator Cracking
      const p2x = centerX + ihw * 0.12;
      const p2y = ihh * 0.48;
      ihctx.strokeStyle = '#4d111c';
      ihctx.lineWidth = 1.5;
      ihctx.strokeRect(p2x, p2y, 130, 60);
      ihctx.fillStyle = '#4d111c';
      ihctx.fillText('ALLIGATOR CRACK // 4.8m²', p2x, p2y - 8);
      ihctx.fillText('STRUCTURAL QA: REVIEWS PASSED', p2x, p2y + 74);

      // Overlay status telemetry
      ihctx.fillStyle = '#272727';
      ihctx.font = '11px "JetBrains Mono", monospace';
      ihctx.fillText('SCAN RATE: 240 KM/DAY', 24, 30);
      ihctx.fillText('CHAINAGE: KM 184+620', 24, 48);

      ihctx.fillStyle = '#4d111c';
      ihctx.fillText('ACCURACY: 99.2% AGREEMENT WITH CLIENT BENCHMARK', ihw - 380, 30);

      requestAnimationFrame(renderHeroInspection);
    }
    requestAnimationFrame(renderHeroInspection);
  }

  // Hero Canvas for Dedicated Voice Page
  const voiceHeroCanvas = document.getElementById('voiceHeroCanvas');
  if (voiceHeroCanvas) {
    const vhctx = voiceHeroCanvas.getContext('2d');
    let vhw = 0, vhh = 0;
    function resizeHeroVoice() {
      const rect = voiceHeroCanvas.parentElement.getBoundingClientRect();
      vhw = rect.width;
      vhh = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      voiceHeroCanvas.width = Math.floor(vhw * dpr);
      voiceHeroCanvas.height = Math.floor(vhh * dpr);
      vhctx.scale(dpr, dpr);
    }
    resizeHeroVoice();
    window.addEventListener('resize', resizeHeroVoice);

    let vhTime = 0;
    function renderHeroVoice() {
      vhctx.clearRect(0, 0, vhw, vhh);
      vhTime += 0.02;

      // Frequency spectral bars
      const numBars = 54;
      const barWidth = (vhw - 48) / numBars;
      for (let i = 0; i < numBars; i++) {
        const h = Math.abs(Math.sin(vhTime * 2 + i * 0.28) * Math.cos(vhTime + i * 0.15)) * (vhh * 0.45) + 8;
        const x = 24 + i * barWidth;
        const y = vhh * 0.65 - h;
        vhctx.fillStyle = i % 3 === 0 ? '#4d111c' : (i % 3 === 1 ? '#ffb502' : '#ded7cb');
        vhctx.fillRect(x, y, barWidth - 2, h);
      }

      // Smooth envelope curve overlay
      vhctx.beginPath();
      vhctx.moveTo(24, vhh * 0.35);
      for (let x = 24; x < vhw - 24; x += 6) {
        const y = vhh * 0.32 + Math.sin((x + vhTime * 50) * 0.02) * 22 * Math.sin(x * 0.005);
        vhctx.lineTo(x, y);
      }
      vhctx.strokeStyle = '#4d111c';
      vhctx.lineWidth = 2;
      vhctx.stroke();

      // Audio transcription alignment badges
      const markers = [
        { x: vhw * 0.15, label: '[00:01.2] "नमस्ते, मैं कैसे मदद करूँ?"', lang: 'HINDI' },
        { x: vhw * 0.48, label: '[00:03.8] "Confirm the payment gateway"', lang: 'INDIAN ENGLISH' },
        { x: vhw * 0.78, label: '[00:06.4] "કાલે સવારે આવી જઈશ"', lang: 'KATHIYAWADI GUJARATI' }
      ];

      markers.forEach(m => {
        vhctx.strokeStyle = '#ffb502';
        vhctx.lineWidth = 1;
        vhctx.setLineDash([4, 4]);
        vhctx.beginPath();
        vhctx.moveTo(m.x, vhh * 0.18);
        vhctx.lineTo(m.x, vhh * 0.82);
        vhctx.stroke();
        vhctx.setLineDash([]);

        vhctx.fillStyle = '#4d111c';
        vhctx.font = '10px "JetBrains Mono", monospace';
        vhctx.fillText(m.lang, m.x + 6, vhh * 0.22);
        vhctx.fillStyle = '#272727';
        vhctx.font = '11.5px "Inter", sans-serif';
        vhctx.fillText(m.label, m.x + 6, vhh * 0.28);
      });

      // HUD Telemetry
      vhctx.fillStyle = '#827d73';
      vhctx.font = '10px "JetBrains Mono", monospace';
      vhctx.fillText('SAMPLING: 48 KHZ / 24-BIT FLAC', 24, vhh - 16);
      vhctx.fillText('DIALECT VARIATIONS: 14 REGIONAL ACCENTS MAPPED', vhw - 360, vhh - 16);

      requestAnimationFrame(renderHeroVoice);
    }
    requestAnimationFrame(renderHeroVoice);
  }

  // --------------------------------------------------------------------------
  // 6. STICKY HEADER & SCROLL REVEAL
  // --------------------------------------------------------------------------
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 7. CONSULTATION DRAWER
  // --------------------------------------------------------------------------
  const modal = document.getElementById('consultationModal');
  const openBtns = document.querySelectorAll('[data-open-consultation]');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('consultationForm');

  function openM() {
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeM() {
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openM();
  }));

  if (closeBtn) closeBtn.addEventListener('click', closeM);
  if (modal) modal.addEventListener('click', (e) => {
    if (e.target === modal) closeM();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      btn.textContent = 'Submitting Data Inquiry...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = 'Inquiry Received ✓';
        setTimeout(() => {
          form.reset();
          btn.textContent = 'Submit Data Inquiry →';
          btn.disabled = false;
          closeM();
        }, 1600);
      }, 700);
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeM();
  });
});
