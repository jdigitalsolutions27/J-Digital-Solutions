import Link from "next/link";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteProcessStepAction, saveProcessStepAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";

const PAGE_SIZE = 8;

export default async function AdminProcessPage({
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
          { timeline: { contains: q, mode: "insensitive" as const } }
        ]
      }
    : {};

  const [items, total] = await Promise.all([
    db.processStep.findMany({ where, orderBy: [{ position: "asc" }, { createdAt: "desc" }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.processStep.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="Process" description="Manage J-Digital Growth Framework steps and deliverables." />

      <ActionForm action={saveProcessStepAction} submitLabel="Add Process Step" resetOnSuccess className="grid gap-4 rounded-xl border border-white/10 p-4">
        <h2 className="font-semibold text-white">Create Process Step</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" required /></div>
          <div className="space-y-2"><Label htmlFor="timeline">Timeline</Label><Input id="timeline" name="timeline" required placeholder="Day 1-2" /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" required rows={3} /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="deliverables">Deliverables (new line)</Label><Textarea id="deliverables" name="deliverables" required rows={4} /></div>
          <div className="space-y-2"><Label htmlFor="position">Position</Label><Input id="position" name="position" type="number" defaultValue={0} min={0} required /></div>
        </div>
      </ActionForm>

      <div className="mt-8">
        <form className="mb-4 flex gap-3" method="get">
          <Input name="q" defaultValue={q} placeholder="Search steps..." />
          <button className="rounded-lg border border-white/15 px-4 py-2 text-sm">Search</button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Timeline</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.timeline}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ActionButton
                      action={saveProcessStepAction}
                      label="Re-save"
                      pendingLabel="Updating..."
                      payload={{
                        id: item.id,
                        title: item.title,
                        description: item.description,
                        deliverables: item.deliverables.join("\n"),
                        timeline: item.timeline,
                        position: String(item.position)
                      }}
                    />
                    <ActionButton action={deleteProcessStepAction} label="Delete" pendingLabel="Deleting..." variant="destructive" payload={{ id: item.id }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 ? <p className="mt-4 text-sm text-slate-300">No steps found.</p> : null}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <p>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/process?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`}>Previous</Link>
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/process?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`}>Next</Link>
          </div>
        </div>
      </div>
    </div>
  );
}