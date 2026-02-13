"use client";

import Link from "next/link";
import type { ReactNode } from "react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { type ConversionEventName, trackConversionEvent } from "@/lib/tracking";

export function TrackedButtonLink({
  href,
  eventName,
  payload,
  children,
  variant,
  size,
  className
}: {
  href: string;
  eventName: ConversionEventName;
  payload?: Record<string, unknown>;
  children: ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  return (
    <Button asChild variant={variant} size={size} className={className}>
      <Link href={href} onClick={() => trackConversionEvent(eventName, payload)}>
        {children}
      </Link>
    </Button>
  );
}
