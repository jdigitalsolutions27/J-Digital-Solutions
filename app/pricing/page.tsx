import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { PremiumFaqAccordion } from "@/components/marketing/premium-faq-accordion";
import { PricingPackageStack, type PricingPackageCard } from "@/components/marketing/pricing-package-stack";
import { MarketingShell } from "@/components/marketing/shell";
import { PricingFitQuiz } from "@/components/marketing/pricing-fit-quiz";
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

const pricingPackages: PricingPackageCard[] = [
  {
    name: "STARTER",
    slug: "starter",
    price: 3999,
    delivery: "3-5 Days",
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
    name: "BASIC",
    slug: "basic",
    price: 5999,
    delivery: "3-7 Days",
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
    name: "STARTUP",
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
    complimentary: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"],
    isPopular: true
  },
  {
    name: "PROFESSIONAL",
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
    complimentary: ["1-Year Free Hosting & Domain", "Free Logo (Branding)", "Free Consultation"]
  },
  {
    name: "BUSINESS / E-COMMERCE",
    slug: "business-ecommerce",
    price: 46999,
    delivery: "7-20 Days",
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
          <PricingPackageStack packages={pricingPackages} />
        </div>

        <Reveal className="mt-14 text-center">
          <p className="text-base font-semibold text-white">Not sure which package fits your needs?</p>
        </Reveal>

        <div className="mx-auto mt-6 max-w-4xl">
          <PricingFitQuiz packages={pricingPackages.map((item) => ({ slug: item.slug, name: item.name }))} />
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
