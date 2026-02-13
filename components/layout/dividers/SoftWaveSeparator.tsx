import { cn } from "@/lib/utils";

export function SoftWaveSeparator({
  className
}: {
  className?: string;
}) {
  return (
    <div className={cn("pointer-events-none relative h-12 w-full overflow-hidden", className)} aria-hidden="true">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        className="h-full w-full"
      >
        <path
          d="M0,72 C180,30 320,120 520,88 C760,48 860,10 1200,70 L1200,120 L0,120 Z"
          fill="rgba(56, 189, 248, 0.08)"
        />
        <path
          d="M0,88 C190,44 340,124 540,96 C760,60 900,20 1200,82"
          fill="none"
          stroke="rgba(191, 219, 254, 0.25)"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
