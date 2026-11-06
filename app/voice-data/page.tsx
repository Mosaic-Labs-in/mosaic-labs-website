import type { Metadata } from "next";
import Link from "next/link";
import { ArchCrosses } from "@/components/WorkBanner";
import { VoiceHeroCanvas } from "@/components/MiniCanvases";

export const metadata: Metadata = {
  title: "Voice Data Collection for AI: Hindi, English and Gujarati | Mosaic Labs",
  description:
    "Speech datasets across Hindi, Indian English, and Gujarati—capturing regional accents, dialects, everyday conversations, and natural code-switching for speech AI.",
};

export default function VoiceDataPage() {
  return (
    <>
      {/* A. Hero */}
      <section
        className="section hero-section"
        style={{ minHeight: "auto", paddingTop: "clamp(88px, 12vw, 120px)", paddingBottom: 20 }}
      >
        <div className="container">
          <div className="domain-breadcrumb" data-reveal>
            <Link href="/#solutions">← Enterprise Domains</Link>
            <span className="crumb-sep">/</span>
            <span>Domain 01: Voice &amp; Speech Data</span>
          </div>

          <div className="section-eyebrow" data-reveal>
            Enterprise Domain 01 // Speech Datasets
          </div>
          <h1
            className="section-title"
            style={{ fontSize: "clamp(30px, 4.4vw, 52px)", maxWidth: 960 }}
            data-reveal
          >
            Voice Data Collection for AI: Hindi, English and Gujarati
          </h1>
          <p
            className="section-subtitle"
            style={{ maxWidth: 800, fontSize: 15.5, lineHeight: 1.6 }}
            data-reveal
          >
            Building reliable speech technology requires speech data that reflects real-world communication across
            regional accents, dialects, and everyday conversational styles. Mosaic Labs sources, prepares, and
            structures high-quality voice datasets across Hindi, Indian English, and Gujarati—including regional
            dialects and spontaneous code-switching.
          </p>

          {/* Technical visual hero canvas */}
          <div className="domain-hero-visual" style={{ margin: "28px 0 0 0" }} data-reveal>
            <div className="domain-canvas-viewport" style={{ height: "clamp(200px, 26vw, 280px)" }}>
              <VoiceHeroCanvas className="world-canvas" />
            </div>
            <div className="domain-visual-meta">
              <div>
                <span>
                  LANGUAGES: <span className="meta-tag">HINDI · INDIAN ENGLISH · GUJARATI</span>
                </span>
                <span style={{ marginLeft: 18 }}>
                  DIALECTS: <span className="meta-tag">KATHIYAWADI &amp; NORTHERN VARIATIONS</span>
                </span>
              </div>
              <div>
                <span>FORMATS: AUDIO FILES · TIME-ALIGNED VERIFIED TRANSCRIPTS</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* B. Domain overview */}
      <section className="section" style={{ padding: "40px 0" }}>
        <ArchCrosses />
        <div className="container">
          <div data-reveal style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Domain Overview</div>
            <h2
              className="problem-statement"
              style={{ fontSize: "clamp(24px, 3.2vw, 36px)", lineHeight: 1.25, maxWidth: 860 }}
            >
              Why Language and Dialect Diversity Matter
            </h2>
            <p className="problem-detail" style={{ fontSize: 14.5, lineHeight: 1.65, maxWidth: 820 }}>
              A speech model trained on textbook translations or standard accents frequently degrades when encountering
              regional pronunciation, conversational pacing, and mixed language usage. High-quality speech AI requires
              datasets built from how people actually communicate in real settings, supported by clear audio, verified
              transcriptions, and documented linguistic criteria.
            </p>
          </div>

          <div className="domain-tri-grid" style={{ marginTop: 0, gap: 18 }} data-reveal>
            <div className="domain-card-spec" style={{ padding: "24px 20px" }}>
              <div className="domain-step-num">01 / DIALECTS</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Authentic Dialect Coverage
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                Capturing regional linguistic variations—such as Kathiyawadi and Northern Gujarati—through reviewed
                speaker backgrounds rather than inferring dialect from geography alone.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "24px 20px" }}>
              <div className="domain-step-num">02 / CODE-SWITCHING</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Natural Language Mixing
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                Recording spontaneous transitions between Hindi-English and Gujarati-English to represent how
                multilingual speakers communicate in everyday conversation.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "24px 20px" }}>
              <div className="domain-step-num">03 / GOVERNANCE</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 8 }}>
                Consent &amp; Data Governance
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13.5, lineHeight: 1.55 }}>
                Ethical speaker recruitment with explicit informed consent, clear usage terms, secure data handling,
                and transparent collection documentation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* C. What we deliver */}
      <section className="section" style={{ padding: "40px 0" }}>
        <ArchCrosses />
        <div className="container">
          <div data-reveal style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Capabilities &amp; Deliverables</div>
            <h2 className="section-title" style={{ fontSize: "clamp(24px, 3.4vw, 40px)", marginBottom: 8 }}>
              What We Deliver
            </h2>
            <p className="section-subtitle" style={{ fontSize: 14.5, marginBottom: 0 }}>
              Targeted speech datasets structured to specific AI application requirements, audio formats, and
              transcription standards.
            </p>
          </div>

          {/* 3 primary language cards */}
          <div className="domain-tri-grid" style={{ marginTop: 0, gap: 18 }} data-reveal>
            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <div className="domain-step-num">01 / HINDI</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
                Hindi Speech Datasets
              </h3>
              <ul className="panel-specs" style={{ fontSize: 13, lineHeight: 1.6 }}>
                <li className="panel-spec-item">Natural conversational Hindi recordings</li>
                <li className="panel-spec-item">Read speech and scripted prompt audio</li>
                <li className="panel-spec-item">Everyday phrases and regional accent diversity</li>
                <li className="panel-spec-item">Hindi-English spontaneous code-switching</li>
                <li className="panel-spec-item">Paired with verified text transcriptions</li>
              </ul>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <div className="domain-step-num">02 / ENGLISH</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
                Indian English Speech
              </h3>
              <ul className="panel-specs" style={{ fontSize: 13, lineHeight: 1.6 }}>
                <li className="panel-spec-item">Indian English across fluency and accent levels</li>
                <li className="panel-spec-item">Conversational and read English recordings</li>
                <li className="panel-spec-item">Varying speaking speeds and pronunciation styles</li>
                <li className="panel-spec-item">Hindi-English and Gujarati-English mixed speech</li>
                <li className="panel-spec-item">Paired with verified text transcriptions</li>
              </ul>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <div className="domain-step-num">03 / GUJARATI</div>
              <h3 className="domain-card-title" style={{ fontSize: 16, marginBottom: 10 }}>
                Gujarati &amp; Dialects
              </h3>
              <ul className="panel-specs" style={{ fontSize: 13, lineHeight: 1.6 }}>
                <li className="panel-spec-item">Standard and conversational Gujarati</li>
                <li className="panel-spec-item">Kathiyawadi Gujarati regional variations</li>
                <li className="panel-spec-item">Northern Gujarati dialectal speech</li>
                <li className="panel-spec-item">Gujarati-English and Gujarati-Hindi code-switching</li>
                <li className="panel-spec-item">Paired with verified text transcriptions</li>
              </ul>
            </div>
          </div>

          {/* Acquisition & structuring process */}
          <div
            className="domain-step-box"
            style={{ marginTop: 20, borderLeft: "3px solid var(--burgundy)", padding: "20px 22px" }}
            data-reveal
          >
            <div className="domain-step-num" style={{ marginBottom: 4 }}>
              PROCESSING &amp; STRUCTURING PIPELINE
            </div>
            <h4 className="domain-step-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
              From Recording to Verified Dataset
            </h4>
            <p className="domain-step-desc" style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 0 }}>
              Recordings undergo systematic audio quality checks for background noise, clipping, and incomplete speech.
              Processing includes segmentation, transcription, language identification, and dialect labeling.
              Deliverables include cleaned audio files, verified transcripts, speaker metadata, and documentation
              formatted to client specifications.
            </p>
          </div>
        </div>
      </section>

      {/* D. Applications */}
      <section className="section" style={{ padding: "40px 0" }}>
        <ArchCrosses />
        <div className="container">
          <div data-reveal style={{ marginBottom: 24 }}>
            <div className="section-eyebrow">Target Applications</div>
            <h2 className="section-title" style={{ fontSize: "clamp(24px, 3.4vw, 40px)", marginBottom: 8 }}>
              Applications &amp; Use Cases
            </h2>
            <p className="section-subtitle" style={{ fontSize: 14.5, marginBottom: 0 }}>
              Speech technology teams and systems supported by our Hindi, English, and Gujarati datasets.
            </p>
          </div>

          <div className="domain-quad-grid" style={{ marginTop: 0, gap: 18 }} data-reveal>
            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                ASR SYSTEMS
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                Speech Recognition (ASR)
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Audio paired with verified text transcriptions to train and evaluate speech-to-text models across
                Indian languages and regional accents.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                CONVERSATIONAL AI
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                Voice Assistants &amp; Bots
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Multilingual speech datasets capturing natural phrasing and conversational turns for voice agents
                handling complex Indian language queries.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                FOUNDATION MODELS
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                Multilingual Speech Models
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Spoken-language datasets for evaluating multilingual AI capabilities, speech tokenization, and
                language-specific performance benchmarks.
              </p>
            </div>

            <div className="domain-card-spec" style={{ padding: "22px 20px" }}>
              <span className="domain-card-badge" style={{ marginBottom: 10 }}>
                ENTERPRISE INTERFACES
              </span>
              <h3 className="domain-card-title" style={{ fontSize: 15.5, marginBottom: 6 }}>
                Customer Support &amp; Products
              </h3>
              <p className="domain-card-body" style={{ fontSize: 13, lineHeight: 1.55 }}>
                Licensed speech data reflecting authentic regional speech patterns for contact centers and voice-enabled
                consumer products.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* E. Closing (minimal, no forms) */}
      <section className="section" style={{ padding: "36px 0 56px 0", borderBottom: "none" }}>
        <ArchCrosses />
        <div className="container">
          <div
            style={{
              borderTop: "1px solid var(--border-line)",
              paddingTop: 32,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              alignItems: "flex-start",
            }}
            data-reveal
          >
            <div className="section-eyebrow" style={{ color: "var(--burgundy)", marginBottom: 0 }}>
              Mosaic Labs // Voice &amp; Speech Data
            </div>
            <p style={{ fontSize: 14.5, color: "var(--ink-secondary)", maxWidth: 680, marginBottom: 4 }}>
              To discuss custom speech dataset collection, dialect coverage, or language data specifications, contact
              our team at{" "}
              <a
                href="mailto:mosaiclabs17@gmail.com"
                style={{ color: "var(--burgundy)", fontWeight: 500, textDecoration: "underline" }}
              >
                mosaiclabs17@gmail.com
              </a>
              .
            </p>
            <Link
              href="/#solutions"
              className="panel-tag"
              style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
              }}
            >
              <span>← Return to Enterprise Domains</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
