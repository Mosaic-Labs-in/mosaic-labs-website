/**
 * MOSAIC LABS — REFINED ENTRANCE SEQUENCE
 * Sequence:
 * 1. Subtle dark background (#0d0d0e)
 * 2. Small Mosaic mark fragments appear at center
 * 3. Minimal geometric lines assemble into the 9 tiles
 * 4. Visual resolves with crisp clarity
 * 5. Smooth curtain dissolve into the editorial hero
 * 6. Hero typography reveals sequentially
 */

(function() {
  'use strict';

  // Check prefers-reduced-motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const overlay = document.getElementById('entranceOverlay');
    if (overlay) overlay.style.display = 'none';
    revealHeroElements();
    return;
  }

  const overlay = document.getElementById('entranceOverlay');
  const canvas = document.getElementById('entranceCanvas');
  if (!canvas || !overlay) return;

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;

  // Exact 9 non-square SVG paths from official Mosaic Labs logo (viewBox: 211 140 801 757)
  const LOGO_VB = { x: 211, y: 140, w: 801, h: 757 };
  const PATH_DATA = [
    "M471 409 L 757 445.5 L 758 459.4 L 750.7 658.3 L 495.4 645.4 L 494.5 644.5 L 471 415.7 Z",
    "M776 657.2 L 783.4 450 L 1012 450 L 1012 660 L 776 660 Z",
    "M775 686 L 1012 686 L 1012 891 L 1011 892 L 794 892 L 792.8 891.4 L 774.1 686.9 Z",
    "M782 417.4 L 791.1 217 L 1012 217 L 1012 424 L 782 424 Z",
    "M518 377.6 L 529.2 217 L 766 217 L 756.9 421 L 755.1 421 L 518 381.9 Z",
    "M529 719 L 743 686.1 L 769.5 887.5 L 763 889 L 727.9 894.7 L 632.3 897 L 562 897 L 560.6 895.6 L 529 721.2 Z",
    "M211 587 L 211 584.7 L 231.3 390.7 L 408.4 398.7 L 426.7 592.3 Z",
    "M291 319.5 L 332.3 140 L 335 140 L 510 188.3 L 510 190.2 L 461.5 369 L 459.1 369 L 291 322.3 Z",
    "M339 897 L 318 897 L 317 896 L 360.4 711.6 L 458.7 687 L 463.3 687 L 503 862.9 L 503 866.6 L 342.2 896.7 Z"
  ];

  const PATH_OBJECTS = PATH_DATA.map(d => new Path2D(d));
  const FULL_LOGO_PATH = new Path2D();
  PATH_DATA.forEach(d => FULL_LOGO_PATH.addPath(new Path2D(d)));

  // Assembly fragments
  const fragments = PATH_DATA.map((_, i) => ({
    angle: (i / 9) * Math.PI * 2,
    dist: 120 + (i % 3) * 60,
    alpha: 0
  }));

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener('resize', resize);

  const T_START = performance.now();
  const DURATION_ASSEMBLE = 850; // ms
  const DURATION_RESOLVE  = 1150; // ms
  const DURATION_DISSOLVE = 1450; // ms

  const easeOutCubic = t => 1 - Math.pow(1 - t, 3);
  const easeInOutCubic = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  function renderEntrance(now) {
    const elapsed = now - T_START;
    ctx.clearRect(0, 0, w, h);

    // Palette charcoal background (#272727)
    ctx.fillStyle = '#272727';
    ctx.fillRect(0, 0, w, h);

    const cx = w / 2;
    const cy = h / 2;
    // Elegant, medium mark size for cinematic feel (120px wide)
    const markSize = Math.min(w * 0.28, 110);
    const scale = markSize / LOGO_VB.w;

    if (elapsed < DURATION_ASSEMBLE) {
      // Stage 1 & 2: Fragments assembling into mark
      const p = easeOutCubic(elapsed / DURATION_ASSEMBLE);

      ctx.save();
      ctx.translate(cx, cy);

      PATH_OBJECTS.forEach((pathObj, idx) => {
        const frag = fragments[idx];
        const offset = (1 - p) * frag.dist;
        const ox = Math.cos(frag.angle) * offset;
        const oy = Math.sin(frag.angle) * offset;

        ctx.save();
        ctx.translate(ox, oy);
        ctx.scale(scale, scale);
        ctx.translate(-(LOGO_VB.x + LOGO_VB.w / 2), -(LOGO_VB.y + LOGO_VB.h / 2));

        ctx.strokeStyle = `rgba(255, 255, 255, ${p * 0.75})`;
        ctx.lineWidth = 1.4;
        ctx.stroke(pathObj);

        // Minimal amber assembly vector
        if (p > 0.4) {
          ctx.fillStyle = `rgba(255, 181, 2, ${(p - 0.4) * 0.35})`;
          ctx.fill(pathObj);
        }
        ctx.restore();
      });

      ctx.restore();

    } else if (elapsed < DURATION_RESOLVE) {
      // Stage 3: Visual resolves with crisp solid white
      const p = (elapsed - DURATION_ASSEMBLE) / (DURATION_RESOLVE - DURATION_ASSEMBLE);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-(LOGO_VB.x + LOGO_VB.w / 2), -(LOGO_VB.y + LOGO_VB.h / 2));

      ctx.fillStyle = '#ffffff';
      ctx.fill(FULL_LOGO_PATH);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke(FULL_LOGO_PATH);

      ctx.restore();

    } else if (elapsed < DURATION_DISSOLVE) {
      // Stage 4: Smooth mask dissolve into light editorial homepage
      const p = easeInOutCubic((elapsed - DURATION_RESOLVE) / (DURATION_DISSOLVE - DURATION_RESOLVE));
      overlay.style.opacity = `${Math.max(0, 1 - p * 1.15)}`;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-(LOGO_VB.x + LOGO_VB.w / 2), -(LOGO_VB.y + LOGO_VB.h / 2));

      ctx.fillStyle = '#ffffff';
      ctx.fill(FULL_LOGO_PATH);
      ctx.restore();

    } else {
      // Complete & Reveal
      overlay.classList.add('hidden');
      revealHeroElements();
      return;
    }

    requestAnimationFrame(renderEntrance);
  }

  function revealHeroElements() {
    const heroElements = document.querySelectorAll('.hero-section [data-reveal]');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, i * 160);
    });
  }

  requestAnimationFrame(renderEntrance);
})();
