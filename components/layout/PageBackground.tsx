import type { ReactNode } from "react";

import { BrandDNA } from "@/components/layout/BrandDNA";
import { cn } from "@/lib/utils";

export function PageBackground({
  children,
  className,
  withBrandDNA = true
}: {
  children: ReactNode;
  className?: string;
  withBrandDNA?: boolean;
}) {
  return (
    <div className={cn("relative isolate overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0 -z-40 bg-[#061226]" />
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[linear-gradient(180deg,#061226_0%,#071a33_48%,#061226_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-[-280px] -z-20 h-[620px] w-[1200px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_70%)] blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-320px] left-1/2 -z-20 h-[620px] w-[1000px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_74%)] blur-3xl" />
      <div className="pointer-events-none absolute inset-0 -z-20 hidden opacity-35 lg:block">
        <div className="aurora-layer aurora-layer-a aurora-drift-a" />
        <div className="aurora-layer aurora-layer-b aurora-drift-b" />
        <div className="aurora-layer aurora-layer-c aurora-drift-c" />
      </div>

      {withBrandDNA ? <BrandDNA className="-z-10 opacity-70" /> : null}

      {children}
    </div>
  );
}

export function SectionGlow({
  className,
  tone = "blue",
  position = "top"
}: {
  className?: string;
  tone?: "blue" | "cyan";
  position?: "top" | "center";
}) {
  const toneClass =
    tone === "cyan"
      ? "bg-[radial-gradient(circle,rgba(56,189,248,0.13),transparent_72%)]"
      : "bg-[radial-gradient(circle,rgba(37,99,235,0.14),transparent_72%)]";

  const positionClass =
    position === "center"
      ? "left-1/2 top-1/2 h-[360px] w-[760px] -translate-x-1/2 -translate-y-1/2"
      : "left-1/2 top-0 h-[320px] w-[740px] -translate-x-1/2";

  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)} aria-hidden="true">
      <div className={cn("absolute blur-3xl", toneClass, positionClass)} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
    </div>
  );
}
