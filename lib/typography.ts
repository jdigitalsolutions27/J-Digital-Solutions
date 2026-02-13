import { createElement, type ReactNode } from "react";

export const typography = {
  heroTitle:
    "text-balance font-display text-4xl font-extrabold leading-[1.04] tracking-[-0.02em] text-white sm:text-5xl lg:text-6xl",
  pageTitle:
    "text-balance font-display text-3xl font-bold leading-[1.08] tracking-[-0.018em] text-white sm:text-4xl lg:text-5xl",
  sectionTitle:
    "text-balance font-display text-2xl font-bold leading-[1.12] tracking-[-0.016em] text-white sm:text-3xl lg:text-4xl",
  sectionLead: "text-pretty text-base leading-relaxed text-slate-200 sm:text-lg",
  eyebrow: "text-xs font-semibold uppercase tracking-[0.22em] text-blue-300",
  gradientKeyword:
    "bg-gradient-to-r from-cyan-200 via-sky-300 to-blue-300 bg-clip-text text-transparent"
} as const;

export function highlightKeyword(text: string, keyword: string): ReactNode {
  if (!text.includes(keyword)) return text;
  const [before, after] = text.split(keyword);

  return [
    before,
    createElement("span", { key: `keyword-${keyword}`, className: typography.gradientKeyword }, keyword),
    after
  ];
}
