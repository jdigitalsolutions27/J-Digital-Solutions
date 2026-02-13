"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer } from "@/lib/motion";
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
  tags: string[];
  status: "DEMO" | "CLIENT";
};

const filters = ["All", "Construction", "Healthcare", "E-Commerce", "Consulting", "Real Estate"] as const;
const ITEMS_PER_BATCH = 6;
const ALL_FILTER_ORDER = ["Construction", "Healthcare", "E-Commerce", "Consulting", "Real Estate"] as const;

function normalizeIndustry(industry: string) {
  if (industry.toLowerCase() === "ecommerce" || industry.toLowerCase() === "e-commerce") {
    return "E-Commerce";
  }
  return industry;
}

function buildMixedProjects(projects: PortfolioItem[]) {
  const grouped = new Map<string, PortfolioItem[]>();
  projects.forEach((project) => {
    const key = normalizeIndustry(project.industry);
    const bucket = grouped.get(key) ?? [];
    bucket.push(project);
    grouped.set(key, bucket);
  });

  const mixed: PortfolioItem[] = [];
  let hasRemaining = true;

  while (hasRemaining) {
    hasRemaining = false;
    for (const industry of ALL_FILTER_ORDER) {
      const bucket = grouped.get(industry);
      if (!bucket || bucket.length === 0) continue;
      mixed.push(bucket.shift() as PortfolioItem);
      hasRemaining = true;
    }
  }

  const usedIds = new Set(mixed.map((item) => item.id));
  const uncategorized = projects.filter((item) => !usedIds.has(item.id));
  return mixed.concat(uncategorized);
}

export function PortfolioMasonry({ projects }: { projects: PortfolioItem[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_BATCH);
  const reduceMotion = useShouldReduceMotion();

  const filtered = useMemo(() => {
    if (activeFilter === "All") return buildMixedProjects(projects);
    return projects.filter((project) => normalizeIndustry(project.industry) === activeFilter);
  }, [activeFilter, projects]);

  useEffect(() => {
    setVisibleCount(ITEMS_PER_BATCH);
  }, [activeFilter]);

  const visibleProjects = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setActiveFilter(filter)}
            aria-pressed={activeFilter === filter}
            className={cn(
              "relative rounded-full border px-4 py-2 text-sm transition-all duration-200",
              activeFilter === filter
                ? "border-cyan-300/55 bg-cyan-400/10 text-white"
                : "border-white/20 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
            )}
          >
            {activeFilter === filter ? (
              <motion.span
                layoutId="portfolio-masonry-tab"
                className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-cyan-300"
              />
            ) : null}
            <span className="relative z-10">{filter}</span>
          </button>
        ))}
      </div>

      <motion.div
        key={activeFilter}
        initial={reduceMotion ? false : "hidden"}
        animate="visible"
        variants={staggerContainer}
        className="grid gap-5 md:grid-cols-2 xl:grid-cols-3"
      >
        {visibleProjects.map((project) => (
          <motion.article
            key={project.id}
            variants={fadeUp}
            className="group premium-panel h-full overflow-hidden"
          >
            <div className="relative h-56 overflow-hidden bg-[linear-gradient(145deg,rgba(56,189,248,0.1),rgba(255,255,255,0.03),rgba(96,165,250,0.1))]">
              <motion.div
                className="relative h-full w-full"
                whileHover={reduceMotion ? undefined : { scale: 1.05, y: -4 }}
                transition={{ duration: 0.45 }}
              >
                <Image src={project.coverImage} alt={project.title} fill className="object-contain object-top p-2" />
              </motion.div>
              <Link
                href={`/portfolio/${project.slug}`}
                className="absolute inset-0 z-20"
                aria-label={`View ${project.title} case study`}
                onClick={() => trackConversionEvent("view_portfolio", { placement: "portfolio_masonry_image", project: project.title })}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute inset-x-4 bottom-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <span className="inline-flex items-center gap-1 rounded-md border border-white/35 bg-white/15 px-3 py-2 text-sm text-white backdrop-blur">
                  View Case <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                <Badge variant={project.status === "CLIENT" ? "success" : "secondary"}>{project.status}</Badge>
              </div>
              <p className="text-sm text-cyan-200">{normalizeIndustry(project.industry)}</p>
              <p className="text-sm text-slate-300">{project.shortSummary}</p>
              <div className="flex flex-wrap gap-2">
                {project.tags.slice(0, 4).map((tag) => (
                  <span key={tag} className="rounded-full border border-white/20 px-2.5 py-1 text-xs text-slate-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.article>
        ))}
      </motion.div>

      {filtered.length === 0 ? (
        <div className="premium-panel mt-6 p-6 text-center">
          <p className="text-sm text-slate-200">No projects found for this filter yet.</p>
        </div>
      ) : null}

      {filtered.length > ITEMS_PER_BATCH ? (
        <div className="mt-8 flex justify-center">
          {hasMore ? (
            <Button type="button" variant="outline" onClick={() => setVisibleCount((count) => count + ITEMS_PER_BATCH)}>
              See More Projects ({Math.min(visibleCount, filtered.length)}/{filtered.length})
            </Button>
          ) : (
            <Button type="button" variant="ghost" onClick={() => setVisibleCount(ITEMS_PER_BATCH)}>
              Show Less
            </Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
