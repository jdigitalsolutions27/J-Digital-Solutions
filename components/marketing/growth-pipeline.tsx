"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { fadeUp, viewportDefaults } from "@/lib/motion";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

const nodes = [
  {
    id: "attention",
    title: "Attention",
    description: "Your website positions your offer quickly so visitors stay and understand your value.",
    details: [
      "Premium first-impression design",
      "Clear value proposition",
      "Mobile-ready page hierarchy"
    ]
  },
  {
    id: "inquiry",
    title: "Inquiry",
    description: "Visitors are guided into structured forms and direct contact pathways.",
    details: [
      "Conversion-focused CTA blocks",
      "Lead capture and qualification fields",
      "Messenger and contact method routing"
    ]
  },
  {
    id: "growth",
    title: "Growth",
    description: "Your business gets more qualified inquiries and a stronger digital trust signal.",
    details: [
      "Admin dashboard for updates",
      "SEO-ready architecture",
      "Scalable expansion for new campaigns"
    ]
  }
] as const;

export function GrowthPipeline() {
  const reduceMotion = useShouldReduceMotion();
  const [activeId, setActiveId] = useState<(typeof nodes)[number]["id"]>("attention");

  const activeNode = useMemo(() => nodes.find((node) => node.id === activeId) ?? nodes[0], [activeId]);
  const activeIndex = nodes.findIndex((node) => node.id === activeId);

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr,1fr]">
      <div className="premium-panel p-6 sm:p-8">
        <div className="relative">
          <div className="absolute left-0 right-0 top-6 h-px bg-white/10" />
          <motion.div
            className="absolute left-0 top-6 h-px origin-left bg-gradient-to-r from-cyan-300/85 via-blue-300/55 to-transparent"
            initial={reduceMotion ? false : { scaleX: 0 }}
            whileInView={reduceMotion ? undefined : { scaleX: 1 }}
            viewport={viewportDefaults}
            transition={{ duration: 0.9, ease: "easeOut" }}
            style={{ width: `${((activeIndex + 1) / nodes.length) * 100}%` }}
          />

          <div className="grid gap-4 pt-1 sm:grid-cols-3">
            {nodes.map((node, index) => {
              const isActive = node.id === activeId;

              return (
                <button
                  key={node.id}
                  type="button"
                  onMouseEnter={() => setActiveId(node.id)}
                  onFocus={() => setActiveId(node.id)}
                  onClick={() => setActiveId(node.id)}
                  className={cn(
                    "relative rounded-2xl border px-4 pb-4 pt-6 text-left transition-all duration-300",
                    isActive
                      ? "border-cyan-300/55 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(56,189,248,0.3)]"
                      : "border-white/10 bg-white/[0.02] hover:border-white/20"
                  )}
                >
                  <span
                    className={cn(
                      "absolute left-4 top-[-10px] flex h-6 min-w-6 items-center justify-center rounded-full border px-2 text-[11px] font-semibold",
                      isActive
                        ? "border-cyan-300/60 bg-slate-900 text-cyan-100"
                        : "border-white/25 bg-slate-900 text-slate-300"
                    )}
                  >
                    {index + 1}
                  </span>
                  <p className="font-semibold text-white">{node.title}</p>
                  <p className="mt-2 text-xs text-slate-300">{node.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefaults}
        className="premium-panel p-6 sm:p-8"
      >
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">What You Get</p>
        <h3 className="mt-3 text-2xl font-bold text-white">{activeNode.title} Layer</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-300">{activeNode.description}</p>
        <ul className="mt-5 space-y-2 text-sm text-slate-100">
          {activeNode.details.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <ArrowRight className="mt-0.5 h-4 w-4 text-cyan-200" /> {item}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
