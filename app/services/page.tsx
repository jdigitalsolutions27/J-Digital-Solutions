import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { MarketingShell } from "@/components/marketing/shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ServiceComparisonTabs } from "@/components/marketing/service-comparison-tabs";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

export async function generateMetadata() {
  return buildMetadata({
    title: "Services | J-Digital Solutions",
    description:
      "Explore J-Digital Solutions services: websites, landing pages, e-commerce, SEO optimization, and maintenance support.",
    path: "/services"
  });
}

function serviceLens(title: string) {
  const map: Record<string, { whoFor: string; whatYouGet: string[]; useCase: string }> = {
    "Website Design & Development": {
      whoFor: "Businesses that need a complete premium web presence to build trust and generate leads.",
      whatYouGet: ["Multi-page structure", "Conversion-focused UI", "Admin-ready content control"],
      useCase: "Ideal when your current website lacks structure or credibility."
    },
    "Landing Pages for Ads": {
      whoFor: "Campaign teams running Facebook or paid traffic with one clear conversion goal.",
      whatYouGet: ["Single-goal page", "Fast load and messaging alignment", "Lead capture optimization"],
      useCase: "Best for promotions, offers, and ad funnels."
    },
    "E-Commerce / Online Store": {
      whoFor: "Brands selling products/services online that need operational clarity and trust.",
      whatYouGet: ["Store structure", "Product experience UX", "Checkout confidence optimization"],
      useCase: "Best for catalog growth and online order workflows."
    },
    "Website Speed & SEO Optimization": {
      whoFor: "Businesses that already have a site but need better visibility and performance.",
      whatYouGet: ["Technical SEO fixes", "Performance improvements", "Core layout and metadata tuning"],
      useCase: "Ideal before scaling traffic or campaigns."
    },
    "Maintenance & Support": {
      whoFor: "Teams that want stability, updates, and ongoing web reliability.",
      whatYouGet: ["Proactive maintenance", "Content updates", "Issue prevention and monitoring"],
      useCase: "Useful for active websites with frequent updates."
    }
  };

  return (
    map[title] ?? {
      whoFor: "Businesses focused on growth and conversion quality.",
      whatYouGet: ["Strategic planning", "Execution support", "Performance-ready delivery"],
      useCase: "Customized to your business objectives."
    }
  );
}

export default async function ServicesPage() {
  const services = await db.service
    .findMany({ where: { isActive: true }, orderBy: { position: "asc" } })
    .catch(() => []);

  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <Reveal>
          <p className={typography.eyebrow}>Services</p>
          <h1 className={`mt-3 ${typography.heroTitle}`}>Execution systems built for credibility and growth</h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
            Every service is structured to improve trust, conversion clarity, and operational speed.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/contact?package=startup">
                Request Consultation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </SectionWrapper>

      <SectionWrapper variant="base" glow="soft" withTopDivider>
        <Reveal>
          <SectionHeading
            eyebrow="Service Lines"
            title="Solutions mapped to your growth stage"
            description="Choose services based on business context, not generic templates."
          />
        </Reveal>

        <Stagger className="mt-10 grid gap-6 lg:grid-cols-2">
          {services.map((service) => {
            const lens = serviceLens(service.title);
            return (
              <StaggerItem key={service.id}>
                <TiltCard className="h-full">
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="text-2xl">{service.title}</CardTitle>
                      <p className="text-sm text-cyan-200">{service.shortDescription}</p>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Who It Is For</p>
                        <p className="mt-2 text-sm text-slate-200">{lens.whoFor}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">What You Get</p>
                        <ul className="mt-2 space-y-2">
                          {lens.whatYouGet.map((item) => (
                            <li key={item} className="flex gap-2 text-sm text-slate-200">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Typical Use Case</p>
                        <p className="mt-2 text-sm text-slate-300">{lens.useCase}</p>
                      </div>
                      <Button asChild>
                        <Link href="/contact?package=startup">Request Consultation</Link>
                      </Button>
                    </CardContent>
                  </Card>
                </TiltCard>
              </StaggerItem>
            );
          })}
        </Stagger>

        {services.length === 0 ? (
          <Card className="mt-8 border-cyan-300/25 bg-cyan-500/[0.06]">
            <CardContent className="p-6 text-sm text-slate-200">
              Services are being prepared. You can still request a consultation and we will recommend the right setup.
            </CardContent>
          </Card>
        ) : null}
      </SectionWrapper>

      <GlowBandSeparator />

      <SectionWrapper variant="raised" glow="soft" withTopDivider withBottomDivider>
        <Reveal>
          <SectionHeading
            eyebrow="Comparison"
            title="Website vs Landing Page vs E-Commerce"
            description="Quick way to identify the right direction before committing."
          />
        </Reveal>
        <div className="mt-8">
          <ServiceComparisonTabs />
        </div>
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="hero" withTopDivider withBottomDivider>
        <Card className="border-cyan-300/30 bg-slate-900/60">
          <CardContent className="flex flex-col gap-4 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">Need a custom service stack?</h2>
              <p className="mt-2 text-sm text-slate-200">
                We can combine services into a phased roadmap based on your goals and timeline.
              </p>
            </div>
            <Button asChild size="lg">
              <Link href="/contact?package=startup">Book Free Consultation</Link>
            </Button>
          </CardContent>
        </Card>
      </SectionWrapper>
    </MarketingShell>
  );
}
