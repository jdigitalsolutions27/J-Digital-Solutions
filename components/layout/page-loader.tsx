import { cn } from "@/lib/utils";

export function PageLoader({
  label = "Loading page...",
  className,
  compact = false
}: {
  label?: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]",
        compact ? "p-6" : "min-h-[52vh] p-8 sm:p-10",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(56,189,248,0.2),transparent_42%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_86%_84%,rgba(59,130,246,0.18),transparent_40%)]" />
      <div className="loader-sweep absolute -inset-x-1/2 top-0 h-full bg-[linear-gradient(110deg,transparent,rgba(186,230,253,0.08),transparent)]" />

      <div className="relative z-10 mx-auto flex h-full max-w-xl flex-col items-center justify-center text-center">
        <div className="loader-orbit mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan-200/35 bg-slate-900/40">
          <div className="loader-pulse-dot h-3.5 w-3.5 rounded-full bg-cyan-200" />
        </div>

        <p className="text-base font-semibold text-white">{label}</p>
        <p className="mt-2 text-sm text-slate-300">Preparing a smooth experience...</p>

        <div className="mt-6 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-white/10">
          <div className="loader-progress h-full w-1/2 rounded-full bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-200" />
        </div>
      </div>
    </div>
  );
}

