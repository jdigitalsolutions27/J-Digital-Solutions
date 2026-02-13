"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { BrandLogo } from "@/components/shared/brand-logo";
import { adminNavItems, isAdminNavItemActive } from "@/components/admin/nav-items";
import { cn } from "@/lib/utils";

export function AdminSidebar() {
  const currentPath = usePathname();

  return (
    <aside className="surface h-fit p-4 lg:sticky lg:top-24">
      <div className="mb-6 space-y-2 px-2">
        <BrandLogo alt="J-Digital Solutions" width={176} height={52} imageClassName="h-9 w-auto" />
        <p className="font-display text-sm font-bold">J-Digital CMS</p>
        <p className="text-xs text-slate-300">Content Management</p>
      </div>
      <nav className="space-y-1">
        {adminNavItems.map((item) => {
          const active = isAdminNavItemActive(currentPath, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg border border-transparent px-3 py-2 text-sm text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                active && "border-blue-300/40 bg-blue-500/25 text-white shadow-[inset_3px_0_0_0_rgba(147,197,253,1)]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
