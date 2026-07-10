"use client";

import {
  deleteMediaAssetAction,
  saveMediaAssetAction,
} from "@/app/admin/actions";
import { BrandCard } from "@/components/design-system";
import { DataTable } from "@/components/design-system/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { MediaAsset } from "@/types/admin";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

type MediaManagerProps = {
  assets: MediaAsset[];
};

const emptyAsset = (): Omit<MediaAsset, "created_at"> => ({
  id: crypto.randomUUID(),
  title: "",
  url: "",
  type: "image",
  category: "gallery",
  alt_text: "",
  sort_order: 0,
  is_published: true,
});

export function MediaManager({ assets: initial }: MediaManagerProps) {
  const [assets, setAssets] = useState(initial);
  const [draft, setDraft] = useState(emptyAsset());
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (!draft.title || !draft.url) return;
    startTransition(async () => {
      await saveMediaAssetAction(draft);
      setAssets((prev) => {
        const idx = prev.findIndex((a) => a.id === draft.id);
        const item = { ...draft, created_at: new Date().toISOString() };
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = item;
          return next;
        }
        return [item, ...prev];
      });
      setDraft(emptyAsset());
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deleteMediaAssetAction(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <BrandCard title="Add media asset">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Match day highlights"
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={draft.url}
              onChange={(e) => setDraft((d) => ({ ...d, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={draft.category ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, category: e.target.value }))
              }
              placeholder="gallery"
            />
          </div>
          <div className="space-y-2">
            <Label>Alt text</Label>
            <Input
              value={draft.alt_text ?? ""}
              onChange={(e) =>
                setDraft((d) => ({ ...d, alt_text: e.target.value }))
              }
            />
          </div>
        </div>
        <Button className="mt-4" onClick={save} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add asset
        </Button>
      </BrandCard>

      <BrandCard title={`${assets.length} assets`}>
        <DataTable
          data={assets}
          emptyMessage="No media assets yet."
          columns={[
            {
              key: "preview",
              header: "Preview",
              cell: (a) =>
                a.type === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={a.url}
                    alt={a.alt_text ?? a.title}
                    className="size-12 rounded-lg object-cover"
                  />
                ) : (
                  <Badge variant="outline">Video</Badge>
                ),
            },
            { key: "title", header: "Title", cell: (a) => a.title },
            { key: "category", header: "Category", cell: (a) => a.category ?? "—" },
            {
              key: "status",
              header: "Status",
              cell: (a) => (
                <Badge variant={a.is_published ? "default" : "secondary"}>
                  {a.is_published ? "Published" : "Draft"}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "",
              cell: (a) => (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(a.id)}
                  disabled={pending}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              ),
            },
          ]}
        />
      </BrandCard>
    </div>
  );
}
