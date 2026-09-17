import { PATHS } from "./logo";

/**
 * Homepage copy, case studies and stat figures are placeholders carried over
 * verbatim from the design prototype, pending real content from the client.
 */

export type Capability = { n: string; id: string; title: string; body: string };

export const CAPABILITIES: Capability[] = [
  {
    n: "01",
    id: "cap-infrastructure",
    title: "Data infrastructure",
    body: "Ingestion, warehousing and pipelines that hold up when volume and sources change.",
  },
  {
    n: "02",
    id: "cap-modelling",
    title: "Modelling & analytics",
    body: "Semantic layers, metric definitions and reporting your teams agree on.",
  },
  {
    n: "03",
    id: "cap-intelligence",
    title: "Applied intelligence",
    body: "Forecasting, segmentation and decision tools built against your own data.",
  },
  {
    n: "04",
    id: "cap-governance",
    title: "Governance & quality",
    body: "Lineage, testing and ownership so results stay trustworthy over time.",
  },
];

export type Step = {
  n: string;
  num: string;
  id: string;
  title: string;
  body: string;
  shape: string[];
};

/** Each step draws a larger fragment of the mark than the one before it. */
export const STEPS: Step[] = [
  {
    n: "Step 01",
    num: "1",
    id: "step-pieces",
    title: "Pieces",
    body: "We map every source you have, including the spreadsheets nobody documents.",
    shape: [PATHS[7], PATHS[3]],
  },
  {
    n: "Step 02",
    num: "2",
    id: "step-mosaic",
    title: "Mosaic",
    body: "Sources are joined, reconciled and modelled into one coherent structure.",
    shape: [PATHS[7], PATHS[3], PATHS[0], PATHS[4]],
  },
  {
    n: "Step 03",
    num: "3",
    id: "step-structure",
    title: "Structure",
    body: "The structure becomes products: dashboards, services, automated decisions.",
    shape: PATHS,
  },
];

export type WorkItem = {
  id: string;
  title: string;
  body: string;
  sector: string;
  year: string;
  slot: string;
};

export const WORK: WorkItem[] = [
  {
    id: "work-freight",
    title: "Freight network telemetry",
    body: "Consolidated 41 regional feeds into a single routing dataset with hourly refresh.",
    sector: "Logistics",
    year: "2026",
    slot: "Case visual — dashboard",
  },
  {
    id: "work-registry",
    title: "Clinical registry warehouse",
    body: "Governed warehouse and audit trail for a multi-site research programme.",
    sector: "Health",
    year: "2025",
    slot: "Case visual — schema",
  },
  {
    id: "work-demand",
    title: "Retail demand model",
    body: "Forecasting layer replacing eleven competing spreadsheets across merchandising.",
    sector: "Retail",
    year: "2024",
    slot: "Case visual — forecast",
  },
];

export type PipelineStage = { n: string; title: string; body: string };

export const PIPELINE: PipelineStage[] = [
  {
    n: "00",
    title: "Client problem",
    body: "A decision that cannot be made because the data for it does not exist yet.",
  },
  {
    n: "01",
    title: "Capture",
    body: "Partner fleets, sensors and custom hardware deployed where the signal actually is.",
  },
  {
    n: "02",
    title: "Clean",
    body: "Deduplication, gap filling and validation against known ground truth.",
  },
  {
    n: "03",
    title: "Structure",
    body: "Schemas, lineage and a semantic layer the whole organisation can read.",
  },
  {
    n: "04",
    title: "Deliver",
    body: "Decision-ready data in the systems your teams already work in.",
  },
];

export const SECTORS = [
  "Energy",
  "Agriculture",
  "Infrastructure",
  "Manufacturing",
];

export const STATS = [
  { label: "Sources reconciled", before: "41 feeds", after: "1 dataset" },
  { label: "Reporting lag", before: "9 days", after: "4 hours" },
  { label: "Competing spreadsheets", before: "11", after: "0" },
];

export const HERO_TILE_COUNT = 60;
export const BAND_TILE_COUNT = 72;

/**
 * Scattered on the left, ordered and dense on the right — the density grid
 * under each pipeline stage. Deterministic so server and client agree.
 */
export function pipelineCells(stageIndex: number) {
  const density = 0.14 + stageIndex * 0.215;
  const order = stageIndex / (PIPELINE.length - 1);
  return Array.from({ length: 36 }, (_, k) => {
    const col = k % 6;
    const row = (k / 6) | 0;
    const h = ((col * 7 + row * 13 + stageIndex * 29) % 17) / 17;
    const on = h < density + order * 0.12 * (1 - (row % 2 ? 0.4 : 0));
    const accent = on && h > density * 0.72 && stageIndex >= 3;
    if (!on) return "rgba(255,255,255,0.045)";
    return accent
      ? `rgba(255,181,2,${(0.55 + order * 0.45).toFixed(2)})`
      : `rgba(255,255,255,${(0.16 + order * 0.6).toFixed(2)})`;
  });
}

export const NAV_ITEMS = [
  {
    label: "Capabilities",
    href: "#capabilities",
    key: "cap",
    items: CAPABILITIES.map((c) => ({
      n: c.n,
      label: c.title,
      href: `#${c.id}`,
    })),
  },
  {
    label: "Approach",
    href: "#approach",
    key: "app",
    items: STEPS.map((s) => ({
      n: s.num.padStart(2, "0"),
      label: `${s.title} — ${s.n.toLowerCase()}`,
      href: `#${s.id}`,
    })),
  },
  {
    label: "Work",
    href: "#work",
    key: "work",
    items: WORK.map((w, i) => ({
      n: String(i + 1).padStart(2, "0"),
      label: w.title,
      href: `#${w.id}`,
    })),
  },
];
