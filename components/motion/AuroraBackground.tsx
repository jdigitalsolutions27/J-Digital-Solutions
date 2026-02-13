"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";

const orbConfigs = [
  { size: 280, left: "10%", top: "8%", duration: 18, delay: 0.2 },
  { size: 240, left: "70%", top: "15%", duration: 16, delay: 0.8 },
  { size: 210, left: "20%", top: "58%", duration: 20, delay: 0.5 },
  { size: 260, left: "78%", top: "62%", duration: 14, delay: 1.2 }
];

export function AuroraBackground({ className }: { className?: string }) {
  const reduceMotion = useShouldReduceMotion();

  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden="true">
      <div className={cn("aurora-layer aurora-layer-a", !reduceMotion && "aurora-drift-a")} />
      <div className={cn("aurora-layer aurora-layer-b", !reduceMotion && "aurora-drift-b")} />
      <div className={cn("aurora-layer aurora-layer-c", !reduceMotion && "aurora-drift-c")} />

      <div className="absolute inset-0">
        {orbConfigs.map((orb) => (
          <motion.div
            key={`${orb.left}-${orb.top}`}
            className="absolute rounded-full bg-blue-400/12 blur-3xl will-change-transform"
            style={{
              width: orb.size,
              height: orb.size,
              left: orb.left,
              top: orb.top,
              opacity: reduceMotion ? 0.2 : 0.28
            }}
            animate={
              reduceMotion
                ? undefined
                : {
                    x: [0, 12, -10, 0],
                    y: [0, -18, 8, 0],
                    scale: [1, 1.05, 0.97, 1]
                  }
            }
            transition={
              reduceMotion
                ? undefined
                : {
                    duration: orb.duration,
                    delay: orb.delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
            }
          />
        ))}
      </div>
    </div>
  );
}
