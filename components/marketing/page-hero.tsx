import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { typography } from "@/lib/typography";

type HeroSignal = {
  label: string;
  value: string;
};

type HeroFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaHref,
  signals,
  features
}: {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  signals?: HeroSignal[];
  features?: HeroFeature[];
}) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] lg:items-end">
      <Reveal className="max-w-3xl">
        <p className={typography.eyebrow}>{eyebrow}</p>
        <h1 className={`mt-3 ${typography.heroTitle}`}>{title}</h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-200 sm:text-base">{description}</p>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {(signals ?? []).map((signal) => (
            <span key={signal.label} className="premium-chip">
              <span className="text-slate-300">{signal.label}</span>
              <span className="font-semibold text-white">{signal.value}</span>
            </span>
          ))}
        </div>

        {ctaLabel && ctaHref ? (
          <div className="mt-8">
            <Button asChild size="lg" className="shadow-[0_16px_44px_-20px_rgba(56,189,248,0.6)]">
              <Link href={ctaHref}>
                {ctaLabel} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : null}
      </Reveal>

      <Reveal className="lg:justify-self-end">
        <div className="premium-shell glow-outline relative overflow-hidden p-5 sm:p-6">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <p className="relative text-xs uppercase tracking-[0.22em] text-cyan-200">What Clients Feel</p>
          <Stagger className="relative mt-5 grid gap-3">
            {(features ?? []).map((feature) => (
              <StaggerItem key={feature.title}>
                <Card className="border-white/10 bg-white/[0.04]">
                  <CardContent className="flex gap-4 p-4">
                    <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-500/10 text-cyan-100">
                      <feature.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{feature.title}</p>
                      <p className="mt-1 text-sm text-slate-300">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </Reveal>
    </div>
  );
}
