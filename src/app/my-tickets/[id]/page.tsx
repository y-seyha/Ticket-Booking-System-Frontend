"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ticketsApi } from "@/features/tickets/tickets.api";
import { Ticket } from "@/features/tickets/tickets.types";
import { ShoppingCart, Users } from "lucide-react";
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
  const [siblingTickets, setSiblingTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await ticketsApi.getTicketById(id);
        setTicket(data);
        const siblings = await ticketsApi.getTicketsByBooking(data.bookingId);
        setSiblingTickets(Array.isArray(siblings) ? siblings : []);
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
  const startTime = new Date(ticket.booking.showtime.startTime);
  const allTickets = siblingTickets.length > 0 ? siblingTickets : [ticket];
  const foodItems = ticket.booking.foodItems || [];

  const statusColor = {
    ACTIVE: "text-green-400",
    USED: "text-zinc-400",
    REFUNDED: "text-yellow-400",
    EXPIRED: "text-red-400",
  }[ticket.status];

  // Group food items by name for display
  const groupedFood = foodItems.reduce((acc, fi) => {
    const key = fi.foodItem.name;
    if (acc.has(key)) {
      acc.get(key)!.quantity += fi.quantity;
    } else {
      acc.set(key, { ...fi });
    }
    return acc;
  }, new Map<string, typeof foodItems[0]>());

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 pt-32 pb-24">
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
                  Booking Details
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-4">
            <div className="flex items-center justify-between mb-1">
              <h1 className="text-xl font-black uppercase tracking-tight">
                {movie.title}
              </h1>
              <span className={`text-sm font-bold uppercase ${statusColor}`}>
                {ticket.status}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Users className="w-3.5 h-3.5" />
              <span>
                {allTickets.length} ticket{allTickets.length !== 1 ? "s" : ""} · Booking {ticket.booking.bookingCode.slice(0, 8)}
              </span>
            </div>
          </div>

          <div className="h-px bg-zinc-800 mx-6" />

          {/* Info Section */}
          <div className="p-6 space-y-5">
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
                  Seats
                </div>
                <div className="space-y-0.5">
                  {allTickets.map((t) => (
                    <div key={t.id} className="font-semibold text-xs">
                      Row {t.bookingSeat.seat.seatRow} — Seat {t.bookingSeat.seat.seatNumber}
                      <span className="text-zinc-500 ml-1">({t.bookingSeat.seat.seatType})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Food & Beverage */}
            {foodItems.length > 0 && (
              <>
                <div className="h-px bg-zinc-800" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 flex items-center gap-2">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Food & Beverage
                  </div>
                  <div className="space-y-2">
                    {Array.from(groupedFood.values()).map((fi) => (
                      <div key={fi.id} className="flex items-center justify-between text-sm">
                        <span className="text-zinc-300">
                          {fi.foodItem.name}{" "}
                          <span className="text-zinc-600">x{fi.quantity}</span>
                        </span>
                        <span className="font-mono text-zinc-300">
                          ${(Number(fi.unitPrice) * fi.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="h-px bg-zinc-800" />

            {/* QR Codes Section */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                <Users className="w-3.5 h-3.5" />
                Tickets — {allTickets.length} seat{allTickets.length !== 1 ? "s" : ""}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allTickets.map((t) => (
                  <div key={t.id} className="bg-white rounded-xl p-3 flex flex-col items-center gap-2">
                    <QRCodeSVG
                      value={t.qrCode}
                      size={100}
                      level="M"
                      includeMargin
                    />
                    <span className="text-[10px] text-zinc-800 font-mono font-bold">
                      Row {t.bookingSeat.seat.seatRow}-{t.bookingSeat.seat.seatNumber}
                    </span>
                    <span className="text-[9px] text-zinc-500 font-mono truncate max-w-full">
                      {t.qrCode}
                    </span>
                  </div>
                ))}
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
            <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
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
