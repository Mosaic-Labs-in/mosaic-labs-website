import type { Metadata } from "next";
import { ServicePageBody } from "@/components/ServicePageBody";
import { MARKET_INTELLIGENCE } from "@/lib/services";

const DESCRIPTION = MARKET_INTELLIGENCE.intro;

export const metadata: Metadata = {
  title: "Market Intelligence | Mosaic Labs",
  description: DESCRIPTION,
  alternates: { canonical: "/market-intelligence" },
  openGraph: {
    type: "website",
    title: "Market Intelligence | Mosaic Labs",
    description: DESCRIPTION,
    url: "/market-intelligence",
  },
};

export default function MarketIntelligencePage() {
  return <ServicePageBody page={MARKET_INTELLIGENCE} />;
}
