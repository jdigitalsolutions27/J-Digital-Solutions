import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { PricingMarketSwitcher } from "@/components/marketing/pricing-market-switcher";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { PremiumFaqAccordion } from "@/components/marketing/premium-faq-accordion";
import { PricingPackageStack, type PricingPackageCard } from "@/components/marketing/pricing-package-stack";
import { MarketingShell } from "@/components/marketing/shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { TrackedButtonLink } from "@/components/marketing/tracked-button-link";
import { Reveal } from "@/components/motion/Reveal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

export async function generateMetadata() {
  return buildMetadata({
    title: "Pricing | J-Digital Solutions",
    description: "View J-Digital Solutions website packages and choose the best fit for your business growth goals.",
    path: "/pricing"
  });
}

export const revalidate = 300;

const pricingPackages: PricingPackageCard[] = [
  {
    name: "Starter",
    slug: "starter",
    price: 3999,
    delivery: "3-5 Days",
    idealFor: "Best for businesses that need a strong entry-level web presence with a clear first step online.",
    includes: [
      "1-Page Landing Page",
      "Mobile Responsive Design",
      "Contact Form",
      "Basic Setup",
      "Live Website Deployment"
    ],
    note: "Web Hosting & Domain Not Included",
    complimentary: ["Free Logo (Basic Branding)", "Free Consultation"]
  },
  {
    name: "Basic",
    slug: "basic",
    price: 5999,
    delivery: "3-7 Days",
    idealFor: "Best for growing businesses that need a multi-page website with stronger trust signals.",
    includes: [
      "Up to 3 Pages",
      "Mobile Responsive Design",
      "Contact Form Integration",
      "Basic SEO Setup",
      "Social Media Links",
      "Live Website Deployment"
    ],
    complimentary: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"]
  },
  {
    name: "Startup",
    slug: "startup",
    price: 14999,
    delivery: "7-10 Days",
    idealFor: "Best for serious businesses ready to invest in a premium, lead-focused website system.",
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
    complimentary: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"],
    isPopular: true
  },
  {
    name: "Professional",
    slug: "professional",
    price: 26999,
    delivery: "7-15 Days",
    idealFor: "Best for established companies that need a custom build with operational workflows and admin access.",
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
    complimentary: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"]
  },
  {
    name: "Business / E-Commerce",
    slug: "business-ecommerce",
    price: 46999,
    delivery: "7-20 Days",
    idealFor: "Best for businesses that need online selling, advanced systems, or a more complex web platform.",
    includes: [
      "10+ Pages",
      "Mobile Responsive Design",
      "Online Store or Advanced System",
      "Product / Service Setup",
      "Payment Integration (If Required)",
      "Advanced Optimization",
      "Admin / Staff Dashboard",
      "Security & Performance Setup",
      "SSL Secured",
      "30 Days Priority Support"
    ],
    complimentary: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"]
  }
];

const internationalPricingPackages: PricingPackageCard[] = [
  {
    name: "Starter Website",
    slug: "starter",
    price: 199,
    priceLabel: "$199",
    delivery: "3-5 Days",
    idealFor: "Best for freelancers and small startups that need a clean, professional website fast.",
    includes: [
      "3-5 Pages Professional Website",
      "Mobile Responsive",
      "Contact Form",
      "Basic On-Page SEO",
      "Live Deployment"
    ],
    complimentary: ["Free Logo", "Free Consultation", "7 Days Support"]
  },
  {
    name: "Business Website",
    slug: "startup",
    price: 499,
    priceLabel: "$499",
    delivery: "5-14 Days",
    idealFor: "Best for growing businesses that need stronger branding, lead capture, and a more strategic web presence.",
    includes: [
      "Up to 5-7 Pages",
      "Mobile Responsive",
      "Custom Layout & Branding",
      "Lead Capture Forms",
      "SEO-Ready Structure",
      "Speed Optimization",
      "SSL Setup",
      "Google Indexing"
    ],
    complimentary: [
      "Free Facebook Ads for 3 Days",
      "1 Year Free Hosting & Domain",
      "Free Logo",
      "14 Days Support"
    ],
    isPopular: true
  },
  {
    name: "Professional Website",
    slug: "professional",
    price: 999,
    priceLabel: "$999",
    delivery: "14-21 Days",
    idealFor: "Best for established companies that need a fully custom, scalable website aligned with brand and operations.",
    includes: [
      "8-12 Pages",
      "Mobile Responsive",
      "Fully Custom Design",
      "Booking / Inquiry System",
      "Advanced SEO Structure",
      "Performance & Security Setup",
      "Admin Dashboard"
    ],
    complimentary: [
      "Free Facebook Ads for 5 Days",
      "1 Year Hosting & Domain",
      "Free Logo",
      "Branding Package",
      "30 Days Priority Support"
    ]
  },
  {
    name: "E-Commerce / Advanced System",
    slug: "business-ecommerce",
    price: 1999,
    priceLabel: "$1,999+",
    delivery: "21-30 Days",
    idealFor: "Best for serious businesses that need online selling, automation, or a more advanced custom system.",
    includes: [
      "Online Store / Advanced Web System",
      "Mobile Responsive",
      "Payment Integration",
      "Product Setup",
      "Custom UI/UX",
      "Admin Dashboard",
      "Security Hardening",
      "Speed Optimization"
    ],
    complimentary: [
      "Free Facebook Ads for 7 Days",
      "1 Year Hosting",
      "Free Logo",
      "Branding Package",
      "30 Days Priority Support"
    ]
  }
];

const fallbackFaqs = [
  {
    id: "pricing-faq-1",
    question: "How soon can we launch once we start?",
    answer: "Timelines depend on package scope, but launch windows are clearly defined in each package to keep delivery realistic and structured."
  },
  {
    id: "pricing-faq-2",
    question: "Can I upgrade from one package to another later?",
    answer: "Yes. We can expand your website as your business grows, then map the added scope and timeline before implementation."
  },
  {
    id: "pricing-faq-3",
    question: "Do you support revisions before launch?",
    answer: "Yes. Revisions are handled within project scope to ensure the final website aligns with your goals and brand direction."
  }
];

export default async function PricingPage() {
  const faqs = await db.fAQ.findMany({ where: { isPublished: true }, orderBy: { position: "asc" }, take: 5 }).catch(() => []);
  const faqItems = faqs.length > 0 ? faqs : fallbackFaqs;

  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <Reveal>
          <p className={typography.eyebrow}>Pricing Packages</p>
          <h1 className={`mt-3 ${typography.heroTitle}`}>Transparent Packages for Every Growth Stage</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Investment-focused website solutions with clear deliverables and realistic timelines.
          </p>
        </Reveal>
      </SectionWrapper>

      <GlowBandSeparator />

      <SectionWrapper variant="base" glow="soft" withTopDivider withBottomDivider>
        <Reveal>
          <SectionHeading
            eyebrow="Packages"
            title="Choose the Right Level for Your Business Goals"
          />
        </Reveal>

        <div className="mt-10">
          <PricingMarketSwitcher
            markets={[
              {
                key: "ph",
                label: "PH Pricing",
                eyebrow: "For the Philippine Market",
                description:
                  "Structured investment packages tailored for businesses operating in the Philippine market that need premium positioning, stronger inquiry flow, and realistic delivery timelines.",
                packages: pricingPackages
              },
              {
                key: "international",
                label: "International Pricing",
                eyebrow: "For International Clients",
                description:
                  "Professional website packages for international clients who need premium design, strategic structure, and reliable execution with clear support coverage.",
                packages: internationalPricingPackages
              }
            ]}
          />
        </div>
      </SectionWrapper>

      <GlowBandSeparator />

      <SectionWrapper variant="raised" glow="soft" withTopDivider withBottomDivider>
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />
        </Reveal>
        <div className="mt-8">
          <PremiumFaqAccordion items={faqItems} />
        </div>
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="hero" withTopDivider withBottomDivider>
        <Card className="border-cyan-300/30 bg-slate-900/60">
          <CardContent className="p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Serious Businesses Invest in Their Digital Presence.</h2>
            <div className="mt-5">
              <TrackedButtonLink
                href="/contact?package=startup"
                eventName="book_free_consultation"
                payload={{ placement: "pricing_cta_band" }}
                size="lg"
              >
                Book Free Consultation
              </TrackedButtonLink>
            </div>
          </CardContent>
        </Card>
      </SectionWrapper>
    </MarketingShell>
  );
}
