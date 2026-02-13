import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { GlowBandSeparator } from "@/components/layout/dividers/GlowBandSeparator";
import { SectionWrapper } from "@/components/layout/SectionWrapper";
import { MarketingShell } from "@/components/marketing/shell";
import { ProcessScrollSpy } from "@/components/marketing/process-scrollspy";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";
import { buildMetadata } from "@/lib/metadata";
import { typography } from "@/lib/typography";

export async function generateMetadata() {
  return buildMetadata({
    title: "Process | J-Digital Growth Framework",
    description: "Discover the 5-step J-Digital Growth Framework for launching high-converting business websites.",
    path: "/process"
  });
}

const prepChecklist = [
  "Business goals and target audience",
  "Available brand assets (logo/colors)",
  "Core offers and service priorities",
  "Preferred launch timeline",
  "Contact channels and decision-maker details"
];

const fallbackSteps = [
  {
    id: "discovery",
    title: "Discovery & Strategy",
    description: "We align goals, audience, and project scope before building.",
    timeline: "Day 1",
    deliverables: ["Strategy brief", "Offer clarity", "Scope mapping"]
  },
  {
    id: "wireframe",
    title: "Structure & Wireframe",
    description: "We map sections and content hierarchy for clarity and conversion.",
    timeline: "Day 1-2",
    deliverables: ["Page structure", "Wireframe direction", "Content priorities"]
  },
  {
    id: "build",
    title: "Design & Development",
    description: "We build the premium website experience and core functionality.",
    timeline: "Day 2-7",
    deliverables: ["UI build", "Responsive layouts", "Lead form setup"]
  },
  {
    id: "optimize",
    title: "Optimization & Testing",
    description: "We validate performance, responsiveness, and final quality.",
    timeline: "Day 6-9",
    deliverables: ["Speed checks", "Cross-device QA", "Final polish"]
  },
  {
    id: "launch",
    title: "Launch & Support",
    description: "We deploy and monitor for a stable go-live experience.",
    timeline: "Day 7-10",
    deliverables: ["Go-live setup", "Core tracking", "Post-launch support"]
  }
];

export default async function ProcessPage() {
  const stepsFromDb = await db.processStep.findMany({ orderBy: { position: "asc" } }).catch(() => []);
  const steps = stepsFromDb.length > 0 ? stepsFromDb : fallbackSteps;

  return (
    <MarketingShell>
      <SectionWrapper variant="accent" glow="hero" withBottomDivider>
        <p className={typography.eyebrow}>{`J-Digital Growth Framework${"\u2122"}`}</p>
        <h1 className={`mt-3 ${typography.heroTitle}`}>A structured process with clear milestones</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-200 sm:text-base">
          Every phase has defined outputs, timeline visibility, and conversion intent.
        </p>
      </SectionWrapper>

      <SectionWrapper variant="raised" glow="soft" withTopDivider>
        <SectionHeading
          eyebrow="Timeline"
          title="Sticky navigation + scroll progress for full project clarity"
        />
        <div className="mt-10">
          <ProcessScrollSpy
            steps={steps.map((step) => ({
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

      <SectionWrapper variant="base" glow="soft" withTopDivider withBottomDivider>
        <div className="grid gap-6 lg:grid-cols-[1.2fr,1fr]">
          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-white">What to prepare before we start</h2>
              <ul className="mt-4 space-y-2">
                {prepChecklist.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-cyan-300/30 bg-cyan-500/[0.06]">
            <CardContent className="p-6 sm:p-8">
              <h3 className="text-xl font-semibold text-white">Need a suggested timeline for your business?</h3>
              <p className="mt-3 text-sm text-slate-200">
                We can map your project into phases and identify the fastest realistic launch path.
              </p>
              <Button asChild className="mt-5">
                <Link href="/contact?package=startup">Book Free Consultation</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </SectionWrapper>
    </MarketingShell>
  );
}
