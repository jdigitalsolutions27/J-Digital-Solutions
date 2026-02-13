import Link from "next/link";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteTestimonialAction, saveTestimonialAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";
import { getSiteSettings } from "@/lib/site-data";

const PAGE_SIZE = 8;

export default async function AdminTestimonialsPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const page = Number(typeof searchParams?.page === "string" ? searchParams.page : "1") || 1;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { company: { contains: q, mode: "insensitive" as const } }
        ]
      }
    : {};

  const settings = await getSiteSettings();
  const [items, total] = await db.$transaction([
    db.testimonial.findMany({
      where,
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    db.testimonial.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="Testimonials" description="Manage social proof cards used on the public About/Home sections." />

      {!settings.testimonialsEnabled ? (
        <div className="mb-4 rounded-lg border border-amber-300/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          Testimonials are currently hidden on the public site. Enable them in Site Settings.
        </div>
      ) : null}

      <ActionForm action={saveTestimonialAction} submitLabel="Add Testimonial" resetOnSuccess className="grid gap-4 rounded-xl border border-white/10 p-4">
        <h2 className="font-semibold text-white">Create Testimonial</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div>
          <div className="space-y-2"><Label htmlFor="role">Role</Label><Input id="role" name="role" required /></div>
          <div className="space-y-2"><Label htmlFor="company">Company</Label><Input id="company" name="company" required /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="quote">Quote</Label><Textarea id="quote" name="quote" rows={4} required /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="avatarUrl">Avatar URL (optional)</Label><Input id="avatarUrl" name="avatarUrl" /></div>
          <div className="space-y-2"><Label htmlFor="position">Position</Label><Input id="position" name="position" type="number" min={0} defaultValue={0} required /></div>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" name="isPublished" defaultChecked className="h-4 w-4" /> Published</label>
      </ActionForm>

      <div className="mt-8">
        <form className="mb-4 flex gap-3" method="get">
          <Input name="q" defaultValue={q} placeholder="Search testimonials..." />
          <button className="rounded-lg border border-white/15 px-4 py-2 text-sm">Search</button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.company}</TableCell>
                <TableCell>{item.isPublished ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ActionButton
                      action={saveTestimonialAction}
                      label={item.isPublished ? "Unpublish" : "Publish"}
                      payload={{
                        id: item.id,
                        name: item.name,
                        role: item.role,
                        company: item.company,
                        quote: item.quote,
                        avatarUrl: item.avatarUrl || "",
                        position: String(item.position),
                        isPublished: item.isPublished ? "" : "on"
                      }}
                    />
                    <ActionButton action={deleteTestimonialAction} label="Delete" variant="destructive" payload={{ id: item.id }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 ? <p className="mt-4 text-sm text-slate-300">No testimonials found.</p> : null}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <p>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/testimonials?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`}>Previous</Link>
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/testimonials?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`}>Next</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
