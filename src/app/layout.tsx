import type { Metadata, Viewport } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "600"],
  variable: "--font-crimson",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#11100c",
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  title: "Bible Reading Planner",
  description:
    "Read the narrative & theological heart of Scripture at your own pace. 898 chapters, 32 books, fully customisable schedule.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "BiblePlan",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/icons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Bible Reading Planner",
    description: "898 chapters. Your pace. No filler.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonPro.variable}`}>
      <head>
        {/* iOS home screen icon */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        {/* iOS splash / safe-area support */}
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans min-h-screen bg-bible-bg text-bible-text">
        <ServiceWorkerRegistrar />
        {children}
      </body>
    </html>
  );
}
