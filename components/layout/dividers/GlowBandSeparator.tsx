import { cn } from "@/lib/utils";

export function GlowBandSeparator({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none relative h-14 w-full overflow-hidden", className)} aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent" />
      <div className="absolute left-1/2 top-1/2 h-16 w-[680px] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(circle,rgba(56,189,248,0.16),transparent_72%)] blur-2xl" />
    </div>
  );
}
