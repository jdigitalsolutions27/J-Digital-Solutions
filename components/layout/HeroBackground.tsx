"use client";

import Image from "next/image";

import { AuroraBackground } from "@/components/motion/AuroraBackground";
import heroImage from "@/public/hero/jdigital-hero.png";
import { cn } from "@/lib/utils";

export function HeroBackground({
  reduceMotion,
  className
}: {
  reduceMotion: boolean;
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 -z-30 overflow-hidden", className)} aria-hidden="true">
      <Image
        src={heroImage}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 100vw, 1280px"
        className="object-cover object-center md:object-[68%_center]"
      />

      <div className="absolute inset-0 bg-slate-950/76" />
      <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.88)_34%,rgba(2,6,23,0.48)_64%,rgba(2,6,23,0.18)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.8)_0%,rgba(7,26,51,0.48)_45%,rgba(3,12,31,0.92)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_28%,rgba(56,189,248,0.23),transparent_52%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(37,99,235,0.18),transparent_42%)]" />
      <div className="absolute left-[58%] top-[10%] h-[420px] w-[320px] -rotate-[18deg] rounded-full bg-[linear-gradient(180deg,rgba(186,230,253,0.12),transparent)] blur-3xl" />
      <div className="absolute inset-0 hero-vignette" />
      <div className="absolute inset-0 noise-overlay opacity-35" />

      <AuroraBackground className={cn("opacity-[0.18] mix-blend-screen", reduceMotion && "opacity-[0.08]")} />
    </div>
  );
}
