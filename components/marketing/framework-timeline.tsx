"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { fadeUp, staggerContainer, viewportDefaults } from "@/lib/motion";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

type ProcessItem = {
  id: string;
  title: string;
  description: string;
  timeline: string;
};

export function FrameworkTimeline({ steps }: { steps: ProcessItem[] }) {
  const reduceMotion = useShouldReduceMotion();
  const desktopRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const { scrollYProgress: desktopProgress } = useScroll({
    target: desktopRef,
    offset: ["start 0.8", "end 0.3"]
  });

  const { scrollYProgress: mobileProgress } = useScroll({
    target: mobileRef,
    offset: ["start 0.8", "end 0.25"]
  });

  useMotionValueEvent(desktopProgress, "change", (value) => {
    if (reduceMotion) return;
    const step = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length)));
    setActiveIndex(step);
  });

  useMotionValueEvent(mobileProgress, "change", (value) => {
    if (reduceMotion) return;
    const step = Math.min(steps.length - 1, Math.max(0, Math.floor(value * steps.length)));
    setActiveMobileIndex(step);
  });

  return (
    <div>
      <div ref={desktopRef} className="relative hidden lg:block">
        <div className="absolute left-0 right-0 top-8 h-px bg-white/10" />
        <motion.div
          className="absolute left-0 right-0 top-8 h-px origin-left bg-gradient-to-r from-blue-300/60 via-cyan-300/50 to-transparent"
          style={reduceMotion ? { scaleX: 1 } : { scaleX: desktopProgress }}
        />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportDefaults}
          variants={staggerContainer}
          className="grid gap-4 lg:grid-cols-5"
        >
          {steps.map((step, index) => {
            const isActive = reduceMotion ? true : index <= activeIndex;

            return (
              <motion.div key={step.id} variants={fadeUp}>
                <Card
                  className={cn(
                    "relative z-10 h-full transition-all duration-300",
                    isActive ? "scale-[1.015] border-blue-300/45 bg-blue-950/20" : "opacity-60"
                  )}
                >
                  <CardContent className="space-y-4 p-5">
                    <div className="flex items-center justify-between">
                      <span
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold transition-all duration-300",
                          isActive
                            ? "border-blue-300/50 bg-blue-600/25 text-blue-100"
                            : "border-white/20 bg-white/5 text-slate-300"
                        )}
                      >
                        {index + 1}
                      </span>
                      <Badge variant="outline">{step.timeline}</Badge>
                    </div>
                    <h3 className="text-base font-semibold text-white">{step.title}</h3>
                    <p className="text-sm text-slate-300">{step.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <div ref={mobileRef} className="relative space-y-4 lg:hidden">
        <div className="absolute left-[15px] top-2 h-[calc(100%-12px)] w-px bg-white/10" />
        <motion.div
          className="absolute left-[15px] top-2 h-[calc(100%-12px)] w-px origin-top bg-gradient-to-b from-blue-300/65 via-cyan-300/45 to-transparent"
          style={reduceMotion ? { scaleY: 1 } : { scaleY: mobileProgress }}
        />

        <motion.div initial="hidden" whileInView="visible" viewport={viewportDefaults} variants={staggerContainer} className="space-y-4">
          {steps.map((step, index) => {
            const isActive = reduceMotion ? true : index <= activeMobileIndex;

            return (
              <motion.div key={step.id} variants={fadeUp}>
                <Card className={cn("transition-all duration-300", isActive ? "border-blue-300/45 bg-blue-950/20" : "opacity-70")}>
                  <CardContent className="grid grid-cols-[auto,1fr] gap-4 p-5">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "relative z-10 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-bold",
                          isActive
                            ? "border-blue-300/50 bg-blue-600/25 text-blue-100"
                            : "border-white/20 bg-white/5 text-slate-300"
                        )}
                      >
                        {index + 1}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-white">{step.title}</h3>
                        <Badge variant="outline">{step.timeline}</Badge>
                      </div>
                      <p className="text-sm text-slate-300">{step.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
