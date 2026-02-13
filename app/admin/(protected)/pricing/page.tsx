import Link from "next/link";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deletePricingAction, savePricingAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";
import { peso } from "@/lib/utils";

const PAGE_SIZE = 8;

export default async function AdminPricingPage({
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
          { slug: { contains: q, mode: "insensitive" as const } }
        ]
      }
    : {};

  const [items, total] = await db.$transaction([
    db.pricingPackage.findMany({
      where,
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE
    }),
    db.pricingPackage.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="Pricing" description="Manage pricing packages and homepage highlight status." />

      <ActionForm action={savePricingAction} submitLabel="Add Package" resetOnSuccess className="grid gap-4 rounded-xl border border-white/10 p-4">
        <h2 className="font-semibold text-white">Create Pricing Package</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2"><Label htmlFor="name">Name</Label><Input id="name" name="name" required /></div>
          <div className="space-y-2"><Label htmlFor="slug">Slug</Label><Input id="slug" name="slug" required /></div>
          <div className="space-y-2"><Label htmlFor="price">Price</Label><Input id="price" name="price" type="number" min={0} required /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="delivery">Delivery</Label><Input id="delivery" name="delivery" required placeholder="7-10 Days" /></div>
          <div className="space-y-2"><Label htmlFor="position">Position</Label><Input id="position" name="position" type="number" min={0} defaultValue={0} required /></div>
        </div>
        <div className="space-y-2"><Label htmlFor="includes">Includes (new line)</Label><Textarea id="includes" name="includes" required rows={5} /></div>
        <div className="space-y-2"><Label htmlFor="freebies">Freebies (new line)</Label><Textarea id="freebies" name="freebies" required rows={3} /></div>
        <div className="space-y-2"><Label htmlFor="note">Note (optional)</Label><Textarea id="note" name="note" rows={2} /></div>
        <label className="flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" name="isPopular" className="h-4 w-4" /> Mark as Most Popular</label>
      </ActionForm>

      <div className="mt-8">
        <form className="mb-4 flex gap-3" method="get">
          <Input name="q" defaultValue={q} placeholder="Search packages..." />
          <button className="rounded-lg border border-white/15 px-4 py-2 text-sm">Search</button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Package</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Delivery</TableHead>
              <TableHead>Popular</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{peso(item.price)}</TableCell>
                <TableCell>{item.delivery}</TableCell>
                <TableCell>{item.isPopular ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ActionButton
                      action={savePricingAction}
                      label={item.isPopular ? "Unset Popular" : "Set Popular"}
                      pendingLabel="Updating..."
                      payload={{
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        price: String(item.price),
                        delivery: item.delivery,
                        includes: item.includes.join("\n"),
                        freebies: item.freebies.join("\n"),
                        note: item.note || "",
                        isPopular: item.isPopular ? "" : "on",
                        position: String(item.position)
                      }}
                    />
                    <ActionButton action={deletePricingAction} label="Delete" pendingLabel="Deleting..." variant="destructive" payload={{ id: item.id }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 ? <p className="mt-4 text-sm text-slate-300">No packages found.</p> : null}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <p>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/pricing?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`}>Previous</Link>
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/pricing?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`}>Next</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
