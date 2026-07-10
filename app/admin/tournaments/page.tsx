import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TournamentManager } from "@/components/admin/tournament-manager";
import { listTournaments } from "@/services/admin/content";

export default async function AdminTournamentsPage() {
  const tournaments = await listTournaments();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Tournaments"
        description="Create and manage tournaments, leagues, and community events."
      />
      <TournamentManager tournaments={tournaments} />
    </div>
  );
}
