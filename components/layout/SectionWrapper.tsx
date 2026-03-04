import type { ReactNode } from "react";

import { GradientLineDivider } from "@/components/layout/dividers/GradientLineDivider";
import { BrandDNA } from "@/components/layout/BrandDNA";
import { cn } from "@/lib/utils";

type SectionVariant = "base" | "raised" | "accent";
type GlowVariant = "none" | "soft" | "hero";

export function SectionWrapper({
  children,
  variant = "base",
  withTopDivider = false,
  withBottomDivider = false,
  glow = "none",
  id,
  className,
  contentClassName
}: {
  children: ReactNode;
  variant?: SectionVariant;
  withTopDivider?: boolean;
  withBottomDivider?: boolean;
  glow?: GlowVariant;
  id?: string;
  className?: string;
  contentClassName?: string;
}) {
  const isRaised = variant === "raised";
  const isAccent = variant === "accent";

  return (
    <section
      id={id}
      className={cn("relative overflow-x-clip py-6 sm:py-8 md:py-12 lg:py-16", className)}
    >
      {withTopDivider ? <GradientLineDivider className="absolute inset-x-0 top-0" /> : null}

      {glow !== "none" ? (
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div
            className={cn(
              "absolute left-1/2 top-0 h-[360px] w-[860px] -translate-x-1/2 rounded-full blur-3xl",
              glow === "hero"
                ? "bg-[radial-gradient(circle,rgba(56,189,248,0.26),transparent_72%)]"
                : "bg-[radial-gradient(circle,rgba(56,189,248,0.14),transparent_72%)]"
            )}
          />
          <div className="absolute inset-x-[8%] top-10 hidden h-px section-beam lg:block" />
        </div>
      ) : null}

      {isAccent ? <BrandDNA intensity="soft" className="-z-20 opacity-80" /> : null}

      <div className="container-xl relative">
        <div
          className={cn(
            "relative isolate space-y-0",
            isRaised &&
              "premium-shell glow-outline p-6 sm:p-8 lg:p-10",
            isAccent &&
              "premium-shell-accent glow-outline p-6 sm:p-8 lg:p-10",
            contentClassName
          )}
        >
          {(isRaised || isAccent) ? (
            <>
              <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
              <div className="pointer-events-none absolute inset-y-10 right-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            </>
          ) : null}
          {children}
        </div>
      </div>

      {withBottomDivider ? <GradientLineDivider className="absolute inset-x-0 bottom-0" /> : null}
    </section>
  );
}
