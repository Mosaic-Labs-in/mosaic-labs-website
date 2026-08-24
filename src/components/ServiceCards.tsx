"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

type ServiceItem = {
  name: string;
  category: string;
  description: string;
  chip: string;
  href: "/data-operations" | "/market-intelligence";
};

const SERVICES: ServiceItem[] = [
  {
    name: "Data Operations",
    category: "Datasets for AI",
    description:
      "We collect, clean, deduplicate, annotate and structure real-world unstructured data — images, video, audio, text and documents — into high-quality, model-ready datasets built for your exact use case.",
    chip: "Build",
    href: "/data-operations",
  },
  {
    name: "Market Intelligence",
    category: "Insight for decisions",
    description:
      "We turn your data — or the market's — into strategic insight: customer behaviour, pricing, competition and growth opportunities, shaped around the decision you actually need to make.",
    chip: "Decide",
    href: "/market-intelligence",
  },
];

export default function ServiceCards() {
  return (
    <div className="services-grid">
      {SERVICES.map((service, index) => (
        <ServiceCard key={service.name} service={service} index={index} />
      ))}
    </div>
  );
}

function ServiceCard({
  service,
  index,
}: {
  service: ServiceItem;
  index: number;
}) {
  const cardRef = useRef<HTMLAnchorElement | null>(null);
  const inkRef = useRef<HTMLSpanElement | null>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  const spread = (e: React.PointerEvent, open: boolean) => {
    const card = cardRef.current;
    const ink = inkRef.current;
    if (!card || !ink) return;
    const rect = card.getBoundingClientRect();

    if (open) {
      const diameter = Math.hypot(rect.width, rect.height) * 2;
      ink.style.width = `${diameter}px`;
      ink.style.height = `${diameter}px`;
      ink.style.left = `${e.clientX - rect.left}px`;
      ink.style.top = `${e.clientY - rect.top}px`;
      card.classList.add("is-hovered");
      tween.current?.kill();
      tween.current = gsap.fromTo(
        ink,
        { scale: 0 },
        { scale: 1, duration: 0.55, ease: "power3.out" }
      );
    } else {
      // Move the ink to where the cursor exits before shrinking
      ink.style.left = `${e.clientX - rect.left}px`;
      ink.style.top = `${e.clientY - rect.top}px`;
      card.classList.remove("is-hovered");
      tween.current?.kill();
      tween.current = gsap.to(ink, {
        scale: 0,
        duration: 0.45,
        ease: "power3.in",
      });
    }
  };

  return (
    <Link
      href={service.href}
      className="service-card gsap-reveal opacity-0"
      ref={cardRef}
      onPointerEnter={(e) => spread(e, true)}
      onPointerLeave={(e) => spread(e, false)}
    >
      <span className="service-card__ink" ref={inkRef} aria-hidden="true" />

      <div className="service-card__content">
        <div className="service-card__top">
          <span className="service-card__index">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="service-card__chip">{service.chip}</span>
        </div>

        <div className="service-card__body">
          <h3 className="service-card__name">{service.name}</h3>
          <p className="service-card__tagline">{service.category}</p>
          <p className="service-card__desc">{service.description}</p>
          <span className="service-card__go">Explore {service.name} &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
