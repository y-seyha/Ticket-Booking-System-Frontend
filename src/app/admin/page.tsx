"use client";

import Link from "next/link";
import { usePageTitle } from "@/hooks/usePageTitle";
import {
  Film,
  Building2,
  Monitor,
  Layout,
  ArmchairIcon,
  CircleDollarSign,
  Clock,
  Users,
  UtensilsCrossed,
  Tags,
  BarChart3,
  Ticket,
  CreditCard,
  RotateCcw,
  UserCog,
  Shield,
  UserCheck,
  Settings,
  User,
  DollarSign,
  TrendingUp,
  Percent,
} from "lucide-react";

interface SectionGroup {
  label: string;
  items: {
    title: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    desc: string;
  }[];
}

const sectionGroups: SectionGroup[] = [
  {
    label: "Analytics",
    items: [
      {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: BarChart3,
        desc: "Real-time KPIs, revenue charts, and booking stats",
      },
    ],
  },
  {
    label: "Cinema",
    items: [
      {
        title: "Movies",
        href: "/admin/cinema/movies",
        icon: Film,
        desc: "Manage movie listings, status, and metadata",
      },
      {
        title: "Theaters",
        href: "/admin/cinema/theaters",
        icon: Building2,
        desc: "Manage cinema locations and operation status",
      },
      {
        title: "Screens",
        href: "/admin/cinema/screens",
        icon: Monitor,
        desc: "Manage screens within theaters",
      },
      {
        title: "Screen Templates",
        href: "/admin/cinema/screen-templates",
        icon: Layout,
        desc: "Configure screen layouts and dimensions",
      },
      {
        title: "Seat Templates",
        href: "/admin/cinema/seat-templates",
        icon: ArmchairIcon,
        desc: "Define seat arrangements and types",
      },
      {
        title: "Seat Pricing",
        href: "/admin/cinema/seat-pricing",
        icon: CircleDollarSign,
        desc: "Configure seat surcharge rules",
      },
      {
        title: "Showtimes",
        href: "/admin/cinema/showtimes",
        icon: Clock,
        desc: "Schedule and manage movie showtimes",
      },
      {
        title: "Food & Beverage",
        href: "/admin/cinema/food-beverage",
        icon: UtensilsCrossed,
        desc: "Manage F&B items and inventory",
      },
      {
        title: "Food Categories",
        href: "/admin/cinema/food-categories",
        icon: Tags,
        desc: "Organize F&B categories",
      },
    ],
  },
  {
    label: "Bookings",
    items: [
      {
        title: "Bookings",
        href: "/admin/bookings",
        icon: Ticket,
        desc: "View, filter, and manage all ticket bookings",
      },
      {
        title: "Payments",
        href: "/admin/bookings/payments",
        icon: CreditCard,
        desc: "Overview of payment transactions by provider",
      },
      {
        title: "Refunds",
        href: "/admin/bookings/refunds",
        icon: RotateCcw,
        desc: "Track and manage refunded tickets",
      },
    ],
  },
  {
    label: "Users & Roles",
    items: [
      {
        title: "Users",
        href: "/admin/users/users-dashboard",
        icon: Users,
        desc: "Manage customer accounts and profiles",
      },
      {
        title: "Admins",
        href: "/admin/users/admins-dashboard",
        icon: Shield,
        desc: "Manage system administrators",
      },
      {
        title: "Cashiers",
        href: "/admin/users/cashiers-dashboard",
        icon: UserCheck,
        desc: "Manage box office / POS employees",
      },
      {
        title: "Roles",
        href: "/admin/users/roles-dashboard",
        icon: UserCog,
        desc: "Create and manage roles with granular permissions",
      },
    ],
  },
  {
    label: "Reports",
    items: [
      {
        title: "Sales",
        href: "/admin/reports/sales",
        icon: DollarSign,
        desc: "Breakdown of ticket and F&B sales revenue",
      },
      {
        title: "Revenue",
        href: "/admin/reports/revenue",
        icon: TrendingUp,
        desc: "Revenue trends across daily, weekly, monthly views",
      },
      {
        title: "Occupancy",
        href: "/admin/reports/occupancy",
        icon: Percent,
        desc: "Seat utilization rates across movies and theaters",
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        title: "Settings",
        href: "/admin/system/settings",
        icon: Settings,
        desc: "Configure application-wide settings",
      },
      {
        title: "Profile",
        href: "/admin/system/profile",
        icon: User,
        desc: "Manage your account details and password",
      },
    ],
  },
];

export default function AdminDashboard() {
  usePageTitle("Admin");
  return (
    <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto min-h-screen transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Admin Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your cinema platform — movies, theaters, showtimes, users, and
          more.
        </p>
      </div>

      {sectionGroups.map((group) => (
        <div key={group.label}>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3">
            {group.label}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.items.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className="group relative flex flex-col gap-3 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-5 shadow-sm transition-all hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 group-hover:bg-zinc-900 group-hover:text-white dark:group-hover:bg-zinc-50 dark:group-hover:text-zinc-900 transition-colors">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                      {section.title}
                    </h3>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    {section.desc}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
