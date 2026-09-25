/**
 * MOSAIC LABS - HERO DATA CANVAS ENGINE
 * Recreates the Mosaic Labs logo mark with cascading numbers and data telemetry
 * inspired by the motion graphics reference (Pinterest: pin.it/4VayblXDe).
 */

(function() {
  'use strict';

  const canvas = document.getElementById('mosaicCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = 1;

  // Mouse state
  const mouse = { x: -1000, y: -1000, active: false };

  // Current active mode: 'raw' | 'edge' | 'structured'
  let currentMode = 'raw';

  // Digital glyphs for number streams (inspired by Pinterest reference)
  const DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const HEX_GLYPHS = ['0x1F', '0xA4', '0xC2', '0x8E', '0x5B', '0xFF', '0x3D', '0x70'];
  const TELEMETRY_SNIPPETS = [
    'DATA: INGEST', 'SCHEMA: PARQUET', 'FORMAT: COCO', 'QA: VERIFIED',
    'REDACT: PII_CLEAR', 'PROV: SIGNED', 'FEED: ACTIVE', 'STATUS: READY',
    'SOURCE: PARTNER', 'STAGE: STRUCTURING', 'TIER: BENCHMARK', 'LIC: AUDITED'
  ];

  // Colors from brand palette
  const COLORS = {
    bg: '#1e1e1e',
    tileDark: '#2a2a2a',
    tileMid: '#343434',
    tileLight: '#444444',
    parchment: '#e5ded2',
    white: '#ffffff',
    gold: '#ffb502',
    burgundy: '#4d111c',
    rule: 'rgba(229, 222, 210, 0.15)'
  };

  /**
   * Structure representing a tile in the 3x3 Mosaic grid
   */
  class MosaicBlock {
    constructor(row, col, isFragmented = false, fragType = 0) {
      this.row = row;
      this.col = col;
      this.isFragmented = isFragmented;
      this.fragType = fragType;
      
      // Animation timers
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 1.5 + Math.random() * 2.0;
      this.highlight = 0;
      
      // Data cascade columns inside the block
      this.subColumns = [];
      const colCount = isFragmented ? 2 : 4;
      for (let c = 0; c < colCount; c++) {
        this.subColumns.push({
          digits: Array.from({ length: 6 }, () => DIGITS[Math.floor(Math.random() * DIGITS.length)]),
          offsetY: Math.random() * 20,
          speed: 15 + Math.random() * 35,
          nextChange: 0
        });
      }

      this.currentSnippet = TELEMETRY_SNIPPETS[Math.floor(Math.random() * TELEMETRY_SNIPPETS.length)];
      this.snippetTimer = Math.random() * 2;
    }

    update(dt) {
      this.pulsePhase += this.pulseSpeed * dt;
      this.snippetTimer -= dt;
      if (this.snippetTimer <= 0) {
        this.snippetTimer = 1.5 + Math.random() * 3.0;
        this.currentSnippet = TELEMETRY_SNIPPETS[Math.floor(Math.random() * TELEMETRY_SNIPPETS.length)];
      }

      // Update data columns
      this.subColumns.forEach(col => {
        let currentSpeed = col.speed;
        if (currentMode === 'raw') currentSpeed *= 1.4;
        if (currentMode === 'structured') currentSpeed *= 0.6;
        if (this.highlight > 0.3) currentSpeed *= 2.0;

        col.offsetY += currentSpeed * dt;
        if (col.offsetY > 16) {
          col.offsetY = 0;
          col.digits.unshift(DIGITS[Math.floor(Math.random() * DIGITS.length)]);
          col.digits.pop();
        }
      });

      // Decay highlight smoothly
      this.highlight *= 0.92;
    }
  }

  // Create the 3x3 layout of blocks
  // Left column (col 0) is fragmented as in the official Mosaic logo!
  const blocks = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const isFrag = (c === 0);
      blocks.push(new MosaicBlock(r, c, isFrag, r));
    }
  }

  // Floating ambient stream particles
  const particles = [];
  for (let i = 0; i < 30; i++) {
    particles.push({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.05,
      vy: 0.03 + Math.random() * 0.07,
      size: 2 + Math.random() * 4,
      val: DIGITS[Math.floor(Math.random() * DIGITS.length)],
      alpha: 0.2 + Math.random() * 0.5
    });
  }

  /**
   * Resize Canvas for retina displays
   */
  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    dpr = window.devicePixelRatio || 1;

    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
  }

  /**
   * Main Render Loop
   */
  let lastTime = performance.now();
  function render(now) {
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;

    ctx.clearRect(0, 0, width, height);

    // Grid sizing and centering
    const pad = Math.min(width, height) * 0.12;
    const gridArea = Math.min(width, height) - pad * 2;
    const originX = (width - gridArea) / 2;
    const originY = (height - gridArea) / 2;
    const blockGap = gridArea * 0.045;
    const blockSize = (gridArea - blockGap * 2) / 3;

    // Render subtle background grid
    ctx.strokeStyle = 'rgba(229, 222, 210, 0.06)';
    ctx.lineWidth = 1;
    const subStep = blockSize / 4;
    for (let x = originX; x <= originX + gridArea; x += subStep) {
      ctx.beginPath();
      ctx.moveTo(x, originY);
      ctx.lineTo(x, originY + gridArea);
      ctx.stroke();
    }
    for (let y = originY; y <= originY + gridArea; y += subStep) {
      ctx.beginPath();
      ctx.moveTo(originX, y);
      ctx.lineTo(originX + gridArea, y);
      ctx.stroke();
    }

    // Render each Mosaic block
    blocks.forEach(block => {
      block.update(dt);

      const bx = originX + block.col * (blockSize + blockGap);
      const by = originY + block.row * (blockSize + blockGap);

      // Check distance to mouse
      if (mouse.active) {
        const cx = bx + blockSize / 2;
        const cy = by + blockSize / 2;
        const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
        if (dist < blockSize * 1.2) {
          block.highlight = Math.max(block.highlight, 1 - dist / (blockSize * 1.2));
        }
      }

      if (block.isFragmented) {
        renderFragmentedBlock(block, bx, by, blockSize);
      } else {
        renderSolidBlock(block, bx, by, blockSize);
      }
    });

    // Render floating data particles
    renderParticles(dt, originX, originY, gridArea);

    requestAnimationFrame(render);
  }

  /**
   * Render a Solid 3x3 Tile with streaming numbers inside
   */
  function renderSolidBlock(block, x, y, size) {
    ctx.save();
    
    // Background Fill & Outline
    const pulseVal = Math.sin(block.pulsePhase);
    let baseColor = COLORS.tileDark;
    if (block.highlight > 0.1) {
      baseColor = '#3a2215'; // Warm amber tint on hover
    }

    ctx.fillStyle = baseColor;
    ctx.fillRect(x, y, size, size);

    // Border
    if (block.highlight > 0.2) {
      ctx.strokeStyle = COLORS.gold;
      ctx.lineWidth = 1.5;
    } else {
      ctx.strokeStyle = COLORS.rule;
      ctx.lineWidth = 1;
    }
    ctx.strokeRect(x, y, size, size);

    // Clip internal data cascade to the block rectangle
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.clip();

    // Data elements flashing inside (Pinterest reference style)
    const colCount = block.subColumns.length;
    const colWidth = size / colCount;

    block.subColumns.forEach((colData, colIndex) => {
      const colX = x + colIndex * colWidth;

      // Vertical background strip with shifting alpha
      const stripAlpha = 0.05 + 0.06 * Math.sin(block.pulsePhase + colIndex);
      ctx.fillStyle = `rgba(255, 255, 255, ${stripAlpha})`;
      ctx.fillRect(colX, y, colWidth - 1, size);

      // Streaming digits
      ctx.font = '500 11px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';

      colData.digits.forEach((digit, dIdx) => {
        const digitY = y + 16 + dIdx * 17 - colData.offsetY;
        if (digitY < y - 5 || digitY > y + size + 5) return;

        // Active highlighted digits
        const isGold = (dIdx === 1 && Math.sin(block.pulsePhase * 2 + colIndex) > 0.4);
        const isWhite = (dIdx === 2);

        if (block.highlight > 0.4) {
          ctx.fillStyle = isGold ? COLORS.gold : (isWhite ? COLORS.white : COLORS.parchment);
        } else if (currentMode === 'structured') {
          ctx.fillStyle = isGold ? COLORS.gold : 'rgba(229, 222, 210, 0.85)';
        } else {
          ctx.fillStyle = isGold ? COLORS.gold : (isWhite ? COLORS.white : 'rgba(229, 222, 210, 0.55)');
        }

        ctx.fillText(digit, colX + colWidth / 2, digitY);
      });
    });

    // Telemetry label strip at bottom of center block
    if (block.row === 1 && block.col === 1) {
      ctx.fillStyle = 'rgba(77, 17, 28, 0.7)';
      ctx.fillRect(x, y + size - 18, size, 18);
      ctx.font = '600 8.5px "JetBrains Mono", monospace';
      ctx.fillStyle = COLORS.gold;
      ctx.textAlign = 'center';
      ctx.fillText(block.currentSnippet, x + size / 2, y + size - 6);
    }

    ctx.restore();
  }

  /**
   * Render a Fragmented Tile (Representing the left assembling pieces)
   */
  function renderFragmentedBlock(block, x, y, size) {
    ctx.save();

    // The left block is broken into sub-tiles
    const subSize = (size - 6) / 2;
    
    // Subtile offsets based on fragment type
    const subPositions = [
      { x: x, y: y },
      { x: x + subSize + 6, y: y },
      { x: x, y: y + subSize + 6 },
      { x: x + subSize + 6, y: y + subSize + 6 }
    ];

    subPositions.forEach((pos, idx) => {
      // In row 0, the top-left sub-tile is further broken down or animated
      if (block.row === 0 && idx === 0) {
        // 4 micro-pixels
        const microSize = (subSize - 3) / 2;
        for (let mx = 0; mx < 2; mx++) {
          for (let my = 0; my < 2; my++) {
            const px = pos.x + mx * (microSize + 3);
            const py = pos.y + my * (microSize + 3);
            const isLit = Math.sin(block.pulsePhase * 3 + mx + my) > 0.2;
            
            ctx.fillStyle = isLit ? COLORS.gold : COLORS.tileMid;
            ctx.fillRect(px, py, microSize, microSize);
            ctx.strokeStyle = isLit ? COLORS.gold : COLORS.rule;
            ctx.strokeRect(px, py, microSize, microSize);
            
            // Micro-digit
            ctx.font = '600 7px "JetBrains Mono", monospace';
            ctx.fillStyle = isLit ? COLORS.bg : COLORS.parchment;
            ctx.textAlign = 'center';
            ctx.fillText((mx + my + 1).toString(), px + microSize / 2, py + microSize - 2);
          }
        }
        return;
      }

      // Standard sub-tile
      const isLit = (idx === 1 || block.highlight > 0.3);
      ctx.fillStyle = isLit ? (block.highlight > 0.4 ? '#3d2015' : COLORS.tileMid) : COLORS.tileDark;
      ctx.fillRect(pos.x, pos.y, subSize, subSize);

      ctx.strokeStyle = isLit ? (block.highlight > 0.4 ? COLORS.gold : COLORS.rule) : COLORS.rule;
      ctx.strokeRect(pos.x, pos.y, subSize, subSize);

      // Data number in each sub-tile
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillStyle = isLit ? COLORS.gold : COLORS.parchment;
      const num = block.subColumns[0].digits[idx % block.subColumns[0].digits.length];
      ctx.fillText(num, pos.x + subSize / 2, pos.y + subSize / 2 + 4);
    });

    ctx.restore();
  }

  /**
   * Render floating ambient data particles
   */
  function renderParticles(dt, originX, originY, gridArea) {
    ctx.save();
    ctx.font = '500 9px "JetBrains Mono", monospace';

    particles.forEach(p => {
      p.y += p.vy * dt;
      p.x += p.vx * dt;

      if (p.y > 1) {
        p.y = 0;
        p.x = Math.random();
        p.val = DIGITS[Math.floor(Math.random() * DIGITS.length)];
      }

      const px = originX + p.x * gridArea;
      const py = originY + p.y * gridArea;

      ctx.fillStyle = `rgba(255, 181, 2, ${p.alpha * 0.45})`;
      ctx.fillText(p.val, px, py);
    });

    ctx.restore();
  }

  // Event Listeners
  window.addEventListener('resize', resize);
  
  canvas.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });

  canvas.addEventListener('mouseleave', () => {
    mouse.active = false;
  });

  // Mode switcher interaction
  const modeButtons = document.querySelectorAll('.mode-btn');
  const streamRateDisplay = document.querySelector('.stream-rate strong');

  modeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      modeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentMode = btn.getAttribute('data-mode') || 'raw';

      if (streamRateDisplay) {
        if (currentMode === 'raw') streamRateDisplay.textContent = '120.4k pkt/s';
        if (currentMode === 'edge') streamRateDisplay.textContent = '48.2k pkt/s';
        if (currentMode === 'structured') streamRateDisplay.textContent = '12.8k pkt/s';
      }
    });
  });

  // Init
  resize();
  requestAnimationFrame(render);
})();
