import { cache } from "react";
import type { FAQ, PricingPackage, ProcessStep, Service, SiteSettings, Testimonial } from "@prisma/client";

import { db } from "@/lib/db";

const fallbackSiteSettings: SiteSettings = {
  id: 1,
  brandName: "J-Digital Solutions",
  heroHeadline: "Turn Your Website Into a 24/7 Client-Generating System",
  heroSubheadline:
    "We design and build premium websites for Philippine businesses that improve trust, capture leads, and drive consistent growth.",
  primaryCtaLabel: "Book Free Consultation",
  primaryCtaLink: "/contact?package=startup",
  secondaryCtaLabel: "View Portfolio",
  secondaryCtaLink: "/portfolio",
  phone: "0927 495 0610",
  email: "jdigitalsolutions27@gmail.com",
  officeAddress: null,
  whatsappLink: null,
  messengerLink: "https://m.me/jdigitalsolutions",
  messageButtonLabel: "Message Us",
  messageButtonLink: "https://m.me/jdigitalsolutions",
  calendarBookingLink: null,
  facebookUrl: "https://www.facebook.com/jdigitalsolutions",
  instagramUrl: null,
  linkedinUrl: null,
  seoDefaultTitle: "J-Digital Solutions | Premium Websites for Philippine Businesses",
  seoDefaultDescription:
    "J-Digital Solutions creates conversion-focused websites, landing pages, and growth systems for Philippine SMEs and local brands.",
  highlightPackageSlug: "startup",
  testimonialsEnabled: false,
  createdAt: new Date(),
  updatedAt: new Date()
};

export const getSiteSettings = cache(async () => {
  try {
    const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (settings) return settings;

    return db.siteSettings.create({
      data: {
        id: 1,
        heroHeadline: fallbackSiteSettings.heroHeadline,
        heroSubheadline: fallbackSiteSettings.heroSubheadline,
        seoDefaultTitle: fallbackSiteSettings.seoDefaultTitle,
        seoDefaultDescription: fallbackSiteSettings.seoDefaultDescription
      }
    });
  } catch (error) {
    console.error("Database unavailable while loading site settings. Using fallback settings.", error);
    return fallbackSiteSettings;
  }
});

export async function getPublicData() {
  try {
    const settings = await getSiteSettings();
    // Use a single connection for the public homepage data to avoid exhausting Supabase pooler clients.
    const [services, portfolio, process, pricing, faq, testimonials] = await db.$transaction([
      db.service.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
      db.portfolioProject.findMany({
        take: 30,
        orderBy: { position: "asc" }
      }),
      db.processStep.findMany({ orderBy: { position: "asc" } }),
      db.pricingPackage.findMany({ orderBy: { position: "asc" } }),
      db.fAQ.findMany({ where: { isPublished: true }, orderBy: { position: "asc" }, take: 6 }),
      db.testimonial.findMany({ where: { isPublished: true }, orderBy: { position: "asc" } })
    ]);

    return { settings, services, portfolio, process, pricing, faq, testimonials };
  } catch (error) {
    console.error("Database unavailable while loading public data. Returning fallback content.", error);
    return {
      settings: fallbackSiteSettings,
      services: [] as Service[],
      portfolio: [],
      process: [] as ProcessStep[],
      pricing: [] as PricingPackage[],
      faq: [] as FAQ[],
      testimonials: [] as Testimonial[]
    };
  }
}

export function getPagination({
  page = 1,
  pageSize = 10
}: {
  page?: number;
  pageSize?: number;
}) {
  const safePage = Number.isFinite(page) && page > 0 ? page : 1;
  const safePageSize = Number.isFinite(pageSize) && pageSize > 0 ? pageSize : 10;
  return {
    take: safePageSize,
    skip: (safePage - 1) * safePageSize,
    page: safePage,
    pageSize: safePageSize
  };
}
