"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ActionResult = {
  error?: string;
  success?: string;
};

export function ActionButton({
  action,
  payload,
  label,
  pendingLabel,
  variant = "outline",
  size = "sm"
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  payload: Record<string, string>;
  label: string;
  pendingLabel?: string;
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      disabled={pending}
      onClick={() => {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => formData.append(key, value));

        startTransition(async () => {
          const result = await action(formData);
          if (result.error) {
            toast.error(result.error);
            return;
          }
          toast.success(result.success || "Updated");
        });
      }}
    >
      {pending ? pendingLabel || "Please wait..." : label}
    </Button>
  );
}