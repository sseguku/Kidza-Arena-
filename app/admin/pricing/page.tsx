import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PricingForm } from "@/components/admin/pricing-form";
import { getPricingSettings } from "@/services/admin/content";

export default async function AdminPricingPage() {
  const pricing = await getPricingSettings();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Pricing"
        description="Manage individual and team booking rates shown across the site."
      />
      <PricingForm initial={pricing} />
    </div>
  );
}
