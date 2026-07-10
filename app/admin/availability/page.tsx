import { AdminAvailabilityManager } from "@/components/admin/admin-availability-manager";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import {
  listAllBlockedSlots,
  listAllRecurringBookings,
} from "@/services/admin/availability";

export default async function AdminAvailabilityPage() {
  const [recurring, blocked] = await Promise.all([
    listAllRecurringBookings(),
    listAllBlockedSlots(),
  ]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Availability Center"
        description="Manage recurring team bookings, block time slots, and override schedules."
      />
      <AdminAvailabilityManager recurring={recurring} blocked={blocked} />
    </div>
  );
}
