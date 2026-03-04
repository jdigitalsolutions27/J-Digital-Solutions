"use client";

import { ArrowUpRight, Building2, Clock3, Gauge, Globe2, LayoutDashboard, ShieldCheck, Sparkles, Workflow } from "lucide-react";
import { motion } from "framer-motion";
import type { PointerEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { HeroBackground } from "@/components/layout/HeroBackground";
import { MagneticButton } from "@/components/motion/MagneticButton";
import { TrackedButtonLink } from "@/components/marketing/tracked-button-link";
import { Badge } from "@/components/ui/badge";
import {
  fadeIn,
  fadeUp,
  hoverButton,
  shouldReduceMotion,
  staggerContainer
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";

const heroSignals = [
  { label: "Positioning", value: "Premium-first" },
  { label: "Delivery", value: "Structured" },
  { label: "Experience", value: "Mobile-led" }
] as const;

const heroFeatureCards = [
  {
    icon: Globe2,
    title: "Global delivery standard",
    description: "Remote-ready execution with clean updates, clear review cycles, and premium launch polish."
  },
  {
    icon: Workflow,
    title: "Trust-focused systems",
    description: "Messaging, UX, and lead capture built to make visitors feel they are dealing with a serious brand."
  },
  {
    icon: ShieldCheck,
    title: "Built to convert",
    description: "Every major section is structured to support credibility, lead intent, and decision-making."
  }
] as const;

export function HomeHero({
  headline,
  subheadline,
  primaryCtaLink,
  secondaryCtaLink
}: {
  headline: string;
  subheadline: string;
  primaryCtaLink: string;
  secondaryCtaLink: string;
}) {
  const words = useMemo(() => headline.split(/\s+/g).filter(Boolean), [headline]);
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const reduceMotion = useShouldReduceMotion();
  const [enableSpotlight, setEnableSpotlight] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setEnableSpotlight(mediaQuery.matches && !shouldReduceMotion());

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (!enableSpotlight || !heroRef.current || !glowRef.current) return;

    const rect = heroRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (frameRef.current) return;
    frameRef.current = window.requestAnimationFrame(() => {
      glowRef.current?.style.setProperty("--spot-x", `${x}%`);
      glowRef.current?.style.setProperty("--spot-y", `${y}%`);
      frameRef.current = null;
    });
  };

  return (
    <section
      ref={heroRef}
      className="relative isolate overflow-hidden"
      onPointerMove={handlePointerMove}
    >
      <HeroBackground reduceMotion={reduceMotion} />

      <div
        ref={glowRef}
        className={cn(
          "hero-spotlight absolute inset-0 -z-10 opacity-0 transition-opacity duration-300",
          enableSpotlight && "opacity-100"
        )}
      />

      <div className="container-xl relative py-16 sm:py-20 lg:py-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid items-end gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]"
        >
          <div className="max-w-3xl text-left">
            <motion.div variants={fadeIn}>
              <Badge className="mb-7">Premium Web Design and Conversion Studio</Badge>
            </motion.div>

            <h1 className="text-balance text-4xl font-extrabold leading-[1.02] tracking-[-0.03em] text-white [text-shadow:0_12px_38px_rgba(2,6,23,0.7)] sm:text-5xl lg:text-[4.35rem]">
              {words.map((word, index) => (
                <motion.span
                  key={`${word}-${index}`}
                  variants={fadeUp}
                  className="mr-[0.34em] inline-block will-change-transform"
                >
                  {word}
                </motion.span>
              ))}
            </h1>

            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-2xl text-pretty text-base leading-relaxed text-slate-100 sm:text-lg"
            >
              {subheadline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-2.5">
              {heroSignals.map((signal) => (
                <span key={signal.label} className="premium-chip">
                  <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                  <span className="text-slate-300">{signal.label}</span>
                  <span className="font-semibold text-white">{signal.value}</span>
                </span>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
              <MagneticButton>
                <motion.div variants={hoverButton} initial="rest" whileHover={reduceMotion ? "rest" : "hover"}>
                  <TrackedButtonLink
                    href={primaryCtaLink}
                    eventName="book_free_consultation"
                    payload={{ placement: "hero_primary" }}
                    size="lg"
                    className="shadow-[0_10px_36px_-12px_rgba(56,189,248,0.65)]"
                  >
                    Book Free Consultation
                  </TrackedButtonLink>
                </motion.div>
              </MagneticButton>

              <motion.div variants={hoverButton} initial="rest" whileHover={reduceMotion ? "rest" : "hover"}>
                <TrackedButtonLink
                  href={secondaryCtaLink}
                  eventName="view_portfolio"
                  payload={{ placement: "hero_secondary" }}
                  size="lg"
                  variant="outline"
                >
                  View Projects
                </TrackedButtonLink>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-7 flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Building2 className="h-3.5 w-3.5" />
                Global Client Ready
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                Fast Turnaround
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <Gauge className="h-3.5 w-3.5" />
                SEO-Ready
              </Badge>
              <Badge variant="secondary" className="gap-1.5 px-3 py-1.5">
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin Dashboard
              </Badge>
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="mt-7 max-w-2xl rounded-[1.5rem] border border-white/15 bg-slate-900/45 px-4 py-3 text-xs text-slate-100 sm:text-sm"
            >
              Supporting service businesses across North America, the UK, Europe, the Middle East, and Asia Pacific with premium web systems built for trust, inquiries, and growth.
            </motion.p>
          </div>

          <motion.div variants={fadeUp} className="hidden lg:block">
            <div className="premium-shell glow-outline relative overflow-hidden p-5 xl:p-6">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_34%)]" />
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              <div className="relative">
                <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Why It Feels Premium</p>
                <div className="mt-5 grid gap-3">
                  {heroFeatureCards.map((item) => (
                    <div key={item.title} className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-start gap-3">
                        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-500/10 text-cyan-100">
                          <item.icon className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-sm leading-relaxed text-slate-300">{item.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-[1.5rem] border border-white/10 bg-[linear-gradient(135deg,rgba(10,25,46,0.78),rgba(255,255,255,0.02))] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">Agency Fit</p>
                      <p className="mt-1 text-sm text-white">Websites, automation, and growth systems for serious brands.</p>
                    </div>
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-500/10 text-cyan-100">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
