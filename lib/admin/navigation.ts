import {
  BarChart3,
  Calendar,
  CalendarDays,
  CalendarRange,
  GraduationCap,
  Image,
  LayoutDashboard,
  Settings,
  Trophy,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

export const adminNavItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    description: "Overview and quick actions",
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
    description: "Manage pitch reservations",
  },
  {
    label: "Calendar",
    href: "/admin/calendar",
    icon: Calendar,
    description: "Visual schedule",
  },
  {
    label: "Availability",
    href: "/admin/availability",
    icon: CalendarRange,
    description: "Recurring & blocked slots",
  },
  {
    label: "Pricing",
    href: "/admin/pricing",
    icon: Wallet,
    description: "Rates and packages",
  },
  {
    label: "Media",
    href: "/admin/media",
    icon: Image,
    description: "Gallery and assets",
  },
  {
    label: "Academy",
    href: "/admin/academy",
    icon: GraduationCap,
    description: "Training programs",
  },
  {
    label: "Tournaments",
    href: "/admin/tournaments",
    icon: Trophy,
    description: "Events and leagues",
  },
  {
    label: "Statistics",
    href: "/admin/statistics",
    icon: BarChart3,
    description: "Performance metrics",
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
    description: "Site configuration",
  },
];
