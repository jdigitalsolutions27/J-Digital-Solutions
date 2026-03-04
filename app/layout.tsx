import type { Metadata } from "next";
import { Manrope, Space_Grotesk } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import "./globals.css";

import { AppToaster } from "@/components/providers/toaster";
import { getSiteUrl, getSiteUrlObject } from "@/lib/site-url";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap"
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: getSiteUrlObject(),
  title: {
    default: "J-Digital Solutions",
    template: "%s | J-Digital Solutions"
  },
  description: "Premium websites and growth systems for service businesses worldwide.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "J-Digital Solutions",
    title: "J-Digital Solutions",
    description: "Premium websites and growth systems for service businesses worldwide.",
    url: siteUrl,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "J-Digital Solutions"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "J-Digital Solutions",
    description: "Premium websites and growth systems for service businesses worldwide.",
    images: ["/og-image.svg"]
  },
  icons: {
    icon: [
      { url: "/LOGOOOO.png", type: "image/png" }
    ],
    shortcut: [{ url: "/LOGOOOO.png", type: "image/png" }],
    apple: [{ url: "/LOGOOOO.png", type: "image/png" }]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "J-Digital Solutions",
    url: siteUrl,
    logo: `${siteUrl}/LOGOOOO.png`,
    sameAs: []
  };

  return (
    <html lang="en">
      <body className={`${manrope.variable} ${spaceGrotesk.variable} min-h-screen bg-background text-foreground`}>
        <a
          href="#main-content"
          className="skip-link absolute left-3 top-3 z-[120] rounded-md border border-blue-300/60 bg-slate-950 px-4 py-2 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
        >
          Skip to content
        </a>
        <Script
          id="organization-jsonld"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
        <AppToaster />
        <Analytics />
      </body>
    </html>
  );
}
