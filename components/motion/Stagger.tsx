"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

import { fadeUp, viewportDefaults } from "@/lib/motion";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

export function Stagger({
  children,
  className,
  delayChildren = 0.06,
  staggerChildren = 0.08
}: {
  children: ReactNode;
  className?: string;
  delayChildren?: number;
  staggerChildren?: number;
}) {
  const reduceMotion = useShouldReduceMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  const variants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren,
        staggerChildren
      }
    }
  };

  return (
    <motion.div
      className={cn("will-change-transform", className)}
      initial="hidden"
      whileInView="visible"
      viewport={viewportDefaults}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  variants = fadeUp
}: {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}) {
  const reduceMotion = useShouldReduceMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={cn("will-change-transform", className)} variants={variants}>
      {children}
    </motion.div>
  );
}
