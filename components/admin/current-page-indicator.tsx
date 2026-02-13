"use client";

import { usePathname } from "next/navigation";

import { getAdminCurrentPageLabel } from "@/components/admin/nav-items";

export function CurrentPageIndicator() {
  const pathname = usePathname();
  const currentPage = getAdminCurrentPageLabel(pathname);

  return (
    <p className="text-sm font-medium text-slate-100" aria-live="polite">
      Current Page: <span className="text-blue-200">{currentPage}</span>
    </p>
  );
}
