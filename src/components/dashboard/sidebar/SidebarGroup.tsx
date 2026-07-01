"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { SidebarGroupType } from "./Navigation";
import SidebarItem from "./SidebarItem";

interface SidebarGroupProps {
  group: SidebarGroupType;
  onItemClick?: () => void;
}

export default function SidebarGroup({
  group,
  onItemClick,
}: SidebarGroupProps) {
  const pathname = usePathname();

  //  Calculate if this group contains the currently active route
  const hasActiveChild = group.items.some((item) => pathname === item.href);

  // Track whether the user has explicitly toggled this section closed/open.
  const [isCollapsedByUser, setIsCollapsedByUser] = useState<boolean | null>(
    null,
  );

  //  Derived state: It's open if the user explicitly opened it, OR if it has an active child and the user hasn't explicitly closed it.
  const isOpen =
    isCollapsedByUser !== null ? !isCollapsedByUser : hasActiveChild;

  // Handle single item groups cleanly (like Dashboard) without accordion wrappers
  if (group.items.length === 1 && group.title === group.items[0].title) {
    return (
      <div className="px-3 py-1">
        <SidebarItem item={group.items[0]} onClick={onItemClick} />
      </div>
    );
  }

  return (
    <div className="px-3 py-1">
      <button
        onClick={() => setIsCollapsedByUser(isOpen)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
        aria-expanded={isOpen}
      >
        <span className="uppercase tracking-wider">{group.title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-zinc-400 dark:text-zinc-500"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: { duration: 0.25, ease: [0.32, 0.94, 0.6, 1] },
                opacity: { duration: 0.15 },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.2, ease: [0.32, 0.94, 0.6, 1] },
                opacity: { duration: 0.1 },
              },
            }}
            className="overflow-hidden"
          >
            <div className="mt-1 space-y-0.5 pl-2 border-l border-zinc-100 ml-4 dark:border-zinc-800">
              {group.items.map((item) => (
                <SidebarItem
                  key={item.href}
                  item={item}
                  onClick={onItemClick}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
