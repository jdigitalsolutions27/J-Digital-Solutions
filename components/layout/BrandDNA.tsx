"use client";

import { motion } from "framer-motion";

import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

export function BrandDNA({
  intensity = "soft",
  animated = false,
  className
}: {
  intensity?: "soft" | "strong";
  animated?: boolean;
  className?: string;
}) {
  const reduced = useShouldReduceMotion();
  const canAnimate = animated && !reduced;

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <div
        className={cn(
          "absolute inset-0 opacity-[0.08]",
          intensity === "strong" ? "opacity-[0.13]" : "opacity-[0.08]",
          "bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:44px_44px]"
        )}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_26%,rgba(56,189,248,0.12),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_78%,rgba(37,99,235,0.12),transparent_66%)]" />

      <motion.div
        className="absolute left-[8%] top-[22%] h-px w-44 bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"
        animate={
          canAnimate
            ? {
                x: [0, 24, 0],
                opacity: [0.25, 0.6, 0.25]
              }
            : undefined
        }
        transition={canAnimate ? { duration: 7.5, repeat: Infinity, ease: "easeInOut" } : undefined}
      />
      <motion.div
        className="absolute right-[10%] top-[62%] h-px w-52 bg-gradient-to-r from-transparent via-blue-300/45 to-transparent"
        animate={
          canAnimate
            ? {
                x: [0, -22, 0],
                opacity: [0.2, 0.5, 0.2]
              }
            : undefined
        }
        transition={canAnimate ? { duration: 8.2, repeat: Infinity, ease: "easeInOut", delay: 0.6 } : undefined}
      />
      <div className="absolute left-[20%] top-[78%] h-[1px] w-32 bg-gradient-to-r from-transparent via-slate-300/35 to-transparent" />
    </div>
  );
}
