"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import {
  DATA_TYPES,
  DIAL_CODES,
  EMAIL,
  EMPTY_VALUES,
  NOTES_MAX,
  OTHER,
  PROJECT_TYPES,
  REQUIREMENTS_MAX,
  REQUIREMENTS_MIN,
  completion,
  mailtoFallback,
  toRow,
  validate,
  type InquiryErrors,
  type InquiryValues,
} from "@/lib/inquiry";

type Status = "idle" | "sending" | "sent" | "failed";

/** A check mark drawn on a 5x4 tile grid, used for the success state. */
const CHECK = ["....X", "...X.", "X.X..", ".X..."];

export function InquiryForm() {
  const searchParams = useSearchParams();

  // Service pages can deep-link in with ?service=Data+Annotation to arrive
  // with that chip already picked.
  const [values, setValues] = useState<InquiryValues>(() => {
    const preset = searchParams.get("service");
    const match = preset
      ? PROJECT_TYPES.find((type) => type.toLowerCase() === preset.toLowerCase())
      : undefined;
    return match ? { ...EMPTY_VALUES, projectTypes: [match] } : EMPTY_VALUES;
  });

  const [errors, setErrors] = useState<InquiryErrors>({});
  const [showErrors, setShowErrors] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState("");
  const honeypot = useRef<HTMLInputElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const progress = useMemo(() => completion(values), [values]);

  const set = <K extends keyof InquiryValues>(key: K, value: InquiryValues[K]) => {
    setValues((prev) => {
      const next = { ...prev, [key]: value };
      // Once the form has been submitted once, clear each error as it is fixed
      // rather than leaving stale red fields behind.
      if (showErrors) setErrors(validate(next));
      return next;
    });
  };

  const toggle = (key: "projectTypes" | "dataTypes", option: string) => {
    const current = values[key];
    set(
      key,
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "sending") return;

    // Bots fill every field they find; humans never see this one.
    if (honeypot.current?.value) return;

    const found = validate(values);
    setErrors(found);
    setShowErrors(true);

    if (Object.keys(found).length > 0) {
      document
        .querySelector<HTMLElement>(`[data-field="${Object.keys(found)[0]}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("sending");
    setFailure("");

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("failed");
      setFailure(
        "The inquiry database is not connected yet. Send this straight to us instead.",
      );
      return;
    }

    const { error } = await supabase
      .from("inquiries")
      .insert(toRow(values, "website-4"));

    if (error) {
      setStatus("failed");
      setFailure(error.message);
      return;
    }

    setStatus("sent");
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (status === "sent") {
    return (
      <Sent
        name={values.name}
        onReset={() => {
          setValues(EMPTY_VALUES);
          setErrors({});
          setShowErrors(false);
          setStatus("idle");
        }}
      />
    );
  }

  const requirementsLength = values.requirements.trim().length;

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col">
      {/* Card header with the completion meter */}
      <div ref={topRef} className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <span className="eyebrow">Project brief</span>
          <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-brand-maroon sm:text-[1.75rem]">
            Tell us what you are working with
          </h2>
        </div>

        <div className="w-full max-w-[180px]">
          <div className="flex items-baseline justify-between text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-ink/45">
            <span>Ready</span>
            <span className="font-mono tabular-nums text-brand-maroon">
              {Math.round(progress * 100)}%
            </span>
          </div>
          <div className="mt-2 h-[6px] w-full bg-brand-sand">
            <div
              className="h-full bg-brand-amber transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(progress * 100, 2)}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── 01 Contact information ───────────────────────────────────── */}
      <Section index="01" title="Contact information" />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          name="name"
          label="Full name *"
          value={values.name}
          error={showErrors ? errors.name : undefined}
          onChange={(v) => set("name", v)}
          autoComplete="name"
        />
        <Field
          name="company"
          label="Company / organisation *"
          value={values.company}
          error={showErrors ? errors.company : undefined}
          onChange={(v) => set("company", v)}
          autoComplete="organization"
        />
        <Field
          name="email"
          type="email"
          label="Work email *"
          value={values.email}
          error={showErrors ? errors.email : undefined}
          onChange={(v) => set("email", v)}
          autoComplete="email"
        />
        <Field
          name="role"
          label="Job title / role"
          value={values.role}
          onChange={(v) => set("role", v)}
          autoComplete="organization-title"
        />
        <PhoneField
          className="sm:col-span-2"
          dialCode={values.dialCode}
          value={values.phone}
          onDialCode={(v) => set("dialCode", v)}
          onChange={(v) => set("phone", v)}
        />
        <Field
          name="website"
          className="sm:col-span-2"
          label="Website / LinkedIn"
          value={values.website}
          onChange={(v) => set("website", v)}
          autoComplete="url"
        />
      </div>

      {/* ── 02 About your project ────────────────────────────────────── */}
      <Section index="02" title="About your project" />

      <ChipGroup
        name="projectTypes"
        legend="What are you looking to build? *"
        options={PROJECT_TYPES}
        selected={values.projectTypes}
        onToggle={(option) => toggle("projectTypes", option)}
        error={showErrors ? errors.projectTypes : undefined}
      />

      {values.projectTypes.includes(OTHER) ? (
        <div className="mt-4">
          <Field
            name="projectOther"
            label="Tell us what you are looking to build *"
            value={values.projectOther}
            error={showErrors ? errors.projectOther : undefined}
            onChange={(v) => set("projectOther", v)}
          />
        </div>
      ) : null}

      <div className="mt-9" data-field="requirements">
        <label className={`mfield ${showErrors && errors.requirements ? "mfield--error" : ""}`}>
          <textarea
            name="requirements"
            rows={6}
            placeholder=" "
            maxLength={REQUIREMENTS_MAX}
            className="mfield__input resize-y"
            value={values.requirements}
            onChange={(event) => set("requirements", event.target.value)}
          />
          <span className="mfield__label">Briefly describe your requirements *</span>
        </label>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            {showErrors && errors.requirements ? (
              <ErrorNote>{errors.requirements}</ErrorNote>
            ) : (
              <p className="text-xs font-light text-brand-ink/50">
                What problem are you trying to solve?
              </p>
            )}
          </div>
          <span
            className={`shrink-0 font-mono text-xs tabular-nums transition-colors ${
              requirementsLength >= REQUIREMENTS_MIN
                ? "text-brand-maroon"
                : "text-brand-ink/40"
            }`}
          >
            {requirementsLength}/{REQUIREMENTS_MAX}
          </span>
        </div>
      </div>

      <div className="mt-9">
        <ChipGroup
          name="dataTypes"
          legend="What type of data are you working with? *"
          options={DATA_TYPES}
          selected={values.dataTypes}
          onToggle={(option) => toggle("dataTypes", option)}
          error={showErrors ? errors.dataTypes : undefined}
        />

        {values.dataTypes.includes(OTHER) ? (
          <div className="mt-4">
            <Field
              name="dataOther"
              label="What kind of data is it? *"
              value={values.dataOther}
              error={showErrors ? errors.dataOther : undefined}
              onChange={(v) => set("dataOther", v)}
            />
          </div>
        ) : null}
      </div>

      {/* ── 03 Final ─────────────────────────────────────────────────── */}
      <Section index="03" title="Final" />

      <div data-field="notes">
        <label className="mfield">
          <textarea
            name="notes"
            rows={4}
            placeholder=" "
            maxLength={NOTES_MAX}
            className="mfield__input resize-y"
            value={values.notes}
            onChange={(event) => set("notes", event.target.value)}
          />
          <span className="mfield__label">Anything else we should know?</span>
        </label>
        <p className="mt-2 text-xs font-light text-brand-ink/50">
          Deadlines, compliance constraints, tools you already use — optional.
        </p>
      </div>

      {/* Spam trap — off-screen, never announced, never tabbed to */}
      <input
        ref={honeypot}
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      {status === "failed" ? (
        <div className="mt-8 border-l-[3px] border-brand-maroon bg-brand-maroon/5 p-4">
          <p className="text-sm font-semibold text-brand-maroon">
            That did not go through.
          </p>
          <p className="mt-1 text-sm font-light leading-relaxed text-brand-ink/70">
            {failure}
          </p>
          <a
            href={mailtoFallback(values)}
            className="underline-grow mt-3 inline-block text-sm font-semibold text-brand-maroon"
          >
            Email it to {EMAIL} instead
          </a>
        </div>
      ) : null}

      <div className="mt-10 border-t border-brand-maroon/10 pt-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-[280px] text-xs font-light leading-relaxed text-brand-ink/50">
            We use this to reply to you and nothing else. No lists, no sequences.
          </p>

          <button
            type="submit"
            disabled={status === "sending"}
            className="btn-wipe group inline-flex w-full items-center justify-center gap-3 px-8 py-4 text-sm font-bold tracking-wide sm:w-auto"
          >
            {status === "sending" ? (
              <>
                <SendingTiles />
                Sending
              </>
            ) : (
              <>
                Submit inquiry
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  &rarr;
                </span>
              </>
            )}
          </button>
        </div>

        {/* Its own row: beside the note there is never enough width to keep it
            on one line, even on a desktop card. */}
        <p className="mt-5 text-[13px] font-light leading-relaxed text-brand-ink/60 sm:whitespace-nowrap sm:text-right">
          Tell us what you&rsquo;re building.{" "}
          <span className="font-medium text-brand-maroon">
            We&rsquo;ll figure out the data.
          </span>
        </p>
      </div>
    </form>
  );
}

/* ── pieces ──────────────────────────────────────────────────────────── */

/** Numbered divider between the three parts of the form. */
function Section({ index, title }: { index: string; title: string }) {
  return (
    <div className="mb-7 mt-12 flex items-center gap-4">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-brand-amber font-mono text-[11px] font-bold text-brand-maroon">
        {index}
      </span>
      <h3 className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand-maroon">
        {title}
      </h3>
      <span aria-hidden="true" className="h-px flex-1 bg-brand-maroon/10" />
    </div>
  );
}

function ChipGroup({
  name,
  legend,
  options,
  selected,
  onToggle,
  error,
}: {
  name: string;
  legend: string;
  options: readonly string[];
  selected: string[];
  onToggle: (option: string) => void;
  error?: string;
}) {
  return (
    <fieldset data-field={name}>
      <legend className="text-[13px] font-semibold text-brand-ink/75">{legend}</legend>

      <div className="mt-4 flex flex-wrap gap-2.5">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            className="chip"
            aria-pressed={selected.includes(option)}
            onClick={() => onToggle(option)}
          >
            <span className="chip__tile" aria-hidden="true" />
            {option}
          </button>
        ))}
      </div>

      {error ? <ErrorNote>{error}</ErrorNote> : null}
    </fieldset>
  );
}

function PhoneField({
  dialCode,
  value,
  onDialCode,
  onChange,
  className = "",
}: {
  dialCode: string;
  value: string;
  onDialCode: (value: string) => void;
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <div data-field="phone" className={className}>
      <div className="mfield__row">
        <select
          name="dialCode"
          value={dialCode}
          aria-label="Country code"
          className="mfield__code w-full sm:w-[11rem] sm:shrink-0"
          onChange={(event) => onDialCode(event.target.value)}
        >
          {DIAL_CODES.map((country) => (
            <option key={country.iso} value={country.dial}>
              {country.name} ({country.dial})
            </option>
          ))}
        </select>

        <label className="mfield min-w-0 sm:flex-1">
          <input
            type="tel"
            name="phone"
            value={value}
            placeholder=" "
            autoComplete="tel-national"
            className="mfield__input"
            onChange={(event) => onChange(event.target.value)}
          />
          <span className="mfield__label">Phone / WhatsApp number</span>
        </label>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  className = "",
}: {
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  className?: string;
}) {
  return (
    <div data-field={name} className={className}>
      <label className={`mfield ${error ? "mfield--error" : ""}`}>
        <input
          type={type}
          name={name}
          value={value}
          placeholder=" "
          autoComplete={autoComplete}
          className="mfield__input"
          onChange={(event) => onChange(event.target.value)}
        />
        <span className="mfield__label">{label}</span>
      </label>
      {error ? <ErrorNote>{error}</ErrorNote> : null}
    </div>
  );
}

function ErrorNote({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="mt-2 flex items-center gap-2 text-xs font-medium text-brand-maroon"
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rotate-45 bg-brand-maroon"
        aria-hidden="true"
      />
      {children}
    </p>
  );
}

/** Three tiles cycling while the insert is in flight. */
function SendingTiles() {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((index) => (
        <span
          key={index}
          className="h-1.5 w-1.5 bg-current"
          style={{
            animation: "tile-breathe 1.1s ease-in-out infinite",
            animationDelay: `${index * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}

function Sent({ name, onReset }: { name: string; onReset: () => void }) {
  const firstName = name.trim().split(" ")[0];

  return (
    <div className="flex flex-col items-start py-6 sm:py-10">
      {/* The check assembles tile by tile */}
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: "repeat(5, 1.25rem)" }}
        aria-hidden="true"
      >
        {CHECK.flatMap((row, rowIndex) =>
          row.split("").map((cell, colIndex) => (
            <span
              key={`${rowIndex}-${colIndex}`}
              className="pop-tile h-5 w-5"
              style={{
                background:
                  cell === "X"
                    ? "var(--color-brand-amber)"
                    : "var(--color-brand-sand)",
                ["--pop-delay" as string]: `${(rowIndex * 5 + colIndex) * 38}ms`,
              }}
            />
          )),
        )}
      </div>

      <h2 className="mt-8 text-[clamp(1.6rem,4vw,2.25rem)] font-black leading-tight tracking-tight text-brand-maroon">
        {firstName ? `Thanks, ${firstName}.` : "Thanks."}
        <br />
        It is with an engineer.
      </h2>

      <p className="mt-5 max-w-md text-[15px] font-light leading-relaxed text-brand-ink/65">
        You will hear back within one working day with a named contact and a
        first read on feasibility. If it is urgent, call{" "}
        <a
          href="tel:+919023764663"
          className="underline-grow font-medium text-brand-maroon"
        >
          +91 90237 64663
        </a>
        .
      </p>

      <button
        type="button"
        onClick={onReset}
        className="btn-wipe mt-9 inline-flex items-center gap-3 px-7 py-3.5 text-sm font-bold tracking-wide"
      >
        Send another
        <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  );
}
