"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ticketsApi } from "@/features/tickets/tickets.api";
import { Ticket } from "@/features/tickets/tickets.types";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function TicketDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await ticketsApi.getTicketById(id);
        setTicket(data);
      } catch {
        router.push("/my-tickets");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!ticket) return null;

  const movie = ticket.booking.showtime.movie;
  const theater = ticket.booking.showtime.screen.theater;
  const screen = ticket.booking.showtime.screen;
  const seat = ticket.bookingSeat.seat;
  const startTime = new Date(ticket.booking.showtime.startTime);

  const statusColor = {
    ACTIVE: "text-green-400",
    USED: "text-zinc-400",
    REFUNDED: "text-yellow-400",
    EXPIRED: "text-red-400",
  }[ticket.status];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <Navbar />

      <main className="max-w-lg mx-auto px-4 pt-32 pb-24">
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
                <Link href="/my-tickets" className="text-zinc-500 hover:text-white transition-colors">
                  My Tickets
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-zinc-700" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold">
                  Ticket
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          {/* QR Section */}
          <div className="bg-white p-8 flex justify-center">
            <div className="bg-white rounded-xl p-2">
              <QRCodeSVG
                value={ticket.qrCode}
                size={200}
                level="M"
                includeMargin
              />
            </div>
          </div>

          <div className="p-6 space-y-5">
            {/* Status */}
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-black uppercase tracking-tight">
                {movie.title}
              </h1>
              <span className={`text-sm font-bold uppercase ${statusColor}`}>
                {ticket.status}
              </span>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Theater
                </div>
                <div className="font-semibold">{theater.name}</div>
                <div className="text-zinc-400 text-xs">{theater.location}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Screen
                </div>
                <div className="font-semibold">{screen.name}</div>
                <div className="text-zinc-400 text-xs">{screen.type}</div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Date & Time
                </div>
                <div className="font-semibold">
                  {startTime.toLocaleDateString([], {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-zinc-400 text-xs">
                  {startTime.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Seat
                </div>
                <div className="font-semibold">
                  Row {seat.seatRow} — Seat {seat.seatNumber}
                </div>
                <div className="text-zinc-400 text-xs">{seat.seatType}</div>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Booking Info */}
            <div className="flex items-center justify-between text-sm">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Booking Code
                </div>
                <div className="font-mono text-xs text-zinc-300">
                  {ticket.booking.bookingCode}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Ticket Code
                </div>
                <div className="font-mono text-xs text-zinc-300">
                  {ticket.qrCode}
                </div>
              </div>
            </div>

            {/* Validation Info */}
            {ticket.validatedAt && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 text-sm">
                <span className="text-green-400 font-bold">Validated</span>
                <span className="text-zinc-400 text-xs ml-2">
                  {new Date(ticket.validatedAt).toLocaleString()}
                </span>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-center pt-2">
              <span className="text-zinc-400 text-sm font-bold">Total</span>
              <span className="text-2xl font-black">
                ${Number(ticket.booking.totalPrice).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
