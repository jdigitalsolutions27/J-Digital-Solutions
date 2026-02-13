import Image from "next/image";

import { ActionButton } from "@/components/admin/action-button";
import { ActionForm } from "@/components/admin/action-form";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteMediaAction, uploadMediaAction } from "@/lib/actions/admin";
import { db } from "@/lib/db";
import { getMissingSupabaseStorageEnvVars } from "@/lib/supabase";

export default async function AdminMediaPage() {
  const media = await db.mediaAsset.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  const missingSupabaseVars = getMissingSupabaseStorageEnvVars();
  const isUploadConfigured = missingSupabaseVars.length === 0;

  return (
    <div>
      <AdminPageHeader title="Media Manager" description="Upload and manage images via Supabase Storage." />

      {isUploadConfigured ? (
        <ActionForm action={uploadMediaAction} submitLabel="Upload File" resetOnSuccess className="rounded-xl border border-white/10 p-4">
          <div className="space-y-2">
            <Label htmlFor="file">Image File</Label>
            <Input id="file" name="file" type="file" accept="image/*" required />
          </div>
        </ActionForm>
      ) : (
        <div className="rounded-xl border border-amber-300/30 bg-amber-400/10 p-4">
          <p className="text-sm font-semibold text-amber-100">Supabase storage is not configured.</p>
          <p className="mt-2 text-sm text-amber-50">
            Missing env vars: <span className="font-mono">{missingSupabaseVars.join(", ")}</span>
          </p>
          <p className="mt-2 text-sm text-amber-50">Add them in <span className="font-mono">.env.local</span> and restart <span className="font-mono">npm run dev</span>.</p>
        </div>
      )}

      <div className="mt-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Preview</TableHead>
              <TableHead>File</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {media.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="relative h-14 w-20 overflow-hidden rounded-md border border-white/10">
                    <Image src={item.url} alt={item.fileName} fill className="object-cover" />
                  </div>
                </TableCell>
                <TableCell>{item.fileName}</TableCell>
                <TableCell>
                  <a href={item.url} target="_blank" className="max-w-[240px] truncate text-blue-200 underline underline-offset-2">
                    {item.url}
                  </a>
                </TableCell>
                <TableCell>{item.size ? `${Math.round(item.size / 1024)} KB` : "-"}</TableCell>
                <TableCell>
                  <ActionButton action={deleteMediaAction} label="Delete" variant="destructive" payload={{ id: item.id }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {media.length === 0 ? <p className="mt-4 text-sm text-slate-300">No uploaded media yet.</p> : null}
      </div>
    </div>
  );
}
