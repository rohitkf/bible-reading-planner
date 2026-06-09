import type { Metadata } from "next";
import { Inter, Crimson_Pro } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "Core Bible Reading Plan",
  description:
    "Read the narrative & theological heart of Scripture in your own pace. 898 chapters, 32 books, fully customisable schedule.",
  openGraph: {
    title: "Core Bible Reading Plan",
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
      <body className="font-sans min-h-screen bg-bible-bg text-bible-text">
        {children}
      </body>
    </html>
  );
}
