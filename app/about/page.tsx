import Link from "next/link";
import { BadgeCheck, Building2, Rocket, ShieldCheck, Sparkles } from "lucide-react";

import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { SoftWaveSeparator } from "@/components/layout/dividers/SoftWaveSeparator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { MarketingShell } from "@/components/marketing/shell";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/metadata";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-data";
import { typography } from "@/lib/typography";

export async function generateMetadata() {
  return buildMetadata({
    title: "About | J-Digital Solutions",
    description:
      "Learn about J-Digital Solutions and our approach to building trust-heavy, conversion-focused websites for Philippine businesses.",
    path: "/about"
  });
}

const principles = [
  {
    title: "Structure Wins",
    description: "Clear architecture outperforms cluttered design and random sections."
  },
  {
    title: "Trust Before Traffic",
    description: "A credible brand experience is required before scaling paid acquisition."
  },
  {
    title: "Execution Over Hype",
    description: "Consistent, measurable delivery matters more than surface-level visuals."
  }
];

const pillars = [
  {
    icon: Building2,
    title: "Business-First Execution",
    description: "Every page is designed to support your business goals, not just visual preference."
  },
  {
    icon: ShieldCheck,
    title: "Trust-Heavy Positioning",
    description: "We structure content and UX to make your business look credible from first scroll."
  },
  {
    icon: Rocket,
    title: "Growth-Oriented Systems",
    description: "Our websites are built to generate qualified inquiries and support scale."
  },
  {
    icon: Sparkles,
    title: "Premium Brand Presence",
    description: "Visual quality and messaging clarity work together to improve perceived value."
  }
];

export default async function AboutPage() {
  const settings = await getSiteSettings();
  const testimonials = settings.testimonialsEnabled
    ? await db.testimonial.findMany({ where: { isPublished: true }, orderBy: { position: "asc" } }).catch(() => [])
    : [];

  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <Reveal>
          <p className={typography.eyebrow}>About J-Digital</p>
          <h1 className={`mt-3 ${typography.heroTitle}`}>
            Built for businesses that want <span className="text-gradient-keyword">structured growth</span>
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
            We design and build trust-first websites that turn attention into organized inquiries for Philippine businesses.
          </p>
          <div className="mt-6">
            <Button asChild size="lg">
              <Link href="/contact?package=startup">Book Free Consultation</Link>
            </Button>
          </div>
        </Reveal>
      </SectionWrapper>

      <SoftWaveSeparator />

      <SectionWrapper variant="raised" glow="soft" id="mission">
        <div className="grid gap-8 lg:grid-cols-[1.1fr,1fr]">
          <Reveal>
            <p className={typography.eyebrow}>Our Mission</p>
            <h2 className={`${typography.pageTitle} heading-underline mt-2`}>
              Help local businesses look premium and convert with confidence
            </h2>
            <p className="mt-4 text-sm text-slate-300">
              We believe growth happens when design, structure, and messaging are aligned. Our mission is to deliver
              websites that clarify your value, reduce buyer hesitation, and drive better conversations.
            </p>
          </Reveal>

          <Card className="border-cyan-300/20 bg-cyan-500/[0.05]">
            <CardContent className="p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Mission Signals</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-200">
                <li className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-cyan-200" />
                  Conversion-focused layouts with clear hierarchy
                </li>
                <li className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-cyan-200" />
                  Trust-first visual system for serious buyers
                </li>
                <li className="flex gap-2">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-cyan-200" />
                  Fast, responsive experience for mobile traffic
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="base" glow="soft" withTopDivider withBottomDivider id="why">
        <Reveal>
          <SectionHeading
            eyebrow="Why J-Digital"
            title="A focused partner for trust, conversion, and execution"
            description="Built for businesses that need clean systems and reliable outcomes."
          />
        </Reveal>
        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pillars.map((pillar) => (
            <StaggerItem key={pillar.title}>
              <TiltCard className="h-full">
                <Card className="h-full">
                  <CardContent className="space-y-3 p-6">
                    <pillar.icon className="h-6 w-6 text-blue-300" />
                    <h3 className="text-lg font-semibold text-white">{pillar.title}</h3>
                    <p className="text-sm text-slate-300">{pillar.description}</p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          ))}
        </Stagger>
      </SectionWrapper>

      <GlowBandSeparator />

      <SectionWrapper variant="raised" glow="soft" id="beliefs">
        <Reveal>
          <SectionHeading
            eyebrow="What We Believe"
            title="Principles behind every project"
          />
        </Reveal>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {principles.map((item) => (
            <Card key={item.title}>
              <CardContent className="space-y-3 p-6">
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="text-sm text-slate-300">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="accent" glow="soft" withTopDivider id="positioning">
        <Card className="border-cyan-300/30 bg-slate-900/55">
          <CardContent className="p-8 text-center sm:p-10">
            <p className={typography.eyebrow}>Positioning</p>
            <h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold text-white sm:text-4xl">
              Built for businesses that want structured growth, not random digital activity
            </h2>
          </CardContent>
        </Card>
      </SectionWrapper>

      {settings.testimonialsEnabled && testimonials.length > 0 ? (
        <SectionWrapper variant="base" glow="soft" withTopDivider id="testimonials">
          <Reveal>
            <SectionHeading eyebrow="Client Feedback" title="What businesses say after launch" />
          </Reveal>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {testimonials.map((item) => (
              <Card key={item.id}>
                <CardContent className="space-y-3 p-6">
                  <p className="text-sm text-slate-200">&ldquo;{item.quote}&rdquo;</p>
                  <div>
                    <p className="font-semibold text-white">{item.name}</p>
                    <p className="text-xs text-slate-300">
                      {item.role}, {item.company}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </SectionWrapper>
      ) : null}

      <SectionWrapper variant="accent" glow="hero" withTopDivider withBottomDivider>
        <Card className="border-cyan-300/30 bg-slate-900/60">
          <CardContent className="p-8 text-center sm:p-12">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to build with clear direction?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-200">
              Book a free consultation and get a structured plan tailored to your business goals.
            </p>
            <Button asChild size="lg" className="mt-5">
              <Link href="/contact?package=startup">Book Free Consultation</Link>
            </Button>
          </CardContent>
        </Card>
      </SectionWrapper>
    </MarketingShell>
  );
}
