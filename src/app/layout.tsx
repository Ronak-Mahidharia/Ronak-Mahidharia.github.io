import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import site from "@/content/site.json";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Link previews (LinkedIn, Slack, and others) need full addresses; Next.js builds them from this.
const SITE_URL = "https://ronak-mahidharia.github.io";
const title = `${site.name} | Software Engineer and AI Engineer`;
const description = `${site.intro} ${site.summary}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  authors: [{ name: site.name, url: site.links.linkedin }],
  // The preview picture is app/opengraph-image.png; Next.js adds its tags.
  openGraph: { type: "website", url: "/", siteName: site.name, title, description },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
