import Link from "next/link";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { deleteFaqAction, saveFaqAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";

const PAGE_SIZE = 10;

export default async function AdminFaqPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const page = Number(typeof searchParams?.page === "string" ? searchParams.page : "1") || 1;

  const where = q
    ? {
        question: {
          contains: q,
          mode: "insensitive" as const
        }
      }
    : {};

  const [items, total] = await Promise.all([
    db.fAQ.findMany({ where, orderBy: [{ position: "asc" }, { createdAt: "desc" }], skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
    db.fAQ.count({ where })
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <AdminPageHeader title="FAQ" description="Manage frequently asked questions shown on key public pages." />

      <ActionForm action={saveFaqAction} submitLabel="Add FAQ" resetOnSuccess className="grid gap-4 rounded-xl border border-white/10 p-4">
        <h2 className="font-semibold text-white">Create FAQ</h2>
        <div className="space-y-2"><Label htmlFor="question">Question</Label><Input id="question" name="question" required /></div>
        <div className="space-y-2"><Label htmlFor="answer">Answer</Label><Textarea id="answer" name="answer" required rows={4} /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="position">Position</Label><Input id="position" name="position" type="number" min={0} defaultValue={0} required /></div>
          <label className="mt-7 flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" name="isPublished" defaultChecked className="h-4 w-4" /> Published</label>
        </div>
      </ActionForm>

      <div className="mt-8">
        <form className="mb-4 flex gap-3" method="get">
          <Input name="q" defaultValue={q} placeholder="Search FAQs..." />
          <button className="rounded-lg border border-white/15 px-4 py-2 text-sm">Search</button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Published</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.question}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.isPublished ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <ActionButton
                      action={saveFaqAction}
                      label={item.isPublished ? "Unpublish" : "Publish"}
                      payload={{
                        id: item.id,
                        question: item.question,
                        answer: item.answer,
                        position: String(item.position),
                        isPublished: item.isPublished ? "" : "on"
                      }}
                    />
                    <ActionButton action={deleteFaqAction} label="Delete" pendingLabel="Deleting..." variant="destructive" payload={{ id: item.id }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 ? <p className="mt-4 text-sm text-slate-300">No FAQs found.</p> : null}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <p>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/faq?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`}>Previous</Link>
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/faq?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`}>Next</Link>
          </div>
        </div>
      </div>
    </div>
  );
}