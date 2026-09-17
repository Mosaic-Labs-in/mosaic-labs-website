import type { Metadata } from "next";
import { JetBrains_Mono, Jost } from "next/font/google";
import "./globals.css";

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-jost",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mosaic Labs — Here for all your data needs",
  description:
    "Mosaic Labs assembles scattered sources — partner fleets, sensors, custom hardware, warehouses and third-party exports — into structures your teams can act on.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jost.variable} ${jetbrainsMono.variable}`}>
      <body>
        {/* Without JS the intro sequence can never hand over, so show the site directly. */}
        <noscript>
          <style>{`
            [data-intro-layer]{display:none !important}
            [data-site]{opacity:1 !important}
            [data-reveal]{opacity:1 !important}
          `}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
