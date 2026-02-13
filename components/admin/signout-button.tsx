"use client";

import { useTransition } from "react";
import { signOut } from "next-auth/react";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() =>
        startTransition(async () => {
          await signOut({ callbackUrl: "/admin/login" });
        })
      }
      disabled={pending}
    >
      {pending ? "Signing out..." : "Sign Out"}
    </Button>
  );
}