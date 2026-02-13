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

      <div className="absolute inset-0 bg-slate-950/72" />
      <div className="absolute inset-0 bg-[linear-gradient(108deg,rgba(2,6,23,0.95)_0%,rgba(2,6,23,0.85)_40%,rgba(2,6,23,0.45)_70%,rgba(2,6,23,0.15)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,6,23,0.72)_0%,rgba(7,26,51,0.42)_45%,rgba(3,12,31,0.86)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_30%,rgba(56,189,248,0.19),transparent_58%)]" />

      <AuroraBackground className={cn("opacity-[0.18] mix-blend-screen", reduceMotion && "opacity-[0.08]")} />
    </div>
  );
}
