"use client";

import { type ReactNode, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

type ActionResult = {
  error?: string;
  success?: string;
};

export function ActionForm({
  action,
  children,
  submitLabel = "Save",
  resetOnSuccess = false,
  className
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: ReactNode;
  submitLabel?: string;
  resetOnSuccess?: boolean;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className={className}
      onSubmit={(event) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const formData = new FormData(formElement);

        startTransition(async () => {
          const result = await action(formData);
          if (result.error) {
            toast.error(result.error);
            return;
          }

          toast.success(result.success || "Saved");
          if (resetOnSuccess) {
            formElement.reset();
          }
        });
      }}
    >
      {children}
      <Button type="submit" disabled={pending} className="mt-4">
        {pending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
