import { cn } from "@/lib/utils";

export function GradientLineDivider({
  className
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-white/25 to-transparent",
        className
      )}
    />
  );
}
