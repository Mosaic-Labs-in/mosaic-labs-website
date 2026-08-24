"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import type { Capability } from "@/lib/services";

/**
 * The ink-spread hover from the home page service cards, on a pale ground and
 * sized for a six-up grid. Cards that map to an inquiry chip link straight
 * into the form with that option preselected.
 */
export function CapabilityCards({ items }: { items: Capability[] }) {
  return (
    <div className="grid gap-px bg-brand-maroon/12 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, index) => (
        <Card key={item.name} item={item} index={index} />
      ))}
    </div>
  );
}

function Card({ item, index }: { item: Capability; index: number }) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const inkRef = useRef<HTMLSpanElement | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  const spread = (event: React.PointerEvent, open: boolean) => {
    const card = cardRef.current;
    const ink = inkRef.current;
    if (!card || !ink) return;

    const rect = card.getBoundingClientRect();
    ink.style.left = `${event.clientX - rect.left}px`;
    ink.style.top = `${event.clientY - rect.top}px`;

    if (open) {
      const diameter = Math.hypot(rect.width, rect.height) * 2;
      ink.style.width = `${diameter}px`;
      ink.style.height = `${diameter}px`;
      card.classList.add("is-hovered");
      tween.current?.kill();
      tween.current = gsap.fromTo(
        ink,
        { scale: 0 },
        { scale: 1, duration: 0.55, ease: "power3.out" },
      );
    } else {
      card.classList.remove("is-hovered");
      tween.current?.kill();
      tween.current = gsap.to(ink, { scale: 0, duration: 0.45, ease: "power3.in" });
    }
  };

  const href = item.service
    ? (`/inquiry?service=${encodeURIComponent(item.service)}` as const)
    : ("/inquiry" as const);

  return (
    <Link
      href={href}
      ref={cardRef}
      className="cap"
      onPointerEnter={(event) => spread(event, true)}
      onPointerLeave={(event) => spread(event, false)}
    >
      <span className="cap__ink" ref={inkRef} aria-hidden="true" />

      <span className="cap__inner">
        <span className="cap__index">{String(index + 1).padStart(2, "0")}</span>
        <span className="cap__name">{item.name}</span>
        <span className="cap__desc">{item.desc}</span>
        <span className="cap__go">Start an inquiry &rarr;</span>
      </span>
    </Link>
  );
}
