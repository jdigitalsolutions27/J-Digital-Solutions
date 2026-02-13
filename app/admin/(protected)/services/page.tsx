import Link from "next/link";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteServiceAction, saveServiceAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";

const PAGE_SIZE = 8;

export default async function AdminServicesPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const page = Number(typeof searchParams?.page === "string" ? searchParams.page : "1") || 1;

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } }
        ]
      }
    : {};

  const [items, total] = await db.$transaction([
    db.service.findMany({
      where,
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    db.service.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="Services" description="Create and manage service cards shown on the public website." />

      <ActionForm action={saveServiceAction} submitLabel="Add Service" resetOnSuccess className="grid gap-4 rounded-xl border border-white/10 p-4">
        <h2 className="font-semibold text-white">Create Service</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
          <div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" required /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="shortDescription">Short Description</Label><Input id="shortDescription" name="shortDescription" required /></div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" required rows={3} /></div>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="iconKey">Icon Key</Label><Input id="iconKey" name="iconKey" placeholder="Monitor" /></div>
          <div className="space-y-2"><Label htmlFor="position">Position</Label><Input id="position" name="position" type="number" min={0} defaultValue={0} required /></div>
          <label className="mt-7 flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" name="isActive" defaultChecked className="h-4 w-4" /> Active</label>
        </div>
      </ActionForm>

      <div className="mt-8">
        <form className="mb-4 flex gap-3" method="get">
          <Input name="q" defaultValue={q} placeholder="Search services..." />
          <button className="rounded-lg border border-white/15 px-4 py-2 text-sm">Search</button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.slug}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.isActive ? "Active" : "Hidden"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton action={saveServiceAction} label="Quick Hide" pendingLabel="Updating..." payload={{ id: item.id, title: item.title, slug: item.slug, shortDescription: item.shortDescription, description: item.description, iconKey: item.iconKey || "", position: String(item.position), isActive: String(!item.isActive ? "on" : "") }} />
                    <ActionButton action={deleteServiceAction} label="Delete" pendingLabel="Deleting..." variant="destructive" payload={{ id: item.id }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 ? <p className="mt-4 text-sm text-slate-300">No services found.</p> : null}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <p>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Link
              className="rounded border border-white/15 px-3 py-1 disabled:opacity-50"
              href={`/admin/services?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`}
            >
              Previous
            </Link>
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/services?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`}>
              Next
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
