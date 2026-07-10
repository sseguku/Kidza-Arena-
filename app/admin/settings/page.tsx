import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { SettingsForm } from "@/components/admin/settings-form";
import { requireAdmin } from "@/lib/auth/session";
import { getGeneralSettings } from "@/services/admin/content";

export default async function AdminSettingsPage() {
  const [session, settings] = await Promise.all([
    requireAdmin(),
    getGeneralSettings(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Settings"
        description="Configure site behaviour and manage your admin account."
      />
      <SettingsForm initial={settings} session={session} />
    </div>
  );
}
