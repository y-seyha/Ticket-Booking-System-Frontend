"use client";

import Link from "next/link";
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
} from "lucide-react";

const adminSections = [
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
  {
    title: "Users",
    href: "/admin/users/users-dashboard",
    icon: Users,
    desc: "Manage users, cashiers, admins, and roles",
  },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen transition-colors duration-200">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Admin Dashboard
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your cinema platform — movies, theaters, showtimes, users, and
          more.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {adminSections.map((section) => {
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
                <h2 className="font-semibold text-sm text-zinc-900 dark:text-zinc-50">
                  {section.title}
                </h2>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {section.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
