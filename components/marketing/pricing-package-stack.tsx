"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock3, Sparkles } from "lucide-react";

import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { TrackedButtonLink } from "@/components/marketing/tracked-button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn, peso } from "@/lib/utils";

export type PricingPackageCard = {
  name: string;
  slug: string;
  price: number;
  delivery: string;
  includes: string[];
  complimentary: string[];
  note?: string;
  isPopular?: boolean;
};

export function PricingPackageStack({ packages }: { packages: PricingPackageCard[] }) {
  const reduceMotion = useShouldReduceMotion();

  return (
    <div className="space-y-8">
      <motion.div
        className="relative h-px overflow-hidden rounded-full bg-white/10"
        initial={{ opacity: 0, scaleX: 0.7 }}
        whileInView={{ opacity: 1, scaleX: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300/75 to-transparent"
          animate={reduceMotion ? { opacity: 0.7 } : { opacity: [0.5, 1, 0.5], x: ["-8%", "8%", "-8%"] }}
          transition={reduceMotion ? undefined : { duration: 4.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        />
      </motion.div>

      <Stagger className="space-y-6 sm:space-y-7">
        {packages.map((pkg) => (
          <StaggerItem key={pkg.slug}>
            <TiltCard maxTilt={4} className={cn(pkg.isPopular ? "lg:scale-[1.02]" : "")}>
              <Card
                className={cn(
                  "group relative overflow-hidden border-white/15 bg-white/[0.045] transition-all duration-300 hover:border-blue-300/45 hover:shadow-[0_24px_65px_-34px_rgba(2,132,199,0.6)]",
                  pkg.isPopular
                    ? "border-cyan-300/55 bg-cyan-400/[0.07] shadow-[0_26px_85px_-42px_rgba(6,182,212,0.75)]"
                    : ""
                )}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.16),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <CardHeader className="relative pb-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <CardTitle className="text-xl font-bold tracking-tight text-white sm:text-2xl">{pkg.name}</CardTitle>
                      <p className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3 py-1 text-xs text-slate-200">
                        <Clock3 className="h-3.5 w-3.5 text-cyan-200" />
                        Delivery: {pkg.delivery}
                      </p>
                    </div>
                    {pkg.isPopular ? (
                      <span className="relative inline-flex items-center rounded-full border border-cyan-300/65 bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-100">
                        <span className="pricing-badge-pulse absolute inset-0 rounded-full" aria-hidden="true" />
                        <span className="relative">Most Popular</span>
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-5 text-4xl font-extrabold tracking-tight text-blue-100 sm:text-5xl">{peso(pkg.price)}</p>
                </CardHeader>

                <CardContent className="relative space-y-6">
                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-300">What&apos;s Included</p>
                    <ul className="grid gap-2.5 sm:grid-cols-2">
                      {pkg.includes.map((item) => (
                        <li key={`${pkg.slug}-${item}`} className="flex items-start gap-2 text-sm text-slate-200">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-200" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {pkg.note ? (
                    <div className="rounded-xl border border-amber-200/20 bg-amber-300/[0.08] px-4 py-3 text-sm text-amber-100">
                      <span className="font-semibold">Note:</span> {pkg.note}
                    </div>
                  ) : null}

                  <div>
                    <p className="mb-3 text-xs uppercase tracking-[0.22em] text-slate-300">Complimentary</p>
                    <ul className="grid gap-2 sm:grid-cols-2">
                      {pkg.complimentary.map((item) => (
                        <li key={`${pkg.slug}-free-${item}`} className="flex items-start gap-2 text-sm text-slate-100">
                          <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-cyan-200" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <TrackedButtonLink
                    href={`/contact?package=${pkg.slug}`}
                    eventName="book_free_consultation"
                    payload={{ placement: "pricing_card", package: pkg.slug }}
                    className="w-full sm:w-auto"
                  >
                    Request Free Consultation
                  </TrackedButtonLink>
                </CardContent>
              </Card>
            </TiltCard>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

