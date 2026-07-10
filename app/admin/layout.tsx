import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth/session";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Admin",
  description: "Kidza Arena admin dashboard",
  path: "/admin",
});

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();

  return (
    <div className="dark min-h-screen">
      <AdminShell session={session}>{children}</AdminShell>
    </div>
  );
}
