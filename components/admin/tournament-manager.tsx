"use client";

import {
  deleteTournamentAction,
  saveTournamentAction,
} from "@/app/admin/actions";
import { BrandCard } from "@/components/design-system";
import { DataTable } from "@/components/design-system/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatUGX } from "@/lib/booking/pricing";
import type { Tournament } from "@/types/admin";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";

type TournamentManagerProps = {
  tournaments: Tournament[];
};

export function TournamentManager({ tournaments: initial }: TournamentManagerProps) {
  const [tournaments, setTournaments] = useState(initial);
  const [draft, setDraft] = useState<Partial<Tournament>>({
    title: "",
    description: "",
    format: "",
    status: "upcoming",
    is_published: true,
  });
  const [pending, startTransition] = useTransition();

  const save = () => {
    if (!draft.title) return;
    startTransition(async () => {
      const title = draft.title!;
      const id = draft.id ?? crypto.randomUUID();
      await saveTournamentAction({ ...draft, id, title });
      const item: Tournament = {
        id,
        title: draft.title!,
        description: draft.description ?? null,
        start_date: draft.start_date ?? null,
        end_date: draft.end_date ?? null,
        format: draft.format ?? null,
        prize_ugx: draft.prize_ugx ?? null,
        status: draft.status ?? "upcoming",
        max_teams: draft.max_teams ?? null,
        is_published: draft.is_published ?? true,
        created_at: new Date().toISOString(),
      };
      setTournaments((prev) => {
        const idx = prev.findIndex((t) => t.id === id);
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = item;
          return next;
        }
        return [item, ...prev];
      });
      setDraft({ title: "", description: "", format: "", status: "upcoming" });
    });
  };

  const remove = (id: string) => {
    startTransition(async () => {
      await deleteTournamentAction(id);
      setTournaments((prev) => prev.filter((t) => t.id !== id));
    });
  };

  return (
    <div className="space-y-6">
      <BrandCard title="Create tournament">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label>Title</Label>
            <Input
              value={draft.title ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              placeholder="Busega Community Cup 2026"
            />
          </div>
          <div className="space-y-2">
            <Label>Start date</Label>
            <Input
              type="date"
              value={draft.start_date ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, start_date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>End date</Label>
            <Input
              type="date"
              value={draft.end_date ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, end_date: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Format</Label>
            <Input
              value={draft.format ?? ""}
              onChange={(e) => setDraft((d) => ({ ...d, format: e.target.value }))}
              placeholder="7-a-side knockout"
            />
          </div>
          <div className="space-y-2">
            <Label>Prize pool (UGX)</Label>
            <Input
              type="number"
              value={draft.prize_ugx ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  prize_ugx: e.target.value ? parseInt(e.target.value, 10) : null,
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
          Create tournament
        </Button>
      </BrandCard>

      <BrandCard title={`${tournaments.length} tournaments`}>
        <DataTable
          data={tournaments}
          emptyMessage="No tournaments yet."
          columns={[
            { key: "title", header: "Tournament", cell: (t) => t.title },
            {
              key: "dates",
              header: "Dates",
              cell: (t) =>
                t.start_date
                  ? `${t.start_date}${t.end_date ? ` → ${t.end_date}` : ""}`
                  : "—",
            },
            { key: "format", header: "Format", cell: (t) => t.format ?? "—" },
            {
              key: "prize",
              header: "Prize",
              cell: (t) => (t.prize_ugx ? formatUGX(t.prize_ugx) : "—"),
            },
            {
              key: "status",
              header: "Status",
              cell: (t) => (
                <Badge variant="outline" className="capitalize">
                  {t.status}
                </Badge>
              ),
            },
            {
              key: "actions",
              header: "",
              cell: (t) => (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(t.id)}
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
