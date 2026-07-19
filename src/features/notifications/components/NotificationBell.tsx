"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  TicketCheck,
  TicketX,
  Mail,
  KeyRound,
  UserRoundCog,
  Clock,
  ExternalLink,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/features/auth/auth.store";
import { useNotificationsStore } from "../notifications.store";
import { notificationsApi } from "../notifications.api";
import { useNotificationSocket } from "../hooks/useNotificationSocket";
import type { Notification } from "../notifications.types";

interface NotificationBellProps {
  open: boolean;
  onToggle: () => void;
}

const TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  BOOKING_CONFIRMATION: TicketCheck,
  BOOKING_CANCELLATION: TicketX,
  EMAIL_VERIFICATION: Mail,
  PASSWORD_RESET: KeyRound,
  ACCOUNT_REACTIVATE: UserRoundCog,
  UPCOMING_SHOWTIME: Clock,
};

const TYPE_COLORS: Record<string, string> = {
  BOOKING_CONFIRMATION: "bg-emerald-500/20 text-emerald-400",
  BOOKING_CANCELLATION: "bg-red-500/20 text-red-400",
  EMAIL_VERIFICATION: "bg-blue-500/20 text-blue-400",
  PASSWORD_RESET: "bg-amber-500/20 text-amber-400",
  ACCOUNT_REACTIVATE: "bg-violet-500/20 text-violet-400",
  UPCOMING_SHOWTIME: "bg-cyan-500/20 text-cyan-400",
};

export const NotificationBell: FC<NotificationBellProps> = ({
  open,
  onToggle,
}) => {
  const user = useAuthStore((s) => s.user);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const connected = useNotificationsStore((s) => s.connected);
  const setUnreadCount = useNotificationsStore((s) => s.setUnreadCount);
  const decrementUnreadCount = useNotificationsStore(
    (s) => s.decrementUnreadCount,
  );
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useNotificationSocket();

  useEffect(() => {
    if (!user) return;
    Promise.all([
      notificationsApi.getHistory({ limit: 10 }),
      notificationsApi.getUnreadCount(),
    ]).then(([hist, cnt]) => {
      const seen = new Set<string>();
      setItems(
        hist.data.filter((n) => {
          if (n.channel !== "IN_APP") return false;
          const key = `${n.type}-${n.title}-${n.body}-${n.createdAt}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        }).slice(0, 5),
      );
      setUnreadCount(cnt.count);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    notificationsApi.getUnreadCount().then((res) => {
      setUnreadCount(res.count);
    });
  }, [open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        open
      ) {
        onToggle();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
    } catch {
      // silent
    }
    setItems((prev) =>
      prev.map((n) =>
        n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
      ),
    );
    decrementUnreadCount();
  };

  const handleClick = (n: Notification) => {
    if (!n.readAt) handleMarkAsRead(n.id);
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
    onToggle();
    window.location.href = path;
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setItems((prev) =>
        prev.map((n) => ({
          ...n,
          readAt: n.readAt || new Date().toISOString(),
        })),
      );
      setUnreadCount(0);
    } catch {
      toast.error("Failed to mark all as read");
    }
  };

  if (!user) return null;

  const connectedColor = connected ? "bg-green-500" : "bg-zinc-500";

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={onToggle}
        className="relative p-2.5 rounded-full bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-200 cursor-pointer"
      >
        <Bell className="w-4 h-4 text-zinc-200" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-gradient-to-br from-red-500 to-rose-600 rounded-full shadow-lg shadow-red-500/30"
            >
              {unreadCount > 9 ? "9+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
        <span
          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-zinc-950 ${connectedColor}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-120"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-white">
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-medium text-zinc-400 bg-white/5 px-1.5 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-red-400 hover:text-red-300 transition cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3 inline mr-0.5" />
                    Mark read
                  </button>
                )}
                <button
                  onClick={() => {
                    onToggle();
                    window.location.href = "/notifications";
                  }}
                  className="text-[11px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="space-y-3 p-4">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="h-16 bg-white/5 rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-zinc-600">
                  <Bell className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-xs">No notifications yet</p>
                </div>
              ) : (
                items.map((n, i) => {
                  const TypeIcon = TYPE_ICONS[n.type] || Bell;
                  const colorClass =
                    TYPE_COLORS[n.type] || "bg-zinc-500/20 text-zinc-400";
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className={`px-4 py-3 border-b border-white/5 hover:bg-white/5 transition cursor-pointer ${
                        !n.readAt ? "bg-white/[0.02]" : ""
                      }`}
                      onClick={() => handleClick(n)}
                    >
                      <div className="flex gap-3">
                        <div
                          className={`shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${colorClass}`}
                        >
                          <TypeIcon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className={`text-sm font-medium truncate ${
                                !n.readAt ? "text-white" : "text-zinc-300"
                              }`}
                            >
                              {n.title}
                            </span>
                            {!n.readAt && (
                              <span className="w-1.5 h-1.5 bg-red-500 rounded-full shrink-0 mt-1.5" />
                            )}
                          </div>
                          <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2 leading-relaxed">
                            {n.body}
                          </p>
                          <p className="text-[10px] text-zinc-600 mt-1">
                            {formatTime(n.createdAt)}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            <button
              onClick={() => {
                onToggle();
                window.location.href = "/notifications";
              }}
              className="block w-full px-4 py-2.5 text-center text-xs text-zinc-400 hover:text-white hover:bg-white/5 transition border-t border-white/5 cursor-pointer"
            >
              View all notifications
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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
