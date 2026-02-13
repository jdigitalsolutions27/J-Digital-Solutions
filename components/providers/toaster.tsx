"use client";

import { Toaster } from "sonner";

export function AppToaster() {
  return <Toaster richColors position="top-right" closeButton duration={3500} />;
}