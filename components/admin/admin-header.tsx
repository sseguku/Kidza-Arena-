"use client";

import { signOutAction } from "@/lib/auth/actions";
import type { AdminSession } from "@/types/admin";
import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useState } from "react";
import { AdminSidebar } from "./admin-sidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

type AdminHeaderProps = {
  session: AdminSession;
};

export function AdminHeader({ session }: AdminHeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
        <Button
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
        >
          <Menu className="size-5" />
        </Button>

        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search bookings, teams…"
            className="h-10 w-full rounded-full border border-input bg-muted/50 pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="icon-sm" aria-label="Notifications">
            <Bell className="size-5" />
          </Button>

          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold leading-none">
              {session.profile.full_name ?? "Admin"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{session.email}</p>
          </div>

          <form action={signOutAction}>
            <Button variant="outline" size="sm" type="submit" aria-label="Log out">
              <LogOut className="size-4" />
              <span className="hidden sm:inline">Log out</span>
            </Button>
          </form>
        </div>
      </header>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <AdminSidebar className="w-full border-0" />
        </SheetContent>
      </Sheet>
    </>
  );
}
