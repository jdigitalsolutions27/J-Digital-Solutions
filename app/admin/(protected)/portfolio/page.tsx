import Link from "next/link";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { PortfolioMediaPicker } from "@/components/admin/portfolio-media-picker";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  deletePortfolioAction,
  deleteProjectCategoryAction,
  savePortfolioAction,
  saveProjectCategoryAction,
  uploadMediaAction
} from "@/lib/actions/admin";
import { db } from "@/lib/db";

const PAGE_SIZE = 8;

export default async function AdminPortfolioPage({
  searchParams
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const editId = typeof searchParams?.edit === "string" ? searchParams.edit : "";
  const page = Number(typeof searchParams?.page === "string" ? searchParams.page : "1") || 1;

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { industry: { contains: q, mode: "insensitive" as const } }
        ]
      }
    : {};

  // Use a single transaction to avoid bursting Supabase session pooler connections during pagination/back navigation.
  const [items, total, mediaItems, categories, editingProject] = editId
    ? await db.$transaction([
        db.portfolioProject.findMany({
          where,
          orderBy: [{ position: "asc" }, { createdAt: "desc" }],
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
        }),
        db.portfolioProject.count({ where }),
        db.mediaAsset.findMany({
          orderBy: { createdAt: "desc" },
          take: 60,
          select: {
            id: true,
            fileName: true,
            url: true
          }
        }),
        db.projectCategory.findMany({
          orderBy: [{ position: "asc" }, { createdAt: "asc" }]
        }),
        db.portfolioProject.findUnique({ where: { id: editId } })
      ])
    : await db.$transaction([
        db.portfolioProject.findMany({
          where,
          orderBy: [{ position: "asc" }, { createdAt: "desc" }],
          skip: (page - 1) * PAGE_SIZE,
          take: PAGE_SIZE
        }),
        db.portfolioProject.count({ where }),
        db.mediaAsset.findMany({
          orderBy: { createdAt: "desc" },
          take: 60,
          select: {
            id: true,
            fileName: true,
            url: true
          }
        }),
        db.projectCategory.findMany({
          orderBy: [{ position: "asc" }, { createdAt: "asc" }]
        }),
        // Keep return shape consistent with the edit case.
        db.portfolioProject.findUnique({ where: { id: "__none__" } })
      ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const activeCategoryNames = categories.filter((item) => item.isActive).map((item) => item.name);
  const fallbackCategories = ["Construction", "E-commerce", "Consulting", "Healthcare", "Real Estate"];
  const industryOptions = Array.from(
    new Set([...(activeCategoryNames.length > 0 ? activeCategoryNames : fallbackCategories), editingProject?.industry || ""])
  ).filter(Boolean);
  const selectedIndustry = editingProject?.industry || industryOptions[0] || "Construction";
  const backToListHref = `/admin/portfolio?q=${encodeURIComponent(q)}&page=${page}`;
  const submitLabel = editingProject ? "Update Project" : "Add Project";
  const formTitle = editingProject ? `Edit Project: ${editingProject.title}` : "Create Project";

  return (
    <div>
      <AdminPageHeader title="Projects" description="Manage project cards, tags, images, and status." />

      <div className="grid gap-4 rounded-xl border border-white/10 p-4">
        <h2 className="font-semibold text-white">Project Categories</h2>
        <p className="text-sm text-slate-300">Add categories here and they will appear in the Industry dropdown when adding/editing a project.</p>

        <ActionForm action={saveProjectCategoryAction} submitLabel="Add Category" resetOnSuccess className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2"><Label htmlFor="categoryName">Category Name</Label><Input id="categoryName" name="name" required /></div>
            <div className="space-y-2"><Label htmlFor="categorySlug">Slug (optional)</Label><Input id="categorySlug" name="slug" placeholder="auto-generated from name" /></div>
            <div className="space-y-2"><Label htmlFor="categoryPosition">Position</Label><Input id="categoryPosition" name="position" type="number" min={0} defaultValue={categories.length} required /></div>
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-200"><input type="checkbox" name="isActive" defaultChecked className="h-4 w-4" /> Active category</label>
        </ActionForm>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.slug}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>{item.isActive ? "Active" : "Hidden"}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton
                      action={saveProjectCategoryAction}
                      label={item.isActive ? "Hide" : "Show"}
                      pendingLabel="Updating..."
                      payload={{
                        id: item.id,
                        name: item.name,
                        slug: item.slug,
                        position: String(item.position),
                        isActive: item.isActive ? "" : "on"
                      }}
                    />
                    <ActionButton
                      action={deleteProjectCategoryAction}
                      label="Delete"
                      pendingLabel="Deleting..."
                      variant="destructive"
                      payload={{ id: item.id }}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ActionForm action={savePortfolioAction} submitLabel={submitLabel} resetOnSuccess={!editingProject} className="mt-8 grid gap-4 rounded-xl border border-white/10 p-4">
        <h2 className="font-semibold text-white">{formTitle}</h2>
        {editingProject ? <Input type="hidden" name="id" value={editingProject.id} readOnly /> : null}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="title">Title</Label><Input id="title" name="title" defaultValue={editingProject?.title || ""} required /></div>
          <div className="space-y-2"><Label htmlFor="slug">Slug (optional)</Label><Input id="slug" name="slug" defaultValue={editingProject?.slug || ""} placeholder="auto-generated from title" /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Select id="industry" name="industry" defaultValue={selectedIndustry}>
              {industryOptions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-2"><Label htmlFor="status">Status</Label><Select id="status" name="status" defaultValue={editingProject?.status || "DEMO"}><option value="DEMO">DEMO</option><option value="CLIENT">CLIENT</option></Select></div>
        </div>
        <div className="space-y-2"><Label htmlFor="shortSummary">Short Summary (optional)</Label><Textarea id="shortSummary" name="shortSummary" defaultValue={editingProject?.shortSummary || ""} rows={2} placeholder="Optional. You can leave this blank for screenshot-based entries." /></div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="tags">Tags (optional, new line)</Label><Textarea id="tags" name="tags" defaultValue={editingProject?.tags.join("\n") || ""} rows={3} placeholder="E-commerce&#10;Retail" /></div>
          <div className="space-y-2"><Label htmlFor="servicesProvided">Services Provided (optional, new line)</Label><Textarea id="servicesProvided" name="servicesProvided" defaultValue={editingProject?.servicesProvided.join("\n") || ""} rows={3} placeholder="Website Design&#10;Development" /></div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="coverImage">Cover Image URL</Label><Input id="coverImage" name="coverImage" defaultValue={editingProject?.coverImage || ""} required placeholder="/placeholders/project-1.svg" /></div>
        </div>

        <PortfolioMediaPicker mediaItems={mediaItems} uploadAction={uploadMediaAction} />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2"><Label htmlFor="liveLink">Live Link (optional)</Label><Input id="liveLink" name="liveLink" defaultValue={editingProject?.liveLink || ""} /></div>
          <div className="space-y-2"><Label htmlFor="position">Position</Label><Input id="position" name="position" type="number" defaultValue={editingProject?.position ?? 0} min={0} required /></div>
        </div>
        {editingProject ? (
          <div>
            <Button asChild type="button" variant="outline">
              <Link href={backToListHref}>Cancel Editing</Link>
            </Button>
          </div>
        ) : null}
      </ActionForm>

      <div className="mt-8">
        <form className="mb-4 flex gap-3" method="get">
          <Input name="q" defaultValue={q} placeholder="Search projects..." />
          <button className="rounded-lg border border-white/15 px-4 py-2 text-sm">Search</button>
        </form>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.industry}</TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>{item.position}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/admin/portfolio?edit=${item.id}&q=${encodeURIComponent(q)}&page=${page}`}>Edit</Link>
                    </Button>
                    <ActionButton
                      action={savePortfolioAction}
                      label="Toggle Status"
                      pendingLabel="Updating..."
                      payload={{
                        id: item.id,
                        title: item.title,
                        slug: item.slug,
                        industry: item.industry,
                        shortSummary: item.shortSummary,
                        tags: item.tags.join("\n"),
                        coverImage: item.coverImage,
                        servicesProvided: item.servicesProvided.join("\n"),
                        liveLink: item.liveLink || "",
                        status: item.status === "DEMO" ? "CLIENT" : "DEMO",
                        position: String(item.position)
                      }}
                    />
                    <ActionButton action={deletePortfolioAction} label="Delete" pendingLabel="Deleting..." variant="destructive" payload={{ id: item.id }} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {items.length === 0 ? <p className="mt-4 text-sm text-slate-300">No projects found.</p> : null}

        <div className="mt-4 flex items-center justify-between text-sm text-slate-300">
          <p>Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/portfolio?q=${encodeURIComponent(q)}&page=${Math.max(1, page - 1)}`}>Previous</Link>
            <Link className="rounded border border-white/15 px-3 py-1" href={`/admin/portfolio?q=${encodeURIComponent(q)}&page=${Math.min(totalPages, page + 1)}`}>Next</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
