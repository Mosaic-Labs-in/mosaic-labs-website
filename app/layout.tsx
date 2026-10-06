import type { Metadata, Viewport } from "next";
import { ConsultationProvider } from "@/components/Consultation";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { SiteEffects } from "@/components/SiteEffects";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mosaic | Data as a Service for the Physical World",
  description:
    "Mosaic turns fragmented real-world data into structured, validated, AI-ready datasets. Data as a Service (DaaS) for Agriculture, Energy, Infrastructure, and Mobility.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {/* Without JS nothing would ever reveal, and the intro would never hand over. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}.entrance-overlay{display:none !important}`}</style>
        </noscript>

        <div className="arch-grid-lines" aria-hidden="true">
          <div className="arch-grid-line-left"></div>
          <div></div>
          <div className="arch-grid-line-right"></div>
        </div>

        <ConsultationProvider>
          <Header />
          <main id="appContainer">{children}</main>
          <Footer />
        </ConsultationProvider>

        <SiteEffects />
      </body>
    </html>
  );
}
