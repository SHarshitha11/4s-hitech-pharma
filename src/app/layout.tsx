import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: "4S HITECH PHARMA",
    template: "%s | 4S HITECH PHARMA",
  },

  description:
    "Wholesale pharmaceutical distribution, manufacturing and pharmacy ordering platform.",

  keywords: [
    "pharmaceutical wholesale distributor",
    "medicine wholesale supplier",
    "pharmaceutical distributor",
    "pharmacy medicine supplier",
    "wholesale medicines",
    "pharmaceutical manufacturing",
  ],

  applicationName: "4S HITECH PHARMA",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    siteName: "4S HITECH PHARMA",
    title: "4S HITECH PHARMA",
    description:
      "Wholesale pharmaceutical distribution, manufacturing and pharmacy ordering platform.",
    url: siteUrl,
  },

  twitter: {
    card: "summary",
    title: "4S HITECH PHARMA",
    description:
      "Wholesale pharmaceutical distribution, manufacturing and pharmacy ordering platform.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}