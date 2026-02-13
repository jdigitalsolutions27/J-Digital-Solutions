"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PackageOption = {
  slug: string;
  name: string;
};

type Need = "landing" | "website" | "ecommerce" | "";
type Urgency = "urgent" | "standard" | "flexible" | "";
type Goal = "credibility" | "leads" | "sales" | "";

export function PricingFitQuiz({ packages }: { packages: PackageOption[] }) {
  const [need, setNeed] = useState<Need>("");
  const [urgency, setUrgency] = useState<Urgency>("");
  const [goal, setGoal] = useState<Goal>("");

  const result = useMemo(() => {
    if (!need || !urgency || !goal) return null;

    let suggestedSlug = "startup";

    if (need === "ecommerce") {
      suggestedSlug = "business-ecommerce";
    } else if (need === "landing") {
      suggestedSlug = urgency === "urgent" ? "starter" : "basic";
    } else if (need === "website") {
      if (goal === "sales") suggestedSlug = "professional";
      else if (goal === "credibility" && urgency === "urgent") suggestedSlug = "basic";
      else suggestedSlug = "startup";
    }

    if (goal === "leads" && need !== "ecommerce" && urgency !== "urgent") {
      suggestedSlug = "startup";
    }

    const found = packages.find((item) => item.slug === suggestedSlug) || packages.find((item) => item.slug === "startup") || packages[0];
    if (!found) return null;

    return {
      slug: found.slug,
      name: found.name
    };
  }, [goal, need, packages, urgency]);

  return (
    <div className="premium-panel p-6 sm:p-8">
      <div className="space-y-5">
        <QuizQuestion
          title="1) What do you need?"
          value={need}
          onChange={(value) => setNeed(value as Need)}
          options={[
            ["landing", "Landing Page"],
            ["website", "Business Website"],
            ["ecommerce", "E-Commerce"]
          ]}
        />

        <QuizQuestion
          title="2) How fast do you need it?"
          value={urgency}
          onChange={(value) => setUrgency(value as Urgency)}
          options={[
            ["urgent", "Urgent"],
            ["standard", "Standard"],
            ["flexible", "Flexible"]
          ]}
        />

        <QuizQuestion
          title="3) What is your main goal?"
          value={goal}
          onChange={(value) => setGoal(value as Goal)}
          options={[
            ["credibility", "Credibility"],
            ["leads", "More Leads"],
            ["sales", "More Sales"]
          ]}
        />
      </div>

      {result ? (
        <div className="mt-6 rounded-2xl border border-cyan-300/35 bg-cyan-400/10 p-5">
          <p className="text-sm text-slate-100">Recommended package:</p>
          <p className="mt-1 text-xl font-bold text-white">{result.name}</p>
          <Button asChild className="mt-4">
            <Link href={`/contact?package=${result.slug}`}>Continue with {result.name}</Link>
          </Button>
        </div>
      ) : (
        <p className="mt-6 text-sm text-slate-300">Answer all 3 questions to get a recommendation.</p>
      )}
    </div>
  );
}

function QuizQuestion({
  title,
  options,
  value,
  onChange
}: {
  title: string;
  options: Array<[string, string]>;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-white">{title}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(([optionValue, label]) => (
          <button
            key={optionValue}
            type="button"
            onClick={() => onChange(optionValue)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm transition-all duration-200",
              value === optionValue
                ? "border-cyan-300/55 bg-cyan-400/10 text-white"
                : "border-white/20 bg-white/[0.03] text-slate-300 hover:bg-white/[0.08]"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
