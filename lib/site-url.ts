const FALLBACK_SITE_URL = "https://jdigital-solutions.vercel.app";

export function getSiteUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || FALLBACK_SITE_URL;
  const normalized = rawUrl.startsWith("http://") || rawUrl.startsWith("https://") ? rawUrl : `https://${rawUrl}`;
  return normalized.replace(/\/+$/, "");
}

export function getSiteUrlObject() {
  return new URL(getSiteUrl());
}
