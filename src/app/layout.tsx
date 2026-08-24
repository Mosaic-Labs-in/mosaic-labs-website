import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import SplashScreen from "@/components/SplashScreen";
import { SmoothScroll } from "@/components/SmoothScroll";
import { PageTransition } from "@/components/PageTransition";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const molgan = localFont({
  src: "../fonts/Molgan-Regular.otf",
  variable: "--font-molgan",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mosaic Labs | Decision-grade data",
  description: "We turn messy, unstructured real-world data into clean, purpose-built datasets for AI training and clear market intelligence.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${molgan.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var navEntries = performance.getEntriesByType("navigation");
                if (navEntries.length > 0 && navEntries[0].type === "reload") {
                  document.documentElement.classList.add('splash-played');
                }
              } catch (e) {}
            `,
          }}
        />
        <SmoothScroll />
        <PageTransition />
        <SplashScreen>{children}</SplashScreen>
      </body>
    </html>
  );
}
