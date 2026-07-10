import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { MediaManager } from "@/components/admin/media-manager";
import { listMediaAssets } from "@/services/admin/content";

export default async function AdminMediaPage() {
  const assets = await listMediaAssets();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Media"
        description="Manage gallery images and video assets for the website."
      />
      <MediaManager assets={assets} />
    </div>
  );
}
