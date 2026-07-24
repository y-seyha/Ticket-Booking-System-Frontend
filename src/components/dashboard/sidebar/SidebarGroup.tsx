"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [isOpen, setIsOpen] = useState(true);

  if (group.items.length === 1 && group.title === group.items[0].title) {
    return (
      <div className="px-3 py-1">
        <SidebarItem item={group.items[0]} onClick={onItemClick} />
      </div>
    );
  }

  return (
    <div className="px-3 py-1">
      {/* Header Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-50"
        aria-expanded={isOpen}
      >
        <span className="uppercase tracking-wider">{group.title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-zinc-400 dark:text-zinc-500"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </motion.div>
      </button>

      {/* Accordion Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="dropdown-container"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                // Smooth ease-out exponential curve for height
                height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: 0.25, ease: "linear" },
                staggerChildren: 0.03, // Slight delay between items
                delayChildren: 0.02,
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.25, ease: [0.32, 0, 0.67, 0] },
                opacity: { duration: 0.15 },
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
