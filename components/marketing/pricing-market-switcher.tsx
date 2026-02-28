"use client";

import { useMemo, useState } from "react";

import { PricingFitQuiz } from "@/components/marketing/pricing-fit-quiz";
import { PricingPackageStack, type PricingPackageCard } from "@/components/marketing/pricing-package-stack";
import { cn } from "@/lib/utils";

type MarketKey = "ph" | "international";

type MarketConfig = {
  key: MarketKey;
  label: string;
  eyebrow: string;
  description: string;
  packages: PricingPackageCard[];
};

export function PricingMarketSwitcher({
  markets,
  defaultMarket = "ph"
}: {
  markets: MarketConfig[];
  defaultMarket?: MarketKey;
}) {
  const [activeMarket, setActiveMarket] = useState<MarketKey>(defaultMarket);

  const currentMarket =
    markets.find((market) => market.key === activeMarket) ||
    markets[0];

  const quizPackages = useMemo(
    () => currentMarket.packages.map((item) => ({ slug: item.slug, name: item.name })),
    [currentMarket]
  );

  return (
    <div className="space-y-10">
      <div className="flex justify-center">
        <div className="inline-flex rounded-full border border-white/15 bg-slate-950/35 p-1.5 shadow-[0_18px_40px_-28px_rgba(2,132,199,0.75)] backdrop-blur">
          {markets.map((market) => {
            const isActive = currentMarket.key === market.key;
            return (
              <button
                key={market.key}
                type="button"
                onClick={() => setActiveMarket(market.key)}
                className={cn(
                  "min-h-11 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-cyan-400/15 text-white shadow-[inset_0_0_0_1px_rgba(103,232,249,0.35)]"
                    : "text-slate-300 hover:text-white"
                )}
              >
                {market.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">{currentMarket.eyebrow}</p>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{currentMarket.description}</p>
      </div>

      <PricingPackageStack packages={currentMarket.packages} />

      <div className="pt-2 text-center">
        <p className="text-base font-semibold text-white">Not sure which package fits your needs?</p>
      </div>

      <div className="mx-auto max-w-4xl">
        <PricingFitQuiz packages={quizPackages} />
      </div>
    </div>
  );
}
