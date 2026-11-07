"use client";

import { createContext, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";

const OpenConsultation = createContext<() => void>(() => {});

const DOMAINS = [
  "Agriculture & Crop Analytics",
  "Energy & Utilities",
  "Roads & Transportation",
  "Infrastructure & Inspection Data",
  "Voice & Speech Data (Indic AI)",
  "Artificial Intelligence",
  "Disaster Response & Climate",
  "Manufacturing & Industrial",
  "Custom Physical Domain",
];

export function ConsultButton({
  className,
  onClick,
  children,
}: {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const open = useContext(OpenConsultation);
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        onClick?.();
        open();
      }}
    >
      {children}
    </button>
  );
}

/** Holds the consultation drawer and lets any ConsultButton below it open the drawer. */
export function ConsultationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Note: Form submission handling. Can be wired to an API route or form service.
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setTimeout(() => {
      setStatus("sent");
      setTimeout(() => {
        form.reset();
        setStatus("idle");
        setOpen(false);
      }, 1600);
    }, 700);
  };

  return (
    <OpenConsultation.Provider value={() => setOpen(true)}>
      {children}

      <div
        className={`modal-overlay${open ? " open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && setOpen(false)}
      >
        <div className="modal-drawer" role="dialog" aria-modal="true" aria-labelledby="consultation-title">
          <div>
            <button
              ref={closeRef}
              type="button"
              className="modal-close-btn"
              aria-label="Close dialog"
              onClick={() => setOpen(false)}
            >
              <span>ESC</span> [✕]
            </button>

            <div className="section-eyebrow">Data Consultation</div>
            <h3 className="modal-title" id="consultation-title">
              Initiate Your Data Pipeline
            </h3>
            <p className="modal-desc">
              Tell us about your target domain, data collection requirements, or annotation needs. A Mosaic data
              architect will review your specification.
            </p>

            <form className="modal-form" onSubmit={submit}>
              <div className="form-group">
                <label className="form-label" htmlFor="consult-name">
                  Full Name
                </label>
                <input id="consult-name" name="name" type="text" className="form-input" placeholder="Alexis Vance" autoComplete="name" required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="consult-email">
                  Work Email
                </label>
                <input id="consult-email" name="email" type="email" className="form-input" placeholder="alexis@enterprise.com" autoComplete="email" required />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="consult-domain">
                  Domain Focus
                </label>
                <select id="consult-domain" name="domain" className="form-select">
                  {DOMAINS.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="consult-scope">
                  Data Requirements &amp; Pipeline Scope
                </label>
                <textarea
                  id="consult-scope"
                  name="scope"
                  className="form-textarea"
                  rows={3}
                  placeholder="Describe your target geography, sensor modalities, collection frequency, or annotation requirements..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="cta-pill cta-pill-solid"
                style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
                disabled={status !== "idle"}
              >
                {status === "idle" && "Submit Data Inquiry →"}
                {status === "sending" && "Submitting Data Inquiry..."}
                {status === "sent" && "Inquiry Received ✓"}
              </button>
            </form>
          </div>

          <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink-muted)", marginTop: 32 }}>
            DATA AS A SERVICE · PRIVACY BY DESIGN · MOSAIC LABS
          </div>
        </div>
      </div>
    </OpenConsultation.Provider>
  );
}
