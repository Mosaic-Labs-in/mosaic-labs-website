/**
 * Content and validation shared by the inquiry page.
 * The website-5 (Vite) build keeps a mirrored copy at src/lib/inquiry.js —
 * change both together.
 */

export const PROJECT_TYPES = [
  "Dataset Creation",
  "Data Annotation",
  "Data Collection",
  "AI/ML Dataset Preparation",
  "Data Cleaning / Processing",
  "Custom Data Solution",
  "Other",
] as const;

/** The chip that opens a free-text follow-up. */
export const OTHER = "Other";

export const DATA_TYPES = [
  "Images",
  "Video",
  "Text",
  "Audio",
  "Geospatial / Satellite",
  "Tabular",
  "Other",
] as const;


/** Dial codes offered beside the phone field. India leads; it is the default. */
export const DIAL_CODES = [
  { iso: "IN", name: "India", dial: "+91" },
  { iso: "AU", name: "Australia", dial: "+61" },
  { iso: "BR", name: "Brazil", dial: "+55" },
  { iso: "CN", name: "China", dial: "+86" },
  { iso: "FR", name: "France", dial: "+33" },
  { iso: "DE", name: "Germany", dial: "+49" },
  { iso: "IL", name: "Israel", dial: "+972" },
  { iso: "JP", name: "Japan", dial: "+81" },
  { iso: "NL", name: "Netherlands", dial: "+31" },
  { iso: "SA", name: "Saudi Arabia", dial: "+966" },
  { iso: "SG", name: "Singapore", dial: "+65" },
  { iso: "ZA", name: "South Africa", dial: "+27" },
  { iso: "KR", name: "South Korea", dial: "+82" },
  { iso: "SE", name: "Sweden", dial: "+46" },
  { iso: "CH", name: "Switzerland", dial: "+41" },
  { iso: "AE", name: "UAE", dial: "+971" },
  { iso: "GB", name: "UK", dial: "+44" },
  { iso: "US", name: "USA", dial: "+1" },
] as const;

export const STEPS = [
  {
    index: "01",
    title: "A person reads it, not a queue",
    body: "Your brief goes straight to the lead who owns that pipeline. Nobody puts you through a qualification call before someone has actually read the technical detail.",
  },
  {
    index: "02",
    title: "A scoped reply in one working day",
    body: "You get a named contact, a first read on feasibility and a rough shape of the work — including when the honest answer is that we are not the right fit.",
  },
  {
    index: "03",
    title: "Pilot first, then volume",
    body: "Every engagement runs the same gate: prove the pipeline on a sample, prove it holds at volume, then hold that quality bar for the life of the contract.",
  },
] as const;

export const EMAIL = "contact@mosaiclabs.in";
export const PHONES = ["+91 90237 64663", "+91 96620 03952"] as const;

/** Digits-only form for tel: hrefs. */
export const telHref = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const DIRECT = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "Phone", value: PHONES[0], href: telHref(PHONES[0]) },
  { label: "WhatsApp", value: PHONES[1], href: telHref(PHONES[1]) },
  { label: "Hours", value: "Mon – Fri, 10:00 – 19:00 IST", href: null },
] as const;

export type InquiryValues = {
  name: string;
  company: string;
  email: string;
  dialCode: string;
  phone: string;
  role: string;
  website: string;
  projectTypes: string[];
  projectOther: string;
  requirements: string;
  dataTypes: string[];
  dataOther: string;
  notes: string;
};

export const EMPTY_VALUES: InquiryValues = {
  name: "",
  company: "",
  email: "",
  dialCode: "+91",
  phone: "",
  role: "",
  website: "",
  projectTypes: [],
  projectOther: "",
  requirements: "",
  dataTypes: [],
  dataOther: "",
  notes: "",
};

export const REQUIREMENTS_MIN = 20;
export const REQUIREMENTS_MAX = 1500;
export const NOTES_MAX = 800;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type InquiryErrors = Partial<Record<keyof InquiryValues, string>>;

export function validate(values: InquiryValues): InquiryErrors {
  const errors: InquiryErrors = {};

  if (!values.name.trim()) {
    errors.name = "Tell us who we are replying to.";
  }

  if (!values.company.trim()) {
    errors.company = "Who are you building this for?";
  }

  if (!values.email.trim()) {
    errors.email = "We need an address to reply to.";
  } else if (!EMAIL_SHAPE.test(values.email.trim())) {
    errors.email = "That address does not look complete.";
  }

  if (values.projectTypes.length === 0) {
    errors.projectTypes = "Pick at least one so we route it correctly.";
  }

  const requirements = values.requirements.trim();
  if (!requirements) {
    errors.requirements = "A couple of lines is enough to start.";
  } else if (requirements.length < REQUIREMENTS_MIN) {
    errors.requirements = `A little more detail helps — ${REQUIREMENTS_MIN - requirements.length} characters to go.`;
  }

  if (values.dataTypes.length === 0) {
    errors.dataTypes = "Tell us what the data actually looks like.";
  }

  // "Other" is only useful if they say what it is.
  if (values.projectTypes.includes(OTHER) && !values.projectOther.trim()) {
    errors.projectOther = "Tell us what you are looking to build.";
  }
  if (values.dataTypes.includes(OTHER) && !values.dataOther.trim()) {
    errors.dataOther = "Tell us what kind of data it is.";
  }

  return errors;
}

/** Share of the required fields that are filled in, 0 to 1. */
export function completion(values: InquiryValues): number {
  const checks = [
    values.name.trim().length > 0,
    values.company.trim().length > 0,
    EMAIL_SHAPE.test(values.email.trim()),
    values.projectTypes.length > 0,
    values.requirements.trim().length >= REQUIREMENTS_MIN,
    values.dataTypes.length > 0,
  ];

  if (values.projectTypes.includes(OTHER)) {
    checks.push(values.projectOther.trim().length > 0);
  }
  if (values.dataTypes.includes(OTHER)) {
    checks.push(values.dataOther.trim().length > 0);
  }

  return checks.filter(Boolean).length / checks.length;
}

/** Row shape written to the Supabase `inquiries` table. */
export function toRow(values: InquiryValues, source: string) {
  return {
    name: values.name.trim(),
    company: values.company.trim(),
    email: values.email.trim().toLowerCase(),
    dial_code: values.phone.trim() ? values.dialCode : null,
    phone: values.phone.trim() || null,
    role: values.role.trim() || null,
    website: values.website.trim() || null,
    project_types: values.projectTypes,
    project_other: values.projectOther.trim() || null,
    requirements: values.requirements.trim(),
    data_types: values.dataTypes,
    data_other: values.dataOther.trim() || null,
    notes: values.notes.trim() || null,
    source,
  };
}

/** Pre-filled mailto used when Supabase is unreachable or unconfigured. */
export function mailtoFallback(values: InquiryValues): string {
  const body = [
    `Name: ${values.name || "-"}`,
    `Company: ${values.company || "-"}`,
    `Email: ${values.email || "-"}`,
    `Phone / WhatsApp: ${values.phone ? `${values.dialCode} ${values.phone}` : "-"}`,
    `Role: ${values.role || "-"}`,
    `Website / LinkedIn: ${values.website || "-"}`,
    `Looking to build: ${values.projectTypes.join(", ") || "-"}`,
    `Other (build): ${values.projectOther || "-"}`,
    `Data types: ${values.dataTypes.join(", ") || "-"}`,
    `Other (data): ${values.dataOther || "-"}`,
    "",
    "Requirements:",
    values.requirements || "-",
    "",
    "Anything else:",
    values.notes || "-",
  ].join("\n");

  return `mailto:${EMAIL}?subject=${encodeURIComponent(
    `Inquiry from ${values.company || values.name || "the Mosaic site"}`,
  )}&body=${encodeURIComponent(body)}`;
}
