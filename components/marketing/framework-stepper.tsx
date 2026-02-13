"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { CheckCircle2, Clock3, ListChecks, Sparkles } from "lucide-react";
import { useMemo, useRef, useState } from "react";

import { fadeUp, staggerContainer, viewportDefaults } from "@/lib/motion";
import { useShouldReduceMotion } from "@/lib/use-should-reduce-motion";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  title: string;
  description: string;
  timeline: string;
  deliverables: string[];
};

export function FrameworkStepper({ steps }: { steps: Step[] }) {
  const reduceMotion = useShouldReduceMotion();
  const [activeId, setActiveId] = useState<string>(steps[0]?.id || "");
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end 0.35"]
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    if (reduceMotion || steps.length === 0) return;
    const index = Math.min(steps.length - 1, Math.floor(value * steps.length));
    setActiveId(steps[index]?.id ?? steps[0].id);
  });

  const activeStep = useMemo(() => steps.find((step) => step.id === activeId) ?? steps[0], [activeId, steps]);
  const activeIndex = useMemo(() => steps.findIndex((step) => step.id === activeStep?.id), [activeStep, steps]);
  const progressPercent = useMemo(() => {
    if (steps.length <= 1 || activeIndex < 0) return 0;
    return (activeIndex / (steps.length - 1)) * 100;
  }, [activeIndex, steps.length]);

  return (
    <div ref={sectionRef}>
      <div className="hidden gap-6 lg:grid lg:grid-cols-[0.95fr,1.05fr]">
        <div className="premium-panel relative overflow-hidden p-6 sm:p-8">
          <div className="pointer-events-none absolute right-0 top-0 h-44 w-44 bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_70%)] blur-2xl" />
          <div className="relative">
            <div className="absolute left-[17px] top-4 h-[calc(100%-2rem)] w-[2px] rounded-full bg-white/10" />
            <motion.div
              className="absolute left-[17px] top-4 w-[2px] rounded-full bg-gradient-to-b from-cyan-300/85 via-blue-300/65 to-blue-400/30"
              style={{ height: `calc((100% - 2rem) * ${Math.max(0, Math.min(progressPercent, 100)) / 100})` }}
              transition={reduceMotion ? undefined : { duration: 0.35, ease: "easeOut" }}
            />

            <div className="space-y-3">
              {steps.map((step, index) => {
                const isActive = step.id === activeStep.id;
                const isPast = index < activeIndex;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onMouseEnter={() => setActiveId(step.id)}
                    onFocus={() => setActiveId(step.id)}
                    onClick={() => setActiveId(step.id)}
                    className={cn(
                      "group relative w-full rounded-2xl border px-5 py-4 text-left transition-all duration-300",
                      isActive
                        ? "border-cyan-300/55 bg-cyan-400/12 shadow-[0_0_0_1px_rgba(56,189,248,0.2)]"
                        : "border-white/10 bg-white/[0.02] hover:border-white/20"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute -left-[5px] top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border",
                        isActive
                          ? "border-cyan-300/70 bg-cyan-200"
                          : isPast
                            ? "border-blue-300/50 bg-blue-300/75"
                            : "border-white/30 bg-slate-800"
                      )}
                    />
                    <p className={cn("text-xs uppercase tracking-[0.2em]", isActive ? "text-cyan-200" : "text-slate-300")}>
                      Step {index + 1}
                    </p>
                    <p className="mt-1 font-semibold text-white">{step.title}</p>
                    <p className="mt-1 text-xs text-slate-300">{step.timeline}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <motion.div
          key={activeStep.id}
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          variants={fadeUp}
          className="premium-panel relative overflow-hidden p-6 sm:p-8"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
          <div className="pointer-events-none absolute -right-12 top-0 h-44 w-44 bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_68%)] blur-2xl" />

          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Current Focus</p>
          <h3 className="mt-3 text-2xl font-bold text-white sm:text-3xl">{activeStep.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">{activeStep.description}</p>

          <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>Overall Progress</span>
              <span className="font-medium text-cyan-200">
                Step {Math.max(1, activeIndex + 1)} of {steps.length}
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200"
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${Math.max(0, Math.min(progressPercent, 100))}%` }}
                transition={reduceMotion ? undefined : { duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Clock3 className="h-4 w-4 text-cyan-200" /> Timeline
              </p>
              <p className="mt-2 text-sm text-slate-300">{activeStep.timeline}</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles className="h-4 w-4 text-cyan-200" /> Step Progress
              </p>
              <p className="mt-2 text-sm text-slate-300">
                {activeIndex + 1} / {steps.length}
              </p>
            </div>
          </div>

          <motion.ul
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mt-5 grid gap-2 sm:grid-cols-2"
          >
            {activeStep.deliverables.map((item) => (
              <motion.li
                key={item}
                variants={fadeUp}
                className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200"
              >
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-cyan-200" />
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      <div className="space-y-4 lg:hidden">
        {steps.map((step, index) => (
          <motion.div key={step.id} initial="hidden" whileInView="visible" viewport={viewportDefaults} variants={fadeUp}>
            <div className="premium-panel relative overflow-hidden p-5">
              <div className="pointer-events-none absolute left-5 top-8 h-[calc(100%-2.25rem)] w-px bg-white/10" />
              <span className="absolute left-[18px] top-[26px] h-3 w-3 rounded-full border border-cyan-300/60 bg-cyan-200" />
              <p className="pl-5 text-xs uppercase tracking-[0.2em] text-slate-300">Step {index + 1}</p>
              <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-1 text-xs text-cyan-200">{step.timeline}</p>
              <p className="mt-3 text-sm text-slate-300">{step.description}</p>
              <ul className="mt-4 grid gap-2">
                {step.deliverables.map((item) => (
                  <li key={item} className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200">
                    <span className="flex items-center gap-2">
                      <ListChecks className="h-4 w-4 text-cyan-200" />
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
