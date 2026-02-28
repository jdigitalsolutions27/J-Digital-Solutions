"use client";

import { useMemo, useState } from "react";
import { BadgeCheck } from "lucide-react";

import { TrackedButtonLink } from "@/components/marketing/tracked-button-link";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { TiltCard } from "@/components/motion/TiltCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, peso } from "@/lib/utils";

type PreviewPackage = {
  name: string;
  slug: string;
  delivery: string;
  includes: string[];
  price: number;
  priceLabel?: string;
};

type ComparisonPackage = {
  includes: string[];
};

type MarketKey = "ph" | "international";

type PricingMarket = {
  key: MarketKey;
  label: string;
  packageNameForContact: string;
  popular: PreviewPackage;
  comparison: {
    starter?: ComparisonPackage;
    growth?: ComparisonPackage;
    professional?: ComparisonPackage;
    labels: {
      starter: string;
      growth: string;
      professional: string;
    };
  };
};

function hasFeature(pkg: ComparisonPackage | undefined, keywords: string[]) {
  return pkg?.includes.some((item) => keywords.some((keyword) => item.toLowerCase().includes(keyword))) ?? false;
}

export function HomePricingPreviewSwitcher({ markets }: { markets: PricingMarket[] }) {
  const [activeMarket, setActiveMarket] = useState<MarketKey>("ph");

  const currentMarket = useMemo(
    () => markets.find((market) => market.key === activeMarket) || markets[0],
    [activeMarket, markets]
  );

  const currentPopular = currentMarket.popular;

  return (
    <div className="mx-auto mt-10 max-w-5xl">
      <div className="mb-8 flex justify-center">
        <div className="inline-flex rounded-full border border-white/15 bg-slate-950/35 p-1.5 backdrop-blur">
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

      <TiltCard>
        <Card className="border-cyan-300/35 bg-slate-900/55">
          <CardHeader>
            <Badge className="relative w-fit overflow-hidden pr-4">
              <span className="relative z-10">Most Popular</span>
              <span className="pricing-badge-pulse absolute inset-0 rounded-full" />
            </Badge>
            <CardTitle className="mt-2 text-3xl">{currentPopular.name}</CardTitle>
            <p className="text-2xl font-bold text-blue-200">{currentPopular.priceLabel || peso(currentPopular.price)}</p>
            <p className="text-sm text-slate-300">Delivery: {currentPopular.delivery}</p>
          </CardHeader>
          <CardContent>
            <Stagger className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2" staggerChildren={0.05}>
              {currentPopular.includes.slice(0, 8).map((item) => (
                <StaggerItem key={`${currentPopular.slug}-${item}`}>
                  <div className="flex gap-2">
                    <BadgeCheck className="mt-0.5 h-4 w-4 text-blue-300" /> {item}
                  </div>
                </StaggerItem>
              ))}
            </Stagger>

            <div className="mt-6 flex flex-wrap gap-3">
              <TrackedButtonLink
                href={`/contact?package=${encodeURIComponent(currentMarket.packageNameForContact)}`}
                eventName="book_free_consultation"
                payload={{ placement: "pricing_primary", market: currentMarket.key }}
              >
                Request Free Consultation
              </TrackedButtonLink>
              <TrackedButtonLink
                href="/pricing"
                eventName="compare_packages"
                payload={{ placement: "pricing_secondary", market: currentMarket.key }}
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
              Quick Comparison: {currentMarket.comparison.labels.starter} vs {currentMarket.comparison.labels.growth} vs{" "}
              {currentMarket.comparison.labels.professional}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-200">
                    <th className="px-3 py-2 text-left">Feature</th>
                    <th className="px-3 py-2 text-left">{currentMarket.comparison.labels.starter}</th>
                    <th className="px-3 py-2 text-left">{currentMarket.comparison.labels.growth}</th>
                    <th className="px-3 py-2 text-left">{currentMarket.comparison.labels.professional}</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300">
                  <tr className="border-b border-white/10">
                    <td className="px-3 py-2 text-white">Pages</td>
                    <td className="px-3 py-2">
                      {currentMarket.comparison.starter?.includes.find((item) => item.toLowerCase().includes("page")) ?? "Included"}
                    </td>
                    <td className="px-3 py-2">
                      {currentMarket.comparison.growth?.includes.find((item) => item.toLowerCase().includes("page")) ?? "Included"}
                    </td>
                    <td className="px-3 py-2">
                      {currentMarket.comparison.professional?.includes.find((item) => item.toLowerCase().includes("page")) ?? "Included"}
                    </td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="px-3 py-2 text-white">Custom Branding</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.starter, ["branding", "custom"]) ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.growth, ["branding", "custom"]) ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.professional, ["branding", "custom"]) ? "Yes" : "No"}</td>
                  </tr>
                  <tr className="border-b border-white/10">
                    <td className="px-3 py-2 text-white">Lead Capture</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.starter, ["contact form", "lead", "inquiry"]) ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.growth, ["lead", "form", "inquiry"]) ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.professional, ["lead", "form", "inquiry", "booking"]) ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 text-white">Booking / Admin</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.starter, ["booking", "admin dashboard"]) ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.growth, ["booking", "admin dashboard"]) ? "Yes" : "No"}</td>
                    <td className="px-3 py-2">{hasFeature(currentMarket.comparison.professional, ["booking", "admin dashboard"]) ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
