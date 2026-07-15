"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ticketsApi } from "@/features/tickets/tickets.api";
import { Ticket, TicketStatus } from "@/features/tickets/tickets.types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const statusStyles: Record<TicketStatus, string> = {
  ACTIVE: "bg-green-500/10 text-green-400 border-green-500/20",
  USED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  REFUNDED: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  EXPIRED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export default function MyTicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TicketStatus | "ALL">("ALL");

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await ticketsApi.getMyTickets(
          filter === "ALL" ? undefined : filter,
        );
        setTickets(Array.isArray(data) ? data : []);
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [filter]);

  const upcoming = tickets.filter(
    (t) =>
      t.status === "ACTIVE" &&
      new Date(t.booking.showtime.startTime) > new Date(),
  );
  const past = tickets.filter(
    (t) =>
      t.status !== "ACTIVE" ||
      new Date(t.booking.showtime.startTime) <= new Date(),
  );

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

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black tracking-tight uppercase">
            My Tickets
          </h1>

          <div className="flex gap-2">
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

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <p className="text-lg font-bold">No tickets found</p>
            <p className="text-sm mt-2">Tickets will appear here after you complete a purchase.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">
                  Upcoming
                </h2>
                <div className="grid gap-4">
                  {upcoming.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            )}

            {past.length > 0 && (
              <div className="mt-10">
                <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-3">
                  Past
                </h2>
                <div className="grid gap-4">
                  {past.map((ticket) => (
                    <TicketCard key={ticket.id} ticket={ticket} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  const movie = ticket.booking.showtime.movie;
  const theater = ticket.booking.showtime.screen.theater;
  const seat = ticket.bookingSeat.seat;
  const startTime = new Date(ticket.booking.showtime.startTime);

  return (
    <Link
      href={`/my-tickets/${ticket.id}`}
      className="block bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-white truncate">
              {movie.title}
            </h3>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${statusStyles[ticket.status]}`}
            >
              {ticket.status}
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
              {theater.name} — {ticket.booking.showtime.screen.name}
            </span>
            <span>
              Row {seat.seatRow} Seat {seat.seatNumber}
            </span>
          </div>

          <div className="mt-2 text-xs text-zinc-500 font-mono">
            {ticket.qrCode}
          </div>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-sm font-bold text-zinc-300">
            ${Number(ticket.booking.totalPrice).toFixed(2)}
          </div>
        </div>
      </div>
    </Link>
  );
}
