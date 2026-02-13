"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { TiltCard } from "@/components/motion/TiltCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fadeUp, staggerContainer, viewportDefaults } from "@/lib/motion";
import { trackConversionEvent } from "@/lib/tracking";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

type PortfolioItem = {
  id: string;
  title: string;
  slug: string;
  industry: string;
  shortSummary: string;
  coverImage: string;
  status: "DEMO" | "CLIENT";
  tags: string[];
};

const filters = ["All", "Construction", "Healthcare", "E-Commerce", "Consulting", "Real Estate"] as const;

function normalizeIndustry(industry: string) {
  if (industry.toLowerCase() === "e-commerce" || industry.toLowerCase() === "ecommerce") {
    return "E-Commerce";
  }
  return industry;
}

function outcomeLine(project: PortfolioItem) {
  const map: Record<string, string> = {
    Construction: "Outcome: Increased contractor inquiry quality with stronger trust positioning.",
    Healthcare: "Outcome: Improved patient inquiry flow and mobile conversion clarity.",
    "E-Commerce": "Outcome: Better product confidence and cleaner checkout intent.",
    Consulting: "Outcome: Stronger authority signals and higher-value consult bookings.",
    "Real Estate": "Outcome: More qualified property inquiries from premium-ready pages."
  };

  return map[normalizeIndustry(project.industry)] || "Outcome: Improved trust, clarity, and inquiry conversion.";
}

export function PortfolioFilterGrid({ projects }: { projects: PortfolioItem[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const reduceMotion = useShouldReduceMotion();

  const filtered = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((project) => normalizeIndustry(project.industry) === activeFilter);
  }, [activeFilter, projects]);

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefaults}
        variants={staggerContainer}
        className="mb-8 flex flex-wrap justify-center gap-2"
      >
        {filters.map((filter) => (
          <motion.button
            key={filter}
            type="button"
            variants={fadeUp}
            onClick={() => setActiveFilter(filter)}
            className={cn(
              "relative overflow-hidden rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200",
              activeFilter === filter
                ? "border-blue-300/45 bg-blue-500/15 text-white"
                : "border-white/20 bg-white/5 text-slate-300 hover:bg-white/10"
            )}
          >
            {activeFilter === filter ? (
              <motion.span
                layoutId="portfolio-filter-active"
                className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-blue-300"
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              />
            ) : null}
            <span className="relative z-10">{filter}</span>
          </motion.button>
        ))}
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefaults}
        variants={staggerContainer}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((project) => (
          <motion.div key={project.id} variants={fadeUp}>
            <TiltCard className="h-full">
              <Card className="group h-full overflow-hidden">
                <div className="relative h-52 w-full overflow-hidden bg-[linear-gradient(145deg,rgba(56,189,248,0.1),rgba(255,255,255,0.03),rgba(96,165,250,0.1))]">
                  <motion.div
                    className="relative h-full w-full will-change-transform"
                    whileHover={reduceMotion ? undefined : { scale: 1.08, y: -6 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  >
                    <Image src={project.coverImage} alt={project.title} fill className="object-contain object-top p-2" />
                  </motion.div>

                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="absolute inset-0 z-20"
                    aria-label={`View ${project.title} case study`}
                    onClick={() =>
                      trackConversionEvent("view_portfolio", {
                        placement: "portfolio_card_image",
                        project: project.title
                      })
                    }
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100">
                    {project.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={tag}
                        className="translate-y-2 rounded-full border border-blue-200/45 bg-slate-950/65 px-2.5 py-1 text-[11px] text-blue-100 opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                        style={reduceMotion ? undefined : { transitionDelay: `${index * 45}ms` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="absolute inset-0 flex items-end justify-between p-4">
                    <span className="translate-y-3 rounded-md border border-white/30 bg-white/15 px-3 py-2 text-sm font-semibold text-white opacity-0 backdrop-blur transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      View Case
                    </span>
                  </div>
                </div>

                <CardHeader className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <Badge variant={project.status === "CLIENT" ? "success" : "secondary"}>{project.status}</Badge>
                  </div>
                  <p className="text-sm text-blue-200">{normalizeIndustry(project.industry)}</p>
                </CardHeader>

                <CardContent className="flex h-[180px] flex-col justify-between gap-4">
                  <p className="text-sm text-slate-200">{project.shortSummary}</p>
                  <p className="text-xs text-slate-300">{outcomeLine(project)}</p>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
