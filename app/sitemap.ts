import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/lib/site-url";

const pages = ["", "/about", "/services", "/portfolio", "/process", "/pricing", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  const lastModified = new Date();

  return pages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified,
    changeFrequency: page === "" ? "weekly" : "monthly",
    priority: page === "" ? 1 : 0.8
  }));
}
