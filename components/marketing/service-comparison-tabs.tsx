"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

const options = [
  {
    key: "website",
    label: "Website",
    bestFor: "Businesses needing full credibility, multi-page positioning, and long-term growth.",
    includes: [
      "Structured pages and trust hierarchy",
      "Conversion-focused content flow",
      "Admin-managed updates"
    ]
  },
  {
    key: "landing",
    label: "Landing Page",
    bestFor: "Campaigns and ad traffic where speed and focused conversion are top priority.",
    includes: [
      "Single conversion objective",
      "Fast turnaround and A/B-ready blocks",
      "Ad-message alignment"
    ]
  },
  {
    key: "ecommerce",
    label: "E-Commerce",
    bestFor: "Brands selling products/services online with checkout and catalog requirements.",
    includes: [
      "Product and category structure",
      "Conversion-ready cart flow",
      "Growth-ready admin and operations layer"
    ]
  }
] as const;

export function ServiceComparisonTabs() {
  const [active, setActive] = useState<(typeof options)[number]["key"]>("website");
  const selected = options.find((item) => item.key === active) ?? options[0];

  return (
    <div className="premium-panel p-6 sm:p-8">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setActive(option.key)}
            className={cn(
              "relative rounded-full border px-4 py-2 text-sm transition-all duration-200",
              active === option.key
                ? "border-cyan-300/55 bg-cyan-400/10 text-white"
                : "border-white/20 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
            )}
          >
            {active === option.key ? (
              <motion.span
                layoutId="service-comparison-active"
                className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-cyan-300"
              />
            ) : null}
            <span className="relative z-10">{option.label}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Best For</p>
        <p className="mt-2 text-sm text-slate-200">{selected.bestFor}</p>
        <ul className="mt-4 grid gap-2 text-sm text-slate-300 sm:grid-cols-2">
          {selected.includes.map((item) => (
            <li key={item} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
