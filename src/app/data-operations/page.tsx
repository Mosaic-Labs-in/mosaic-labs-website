import type { Metadata } from "next";
import { ServicePageBody } from "@/components/ServicePageBody";
import { DATA_OPERATIONS } from "@/lib/services";

const DESCRIPTION = DATA_OPERATIONS.intro;

export const metadata: Metadata = {
  title: "Data Operations | Mosaic Labs",
  description: DESCRIPTION,
  alternates: { canonical: "/data-operations" },
  openGraph: {
    type: "website",
    title: "Data Operations | Mosaic Labs",
    description: DESCRIPTION,
    url: "/data-operations",
  },
};

export default function DataOperationsPage() {
  return <ServicePageBody page={DATA_OPERATIONS} />;
}
