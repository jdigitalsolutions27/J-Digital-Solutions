import Link from "next/link";
import { ArrowRight, Facebook, Instagram, Linkedin, Mail, Phone } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";

const quickLinks = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/portfolio" },
  { label: "Process", href: "/process" },
  { label: "Pricing", href: "/pricing" },
  { label: "Contact", href: "/contact" }
] as const;

export function MarketingFooter({
  brandName,
  email,
  phone,
  facebookUrl,
  instagramUrl,
  linkedinUrl
}: {
  brandName: string;
  email?: string | null;
  phone?: string | null;
  facebookUrl?: string | null;
  instagramUrl?: string | null;
  linkedinUrl?: string | null;
}) {
  const year = new Date().getFullYear();

  const socialLinks = [
    facebookUrl ? { href: facebookUrl, label: "Facebook", icon: Facebook } : null,
    instagramUrl ? { href: instagramUrl, label: "Instagram", icon: Instagram } : null,
    linkedinUrl ? { href: linkedinUrl, label: "LinkedIn", icon: Linkedin } : null
  ].filter(Boolean) as Array<{ href: string; label: string; icon: typeof Facebook }>;

  return (
    <footer className="relative border-t border-white/10 bg-slate-950/70">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/45 to-transparent" />

      <div className="container-xl grid gap-10 py-14 md:grid-cols-[1.4fr,1fr,1fr]">
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <BrandLogo alt={brandName} width={120} height={44} imageClassName="h-10 w-auto" />
            <div>
              <p className="font-display text-xl font-bold text-white">{brandName}</p>
              <p className="text-xs uppercase tracking-[0.2em] text-blue-200">Web Growth Studio</p>
            </div>
          </div>

          <p className="max-w-xl text-sm text-slate-300">
            Premium websites and growth-focused digital systems for Philippine businesses that want consistent, qualified inquiries.
          </p>

          <Link
            href="/contact?package=startup"
            className="inline-flex items-center gap-2 text-sm font-medium text-cyan-200 transition hover:text-white"
          >
            Book Free Consultation <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-200">Quick Links</h3>
          <ul className="space-y-2 text-sm text-slate-300">
            {quickLinks.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center gap-2 transition hover:text-white">
                  <span className="h-1 w-1 rounded-full bg-blue-200/70" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Contact</h3>

          {email ? (
            <Link href={`mailto:${email}`} className="flex min-h-11 items-center gap-2 text-sm text-slate-300 transition hover:text-white">
              <Mail className="h-4 w-4 text-blue-200" />
              {email}
            </Link>
          ) : null}

          {phone ? (
            <Link href={`tel:${phone.replace(/\s+/g, "")}`} className="flex min-h-11 items-center gap-2 text-sm text-slate-300 transition hover:text-white">
              <Phone className="h-4 w-4 text-blue-200" />
              {phone}
            </Link>
          ) : null}

          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap gap-2 pt-1">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-slate-200 transition hover:border-cyan-300/55 hover:bg-cyan-400/10 hover:text-white"
                >
                  <item.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-slate-400">
        Copyright {year} {brandName}. All rights reserved.
      </div>
    </footer>
  );
}
