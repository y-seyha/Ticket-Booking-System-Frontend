"use client";
import { useState } from "react";
import { Menu } from "lucide-react";
import { navigationConfig } from "./Navigation";
import SidebarHeader from "./SidebarHeader";
import SidebarGroup from "./SidebarGroup";
import SidebarUser from "./SidebarUser";
import SidebarFooter from "./SidebarFooter";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar Header strip */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white px-4 md:hidden dark:border-zinc-800 dark:bg-zinc-950 sticky top-0 z-40">
        <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-50">
          <span className="tracking-tight">CineBook Admin</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-600 dark:border-zinc-800 dark:text-zinc-400"
          aria-label="Open Navigation Menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile Backdrop Overlay Wrapper */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-zinc-950/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main Structural Drawer Frame Container */}
      <aside
        className={`
    fixed bottom-0 top-0 z-50 flex w-72 flex-col bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800
    transition-transform duration-300 ease-in-out md:sticky md:top-0 md:h-screen md:translate-x-0
    ${isOpen ? "left-0 translate-x-0" : "-translate-x-full md:left-auto"}
  `}
      >
        <SidebarHeader onClose={() => setIsOpen(false)} />

        {/* Dynamic Nested Scrolling Route Layout Array */}
        <nav className="flex-1 overflow-y-auto py-4 space-y-1 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
          {navigationConfig.map((group) => (
            <SidebarGroup
              key={group.title}
              group={group}
              onItemClick={() => setIsOpen(false)}
            />
          ))}
        </nav>

        {/* Locked Footer Structure Segment */}
        <div className="mt-auto border-t border-zinc-200 p-4 space-y-4 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <SidebarUser />
          <SidebarFooter />
        </div>
      </aside>
    </>
  );
}
