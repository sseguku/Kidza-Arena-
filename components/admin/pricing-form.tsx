"use client";

import { savePricingAction } from "@/app/admin/actions";
import { BrandCard } from "@/components/design-system";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PricingSettings } from "@/types/admin";
import { Loader2 } from "lucide-react";
import { useState, useTransition } from "react";

type PricingFormProps = {
  initial: PricingSettings;
};

export function PricingForm({ initial }: PricingFormProps) {
  const [settings, setSettings] = useState(initial);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const handleSave = () => {
    setMessage(null);
    startTransition(async () => {
      const { error } = await savePricingAction(settings);
      setMessage(error ? error : "Pricing updated successfully.");
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <BrandCard title="Individual Play" description="Per person, per session">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="individual">Price (UGX)</Label>
            <Input
              id="individual"
              type="number"
              min={0}
              step={1000}
              value={settings.individualPriceUgx}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  individualPriceUgx: parseInt(e.target.value, 10) || 0,
                }))
              }
              className="h-12 text-lg font-semibold"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Displayed on the booking wizard and landing page pricing section.
          </p>
        </div>
      </BrandCard>

      <BrandCard title="Team Booking" description="Full pitch, hourly rate">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team">Price per hour (UGX)</Label>
            <Input
              id="team"
              type="number"
              min={0}
              step={5000}
              value={settings.teamHourlyPriceUgx}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  teamHourlyPriceUgx: parseInt(e.target.value, 10) || 0,
                }))
              }
              className="h-12 text-lg font-semibold"
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Charged per hour for team, training, and event bookings (1–3 hours).
          </p>
        </div>
      </BrandCard>

      <div className="lg:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button size="lg" onClick={handleSave} disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Saving…
            </>
          ) : (
            "Save pricing"
          )}
        </Button>
        {message && (
          <p
            className={`text-sm ${message.includes("success") ? "text-emerald-600" : "text-destructive"}`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
