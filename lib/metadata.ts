import type { Metadata } from "next";

import { getSiteSettings } from "@/lib/site-data";
import { getSiteUrl, getSiteUrlObject } from "@/lib/site-url";

export async function buildMetadata({
  title,
  description,
  path = "/"
}: {
  title: string;
  description: string;
  path?: string;
}): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteUrl = getSiteUrl();
  const metadataBase = getSiteUrlObject();
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${siteUrl}${normalizedPath}`;

  return {
    title,
    description,
    metadataBase,
    alternates: {
      canonical: normalizedPath
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: settings.brandName,
      images: [
        {
          url: "/og-image.svg",
          width: 1200,
          height: 630,
          alt: settings.brandName
        }
      ],
      locale: "en_PH",
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.svg"]
    },
    robots: {
      index: true,
      follow: true
    }
  };
}
