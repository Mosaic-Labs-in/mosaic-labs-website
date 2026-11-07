import Link from "next/link";
import { BrandMark } from "./BrandMark";
import { ConsultButton } from "./Consultation";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand-col">
            <Link href="/" className="brand-link">
              <BrandMark />
              <span>MOSAIC LABS</span>
            </Link>
            <p className="footer-tagline">
              Turning fragmented real-world data into AI-ready datasets. Data as a Service, custom collection, and
              applied AI models.
            </p>
          </div>

          <div>
            <div className="footer-nav-title">Navigation</div>
            <ul className="footer-links">
              <li className="footer-link-item">
                <Link href="/what-we-do" className="footer-link">
                  What We Do
                </Link>
              </li>
              <li className="footer-link-item">
                <Link href="/solutions" className="footer-link">
                  Solutions
                </Link>
              </li>
              <li className="footer-link-item">
                <Link href="/about" className="footer-link">
                  About
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="footer-nav-title">Contact &amp; Inquiries</div>
            <ul className="footer-links">
              <li className="footer-link-item">
                <ConsultButton className="footer-link">Request Consultation</ConsultButton>
              </li>
              <li className="footer-link-item">
                <span className="footer-link" style={{ color: "var(--ink-muted)" }}>
                  Ahmedabad, Gujarat
                </span>
              </li>
              <li className="footer-link-item">
                <a
                  href="mailto:mosaiclabs17@gmail.com"
                  className="footer-link"
                  style={{ color: "var(--ink-muted)" }}
                >
                  mosaiclabs17@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© 2026 MOSAIC LABS INC. ALL RIGHTS RESERVED.</div>
          <div>DATA AS A SERVICE · PRIVACY BY DESIGN · DPDP ALIGNED</div>
        </div>
      </div>
    </footer>
  );
}
