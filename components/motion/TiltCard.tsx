"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

import { hoverCard, shouldReduceMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

export function TiltCard({
  children,
  className,
  maxTilt = 5
}: {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 22, mass: 0.35 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 22, mass: 0.35 });

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
    const relativeX = (event.clientX - rect.left) / rect.width;
    const relativeY = (event.clientY - rect.top) / rect.height;

    const nextRotateY = (relativeX - 0.5) * (maxTilt * 2);
    const nextRotateX = (0.5 - relativeY) * (maxTilt * 2);

    rotateX.set(nextRotateX);
    rotateY.set(nextRotateY);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={cn("group relative h-full [transform-style:preserve-3d]", enabled ? "will-change-transform" : "", className)}
      style={enabled ? { rotateX: springRotateX, rotateY: springRotateY } : undefined}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      variants={hoverCard}
      initial="rest"
      whileHover={enabled ? "hover" : "rest"}
      transition={{ duration: 0.24, ease: "easeOut" }}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-blue-300/35 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_15%,rgba(56,189,248,0.22),transparent_55%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {children}
    </motion.div>
  );
}
