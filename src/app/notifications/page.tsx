"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  TicketCheck,
  TicketX,
  Mail,
  KeyRound,
  UserRoundCog,
  Clock,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useAuthStore } from "@/features/auth/auth.store";
import { useNotificationsStore } from "@/features/notifications/notifications.store";
import { notificationsApi } from "@/features/notifications/notifications.api";
import type { Notification } from "@/features/notifications/notifications.types";

const TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  BOOKING_CONFIRMATION: TicketCheck,
  BOOKING_CANCELLATION: TicketX,
  EMAIL_VERIFICATION: Mail,
  PASSWORD_RESET: KeyRound,
  ACCOUNT_REACTIVATE: UserRoundCog,
  UPCOMING_SHOWTIME: Clock,
};

const TYPE_LABELS: Record<string, string> = {
  BOOKING_CONFIRMATION: "Booking",
  BOOKING_CANCELLATION: "Cancellation",
  EMAIL_VERIFICATION: "Verification",
  PASSWORD_RESET: "Security",
  ACCOUNT_REACTIVATE: "Account",
  UPCOMING_SHOWTIME: "Reminder",
  PAYMENT_RECEIVED: "Payment",
  SYSTEM: "System",
};

const TYPE_COLORS: Record<string, string> = {
  BOOKING_CONFIRMATION: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
  BOOKING_CANCELLATION: "bg-red-500/20 text-red-400 border-red-500/20",
  EMAIL_VERIFICATION: "bg-blue-500/20 text-blue-400 border-blue-500/20",
  PASSWORD_RESET: "bg-amber-500/20 text-amber-400 border-amber-500/20",
  ACCOUNT_REACTIVATE: "bg-violet-500/20 text-violet-400 border-violet-500/20",
  UPCOMING_SHOWTIME: "bg-cyan-500/20 text-cyan-400 border-cyan-500/20",
};

const FILTER_TABS = [
  { label: "All", value: undefined },
  { label: "Unread", value: "unread" },
  { label: "Read", value: "read" },
] as const;

export default function NotificationsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const decrementUnreadCount = useNotificationsStore((s) => s.decrementUnreadCount);
  const setUnreadCount = useNotificationsStore((s) => s.setUnreadCount);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState<string | undefined>();

  useEffect(() => {
    if (hydrated && !user) router.push("/auth/login");
  }, [hydrated, user]);

  useEffect(() => {
    loadNotifications();
  }, [page, filter]);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await notificationsApi.getHistory({
        page,
        limit: 15,
        status: filter as "read" | "unread" | undefined,
      });
      const seen = new Set<string>();
      setNotifications(
        res.data.filter((n) => {
          if (n.channel !== "IN_APP") return false;
          const key = `${n.type}-${n.title}-${n.body}-${n.createdAt}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }),
      );
      setTotalPages(res.meta.totalPages);
      setTotal(res.meta.total);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
    } catch {
      // silent
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n)),
    );
    decrementUnreadCount();
  };

  const handleClick = (n: Notification) => {
    handleMarkAsRead(n.id);
    const bookingId = n.data?.bookingId;
    let path = "/notifications";
    switch (n.type) {
      case "BOOKING_CONFIRMATION":
        path = bookingId ? `/bookings/confirmation/${bookingId}` : "/my-tickets";
        break;
      case "BOOKING_CANCELLATION":
      case "UPCOMING_SHOWTIME":
        path = "/my-tickets";
        break;
    }
    router.push(path);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      const now = new Date().toISOString();
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || now })));
      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <Navbar showSearch={false} showJoinNow={false} />

      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-24">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-zinc-700" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold">
                  Notifications
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-black tracking-tight uppercase">Notifications</h1>
            <p className="text-xs text-zinc-500 mt-1">
              {total} notification{total !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {notifications.some((n) => !n.readAt) && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 transition cursor-pointer"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-2 mb-8">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setFilter(tab.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                filter === tab.value
                  ? "bg-red-500 text-white"
                  : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4">
              <Inbox className="w-7 h-7 text-zinc-600" />
            </div>
            <p className="text-lg font-bold">{filter ? "No matching notifications" : "No notifications yet"}</p>
            <p className="text-sm mt-2">
              {filter
                ? "Try a different filter"
                : "Notifications will appear here when you get them"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {notifications.map((n, i) => {
                const TypeIcon = TYPE_ICONS[n.type] || Bell;
                const colorClass =
                  TYPE_COLORS[n.type] || "bg-zinc-500/20 text-zinc-400 border-zinc-500/20";
                return (
                  <motion.div
                    key={n.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.02, type: "spring", stiffness: 400, damping: 30 }}
                    className={`group flex items-start gap-4 p-4 rounded-2xl border transition-colors cursor-pointer ${
                      !n.readAt
                        ? "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700"
                        : "bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700"
                    }`}
                    onClick={() => handleClick(n)}
                  >
                    <div
                      className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border ${colorClass}`}
                    >
                      <TypeIcon className="w-5 h-5" />
                    </div>

                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`text-sm truncate ${
                              !n.readAt
                                ? "text-white font-bold"
                                : "text-zinc-400"
                            }`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[10px] text-zinc-600 shrink-0 bg-zinc-800 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                            {TYPE_LABELS[n.type] || n.type}
                          </span>
                        </div>
                        {!n.readAt && (
                          <span className="w-2 h-2 bg-red-500 rounded-full shrink-0 shadow-lg shadow-red-500/20" />
                        )}
                      </div>
                      <p
                        className={`text-xs mt-1 line-clamp-2 leading-relaxed ${
                          !n.readAt ? "text-zinc-400" : "text-zinc-600"
                        }`}
                      >
                        {n.body}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[11px] text-zinc-600">
                          {formatTime(n.createdAt)}
                        </span>
                        {n.readAt && (
                          <span className="text-[11px] text-zinc-700 flex items-center gap-1">
                            <CheckCheck className="w-3 h-3" />
                            Read
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-8">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-zinc-400 disabled:opacity-30 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              Previous
            </button>
            <span className="text-xs text-zinc-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs text-zinc-400 disabled:opacity-30 hover:text-white hover:bg-white/5 transition cursor-pointer"
            >
              Next
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function formatTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}
