"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";
import { fadeUp, viewportDefaults } from "@/lib/motion";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";

export function Reveal({
  children,
  className,
  variants = fadeUp,
  delay = 0
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
  delay?: number;
}) {
  const reduceMotion = useShouldReduceMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportDefaults}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
}
