import type { ReactNode } from "react";

import { typography } from "@/lib/typography";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  titleClassName
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: string;
  className?: string;
  titleClassName?: string;
}) {
  return (
    <div className={cn("mx-auto max-w-3xl space-y-4 text-center sm:space-y-5", className)}>
      {eyebrow ? (
        <p className={typography.eyebrow}>{eyebrow}</p>
      ) : null}
      <h2 className={cn(typography.sectionTitle, titleClassName)}>{title}</h2>
      <div className="mx-auto h-px w-24 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />
      {description ? <p className={typography.sectionLead}>{description}</p> : null}
    </div>
  );
}
