"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * The scroll piece: a translucent orb with an amber fresnel rim, driven by
 * scroll position.
 *
 *   0  hero        one orb, surface boiling with noise — raw, unresolved
 *   1  settling    the noise calms and the form resolves
 *   2  two ways    it separates into two orbs — one pipeline, two outputs
 *   3  why mosaic  they draw back together, smaller and still
 *
 * Deliberately low alpha and parked in empty column space. It is a backdrop,
 * not a foreground element, and it must never fight the copy for attention.
 */

/* Ashima 3D simplex noise — the standard implementation. */
const NOISE = /* glsl */ `
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`;

const VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uNoise;

  varying vec3 vNormal;
  varying vec3 vView;
  varying float vRelief;

  ${NOISE}

  void main() {
    float big = snoise(position * 1.35 + uTime * 0.16);
    float fine = snoise(position * 3.1 - uTime * 0.11) * 0.45;
    float relief = (big + fine) * uNoise;

    vec3 displaced = position + normal * relief;
    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);

    vNormal = normalize(normalMatrix * normal);
    vView = normalize(-mv.xyz);
    vRelief = big;

    gl_Position = projectionMatrix * mv;
  }
`;

const FRAGMENT = /* glsl */ `
  uniform vec3 uBody;
  uniform vec3 uRim;
  uniform float uOpacity;
  uniform float uDark;

  varying vec3 vNormal;
  varying vec3 vView;
  varying float vRelief;

  void main() {
    float facing = clamp(dot(normalize(vNormal), normalize(vView)), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 4.2);

    // Body lifts toward bone over the dark bands so it does not vanish.
    vec3 body = mix(uBody, vec3(0.93, 0.91, 0.88), uDark * 0.6);
    vec3 color = mix(body, uRim, fresnel);
    // a whisper of amber in the raised folds, not a coat of paint
    color = mix(color, uRim, smoothstep(0.55, 1.0, vRelief) * 0.12);

    float alpha = (0.035 + fresnel * 0.42) * uOpacity * (1.0 - uDark * 0.35);
    gl_FragColor = vec4(color, alpha);
  }
`;

/** Eased 0..1 window over a slice of the scroll. */
function seg(p: number, from: number, to: number) {
  const t = THREE.MathUtils.clamp((p - from) / (to - from), 0, 1);
  return t * t * (3 - 2 * t);
}

export function DataMorph() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Below md the host is display:none; do not spin a render loop into it.
    if (!window.matchMedia("(min-width: 768px)").matches) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 8.4;

    const pixelRatio = Math.min(window.devicePixelRatio, 1.75);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uNoise: { value: 0.11 },
      uOpacity: { value: 0 },
      uDark: { value: 0 },
      uBody: { value: new THREE.Color("#4d111c") },
      uRim: { value: new THREE.Color("#ffb502") },
    };

    const geometry = new THREE.IcosahedronGeometry(1, 24);
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
      blending: THREE.NormalBlending,
    });

    const orbA = new THREE.Mesh(geometry, material);
    const orbB = new THREE.Mesh(geometry, material);

    // A coarse amber cage: the "structure" read, kept very faint.
    const cageMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color("#ffb502"),
      transparent: true,
      opacity: 0,
    });
    const cageGeometry = new THREE.WireframeGeometry(
      new THREE.IcosahedronGeometry(1.26, 2),
    );
    const cage = new THREE.LineSegments(cageGeometry, cageMaterial);

    const group = new THREE.Group();
    group.add(orbA, orbB, cage);
    scene.add(group);

    const state = { progress: 0 };
    const view = { x: 2.75, y: 0, scale: 1.95, sep: 0, noise: 0.11 };

    const splashPending =
      !document.documentElement.classList.contains("splash-played");
    gsap.to(uniforms.uOpacity, {
      value: 1,
      duration: 1.4,
      delay: splashPending ? 5.4 : 0.5,
    });

    const pointer = { x: 0, y: 0 };
    const onPointerMove = (event: PointerEvent) => {
      pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const triggers: ScrollTrigger[] = [];
    triggers.push(
      ScrollTrigger.create({
        trigger: "#morph-start",
        endTrigger: "#morph-end",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          state.progress = self.progress * 3;
        },
      }),
    );

    document.querySelectorAll<HTMLElement>("[data-morph-dark]").forEach((el) => {
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 60%",
          end: "bottom 40%",
          onToggle: (self) =>
            gsap.to(uniforms.uDark, {
              value: self.isActive ? 1 : 0,
              duration: 0.6,
              overwrite: true,
            }),
        }),
      );
    });

    triggers.push(
      ScrollTrigger.create({
        trigger: "#morph-end",
        start: "bottom 80%",
        onToggle: (self) =>
          gsap.to(uniforms.uOpacity, {
            value: self.isActive ? 0 : 1,
            duration: 0.7,
            overwrite: true,
          }),
      }),
    );

    const clock = new THREE.Clock();
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      uniforms.uTime.value = clock.getElapsedTime();

      const p = state.progress;
      const settle = seg(p, 0.15, 1.1); // noise calms
      const split = seg(p, 1.15, 2.0); // orbs part
      const regroup = seg(p, 2.15, 3.0); // and come back

      const targetNoise = 0.11 * (1 - settle) + 0.035 * settle;
      const targetSep = split * 1.35 * (1 - regroup * 0.82);
      const targetScale = 1.95 - split * 0.6 + regroup * 0.1;
      // Climbs into the empty top-right while the cards own the lower half.
      const targetY = split * 1.45 - regroup * 1.25;
      const targetX = 2.75 + split * 0.95 - regroup * 1.1;

      // Damped toward the target so scrubbing never snaps.
      view.noise += (targetNoise - view.noise) * 0.06;
      view.sep += (targetSep - view.sep) * 0.06;
      view.scale += (targetScale - view.scale) * 0.06;
      view.x += (targetX - view.x) * 0.06;
      view.y += (targetY - view.y) * 0.06;

      uniforms.uNoise.value = view.noise;
      orbA.position.x = -view.sep;
      orbB.position.x = view.sep;
      orbB.visible = view.sep > 0.02;
      cageMaterial.opacity = 0.055 * settle * uniforms.uOpacity.value;
      cage.scale.setScalar(1 + view.sep * 0.3);

      group.position.set(view.x, view.y, 0);
      group.scale.setScalar(view.scale);
      group.rotation.y += 0.0022;
      group.rotation.x += (pointer.y * 0.16 - group.rotation.x) * 0.035;
      cage.rotation.y -= 0.004;
      cage.rotation.x += 0.0016;

      renderer.render(scene, camera);
    };
    render();

    const onVisibility = () => {
      if (document.hidden) cancelAnimationFrame(frame);
      else frame = requestAnimationFrame(render);
    };
    document.addEventListener("visibilitychange", onVisibility);

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      triggers.forEach((t) => t.kill());
      gsap.killTweensOf([uniforms.uOpacity, uniforms.uDark]);
      geometry.dispose();
      material.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[15] hidden md:block"
    />
  );
}
