import Link from "next/link";
import { format } from "date-fns";

import { ActionButton } from "@/components/admin/action-button";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { saveLeadStatusAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";

const PAGE_SIZE = 12;
const statuses = ["NEW", "CONTACTED", "QUALIFIED", "CLOSED", "LOST"] as const;

export default async function AdminLeadsPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const status = typeof searchParams?.status === "string" ? searchParams.status : "";
  const page = Number(typeof searchParams?.page === "string" ? searchParams.page : "1") || 1;

  const where = {
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { businessName: { contains: q, mode: "insensitive" as const } }
          ]
        }
      : {}),
    ...(status ? { status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "CLOSED" | "LOST" } : {})
  };

  const [items, total] = await Promise.all([
    db.lead.findMany({ where, orderBy: { createdAt: "desc" }, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.lead.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="Leads" description="View inquiries, update lead status, and export contact data." />

      <form className="mb-4 grid gap-3 sm:grid-cols-3" method="get">
        <Input name="q" defaultValue={q} placeholder="Search name, email, business" />
        <Select name="status" defaultValue={status}>
          <option value="">All statuses</option>
          {statuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <button className="rounded-lg border border-white/15 px-4 py-2 text-sm">Apply Filters</button>
      </form>

      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-slate-300">Total leads: {total}</p>
        <Link href="/admin/leads/export" className="rounded-lg border border-white/15 px-3 py-2 text-sm text-slate-100 hover:bg-white/10">
          Export CSV
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lead</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Business</TableHead>
            <TableHead>Package</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((lead) => (
            <TableRow key={lead.id}>
              <TableCell>
                <div>
                  <p className="font-semibold text-white">{lead.fullName}</p>
                  <p className="text-xs text-slate-300">{lead.email} · {lead.mobileNumber}</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-xs uppercase tracking-wide text-blue-200">{lead.leadType}</p>
                {lead.websiteOrFacebookLink ? (
                  <a
                    href={lead.websiteOrFacebookLink}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block max-w-[220px] truncate text-xs text-blue-100 underline underline-offset-2"
                  >
                    Source Link
                  </a>
                ) : null}
              </TableCell>
              <TableCell>
                <p>{lead.businessName}</p>
                <p className="text-xs text-slate-300">{lead.industry}</p>
              </TableCell>
              <TableCell>
                <p>{lead.packageInterest}</p>
                <p className="text-xs text-slate-300">{lead.budgetRange}</p>
                <p className="mt-1 text-xs text-blue-200">
                  {lead.preferredContactMethod}: {lead.preferredContactValue || "N/A"}
                </p>
              </TableCell>
              <TableCell>{lead.status}</TableCell>
              <TableCell>{format(lead.createdAt, "MMM d, yyyy")}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-2">
                  {statuses.map((item) => (
                    <ActionButton key={item} action={saveLeadStatusAction} label={item} size="sm" variant={lead.status === item ? "default" : "outline"} payload={{ id: lead.id, status: item }} />
                  ))}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {items.length === 0 ? <p className="mt-4 text-sm text-slate-300">No leads found for current filters.</p> : null}

      <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
        <p>Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/leads?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${Math.max(1, page - 1)}`}>Previous</Link>
          <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/leads?q=${encodeURIComponent(q)}&status=${encodeURIComponent(status)}&page=${Math.min(totalPages, page + 1)}`}>Next</Link>
        </div>
      </div>
    </div>
  );
}
