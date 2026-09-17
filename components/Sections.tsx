import {
  BAND_TILE_COUNT,
  CAPABILITIES,
  HERO_TILE_COUNT,
  PIPELINE,
  SECTORS,
  STATS,
  STEPS,
  WORK,
  pipelineCells,
} from "@/lib/content";
import { LOGO_VIEWBOX, PATHS } from "@/lib/logo";
import styles from "./Sections.module.css";

export function Sections() {
  return (
    <>
      <Hero />
      <StatStrip />
      <Pipeline />
      <Capabilities />
      <StatementBand />
      <Approach />
      <Work />
      <Contact />
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section id="top" data-section="light" className={styles.hero}>
      <div data-mosaic className={styles.heroGrid} aria-hidden="true">
        {Array.from({ length: HERO_TILE_COUNT }, (_, i) => (
          <div key={i} className={styles.heroTile} />
        ))}
      </div>
      <div className={styles.heroScrim} aria-hidden="true" />

      <div className={styles.heroBody}>
        <div data-reveal className={styles.eyebrow}>
          Data studio · est. 2019
        </div>
        <h2 data-reveal className={styles.heroHeading}>
          Data arrives in pieces.
          <br />
          <span className={styles.accent}>We build the mosaic.</span>
        </h2>
        <div className={styles.heroFoot}>
          <p data-reveal className={styles.heroLede}>
            Mosaic Labs assembles scattered sources — partner fleets, sensors,
            custom hardware, warehouses and third-party exports — into structures
            your teams can act on.
          </p>
          <div data-reveal className={styles.heroCtas}>
            <a href="#work" className={styles.pillGhost}>
              Selected work
            </a>
            <a href="#contact" className={styles.pillSolid}>
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatStrip() {
  return (
    <section
      data-section="light"
      className={`${styles.statStrip} ${styles.dots}`}
    >
      <div className={styles.statGrid}>
        {STATS.map((s) => (
          <div key={s.label} data-reveal className={styles.stat}>
            <span className={styles.statLabel}>{s.label}</span>
            <span className={styles.statValue}>
              <span className={styles.statBefore}>{s.before}</span>
              <span className={styles.statArrow} aria-hidden="true">
                →
              </span>
              <span className={styles.statAfter}>{s.after}</span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Pipeline() {
  return (
    <section data-section="dark" className={styles.pipeline}>
      <div className={styles.dotsDark} aria-hidden="true" />
      <div className={styles.pipeBody}>
        <div data-reveal className={styles.pipeEyebrow}>
          One studio. Full data pipeline.
        </div>
        <h3 data-reveal className={styles.pipeHeading}>
          From a client problem to decision-ready data.
        </h3>

        <div className={styles.pipeGrid}>
          {PIPELINE.map((stage, i) => (
            <div key={stage.n} data-reveal className={styles.pipeCard}>
              <div className={styles.pipeStep}>
                <span>{stage.n}</span>
                <span className={styles.pipeArrow} aria-hidden="true">
                  {i < PIPELINE.length - 1 ? "→" : "●"}
                </span>
              </div>
              {/* Scattered tiles on the left resolve into an ordered grid on the right. */}
              <div className={styles.density} aria-hidden="true">
                {pipelineCells(i).map((bg, k) => (
                  <div
                    key={k}
                    className={styles.densityCell}
                    style={{ background: bg }}
                  />
                ))}
              </div>
              <div>
                <h4 className={styles.pipeTitle}>{stage.title}</h4>
                <p className={styles.pipeText}>{stage.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div data-reveal className={styles.sectors}>
          {SECTORS.map((s) => (
            <span key={s} className={styles.sector}>
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section
      id="capabilities"
      data-section="light"
      className={`${styles.capabilities} ${styles.dots}`}
    >
      <div className={styles.sectionHead}>
        <h3 data-reveal className={styles.sectionTitle}>
          Capabilities
        </h3>
        <span className={styles.sectionMeta}>04 / PRACTICES</span>
      </div>
      <div className={styles.capGrid}>
        {CAPABILITIES.map((c) => (
          <div key={c.id} id={c.id} data-reveal className={styles.capCard}>
            <span className={styles.capIndex}>{c.n}</span>
            <div>
              <h4 className={styles.capTitle}>{c.title}</h4>
              <p className={styles.capText}>{c.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function StatementBand() {
  return (
    <section data-section="dark" className={styles.band}>
      <div data-mosaic className={styles.bandGrid} aria-hidden="true">
        {Array.from({ length: BAND_TILE_COUNT }, (_, i) => (
          <div key={i} className={styles.bandTile} />
        ))}
      </div>
      <div className={styles.bandScrim} aria-hidden="true" />
      <p data-reveal className={styles.bandText}>
        Every dataset is a piece of a larger picture.
      </p>
    </section>
  );
}

function Approach() {
  return (
    <section id="approach" data-section="light" className={styles.approach}>
      <h3 data-reveal className={styles.approachTitle}>
        Pieces, mosaic, structure.
      </h3>
      <div className={styles.steps}>
        {STEPS.map((s) => (
          <div key={s.id} id={s.id} data-reveal className={styles.step}>
            <span className={styles.stepNumeral} aria-hidden="true">
              {s.num}
            </span>
            <div className={styles.stepBody}>
              <span className={styles.stepEyebrow}>{s.n}</span>
              <h4 className={styles.stepTitle}>{s.title}</h4>
              <p className={styles.stepText}>{s.body}</p>
            </div>
            {/* Each step draws more of the mark than the last. */}
            <svg
              viewBox={LOGO_VIEWBOX}
              className={styles.stepShape}
              aria-hidden="true"
            >
              {s.shape.map((d, i) => (
                <path key={i} d={d} fill="currentColor" />
              ))}
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}

function Work() {
  return (
    <section id="work" data-section="dark" className={styles.work}>
      <div className={styles.dotsDark} aria-hidden="true" />
      <div className={styles.workBody}>
        <div className={styles.sectionHead}>
          <h3 data-reveal className={`${styles.sectionTitle} ${styles.workTitle}`}>
            Selected work
          </h3>
          <span className={styles.workMeta}>2023 — 2026</span>
        </div>
        <div className={styles.workList}>
          {WORK.map((w) => (
            <div key={w.id} id={w.id} data-reveal className={styles.workItem}>
              <div>
                <h4 className={styles.workItemTitle}>{w.title}</h4>
                <p className={styles.workItemText}>{w.body}</p>
              </div>
              <div className={styles.workTags}>
                <span>{w.sector}</span>
                <span>{w.year}</span>
              </div>
              <div className={styles.workVisual}>
                <span className={styles.workVisualLabel}>{w.slot}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section
      id="contact"
      data-section="light"
      className={`${styles.contact} ${styles.dots}`}
    >
      <div className={styles.contactGrid}>
        <h3 data-reveal className={styles.contactTitle}>
          Let&rsquo;s build your mosaic.
        </h3>
        <div data-reveal className={styles.contactBody}>
          <span>
            Engagements start with a two-week source audit. We report what
            exists, what is broken, and what is worth building.
          </span>
          <a href="mailto:hello@mosaiclabs.studio" className={styles.contactPill}>
            hello@mosaiclabs.studio
          </a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer data-section="light" className={styles.footer}>
      <div className={styles.footerBrand}>
        <svg
          viewBox={LOGO_VIEWBOX}
          className={styles.footerMark}
          role="img"
          aria-label="Mosaic Labs"
        >
          {PATHS.map((d, i) => (
            <path key={i} d={d} fill="currentColor" />
          ))}
        </svg>
        <span className={styles.footerName}>MOSAIC LABS</span>
      </div>
      <span>© 2026</span>
    </footer>
  );
}
