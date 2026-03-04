import { cache } from "react";
import { ProjectStatus, type FAQ, type PricingPackage, type PortfolioProject, type ProcessStep, type Service, type SiteSettings, type Testimonial } from "@prisma/client";

import { db } from "@/lib/db";

const fallbackSiteSettings: SiteSettings = {
  id: 1,
  brandName: "J-Digital Solutions",
  heroHeadline: "Premium Websites Built for Trust, Leads, and Growth",
  heroSubheadline:
    "We design and build conversion-focused websites for growth-driven businesses worldwide, combining premium design, sharp positioning, and structured execution.",
  primaryCtaLabel: "Book Free Consultation",
  primaryCtaLink: "/contact?package=startup",
  secondaryCtaLabel: "View Projects",
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
  seoDefaultTitle: "J-Digital Solutions | Premium Websites for Growth-Driven Businesses",
  seoDefaultDescription:
    "J-Digital Solutions creates premium websites, landing pages, and growth systems for service businesses worldwide.",
  highlightPackageSlug: "startup",
  testimonialsEnabled: true,
  createdAt: new Date(),
  updatedAt: new Date()
};

const fallbackServices: Service[] = [
  {
    id: "fallback-service-web",
    title: "Website Design & Development",
    slug: "website-design-development",
    shortDescription: "Conversion-focused websites that position your business as premium and credible.",
    description:
      "Custom websites with high-converting layouts, clear messaging, and performance-first implementation for serious business growth.",
    iconKey: "Monitor",
    position: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-service-landing",
    title: "Landing Pages for Ads",
    slug: "landing-pages-for-ads",
    shortDescription: "Ad-ready landing pages built to convert clicks into qualified inquiries.",
    description:
      "Purpose-built landing pages with persuasive sections, trust signals, and fast load times for paid traffic campaigns.",
    iconKey: "MousePointerClick",
    position: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-service-ecommerce",
    title: "E-Commerce / Online Store",
    slug: "ecommerce-online-store",
    shortDescription: "Online storefronts that make buying simple and increase order confidence.",
    description:
      "Secure and scalable e-commerce experiences with optimized product flow, checkout UX, and mobile-first shopping journeys.",
    iconKey: "ShoppingBag",
    position: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackPortfolio: PortfolioProject[] = [
  {
    id: "fallback-project-1",
    title: "UrbanRise Contractors",
    slug: "urbanrise-contractors-modern-construction-company-website",
    industry: "Construction",
    shortSummary: "Modern construction website designed to improve trust, quote quality, and service clarity.",
    tags: ["Construction", "Lead Gen", "Authority"],
    coverImage: "/placeholders/project-1.svg",
    servicesProvided: ["Website Design", "Responsive Development", "SEO Foundation"],
    liveLink: null,
    status: ProjectStatus.DEMO,
    position: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-project-2",
    title: "VitalCore Health Clinic",
    slug: "vitalcore-health-clinic-modern-healthcare-website",
    industry: "Healthcare",
    shortSummary: "Healthcare-focused site with cleaner mobile UX and stronger patient inquiry confidence.",
    tags: ["Healthcare", "Trust", "Mobile UX"],
    coverImage: "/placeholders/project-4.svg",
    servicesProvided: ["Website Design", "Content Structure", "Booking CTA"],
    liveLink: null,
    status: ProjectStatus.DEMO,
    position: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-project-3",
    title: "LuxeCart Online",
    slug: "luxecart-online-premium-ecommerce-website",
    industry: "E-Commerce",
    shortSummary: "Premium storefront concept built to improve product confidence and purchase intent.",
    tags: ["E-Commerce", "Conversion", "Storefront"],
    coverImage: "/placeholders/project-2.svg",
    servicesProvided: ["Store UX", "Responsive Build", "Speed Optimization"],
    liveLink: null,
    status: ProjectStatus.DEMO,
    position: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-project-4",
    title: "Elevate Consulting Group",
    slug: "elevate-consulting-group-corporate-consulting-website",
    industry: "Consulting",
    shortSummary: "Authority-focused consulting website designed for higher-value consultation inquiries.",
    tags: ["Consulting", "B2B", "Authority"],
    coverImage: "/placeholders/project-3.svg",
    servicesProvided: ["Brand Positioning", "Website Design", "Lead Capture"],
    liveLink: null,
    status: ProjectStatus.DEMO,
    position: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-project-5",
    title: "PrimeSteel Structures",
    slug: "primestreel-structures-construction-website",
    industry: "Construction",
    shortSummary: "Industrial-style website for showcasing services, capability, and stronger bid credibility.",
    tags: ["Construction", "Industrial", "Branding"],
    coverImage: "/placeholders/project-5.svg",
    servicesProvided: ["Website Design", "Development", "Messaging"],
    liveLink: null,
    status: ProjectStatus.DEMO,
    position: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-project-6",
    title: "WellSpring Family Care",
    slug: "wellspring-family-care-family-healthcare-website",
    industry: "Healthcare",
    shortSummary: "Family-care website concept focused on readability, trust, and organized contact flow.",
    tags: ["Healthcare", "Clinic", "Mobile"],
    coverImage: "/placeholders/project-6.svg",
    servicesProvided: ["Website Design", "UX Strategy", "Forms"],
    liveLink: null,
    status: ProjectStatus.DEMO,
    position: 6,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackProcess: ProcessStep[] = [
  {
    id: "fallback-process-1",
    title: "Discovery & Strategy",
    description: "We align goals, audience, and project scope before building.",
    deliverables: ["Strategy brief", "Offer clarity", "Scope mapping"],
    timeline: "Day 1",
    position: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-process-2",
    title: "Structure & Wireframe",
    description: "We map sections and content hierarchy for clarity and conversion.",
    deliverables: ["Page structure", "Wireframe direction", "Content priorities"],
    timeline: "Day 1-2",
    position: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-process-3",
    title: "Design & Development",
    description: "We build the premium website experience and core functionality.",
    deliverables: ["UI build", "Responsive layouts", "Lead form setup"],
    timeline: "Day 2-7",
    position: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-process-4",
    title: "Optimization & Testing",
    description: "We validate performance, responsiveness, and final quality.",
    deliverables: ["Speed checks", "Cross-device QA", "Final polish"],
    timeline: "Day 6-9",
    position: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-process-5",
    title: "Launch & Support",
    description: "We deploy and monitor for a stable go-live experience.",
    deliverables: ["Go-live setup", "Core tracking", "Post-launch support"],
    timeline: "Day 7-10",
    position: 5,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackPricing: PricingPackage[] = [
  {
    id: "fallback-pricing-starter",
    name: "Starter",
    slug: "starter",
    price: 3999,
    delivery: "3-5 Days",
    includes: ["1-Page Landing Page", "Mobile Responsive Design", "Contact Form", "Basic Setup", "Live Deployment"],
    freebies: ["Free Logo (Basic Branding)", "Free Consultation"],
    note: "Web Hosting & Domain Not Included",
    isPopular: false,
    position: 1,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-pricing-basic",
    name: "Basic",
    slug: "basic",
    price: 5999,
    delivery: "3-7 Days",
    includes: ["Up to 3 Pages", "Mobile Responsive Design", "Contact Form Integration", "Basic SEO Setup", "Social Media Links", "Live Website Deployment"],
    freebies: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"],
    note: null,
    isPopular: false,
    position: 2,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-pricing-startup",
    name: "Startup",
    slug: "startup",
    price: 14999,
    delivery: "7-10 Days",
    includes: [
      "Up to 5-7 Pages",
      "Mobile Responsive Design",
      "Custom Layout & Branding",
      "Lead Capture Forms",
      "SEO-Ready Website Structure",
      "SSL Secured",
      "Speed & Performance Optimization",
      "Google Indexing",
      "Live Website Deployment"
    ],
    freebies: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"],
    note: null,
    isPopular: true,
    position: 3,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-pricing-professional",
    name: "Professional",
    slug: "professional",
    price: 26999,
    delivery: "7-15 Days",
    includes: [
      "Up to 8-10 Pages",
      "Mobile Responsive Design",
      "Fully Custom Website",
      "Booking / Inquiry System",
      "Advanced SEO Structure",
      "Security & Performance Setup",
      "SSL Secured",
      "Admin / Staff Dashboard"
    ],
    freebies: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"],
    note: null,
    isPopular: false,
    position: 4,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const fallbackFaq: FAQ[] = [
  {
    id: "fallback-faq-1",
    question: "How fast can we launch?",
    answer: "Most projects launch within 3 to 15 days depending on scope, content readiness, and integrations.",
    position: 1,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "fallback-faq-2",
    question: "Do you provide content and images?",
    answer: "Yes. We can guide messaging, structure your content, and recommend suitable visuals for a more premium result.",
    position: 2,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

function normalizeLegacySettings(settings: SiteSettings): SiteSettings {
  const legacyHeroHeadline = "Turn Your Website Into a 24/7 Client-Generating System";
  const legacyHeroSubheadline =
    "We design and build premium websites for Philippine businesses that improve trust, capture leads, and drive consistent growth.";
  const legacySeoTitle = "J-Digital Solutions | Premium Websites for Philippine Businesses";
  const legacySeoDescription =
    "J-Digital Solutions creates conversion-focused websites, landing pages, and growth systems for Philippine SMEs and local brands.";
  const legacySecondaryCtaLabel = "View Portfolio";

  return {
    ...settings,
    heroHeadline: settings.heroHeadline === legacyHeroHeadline ? fallbackSiteSettings.heroHeadline : settings.heroHeadline,
    heroSubheadline: settings.heroSubheadline === legacyHeroSubheadline ? fallbackSiteSettings.heroSubheadline : settings.heroSubheadline,
    secondaryCtaLabel:
      settings.secondaryCtaLabel === legacySecondaryCtaLabel ? fallbackSiteSettings.secondaryCtaLabel : settings.secondaryCtaLabel,
    seoDefaultTitle: settings.seoDefaultTitle === legacySeoTitle ? fallbackSiteSettings.seoDefaultTitle : settings.seoDefaultTitle,
    seoDefaultDescription:
      settings.seoDefaultDescription === legacySeoDescription
        ? fallbackSiteSettings.seoDefaultDescription
        : settings.seoDefaultDescription
  };
}

export const getSiteSettings = cache(async () => {
  try {
    const settings = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (settings) return normalizeLegacySettings(settings);

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

    return {
      settings,
      services: services.length > 0 ? services : fallbackServices,
      portfolio: portfolio.length > 0 ? portfolio : fallbackPortfolio,
      process: process.length > 0 ? process : fallbackProcess,
      pricing: pricing.length > 0 ? pricing : fallbackPricing,
      faq: faq.length > 0 ? faq : fallbackFaq,
      testimonials
    };
  } catch (error) {
    console.error("Database unavailable while loading public data. Returning fallback content.", error);
    return {
      settings: fallbackSiteSettings,
      services: fallbackServices,
      portfolio: fallbackPortfolio,
      process: fallbackProcess,
      pricing: fallbackPricing,
      faq: fallbackFaq,
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
