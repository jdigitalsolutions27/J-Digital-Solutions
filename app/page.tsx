import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Gauge,
  LayoutDashboard,
  SearchCheck,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Workflow
} from "lucide-react";

import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { SoftWaveSeparator } from "@/components/layout/dividers/SoftWaveSeparator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { AuditLeadForm } from "@/components/marketing/audit-lead-form";
import { FrameworkStepper } from "@/components/marketing/framework-stepper";
import { GrowthPipeline } from "@/components/marketing/growth-pipeline";
import { HomeHero } from "@/components/marketing/home-hero";
import { HomePortfolioShowcase } from "@/components/marketing/home-portfolio-showcase";
import { PremiumFaqAccordion } from "@/components/marketing/premium-faq-accordion";
import { SectionHeading } from "@/components/marketing/section-heading";
import { MarketingShell } from "@/components/marketing/shell";
import { TrackedButtonLink } from "@/components/marketing/tracked-button-link";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { getPublicData } from "@/lib/site-data";
import { highlightKeyword, typography } from "@/lib/typography";
import { peso } from "@/lib/utils";

export async function generateMetadata() {
  return buildMetadata({
    title: "J-Digital Solutions | Websites That Convert for PH Businesses",
    description:
      "Premium, conversion-focused websites for Philippine businesses. Build trust, capture leads, and scale with confidence.",
    path: "/"
  });
}

const trustItems = [
  { icon: Smartphone, label: "Mobile-Ready" },
  { icon: SearchCheck, label: "SEO Foundation" },
  { icon: Gauge, label: "Fast Performance" },
  { icon: LayoutDashboard, label: "Conversion Layout" }
];

const painPoints = [
  {
    title: "Missed inquiries in social inboxes",
    description: "Leads disappear in long chat threads and follow-ups become inconsistent."
  },
  {
    title: "Low credibility at first impression",
    description: "Businesses look less established without a premium, structured website presence."
  },
  {
    title: "No conversion flow",
    description: "Traffic from referrals and ads leaks because there is no clear inquiry pathway."
  }
];

const whyChooseItems = [
  {
    icon: Sparkles,
    title: "Conversion-First Structure",
    description: "Every section is planned to move visitors from interest to inquiry."
  },
  {
    icon: Smartphone,
    title: "Mobile-First Performance",
    description: "Fast, clean, and optimized for how Philippine buyers browse on mobile."
  },
  {
    icon: Gauge,
    title: "SEO-Ready Architecture",
    description: "Technical foundations are built in from day one for long-term discoverability."
  },
  {
    icon: LayoutDashboard,
    title: "Admin Dashboard Access",
    description: "Manage your core content quickly without relying on developers."
  },
  {
    icon: Workflow,
    title: "Structured Development Process",
    description: "Clear timelines, clear deliverables, and clear accountability."
  },
  {
    icon: ShieldCheck,
    title: "Post-Launch Support",
    description: "We stay available to keep your site stable, secure, and improving."
  }
];

const valueMetrics = [
  {
    icon: ShieldCheck,
    title: "Credibility",
    text: "Designed for trust and clarity from first visit."
  },
  {
    icon: Workflow,
    title: "Inquiry Quality",
    text: "Built to improve inquiry quality and intent."
  },
  {
    icon: Gauge,
    title: "Speed & Performance",
    text: "Optimized for fast loading and smooth mobile UX."
  },
  {
    icon: SearchCheck,
    title: "SEO Foundation",
    text: "Technical base prepared for long-term visibility."
  }
];

const defaultFaqItems = [
  {
    id: "faq-launch",
    question: "How fast can we launch?",
    answer: "Most projects launch within 3 to 15 days depending on scope and content readiness."
  },
  {
    id: "faq-content",
    question: "Do you provide content and images?",
    answer: "Yes. We can guide messaging and suggest suitable visuals to keep your site clear and conversion-focused."
  },
  {
    id: "faq-mobile",
    question: "Will it work on mobile?",
    answer: "Yes. Every build is responsive, mobile-optimized, and tested across common devices."
  },
  {
    id: "faq-admin",
    question: "Do I get admin access?",
    answer: "Yes. You get secure admin access to manage key site content and leads."
  },
  {
    id: "faq-support",
    question: "What happens after launch?",
    answer: "We provide post-launch support and can continue helping with optimization and growth updates."
  }
];

export default async function HomePage() {
  const data = await getPublicData();
  const popular =
    data.pricing.find((item) => item.slug === data.settings.highlightPackageSlug) ||
    data.pricing.find((item) => item.isPopular) ||
    data.pricing[0];
  const starter = data.pricing.find((item) => item.slug === "starter");
  const startup = data.pricing.find((item) => item.slug === "startup") || popular;
  const professional = data.pricing.find((item) => item.slug === "professional");

  const faqByQuestion = new Map(data.faq.map((item) => [item.question.toLowerCase(), item]));
  const faqItems = defaultFaqItems.map((item) => {
    const fromDb = faqByQuestion.get(item.question.toLowerCase());
    if (!fromDb) return item;
    return { id: fromDb.id, question: fromDb.question, answer: fromDb.answer };
  });

  const hasFeature = (pkg: { includes: string[] } | undefined, keywords: string[]) =>
    pkg?.includes.some((item) => keywords.some((keyword) => item.toLowerCase().includes(keyword))) ?? false;

  return (
    <MarketingShell>
      <HomeHero
        headline={data.settings.heroHeadline}
        subheadline={data.settings.heroSubheadline}
        primaryCtaLink={data.settings.primaryCtaLink || "/contact?package=startup"}
        secondaryCtaLink={data.settings.secondaryCtaLink || "/portfolio"}
      />

      <SectionWrapper variant="base" withTopDivider glow="soft" className="pt-4 md:pt-8">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item) => (
            <StaggerItem key={item.label}>
              <TiltCard className="h-full">
                <Card className="h-full">
                  <CardContent className="flex items-center gap-3 p-5">
                    <item.icon className="h-5 w-5 text-blue-300" />
                    <p className="text-sm font-semibold text-slate-100">{item.label}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionWrapper>

      <SoftWaveSeparator />

      <SectionWrapper variant="raised" glow="soft" id="pain-points">
        <div className="grid gap-8 lg:grid-cols-[1fr,1.08fr]">
          <Reveal className="space-y-5">
            <p className={typography.eyebrow}>Pain Points</p>
            <h2 className={`${typography.pageTitle} heading-underline`}>
              Why local businesses still struggle to convert online
            </h2>
            <p className={typography.sectionLead}>
              Most websites look acceptable but fail at one critical job: turning traffic into qualified inquiries.
            </p>
            <ul className="space-y-3 text-sm text-slate-200">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                Delayed replies reduce buyer trust and intent.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                Inconsistent messaging causes confusion before contact.
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                No clear funnel means ad spend loses momentum.
              </li>
            </ul>

            <Card className="border-cyan-300/25 bg-cyan-500/[0.06]">
              <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-rose-200/90">Before</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    <li>FB-only inquiries</li>
                    <li>Lost messages</li>
                    <li>Low trust</li>
                  </ul>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">After</p>
                  <ul className="mt-2 space-y-1 text-sm text-slate-200">
                    <li>Website funnels leads</li>
                    <li>Organized inquiries</li>
                    <li>Higher credibility</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </Reveal>

          <Stagger className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {painPoints.map((item, index) => (
              <StaggerItem key={item.title} className={index === 1 ? "lg:translate-x-8" : index === 2 ? "lg:translate-x-4" : ""}>
                <Card className="h-full border-white/12 bg-white/[0.04]">
                  <CardContent className="space-y-3 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Issue {index + 1}</p>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm text-slate-300">{item.description}</p>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </SectionWrapper>

      <GlowBandSeparator />

      <SectionWrapper variant="base" glow="soft" id="solution">
        <Reveal>
          <SectionHeading
            eyebrow="Solution"
            title="Your Conversion Pipeline: Attention → Inquiry → Growth"
            description="J-Digital combines persuasive messaging, premium design, and conversion strategy so your website performs like a sales asset."
          />
        </Reveal>
        <div className="mt-10">
          <GrowthPipeline />
        </div>
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="soft" id="why-jdigital" withTopDivider withBottomDivider>
        <Reveal>
          <SectionHeading
            eyebrow="Why J-Digital"
            title="Why Businesses Choose J-Digital"
            description="Built for clarity, trust, and high-intent conversion from first visit to inquiry."
          />
        </Reveal>
        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {whyChooseItems.map((item) => (
            <StaggerItem key={item.title}>
              <TiltCard className="h-full">
                <Card className="h-full border-white/15 bg-white/[0.03]">
                  <CardContent className="space-y-4 p-6">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-500/15 text-blue-100">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionWrapper>

      <SoftWaveSeparator />

      <SectionWrapper variant="base" glow="soft" id="portfolio">
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="See how we position brands to look premium and convert better"
            description="Featured projects and selected builds across high-trust business categories."
          />
        </Reveal>
        <div className="mt-10">
          <HomePortfolioShowcase
            projects={data.portfolio.map((project) => ({
              id: project.id,
              title: project.title,
              slug: project.slug,
              industry: project.industry,
              shortSummary: project.shortSummary,
              coverImage: project.coverImage,
              servicesProvided: project.servicesProvided,
              status: project.status
            }))}
          />
        </div>
        <div className="mt-8 flex justify-center">
          <TrackedButtonLink
            href="/portfolio"
            eventName="view_portfolio"
            payload={{ placement: "home_view_all" }}
            size="lg"
            variant="outline"
          >
            View All Projects <ArrowRight className="ml-1 h-4 w-4" />
          </TrackedButtonLink>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="raised" glow="soft" id="framework" withTopDivider withBottomDivider>
        <Reveal>
          <SectionHeading
            eyebrow="Framework"
            title={
              <>
                J-Digital {highlightKeyword("Growth Framework", "Growth")}
                {"\u2122"}
              </>
            }
            description="Interactive step-by-step delivery system with clear timelines and deliverables."
          />
        </Reveal>
        <div className="mt-10">
          <FrameworkStepper
            steps={data.process.map((step) => ({
              id: step.id,
              title: step.title,
              description: step.description,
              timeline: step.timeline,
              deliverables: step.deliverables
            }))}
          />
        </div>
      </SectionWrapper>

      <GlowBandSeparator />

      <SectionWrapper variant="base" glow="soft" id="results">
        <Reveal>
          <SectionHeading
            eyebrow="Value Metrics"
            title="Built to improve business outcomes, not just visual appeal"
            description="Authority-focused indicators designed to strengthen trust and lead quality."
          />
        </Reveal>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {valueMetrics.map((metric) => (
            <StaggerItem key={metric.title}>
              <Card className="h-full">
                <CardContent className="space-y-3 p-5">
                  <metric.icon className="h-5 w-5 text-cyan-200" />
                  <h3 className="font-semibold text-white">{metric.title}</h3>
                  <p className="text-sm text-slate-300">{metric.text}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="soft" id="pricing" withTopDivider withBottomDivider>
        <Reveal>
          <SectionHeading
            eyebrow="Pricing Preview"
            title="Packages Designed for Business Growth"
            description="Transparent deliverables. Realistic timelines. Built for growth."
          />
        </Reveal>
        <Reveal>
          <p className="mt-6 text-center text-sm text-blue-100">
            We take a limited number of projects monthly to maintain quality.
          </p>
        </Reveal>

        {popular ? (
          <div className="mx-auto mt-10 max-w-4xl">
            <TiltCard>
              <Card className="border-cyan-300/35 bg-slate-900/55">
                <CardHeader>
                  <Badge className="relative w-fit overflow-hidden pr-4">
                    <span className="relative z-10">Most Popular</span>
                    <span className="pricing-badge-pulse absolute inset-0 rounded-full" />
                  </Badge>
                  <CardTitle className="mt-2 text-3xl">{popular.name}</CardTitle>
                  <p className="text-2xl font-bold text-blue-200">{peso(popular.price)}</p>
                  <p className="text-sm text-slate-300">Delivery: {popular.delivery}</p>
                </CardHeader>
                <CardContent>
                  <Stagger className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2" staggerChildren={0.05}>
                    {popular.includes.slice(0, 8).map((item) => (
                      <StaggerItem key={item}>
                        <div className="flex gap-2">
                          <BadgeCheck className="mt-0.5 h-4 w-4 text-blue-300" /> {item}
                        </div>
                      </StaggerItem>
                    ))}
                  </Stagger>

                  <div className="mt-6 flex flex-wrap gap-3">
                    <TrackedButtonLink
                      href="/contact?package=startup"
                      eventName="book_free_consultation"
                      payload={{ placement: "pricing_primary" }}
                    >
                      Request Free Consultation
                    </TrackedButtonLink>
                    <TrackedButtonLink
                      href="/pricing"
                      eventName="compare_packages"
                      payload={{ placement: "pricing_secondary" }}
                      variant="outline"
                    >
                      Compare All Packages
                    </TrackedButtonLink>
                  </div>
                </CardContent>
              </Card>
            </TiltCard>

            <Reveal className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="mb-4 text-sm font-semibold text-white">
                    Quick Comparison: Starter vs Startup vs Professional
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-white/10 text-slate-200">
                          <th className="px-3 py-2 text-left">Feature</th>
                          <th className="px-3 py-2 text-left">Starter</th>
                          <th className="px-3 py-2 text-left">Startup</th>
                          <th className="px-3 py-2 text-left">Professional</th>
                        </tr>
                      </thead>
                      <tbody className="text-slate-300">
                        <tr className="border-b border-white/10">
                          <td className="px-3 py-2 text-white">Pages</td>
                          <td className="px-3 py-2">
                            {starter?.includes.find((item) => item.toLowerCase().includes("page")) ?? "Included"}
                          </td>
                          <td className="px-3 py-2">
                            {startup?.includes.find((item) => item.toLowerCase().includes("page")) ?? "Included"}
                          </td>
                          <td className="px-3 py-2">
                            {professional?.includes.find((item) => item.toLowerCase().includes("page")) ?? "Included"}
                          </td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="px-3 py-2 text-white">Custom Branding</td>
                          <td className="px-3 py-2">{hasFeature(starter, ["branding", "custom"]) ? "Yes" : "No"}</td>
                          <td className="px-3 py-2">{hasFeature(startup, ["branding", "custom"]) ? "Yes" : "No"}</td>
                          <td className="px-3 py-2">Yes</td>
                        </tr>
                        <tr className="border-b border-white/10">
                          <td className="px-3 py-2 text-white">Lead Capture</td>
                          <td className="px-3 py-2">{hasFeature(starter, ["contact form", "lead"]) ? "Yes" : "No"}</td>
                          <td className="px-3 py-2">{hasFeature(startup, ["lead capture", "form"]) ? "Yes" : "No"}</td>
                          <td className="px-3 py-2">
                            {hasFeature(professional, ["inquiry", "booking", "form"]) ? "Yes" : "No"}
                          </td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-white">Booking System</td>
                          <td className="px-3 py-2">{hasFeature(starter, ["booking"]) ? "Yes" : "No"}</td>
                          <td className="px-3 py-2">{hasFeature(startup, ["booking"]) ? "Yes" : "No"}</td>
                          <td className="px-3 py-2">{hasFeature(professional, ["booking"]) ? "Yes" : "No"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        ) : null}
      </SectionWrapper>

      <SectionWrapper variant="base" glow="soft" id="faq">
        <Reveal>
          <SectionHeading eyebrow="FAQ" title="Quick Answers Before You Start" />
        </Reveal>
        <Reveal className="mt-8">
          <PremiumFaqAccordion items={faqItems} />
        </Reveal>
        <Reveal>
          <p className="mt-5 text-center text-sm text-slate-300">
            Still have questions? Message us and we will guide you.
          </p>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper variant="raised" glow="soft" id="audit" withTopDivider>
        <Reveal>
          <SectionHeading
            eyebrow="Free Audit"
            title="Get a Free Website Audit for Your Business"
            description="We will review your website or Facebook page and send improvement recommendations."
          />
        </Reveal>
        <div className="mt-8">
          <AuditLeadForm />
        </div>
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="hero" withTopDivider withBottomDivider>
        <Reveal>
          <Card className="border-cyan-300/30 bg-slate-900/60">
            <CardContent className="p-8 text-center sm:p-12">
              <h2 className={`${typography.pageTitle} mx-auto max-w-3xl`}>
                Ready to turn your website into a growth engine?
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-slate-200">
                Secure your free strategy consultation and get a clear action plan based on your business goals.
              </p>
              <div className="mt-6 flex justify-center">
                <TrackedButtonLink
                  href="/contact?package=startup"
                  eventName="book_free_consultation"
                  payload={{ placement: "final_cta" }}
                  size="lg"
                >
                  Book Free Consultation
                </TrackedButtonLink>
              </div>
            </CardContent>
          </Card>
        </Reveal>
      </SectionWrapper>
    </MarketingShell>
  );
}
