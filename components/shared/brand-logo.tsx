"use client";

import Image from "next/image";
import { motion } from "framer-motion";

import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

export function BrandLogo({
  alt,
  width,
  height,
  className,
  imageClassName,
  priority = false,
  animated = false
}: {
  alt: string;
  width: number;
  height: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  animated?: boolean;
}) {
  const reduceMotion = useShouldReduceMotion();
  const enableAnimation = animated && !reduceMotion;

  return (
    <motion.span
      className={cn("group relative inline-flex items-center justify-center", className)}
      initial={false}
      animate={
        enableAnimation
          ? {
              y: [0, -2, 0],
              scale: [1, 1.012, 1]
            }
          : undefined
      }
      transition={enableAnimation ? { duration: 4.8, ease: "easeInOut", repeat: Number.POSITIVE_INFINITY } : undefined}
      whileHover={!reduceMotion ? { y: -1.5, scale: 1.015 } : undefined}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-2 -z-10 rounded-full bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_70%)] opacity-70 blur-xl transition-opacity duration-300 group-hover:opacity-95"
      />
      <Image
        src="/LOGOOOO.png"
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={cn("h-auto w-auto drop-shadow-[0_6px_20px_rgba(14,165,233,0.2)]", imageClassName)}
      />
    </motion.span>
  );
}

