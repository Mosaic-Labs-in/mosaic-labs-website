"use client";

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * MOSAIC logo assembly — locked preset:
 *   assembly: shatter · order: R → L · palette: spectrum · shadow: off · surface: paper
 *
 * Requires: npm i three @types/three
 * Usage: <MosaicLogoAssembly />  (fills its parent; give the parent a size)
 */

type Tile = { name: string; pts: [number, number][]; color: string };

const TILES: Tile[] = [
  { name: 'tile-tilt',    pts: [[291,319.5],[332.3,140],[335,140],[510,188.3],[510,190.2],[461.5,369],[459.1,369],[291,322.3]], color: '#4D111C' },
  { name: 'tile-top-mid', pts: [[518,377.6],[529.2,217],[766,217],[756.9,421],[755.1,421],[518,381.9]], color: '#FFB502' },
  { name: 'tile-top-rt',  pts: [[782,417.4],[791.1,217],[1012,217],[1012,424],[782,424]], color: '#272727' },
  { name: 'tile-mid-lt',  pts: [[211,587],[211,584.7],[231.3,390.7],[408.4,398.7],[426.7,592.3]], color: '#E5DED2' },
  { name: 'tile-center',  pts: [[471,409],[757,445.5],[758,459.4],[750.7,658.3],[495.4,645.4],[494.5,644.5],[471,415.7]], color: '#FFFFFF' },
  { name: 'tile-mid-rt',  pts: [[776,657.2],[783.4,450],[1012,450],[1012,660],[776,660]], color: '#4D111C' },
  { name: 'tile-bot-lt',  pts: [[339,897],[318,897],[317,896],[360.4,711.6],[458.7,687],[463.3,687],[503,862.9],[503,866.6],[342.2,896.7]], color: '#FFB502' },
  { name: 'tile-bot-mid', pts: [[529,719],[743,686.1],[769.5,887.5],[763,889],[727.9,894.7],[632.3,897],[562,897],[560.6,895.6],[529,721.2]], color: '#E5DED2' },
  { name: 'tile-bot-rt',  pts: [[775,686],[1012,686],[1012,891],[1011,892],[794,892],[792.8,891.4],[774.1,686.9]], color: '#272727' }
];

const CX = 611.5, CY = 518.5, S = 300;      // logo pixel space -> world units
const START_DELAY = 0.25;
const INK = new THREE.Color('#272727'); // tiles resolve to the logo's black
const INK_HOLD = 0.65, INK_DUR = 1.6;

// shatter
const M = {
  dur: 1.25,
  stagger: 0.105,
  back: 1.35,
  tumble: 6.0,
  scale0: 0.4,
  spinY: 0.85,
  spinX: -0.42,
  dolly: 2.6,
  start: (cx: number, cy: number, r: () => number) => {
    const d = new THREE.Vector3(cx, cy, 0.4).normalize();
    const s = 5.5 + r() * 5.5;
    return new THREE.Vector3(
      d.x * s + (r() - 0.5) * 3.5,
      d.y * s + (r() - 0.5) * 3.5,
      -3.5 - r() * 7
    );
  }
};

// paper
const SURFACE = { roughness: 0.78, metalness: 0.0, env: 0.45 };

type Piece = {
  mesh: THREE.Mesh<THREE.ExtrudeGeometry, THREE.MeshStandardMaterial>;
  base: THREE.Color;
  target: THREE.Vector3;
  start: THREE.Vector3;
  startQ: THREE.Quaternion;
  endQ: THREE.Quaternion;
  delay: number;
};

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => {
  const c = M.back;
  return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
};
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const seeded = () => {
  let s = 20260822;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
};

export default function MosaicLogoAssembly({
  className,
  showWordmark = true
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLDivElement>(null);
  const restartRef = useRef<() => void>(() => {});

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(0, 0, 9.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    host.appendChild(renderer.domElement);

    // soft studio environment (no shadows in this preset)
    const envTexture = () => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 32;
      const g = c.getContext('2d')!;
      const grad = g.createLinearGradient(0, 0, 0, 32);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.5, '#dcdad5');
      grad.addColorStop(1, '#8f8d88');
      g.fillStyle = grad;
      g.fillRect(0, 0, 64, 32);
      g.fillStyle = '#ffffff';
      g.fillRect(10, 1, 26, 7);
      const tex = new THREE.CanvasTexture(c);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.colorSpace = THREE.SRGBColorSpace;
      const pmrem = new THREE.PMREMGenerator(renderer);
      const env = pmrem.fromEquirectangular(tex).texture;
      pmrem.dispose();
      tex.dispose();
      return env;
    };
    scene.environment = envTexture();
    scene.environmentIntensity = 0.85;
    scene.add(new THREE.HemisphereLight('#ffffff', '#cfccc5', 0.5));

    const key = new THREE.DirectionalLight('#fffaf2', 2.6);
    key.position.set(1.1, 2.4, 9.5);
    scene.add(key);
    const fill = new THREE.DirectionalLight('#e8f0ff', 0.5);
    fill.position.set(-5, -2, 4);
    scene.add(fill);

    const logo = new THREE.Group();
    logo.name = 'mosaic-logo';
    scene.add(logo);

    const pieces: Piece[] = [];
    for (const t of TILES) {
      const world = t.pts.map(([x, y]) => [(x - CX) / S, -(y - CY) / S] as [number, number]);
      const cx = world.reduce((a, p) => a + p[0], 0) / world.length;
      const cy = world.reduce((a, p) => a + p[1], 0) / world.length;

      const shape = new THREE.Shape();
      world.forEach(([x, y], i) =>
        i ? shape.lineTo(x - cx, y - cy) : shape.moveTo(x - cx, y - cy)
      );
      shape.closePath();

      const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.14,
        bevelEnabled: true,
        bevelThickness: 0.016,
        bevelSize: 0.014,
        bevelSegments: 3,
        curveSegments: 1
      });
      geo.translate(0, 0, -0.07);

      const mat = new THREE.MeshStandardMaterial({
        name: `${t.name}-mat`,
        color: new THREE.Color(t.color),
        roughness: SURFACE.roughness,
        metalness: SURFACE.metalness,
        envMapIntensity: SURFACE.env
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.name = t.name;
      logo.add(mesh);

      pieces.push({
        mesh,
        base: new THREE.Color(t.color),
        target: new THREE.Vector3(cx, cy, 0),
        start: new THREE.Vector3(),
        startQ: new THREE.Quaternion(),
        endQ: new THREE.Quaternion(),
        delay: START_DELAY
      });
    }

    // R → L, column by column
    let total = 0;
    const buildMotion = () => {
      const r = seeded();
      for (const p of pieces) {
        p.start.copy(M.start(p.target.x, p.target.y, r));
        p.startQ.setFromEuler(
          new THREE.Euler(
            (r() - 0.5) * M.tumble,
            (r() - 0.5) * M.tumble,
            (r() - 0.5) * M.tumble
          )
        );
        p.delay = START_DELAY + r() * 0.06;
      }
      const col = (p: Piece) => Math.round(p.target.x * 1.6);
      pieces
        .slice()
        .sort((a, b) => col(b) - col(a) || b.target.y - a.target.y)
        .forEach((p, i) => {
          p.delay += i * M.stagger;
        });
      total = Math.max(...pieces.map((p) => p.delay)) + M.dur;
    };
    buildMotion();

    let t0 = performance.now();
    const restart = () => {
      t0 = performance.now();
      wordRef.current?.classList.remove('is-on');
    };
    restartRef.current = restart;
    renderer.domElement.addEventListener('click', restart);

    const tmpQ = new THREE.Quaternion();
    let raf = 0;
    const frame = (now: number) => {
      const time = (now - t0) / 1000;
      const inkT = smootherstep(
        THREE.MathUtils.clamp((time - total - INK_HOLD) / INK_DUR, 0, 1)
      );

      for (const p of pieces) {
        const k = THREE.MathUtils.clamp((time - p.delay) / M.dur, 0, 1);
        p.mesh.position.lerpVectors(p.start, p.target, easeOut(k));
        p.mesh.quaternion.copy(tmpQ.slerpQuaternions(p.startQ, p.endQ, easeOut(k)));
        const s = M.scale0 + (1 - M.scale0) * easeOut(Math.min(1, k * 1.4));
        p.mesh.scale.setScalar(s);
        p.mesh.material.color.copy(p.base).lerp(INK, inkT);
      }

      const settle = easeOut(THREE.MathUtils.clamp(time / (total * 0.92), 0, 1));
      const idle = Math.max(0, time - total);
      logo.rotation.y = (1 - settle) * M.spinY + Math.sin(idle * 0.55) * 0.055;
      logo.rotation.x = (1 - settle) * M.spinX + Math.cos(idle * 0.42) * 0.035;
      logo.position.y = 0.85 - 0.55 * settle + Math.sin(idle * 0.5) * 0.02;
      camera.position.z = 9.0 + (1 - settle) * M.dolly;

      if (time > total - 0.25) wordRef.current?.classList.add('is-on');

      renderer.render(scene, camera);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const resize = () => {
      const w = host.clientWidth || window.innerWidth;
      const h = host.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.fov = w / h < 0.95 ? 46 : 34;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('click', restart);
      pieces.forEach((p) => {
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
      });
      scene.environment?.dispose();
      renderer.dispose();
      host.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background:
          'radial-gradient(120% 90% at 50% 34%, #ffffff 0%, #f4f3f0 58%, #e9e7e2 100%)'
      }}
    >
      <div ref={hostRef} style={{ position: 'absolute', inset: 0 }} />
      {showWordmark && (
        <div
          ref={wordRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '7%',
            textAlign: 'center',
            fontFamily: 'var(--font-molgan), Helvetica, "Helvetica Neue", Arial, sans-serif',
            fontSize: 'clamp(24px, 4.8vw, 68px)',
            letterSpacing: '0.32em',
            textIndent: '0.32em',
            color: '#272727',
            fontWeight: 400,
            opacity: 0,
            transition: 'opacity .9s ease',
            pointerEvents: 'none',
            userSelect: 'none'
          }}
        >
          MOSAIC LABS
          <style>{`div[style*="0.32em"].is-on, .is-on { opacity: 1 !important; }`}</style>
        </div>
      )}

    </div>
  );
}
