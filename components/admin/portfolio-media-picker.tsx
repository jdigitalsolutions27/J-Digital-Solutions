"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

type UploadResult = {
  error?: string;
  success?: string;
  url?: string;
};

type MediaItem = {
  id: string;
  fileName: string;
  url: string;
};

export function PortfolioMediaPicker({
  mediaItems,
  uploadAction
}: {
  mediaItems: MediaItem[];
  uploadAction: (formData: FormData) => Promise<UploadResult>;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const [selectedExtraId, setSelectedExtraId] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return mediaItems;
    return mediaItems.filter((item) => item.fileName.toLowerCase().includes(q) || item.url.toLowerCase().includes(q));
  }, [mediaItems, search]);

  const featuredItems = useMemo(() => filteredItems.slice(0, 3), [filteredItems]);
  const remainingItems = useMemo(() => filteredItems.slice(3), [filteredItems]);
  const selectedExtraItem = useMemo(
    () => remainingItems.find((item) => item.id === selectedExtraId) || null,
    [remainingItems, selectedExtraId]
  );

  useEffect(() => {
    if (!selectedExtraId) return;
    if (!remainingItems.some((item) => item.id === selectedExtraId)) {
      setSelectedExtraId("");
    }
  }, [remainingItems, selectedExtraId]);

  const setCoverImage = (url: string) => {
    const field = document.getElementById("coverImage") as HTMLInputElement | null;
    if (!field) {
      toast.error("Cover image field was not found.");
      return;
    }
    field.value = url;
    field.focus();
    toast.success("Cover image URL applied.");
  };

  const handleUpload = () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Please choose a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      const result = await uploadAction(formData);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (result.url) {
        setLastUploadedUrl(result.url);
      }

      toast.success(result.success || "Image uploaded.");
      router.refresh();
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-4">
      <div>
        <p className="text-sm font-semibold text-white">Project Image Helper</p>
        <p className="mt-1 text-xs text-slate-300">Upload here or pick from Media Library, then apply as cover image in one click.</p>
      </div>

      <div className="grid gap-3 rounded-lg border border-white/10 bg-slate-950/35 p-3 md:grid-cols-[1fr,auto] md:items-end">
        <div className="space-y-2">
          <Label htmlFor="portfolioUploadFile">Upload Image</Label>
          <Input id="portfolioUploadFile" ref={fileInputRef} type="file" accept="image/*" />
        </div>
        <Button type="button" onClick={handleUpload} disabled={pending}>
          {pending ? "Uploading..." : "Upload to Media"}
        </Button>
      </div>

      {lastUploadedUrl ? (
        <div className="rounded-lg border border-cyan-300/35 bg-cyan-500/10 p-3">
          <p className="text-xs text-cyan-100">Latest upload ready:</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button type="button" size="sm" onClick={() => setCoverImage(lastUploadedUrl)}>
              Use Latest as Cover
            </Button>
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="portfolioMediaSearch">Search Media Library</Label>
        <Input
          id="portfolioMediaSearch"
          placeholder="Search by filename..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {featuredItems.map((item) => (
          <div key={item.id} className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
            <div className="relative mb-2 h-28 overflow-hidden rounded-md border border-white/10">
              <Image src={item.url} alt={item.fileName} fill className="object-cover" />
            </div>
            <p className="truncate text-xs text-slate-200" title={item.fileName}>
              {item.fileName}
            </p>
            <div className="mt-2">
              <Button type="button" size="sm" className="w-full" onClick={() => setCoverImage(item.url)}>
                Use as Cover
              </Button>
            </div>
          </div>
        ))}
      </div>

      {remainingItems.length > 0 ? (
        <div className="space-y-3 rounded-lg border border-white/10 bg-slate-950/25 p-3">
          <div className="space-y-2">
            <Label htmlFor="portfolioExtraMedia">More Uploaded Images</Label>
            <Select id="portfolioExtraMedia" value={selectedExtraId} onChange={(event) => setSelectedExtraId(event.target.value)}>
              <option value="">Select an image...</option>
              {remainingItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.fileName}
                </option>
              ))}
            </Select>
          </div>

          {selectedExtraItem ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-2">
              <div className="relative mb-2 h-28 overflow-hidden rounded-md border border-white/10">
                <Image src={selectedExtraItem.url} alt={selectedExtraItem.fileName} fill className="object-cover" />
              </div>
              <p className="truncate text-xs text-slate-200" title={selectedExtraItem.fileName}>
                {selectedExtraItem.fileName}
              </p>
              <div className="mt-2">
                <Button type="button" size="sm" className="w-full" onClick={() => setCoverImage(selectedExtraItem.url)}>
                  Use as Cover
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {filteredItems.length === 0 ? <p className="text-xs text-slate-300">No media found for your search.</p> : null}
      {filteredItems.length > 3 ? (
        <p className="text-xs text-slate-300">
          Showing 3 images on the grid. Use the dropdown to access other uploaded images.
        </p>
      ) : null}
    </div>
  );
}
