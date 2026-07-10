"use client";

import {
  deleteAcademyProgramAction,
  saveAcademyProgramAction,
} from "@/app/admin/actions";
import { BrandCard } from "@/components/design-system";
import { DataTable } from "@/components/design-system/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatUGX } from "@/lib/booking/pricing";
import type { AcademyProgram } from "@/types/admin";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

type AcademyManagerProps = {
  programs: AcademyProgram[];
};

export function AcademyManager({ programs: initial }: AcademyManagerProps) {
  const [programs, setPrograms] = useState(initial);
  const [draft, setDraft] = useState<Partial<AcademyProgram>>({
    title: "",
    description: "",
    age_group: "",
    schedule: "",
    price_ugx: null,
    is_active: true,
  });
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (!draft.title) return;
    startTransition(async () => {
      const title = draft.title!;
      const id = draft.id ?? crypto.randomUUID();
      await saveAcademyProgramAction({ ...draft, id, title });
      const item: AcademyProgram = {
        id,
        title: draft.title!,
        description: draft.description ?? null,
        age_group: draft.age_group ?? null,
        schedule: draft.schedule ?? null,
        price_ugx: draft.price_ugx ?? null,
        is_active: draft.is_active ?? true,
        sort_order: draft.sort_order ?? 0,
        created_at: new Date().toISOString(),
      };
      setPrograms((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = item;
          return next;
        }
        return [item, ...prev];
      });
      setDraft({ title: "", description: "", age_group: "", schedule: "", is_active: true });
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deleteAcademyProgramAction(id);
      setPrograms((prev) => prev.filter((p) => p.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <BrandCard title="Add program">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Program title</Label>
            <Input
              value={draft.title ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Youth Development U12"
            />
          </div>
          <div className="space-y-2">
            <Label>Age group</Label>
            <Input
              value={draft.age_group ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, age_group: e.target.value }))}
              placeholder="8–12 years"
            />
          </div>
          <div className="space-y-2">
            <Label>Schedule</Label>
            <Input
              value={draft.schedule ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, schedule: e.target.value }))}
              placeholder="Sat & Sun, 9–11 AM"
            />
          </div>
          <div className="space-y-2">
            <Label>Price (UGX)</Label>
            <Input
              type="number"
              value={draft.price_ugx ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  price_ugx: e.target.value ? parseInt(e.target.value, 10) : null,
                }))
              }
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={draft.description ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              rows={3}
            />
          </div>
        </div>
        <Button className="mt-4" onClick={save} disabled={pending}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Add program
        </Button>
      </BrandCard>

      <BrandCard title={`${programs.length} programs`}>
        <DataTable
          data={programs}
          emptyMessage="No academy programs yet."
          columns={[
            { key: "title", header: "Program", cell: (p) => p.title },
            { key: "age", header: "Age", cell: (p) => p.age_group ?? "—" },
            { key: "schedule", header: "Schedule", cell: (p) => p.schedule ?? "—" },
            {
              key: "price",
              header: "Price",
              cell: (p) => (p.price_ugx ? formatUGX(p.price_ugx) : "—"),
            },
            {
              key: "status",
              header: "Status",
              cell: (p) => (
                <Badge variant={p.is_active ? "default" : "secondary"}>
                  {p.is_active ? "Active" : "Inactive"}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "",
              cell: (p) => (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(p.id)}
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
