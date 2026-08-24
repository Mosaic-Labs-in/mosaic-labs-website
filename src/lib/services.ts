/**
 * Content for the two service routes. `service` on a capability matches a chip
 * in PROJECT_TYPES so the card can deep-link into the inquiry form with that
 * option already selected.
 */

export type Capability = {
  name: string;
  desc: string;
  /** Must match a PROJECT_TYPES entry in lib/inquiry to preselect the chip. */
  service?: string;
};

export type ServicePage = {
  slug: "data-operations" | "market-intelligence";
  eyebrow: string;
  /** \n forces a line break in the split heading. */
  headline: string;
  intro: string;
  stats: { value: number; prefix?: string; suffix?: string; label: string }[];
  pipeline: readonly string[];
  capabilities: Capability[];
  deliverables: { title: string; body: string }[];
  closing: { headline: string; body: string };
};

export const DATA_OPERATIONS: ServicePage = {
  slug: "data-operations",
  eyebrow: "Data Operations",
  headline: "Model-ready data,\nbuilt for the job.",
  intro:
    "We collect, clean, deduplicate, annotate and structure real-world unstructured data — images, video, audio, text and documents — into datasets built for your exact use case, not a generic corpus someone else already trained on.",
  stats: [
    { value: 6, suffix: "", label: "Data types handled end to end" },
    { value: 95, suffix: "%+", label: "Agreement bar before delivery" },
    { value: 1, suffix: " day", label: "From brief to first reply" },
  ],
  pipeline: ["Define", "Collect", "Process", "Annotate", "Validate", "Deliver"],
  capabilities: [
    {
      name: "Dataset Creation",
      service: "Dataset Creation",
      desc: "A dataset designed backwards from your model's failure cases, not scraped and hoped for.",
    },
    {
      name: "Data Collection",
      service: "Data Collection",
      desc: "Field capture from the environments and markets your model will actually run in.",
    },
    {
      name: "Data Annotation",
      service: "Data Annotation",
      desc: "Boxes, masks, keypoints, transcription and classification, held to an agreement bar you set.",
    },
    {
      name: "Cleaning & Processing",
      service: "Data Cleaning / Processing",
      desc: "Deduplication, normalisation, format conversion and the unglamorous work that decides model quality.",
    },
    {
      name: "AI/ML Dataset Prep",
      service: "AI/ML Dataset Preparation",
      desc: "Splits, schema, class balance and versioning, handed over ready to load.",
    },
    {
      name: "Custom Data Solution",
      service: "Custom Data Solution",
      desc: "When the shape of the problem does not match anything on this list.",
    },
  ],
  deliverables: [
    {
      title: "The data, in your schema",
      body: "Delivered in the format your loader already expects — not ours. Splits, manifests and label maps included.",
    },
    {
      title: "A quality report you can audit",
      body: "Per-class agreement, sample counts and the exact cases we rejected, so you can see where the bar sat.",
    },
    {
      title: "The pipeline that produced it",
      body: "Documented well enough to rerun, extend or hand to another vendor. No lock-in by obscurity.",
    },
  ],
  closing: {
    headline: "Bring us the data\nthat won't behave.",
    body: "Send a sample, a schema, or just the problem. An engineer reads it and replies within one working day.",
  },
};

export const MARKET_INTELLIGENCE: ServicePage = {
  slug: "market-intelligence",
  eyebrow: "Market Intelligence",
  headline: "The answer is already\nin the data.",
  intro:
    "We turn your data — or the market's — into strategic insight: customer behaviour, pricing, competition and growth opportunities, shaped around the decision you actually need to make rather than a template report nobody reads twice.",
  stats: [
    { value: 5, suffix: "", label: "Stages from question to answer" },
    { value: 100, suffix: "%", label: "Findings traced to a source" },
    { value: 1, suffix: " day", label: "From brief to first reply" },
  ],
  pipeline: ["Understand", "Research", "Analyze", "Discover", "Recommend"],
  capabilities: [
    {
      name: "Market Sizing",
      desc: "Bottom-up numbers you can defend in a board room, with the assumptions written down.",
    },
    {
      name: "Competitor Tracking",
      desc: "What they shipped, what they charge and what changed since last quarter.",
    },
    {
      name: "Pricing Intelligence",
      desc: "Where your price sits against the market, and what moving it would cost you.",
    },
    {
      name: "Customer Behaviour",
      desc: "What people do inside your product and your category, not what a survey says they do.",
    },
    {
      name: "Growth Opportunities",
      desc: "The adjacent segments worth entering, ranked by what it takes to win them.",
    },
    {
      name: "Custom Research",
      service: "Custom Data Solution",
      desc: "A question that does not fit a category. Those are usually the interesting ones.",
    },
  ],
  deliverables: [
    {
      title: "A decision, not a deck",
      body: "The recommendation leads. The supporting analysis sits behind it for whoever wants to argue.",
    },
    {
      title: "Sources you can check",
      body: "Every number traces back to where it came from and how it was derived. Including the shaky ones.",
    },
    {
      title: "The working, kept",
      body: "Models and datasets handed over live, so the next question does not start from zero.",
    },
  ],
  closing: {
    headline: "Bring us the question\nnobody can answer.",
    body: "Tell us the decision you are trying to make. We will tell you honestly whether the data can support it.",
  },
};
