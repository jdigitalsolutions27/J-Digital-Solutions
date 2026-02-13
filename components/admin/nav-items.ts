import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  CircleHelp,
  FolderKanban,
  Image,
  LayoutDashboard,
  Mail,
  MessageSquareQuote,
  PhilippinePeso,
  Settings,
  Users,
  Workflow
} from "lucide-react";

export type AdminNavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/site", label: "Site Settings", icon: Settings },
  { href: "/admin/services", label: "Services", icon: BriefcaseBusiness },
  { href: "/admin/portfolio", label: "Projects", icon: FolderKanban },
  { href: "/admin/process", label: "Process", icon: Workflow },
  { href: "/admin/pricing", label: "Pricing", icon: PhilippinePeso },
  { href: "/admin/leads", label: "Leads", icon: Mail },
  { href: "/admin/faq", label: "FAQ", icon: CircleHelp },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/users", label: "Users", icon: Users }
];

export const adminRouteLabels = Object.fromEntries(
  adminNavItems.map((item) => [item.href, item.label])
) as Record<string, string>;

export function isAdminNavItemActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminCurrentPageLabel(pathname: string) {
  const sortedRoutes = Object.keys(adminRouteLabels).sort((a, b) => b.length - a.length);
  const match = sortedRoutes.find((route) => pathname === route || pathname.startsWith(`${route}/`));
  return match ? adminRouteLabels[match] : "Dashboard";
}
