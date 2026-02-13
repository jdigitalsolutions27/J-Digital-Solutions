"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

import { adminNavItems, getAdminCurrentPageLabel, isAdminNavItemActive } from "@/components/admin/nav-items";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminMobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const currentPage = getAdminCurrentPageLabel(pathname);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      <div className="surface flex items-center justify-between gap-3 p-3">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-blue-200">Admin Menu</p>
          <p className="text-sm font-semibold text-white">{currentPage}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-expanded={open}
          aria-controls="admin-mobile-menu"
          aria-label={open ? "Close admin menu" : "Open admin menu"}
          onClick={() => setOpen((prev) => !prev)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-sm lg:hidden">
          <button type="button" className="absolute inset-0" aria-label="Close admin menu overlay" onClick={() => setOpen(false)} />
          <div id="admin-mobile-menu" className="relative ml-auto h-full w-[88%] max-w-sm border-l border-white/10 bg-slate-950/95 p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-white">Navigation</p>
              <Button type="button" variant="ghost" size="icon" aria-label="Close admin menu" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="max-h-[calc(100dvh-110px)] space-y-1 overflow-y-auto pr-1">
              {adminNavItems.map((item) => {
                const active = isAdminNavItemActive(pathname, item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border border-transparent px-3 py-3 text-sm text-slate-200 transition",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950",
                      active ? "border-blue-300/40 bg-blue-500/25 text-white" : "hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
