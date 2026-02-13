"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";

import { TiltCard } from "@/components/motion/TiltCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeUp, staggerContainer, viewportDefaults } from "@/lib/motion";
import { trackConversionEvent } from "@/lib/tracking";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

type HomeProject = {
  id: string;
  title: string;
  slug: string;
  industry: string;
  shortSummary: string;
  coverImage: string;
  servicesProvided: string[];
  status: "DEMO" | "CLIENT";
};

const filters = ["All", "Construction", "Healthcare", "E-Commerce", "Consulting", "Real Estate"] as const;
const HOME_PREVIEW_COUNT = 7;
const ALL_FILTER_ORDER = ["Construction", "Healthcare", "E-Commerce", "Consulting", "Real Estate"] as const;

function normalizeIndustry(industry: string) {
  if (industry.toLowerCase() === "ecommerce" || industry.toLowerCase() === "e-commerce") {
    return "E-Commerce";
  }
  return industry;
}

function projectOutcome(industry: string) {
  const map: Record<string, string> = {
    Construction: "Outcome: clearer service positioning and stronger contractor trust.",
    Healthcare: "Outcome: smoother patient inquiry experience and better credibility.",
    "E-Commerce": "Outcome: improved product confidence and stronger purchase intent.",
    Consulting: "Outcome: elevated authority and higher-quality consultation requests.",
    "Real Estate": "Outcome: cleaner property funnels and more qualified inquiries."
  };
  return map[normalizeIndustry(industry)] ?? "Outcome: stronger trust and better inquiry conversion.";
}

function buildMixedPreview(projects: HomeProject[], limit = HOME_PREVIEW_COUNT) {
  if (projects.length <= limit) return projects;

  const grouped = new Map<string, HomeProject[]>();
  projects.forEach((project) => {
    const key = normalizeIndustry(project.industry);
    const bucket = grouped.get(key) ?? [];
    bucket.push(project);
    grouped.set(key, bucket);
  });

  const order = [...ALL_FILTER_ORDER];
  const mixed: HomeProject[] = [];
  let progressed = true;

  while (mixed.length < limit && progressed) {
    progressed = false;
    for (const industry of order) {
      const bucket = grouped.get(industry);
      if (!bucket || bucket.length === 0) continue;
      mixed.push(bucket.shift() as HomeProject);
      progressed = true;
      if (mixed.length >= limit) break;
    }
  }

  if (mixed.length < limit) {
    const usedIds = new Set(mixed.map((item) => item.id));
    const remaining = projects
      .filter((item) => !usedIds.has(item.id))
      .sort((a, b) => {
        const aIndex = order.indexOf(normalizeIndustry(a.industry) as (typeof ALL_FILTER_ORDER)[number]);
        const bIndex = order.indexOf(normalizeIndustry(b.industry) as (typeof ALL_FILTER_ORDER)[number]);
        const safeA = aIndex === -1 ? Number.MAX_SAFE_INTEGER : aIndex;
        const safeB = bIndex === -1 ? Number.MAX_SAFE_INTEGER : bIndex;
        return safeA - safeB;
      });
    mixed.push(...remaining.slice(0, limit - mixed.length));
  }

  return mixed;
}

export function HomePortfolioShowcase({ projects }: { projects: HomeProject[] }) {
  const [activeFilter, setActiveFilter] = useState<(typeof filters)[number]>("All");
  const reduceMotion = useShouldReduceMotion();

  const filtered = useMemo(() => {
    if (activeFilter === "All") return buildMixedPreview(projects, HOME_PREVIEW_COUNT);
    return projects
      .filter((item) => normalizeIndustry(item.industry) === activeFilter)
      .slice(0, HOME_PREVIEW_COUNT);
  }, [activeFilter, projects]);

  const featured = filtered[0];
  const secondary = filtered.slice(1, HOME_PREVIEW_COUNT);

  return (
    <div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportDefaults}
        variants={staggerContainer}
        className="mb-8 flex flex-wrap gap-2"
      >
        {filters.map((filter) => (
          <motion.button
            key={filter}
            type="button"
            variants={fadeUp}
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
                layoutId="portfolio-tab-underline"
                className="absolute inset-x-3 bottom-1 h-[2px] rounded-full bg-cyan-300"
                transition={{ type: "spring", stiffness: 260, damping: 24 }}
              />
            ) : null}
            <span className="relative z-10">{filter}</span>
          </motion.button>
        ))}
      </motion.div>

      <p className="mb-6 text-sm text-slate-300">
        Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"} in {activeFilter}.
      </p>

      {featured ? (
        <div className="grid gap-6 lg:grid-cols-[1.4fr,1fr]">
          <TiltCard>
            <motion.article
              initial="hidden"
              whileInView="visible"
              viewport={viewportDefaults}
              variants={fadeUp}
              className="group premium-panel overflow-hidden"
            >
              <div className="relative h-72 overflow-hidden bg-[linear-gradient(145deg,rgba(56,189,248,0.12),rgba(255,255,255,0.04),rgba(96,165,250,0.12))] sm:h-[380px]">
                <motion.div
                  className="relative h-full w-full"
                  whileHover={reduceMotion ? undefined : { scale: 1.04, x: 8 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Image src={featured.coverImage} alt={featured.title} fill className="object-contain object-top p-2" />
                </motion.div>
                <Link
                  href={`/portfolio/${featured.slug}`}
                  className="absolute inset-0 z-20"
                  aria-label={`View ${featured.title} case study`}
                  onClick={() => trackConversionEvent("view_portfolio", { placement: "featured_image", project: featured.title })}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent" />
              </div>

              <div className="space-y-4 p-6">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={featured.status === "CLIENT" ? "success" : "secondary"}>{featured.status}</Badge>
                  <Badge variant="outline">{normalizeIndustry(featured.industry)}</Badge>
                </div>
                <h3 className="text-2xl font-bold text-white">{featured.title}</h3>
                <p className="text-sm text-slate-300">{featured.shortSummary}</p>
                <p className="text-sm text-cyan-100">{projectOutcome(featured.industry)}</p>
                <div className="flex flex-wrap gap-2">
                  {featured.servicesProvided.slice(0, 3).map((service) => (
                    <span key={service} className="rounded-full border border-white/20 bg-white/[0.03] px-3 py-1 text-xs text-slate-200">
                      {service}
                    </span>
                  ))}
                </div>
                <Button asChild>
                  <Link
                    href={`/portfolio/${featured.slug}`}
                    onClick={() => trackConversionEvent("view_portfolio", { placement: "featured_case", project: featured.title })}
                  >
                    View Case <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.article>
          </TiltCard>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportDefaults}
            variants={staggerContainer}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
          >
            {secondary.map((project) => (
              <motion.article
                key={project.id}
                variants={fadeUp}
                className="group premium-panel overflow-hidden"
              >
                <div className="relative h-48 overflow-hidden bg-[linear-gradient(145deg,rgba(56,189,248,0.1),rgba(255,255,255,0.03),rgba(96,165,250,0.1))]">
                  <motion.div
                    className="relative h-full w-full"
                    whileHover={reduceMotion ? undefined : { scale: 1.05, y: -4 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Image src={project.coverImage} alt={project.title} fill className="object-contain object-top p-2" />
                  </motion.div>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="absolute inset-0 z-20"
                    aria-label={`View ${project.title} case study`}
                    onClick={() => trackConversionEvent("view_portfolio", { placement: "portfolio_secondary_image", project: project.title })}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs text-cyan-100">{projectOutcome(project.industry)}</p>
                  </div>
                </div>
                <div className="space-y-2 p-4">
                  <p className="text-sm text-cyan-200">{normalizeIndustry(project.industry)}</p>
                  <h4 className="font-semibold text-white">{project.title}</h4>
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="inline-flex items-center gap-1 text-sm text-slate-200 hover:text-white"
                    onClick={() => trackConversionEvent("view_portfolio", { placement: "portfolio_secondary", project: project.title })}
                  >
                    View Case <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      ) : (
        <div className="premium-panel p-6 text-center">
          <p className="text-sm text-slate-200">No projects available in this category yet.</p>
        </div>
      )}
    </div>
  );
}
