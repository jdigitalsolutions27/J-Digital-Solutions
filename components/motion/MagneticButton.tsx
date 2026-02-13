"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { shouldReduceMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  maxOffset = 12
}: {
  children: ReactNode;
  className?: string;
  maxOffset?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 280, damping: 24, mass: 0.28 });
  const springY = useSpring(y, { stiffness: 280, damping: 24, mass: 0.28 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;

    const mediaQuery = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const update = () => setEnabled(mediaQuery.matches && !shouldReduceMotion());

    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!enabled || !ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const xPosition = event.clientX - rect.left - rect.width / 2;
    const yPosition = event.clientY - rect.top - rect.height / 2;

    const nextX = Math.max(-maxOffset, Math.min(maxOffset, (xPosition / rect.width) * (maxOffset * 2)));
    const nextY = Math.max(-maxOffset, Math.min(maxOffset, (yPosition / rect.height) * (maxOffset * 2)));

    x.set(nextX);
    y.set(nextY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn(enabled ? "will-change-transform" : "", className)}
      style={enabled ? { x: springX, y: springY } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
