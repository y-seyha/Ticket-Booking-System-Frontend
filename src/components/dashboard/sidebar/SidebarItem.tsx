"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { SidebarItemType } from "./Navigation";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  item: SidebarItemType;
  onClick?: () => void;
}

export default function SidebarItem({ item, onClick }: SidebarItemProps) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
        isActive
          ? "text-indigo-600 bg-indigo-50/60 font-semibold dark:text-indigo-400 dark:bg-indigo-950/30"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-50",
      )}
    >
      {/* Active Indicator Bar */}
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r-md bg-indigo-600 dark:bg-indigo-400"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <Icon
        className={cn(
          "h-4 w-4 shrink-0 transition-colors",
          isActive
            ? "text-indigo-600 dark:text-indigo-400"
            : "text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300",
        )}
      />

      <span className="truncate">{item.title}</span>
    </Link>
  );
}
