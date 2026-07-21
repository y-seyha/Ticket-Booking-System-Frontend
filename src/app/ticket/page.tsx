"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ticketsApi } from "@/features/tickets/tickets.api";
import { foodAndBeverageApi } from "@/features/foods-and-beverage/foods-and-beverage.api";
import { Ticket, TicketStatus } from "@/features/tickets/tickets.types";
import type { UserFoodOrder } from "@/features/foods-and-beverage/foods-and-beverage.types";
import { ShoppingCart, Ticket as TicketIcon, ChevronRight, Clock, Loader2 } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type Tab = "tickets" | "food";

const statusStyles: Record<TicketStatus, string> = {
  ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
  USED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  REFUNDED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
};

interface TicketGroup {
  bookingCode: string;
  bookingId: string;
  movie: { title: string };
  theater: { name: string; location: string };
  screen: { name: string; type: string };
  startTime: string;
  totalPrice: number;
  status: TicketStatus;
  tickets: Ticket[];
  foodItems: Ticket["booking"]["foodItems"];
}

export default function TicketPage() {
  return (
    <Suspense fallback={null}>
      <TicketPageContent />
    </Suspense>
  );
}

function TicketPageContent() {
  usePageTitle("Ticket");
  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = (searchParams.get("tab") as Tab) || "tickets";

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [foodOrders, setFoodOrders] = useState<UserFoodOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TicketStatus | "ALL">("ALL");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [ticketData, foodData] = await Promise.all([
          ticketsApi.getMyTickets(filter === "ALL" ? undefined : filter),
          foodAndBeverageApi.getMyOrders(),
        ]);
        setTickets(Array.isArray(ticketData) ? ticketData : []);
        setFoodOrders(Array.isArray(foodData) ? foodData : []);
      } catch {
        setTickets([]);
        setFoodOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [filter]);

  const groups = useMemo(() => {
    const map = new Map<string, TicketGroup>();
    for (const ticket of tickets) {
      const key = ticket.booking.bookingCode;
      if (!map.has(key)) {
        map.set(key, {
          bookingCode: ticket.booking.bookingCode,
          bookingId: ticket.bookingId,
          movie: ticket.booking.showtime.movie,
          theater: ticket.booking.showtime.screen.theater,
          screen: ticket.booking.showtime.screen,
          startTime: ticket.booking.showtime.startTime,
          totalPrice: Number(ticket.booking.totalPrice),
          status: ticket.status,
          tickets: [],
          foodItems: ticket.booking.foodItems || [],
        });
      }
      map.get(key)!.tickets.push(ticket);
    }
    return Array.from(map.values());
  }, [tickets]);

  const upcoming = groups.filter(
    (g) =>
      g.status === "ACTIVE" &&
      new Date(g.startTime) > new Date(),
  );
  const past = groups.filter(
    (g) =>
      g.status !== "ACTIVE" ||
      new Date(g.startTime) <= new Date(),
  );

  const setTab = (t: Tab) => {
    router.push(`/ticket?tab=${t}`, { scroll: false });
  };

  const tabs: { key: Tab; label: string; shortLabel: string; icon: typeof TicketIcon }[] = [
    { key: "tickets", label: "Tickets", shortLabel: "Tickets", icon: TicketIcon },
    { key: "food", label: "Food & Beverage", shortLabel: "Food", icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <Navbar />

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
                  My Tickets
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Tab Selector */}
        <div className="flex gap-1 mb-8 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  tab === t.key
                    ? "bg-red-500 text-white shadow-lg"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
                <span className="sm:hidden">{t.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        ) : tab === "tickets" ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <h2 className="text-lg font-bold text-zinc-300">
                Movie Tickets
              </h2>
              <div className="flex gap-2 flex-wrap">
                {(["ALL", "ACTIVE", "USED", "REFUNDED", "EXPIRED"] as const).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors ${
                        filter === f
                          ? "bg-red-500 text-white"
                          : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                      }`}
                    >
                      {f}
                    </button>
                  ),
                )}
              </div>
            </div>

            {groups.length === 0 ? (
              <div className="text-center py-20 text-zinc-600">
                <TicketIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-bold">No tickets found</p>
                <p className="text-sm mt-2">Your movie tickets will appear here after you make a purchase.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {upcoming.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Upcoming</h2>
                    <div className="grid gap-4">
                      {upcoming.map((group) => (
                        <BookingGroupCard key={group.bookingCode} group={group} />
                      ))}
                    </div>
                  </div>
                )}

                {past.length > 0 && (
                  <div>
                    <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">Past</h2>
                    <div className="grid gap-4">
                      {past.map((group) => (
                        <BookingGroupCard key={group.bookingCode} group={group} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold text-zinc-300 mb-6">
              Food & Beverage Orders
            </h2>

            {foodOrders.length === 0 ? (
              <div className="text-center py-20 text-zinc-600">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-bold">No orders yet</p>
                <p className="text-sm mt-2">Your food orders will appear here after you make a purchase.</p>
                <Link
                  href="/food-and-drinks"
                  className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {foodOrders.map((order) => (
                  <FoodOrderCard key={order.bookingId} order={order} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}

function BookingGroupCard({ group }: { group: TicketGroup }) {
  const startTime = new Date(group.startTime);
  const ticketStatus = group.tickets[0]?.status || "ACTIVE";

  return (
    <Link
      href={`/my-tickets/${group.tickets[0]?.id}`}
      className="block bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-white truncate">
              {group.movie.title}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${statusStyles[ticketStatus]}`}
            >
              {ticketStatus}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
            <span>
              {startTime.toLocaleDateString([], {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}{" "}
              {startTime.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span>
              {group.theater.name} — {group.screen.name}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {group.tickets.map((t) => (
              <span
                key={t.id}
                className="text-[11px] font-mono font-semibold text-zinc-300 bg-zinc-800/80 px-2 py-0.5 rounded"
              >
                Row {t.bookingSeat.seat.seatRow} Seat {t.bookingSeat.seat.seatNumber}
              </span>
            ))}
          </div>

          {group.foodItems && group.foodItems.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              <ShoppingCart className="w-3 h-3 text-emerald-500" />
              {group.foodItems.map((fi) => (
                <span
                  key={fi.id}
                  className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded"
                >
                  {fi.foodItem.name} x{fi.quantity}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mt-3">
            {group.tickets.map((t) => (
              <div key={t.id} className="bg-white rounded-lg p-1">
                <QRCodeSVG value={t.qrCode} size={48} level="M" />
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 text-right flex flex-col items-end gap-2">
          <div className="text-sm font-bold text-zinc-300">
            ${Number(group.totalPrice).toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            {group.tickets.length} seat{group.tickets.length !== 1 ? "s" : ""}
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}

const foodStatusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  CONFIRMED: { label: "Confirmed", className: "bg-green-500/10 text-green-400 border-green-500/20" },
  EXPIRED: { label: "Expired", className: "bg-red-500/10 text-red-400 border-red-500/20" },
  CANCELLED: { label: "Cancelled", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

function FoodOrderCard({ order }: { order: UserFoodOrder }) {
  const createdDate = new Date(order.createdAt);
  const status = foodStatusConfig[order.status] || foodStatusConfig.PENDING;

  return (
    <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-white truncate">
              Order #{order.bookingCode.slice(0, 8)}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${status.className}`}
            >
              {status.label}
            </span>
          </div>

          <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {createdDate.toLocaleDateString([], {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-3">
            {order.items.map((item) => (
              <span
                key={item.id}
                className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"
              >
                {item.name} x{item.quantity}
              </span>
            ))}
          </div>

          {order.paymentStatus && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className="text-[10px] font-medium text-zinc-500 uppercase">
                Payment: {order.paymentStatus}
              </span>
            </div>
          )}
        </div>

        <div className="shrink-0 text-right flex flex-col items-end gap-2">
          <div className="text-sm font-bold text-zinc-300">
            ${Number(order.totalAmount).toFixed(2)}
          </div>
          <div className="text-[10px] text-zinc-600 flex items-center gap-1">
            {order.items.length} item{order.items.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
