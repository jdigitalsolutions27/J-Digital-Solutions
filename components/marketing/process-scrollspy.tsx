"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";

type ProcessStep = {
  id: string;
  title: string;
  description: string;
  timeline: string;
  deliverables: string[];
};

export function ProcessScrollSpy({ steps }: { steps: ProcessStep[] }) {
  const [activeId, setActiveId] = useState<string>(steps[0]?.id ?? "");

  useEffect(() => {
    const targets = steps
      .map((step) => document.getElementById(`process-step-${step.id}`))
      .filter((node): node is HTMLElement => Boolean(node));

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]) {
          setActiveId(visible[0].target.id.replace("process-step-", ""));
        }
      },
      {
        rootMargin: "-20% 0px -50% 0px",
        threshold: [0.15, 0.4, 0.65]
      }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [steps]);

  const activeIndex = useMemo(
    () => Math.max(0, steps.findIndex((step) => step.id === activeId)),
    [activeId, steps]
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[280px,1fr]">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <div className="premium-panel p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Process Steps</p>
          <div className="mt-4 space-y-2">
            {steps.map((step, index) => {
              const isActive = step.id === activeId;
              return (
                <a
                  key={step.id}
                  href={`#process-step-${step.id}`}
                  className={cn(
                    "block rounded-xl border px-3 py-3 text-sm transition-all duration-200",
                    isActive
                      ? "border-cyan-300/55 bg-cyan-400/10 text-white"
                      : "border-white/10 bg-white/[0.02] text-slate-300 hover:border-white/20"
                  )}
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Step {index + 1}</p>
                  <p className="mt-1 font-semibold">{step.title}</p>
                </a>
              );
            })}
          </div>
          <div className="mt-4 h-1 w-full rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-300 transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / Math.max(steps.length, 1)) * 100}%` }}
            />
          </div>
        </div>
      </aside>

      <div className="space-y-5">
        {steps.map((step, index) => (
          <article id={`process-step-${step.id}`} key={step.id} className="premium-panel p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-cyan-200">Step {index + 1}</p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-white">{step.title}</h3>
              <span className="rounded-full border border-white/20 bg-white/[0.03] px-3 py-1 text-xs text-slate-200">
                {step.timeline}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.description}</p>
            <ul className="mt-5 grid gap-2 sm:grid-cols-2">
              {step.deliverables.map((deliverable) => (
                <li
                  key={deliverable}
                  className="flex gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-200"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-cyan-200" />
                  {deliverable}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
