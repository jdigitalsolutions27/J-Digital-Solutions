import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/lib/db";

export default async function AdminDashboardPage() {
  const [services, projects, leads, pricing, latestLeads] = await db.$transaction([
    db.service.count(),
    db.portfolioProject.count(),
    db.lead.count(),
    db.pricingPackage.count(),
    db.lead.findMany({ orderBy: { createdAt: "desc" }, take: 6 })
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your marketing site content and incoming consultation leads."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-5"><p className="text-xs text-slate-300">Services</p><p className="mt-2 text-3xl font-bold">{services}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-300">Projects</p><p className="mt-2 text-3xl font-bold">{projects}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-300">Pricing Packages</p><p className="mt-2 text-3xl font-bold">{pricing}</p></CardContent></Card>
        <Card><CardContent className="p-5"><p className="text-xs text-slate-300">Total Leads</p><p className="mt-2 text-3xl font-bold">{leads}</p></CardContent></Card>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Recent Leads</h2>
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/leads">View All Leads</Link>
          </Button>
        </div>
        <div className="grid gap-4">
          {latestLeads.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-sm text-slate-300">No leads yet. Public inquiries will appear here.</CardContent>
            </Card>
          ) : (
            latestLeads.map((lead) => (
              <Card key={lead.id}>
                <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-semibold text-white">{lead.fullName}</p>
                    <p className="text-sm text-slate-300">{lead.businessName} | {lead.packageInterest}</p>
                    <p className="text-xs text-slate-400">{lead.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-wide text-blue-200">{lead.leadType}</p>
                    <Badge variant={lead.status === "NEW" ? "default" : "secondary"}>{lead.status}</Badge>
                    <p className="mt-2 text-xs text-slate-400">{formatDistanceToNow(lead.createdAt, { addSuffix: true })}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
