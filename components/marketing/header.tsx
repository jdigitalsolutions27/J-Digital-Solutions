"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { trackConversionEvent } from "@/lib/tracking";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/portfolio" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" }
];

export function MarketingHeader({ brandName = "J-Digital Solutions" }: { brandName?: string }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isNavItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMobileMenuOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menuElement = mobileMenuRef.current;
    const focusable = menuElement?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    focusable?.[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !menuElement) return;
      const elements = Array.from(menuElement.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"));
      if (elements.length === 0) return;

      const first = elements[0];
      const last = elements[elements.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (event.shiftKey && current === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isMobileMenuOpen]);

  const currentPageLabel = navItems.find((item) => isNavItemActive(item.href))?.label ?? "Home";

  return (
    <header
      className={`sticky top-0 z-50 border-b backdrop-blur-xl transition-all ${
        isScrolled
          ? "border-blue-300/30 bg-slate-950/92 shadow-[0_14px_38px_-24px_rgba(2,6,23,0.95)]"
          : "border-white/10 bg-slate-950/68"
      }`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />
      <div className="container-xl flex h-16 items-center justify-between gap-4">
        <Link href="/" className="group flex items-center gap-3 text-white">
          <BrandLogo alt={brandName} width={190} height={56} priority animated imageClassName="h-10 w-auto sm:h-11" />
          <div className="hidden md:block">
            <span className="block font-display text-lg font-semibold transition group-hover:text-cyan-100">{brandName}</span>
            <span className="block text-[10px] uppercase tracking-[0.24em] text-slate-400">Premium Digital Systems</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] lg:flex" aria-label="Primary Navigation">
          {navItems.map((item) => {
            const active = isNavItemActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 after:absolute after:bottom-1 after:left-3 after:h-0.5 after:w-[calc(100%-1.5rem)] after:origin-left after:rounded-full after:bg-blue-300 after:transition-transform ${
                  active
                    ? "bg-white/[0.08] font-medium text-white shadow-[0_10px_30px_-18px_rgba(56,189,248,0.5)] after:scale-x-100"
                    : "text-slate-200 after:scale-x-0 hover:bg-white/[0.04] hover:text-white hover:after:scale-x-100"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <p className="rounded-full border border-blue-300/40 bg-blue-500/20 px-2.5 py-1 text-[11px] font-medium text-blue-100 lg:hidden">
            {currentPageLabel}
          </p>
          <Button asChild size="sm" className={`hidden sm:inline-flex ${isScrolled ? "shadow-glow" : ""}`}>
            <Link href="/contact?package=startup" onClick={() => trackConversionEvent("book_free_consultation", { placement: "header" })}>
              Book Free Consultation
            </Link>
          </Button>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="lg:hidden"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {isMobileMenuOpen ? (
        <div className="fixed inset-0 top-16 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Close menu overlay"
            className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div
            id="mobile-menu"
            ref={mobileMenuRef}
            role="dialog"
            aria-modal="true"
            className="relative max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-[linear-gradient(180deg,rgba(2,6,23,0.96),rgba(4,16,31,0.98))]"
          >
            <div className="container-xl space-y-1 py-3">
              {navItems.map((item) => {
                const active = isNavItemActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded-lg px-3 py-3 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                      active ? "bg-blue-500/25 font-medium text-white" : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Button asChild className="mt-2 w-full">
                <Link href="/contact?package=startup" onClick={() => trackConversionEvent("book_free_consultation", { placement: "header_mobile" })}>
                  Book Free Consultation
                </Link>
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
