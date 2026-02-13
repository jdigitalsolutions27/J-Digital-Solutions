"use client";

import { Building2, Clock3, Gauge, LayoutDashboard } from "lucide-react";
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
          className="max-w-3xl text-left"
        >
          <motion.div variants={fadeIn}>
            <Badge className="mb-7">Built for Philippine Businesses</Badge>
          </motion.div>

          <h1 className="text-balance text-4xl font-extrabold leading-[1.04] tracking-[-0.02em] text-white [text-shadow:0_12px_38px_rgba(2,6,23,0.7)] sm:text-5xl lg:text-6xl">
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
              Built for PH Businesses
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
            className="mt-7 max-w-2xl rounded-2xl border border-white/15 bg-slate-900/45 px-4 py-3 text-xs text-slate-100 sm:text-sm"
          >
            Industries we build for: Construction | Healthcare | E-Commerce | Consulting | Real Estate
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
