"use client";

import { saveGeneralSettingsAction } from "@/app/admin/actions";
import { BrandCard } from "@/components/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AdminSession, GeneralSettings } from "@/types/admin";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

type SettingsFormProps = {
  initial: GeneralSettings;
  session: AdminSession;
};

export function SettingsForm({ initial, session }: SettingsFormProps) {
  const [settings, setSettings] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const { error } = await saveGeneralSettingsAction(settings);
      setMessage(error ? error : "Settings saved.");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BrandCard title="Site settings">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteName">Site name</Label>
            <Input
              id="siteName"
              value={settings.siteName}
              onChange={(e) =>
                setSettings((s) => ({ ...s, siteName: e.target.value }))
              }
            />
          </div>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
            <input
              type="checkbox"
              checked={settings.bookingApprovalRequired}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  bookingApprovalRequired: e.target.checked,
                }))
              }
              className="size-5 accent-primary"
            />
            <div>
              <p className="font-semibold">Require booking approval</p>
              <p className="text-sm text-muted-foreground">
                New bookings stay pending until an admin confirms.
              </p>
            </div>
          </label>
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4">
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  maintenanceMode: e.target.checked,
                }))
              }
              className="size-5 accent-primary"
            />
            <div>
              <p className="font-semibold">Maintenance mode</p>
              <p className="text-sm text-muted-foreground">
                Temporarily disable public booking (coming soon on site).
              </p>
            </div>
          </label>
          <Button onClick={handleSave} disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : "Save settings"}
          </Button>
          {message && (
            <p className="text-sm text-muted-foreground">{message}</p>
          )}
        </div>
      </BrandCard>

      <BrandCard title="Your account">
        <dl className="space-y-4 text-sm">
          <div>
            <dt className="text-muted-foreground">Name</dt>
            <dd className="font-semibold">
              {session.profile.full_name ?? "Administrator"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-semibold">{session.email}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">Role</dt>
            <dd className="font-semibold capitalize">{session.profile.role}</dd>
          </div>
        </dl>
      </BrandCard>
    </div>
  );
}
