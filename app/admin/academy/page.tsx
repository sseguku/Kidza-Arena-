import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AcademyManager } from "@/components/admin/academy-manager";
import { listAcademyPrograms } from "@/services/admin/content";

export default async function AdminAcademyPage() {
  const programs = await listAcademyPrograms();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Academy"
        description="Manage youth training programs and academy offerings."
      />
      <AcademyManager programs={programs} />
    </div>
  );
}
