"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { AdminSession } from "@/types/admin";
import { useState } from "react";
import { AdminHeader } from "./admin-header";
import { AdminMobileNav, AdminSidebar } from "./admin-sidebar";

type AdminShellProps = {
  session: AdminSession;
  children: ReactNode;
};

export function AdminShell({ session, children }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        className="fixed inset-y-0 left-0 z-40 hidden lg:flex"
      />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-[padding] duration-300",
          collapsed ? "lg:pl-[72px]" : "lg:pl-64",
        )}
      >
        <AdminHeader session={session} />
        <AdminMobileNav />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
