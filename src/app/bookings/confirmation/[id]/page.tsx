"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Ticket as TicketIcon,
  Clock,
  Film,
  ChevronLeft,
  QrCode,
  ExternalLink,
  ShoppingCart,
  Banknote,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { ticketsApi } from "@/features/tickets/tickets.api";
import { useAuthStore } from "@/features/auth/auth.store";
import type { Ticket } from "@/features/tickets/tickets.types";
import type { PaymentProvider } from "@/features/payment/payment.types";

interface FoodConfirmationItem {
  name: string;
  price: number;
  quantity: number;
}

interface FoodOrderConfirmation {
  bookingId: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
  provider: PaymentProvider;
  items: FoodConfirmationItem[];
}

export default function BookingConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [foodOrder, setFoodOrder] = useState<FoodOrderConfirmation | null>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/auth/login");
      return;
    }
    if (!hydrated || !user || !id) return;
    if (initialized.current) return;
    initialized.current = true;

    const stored = sessionStorage.getItem("foodOrderConfirmation");
    if (stored) {
      const parsed: FoodOrderConfirmation = JSON.parse(stored);
      if (parsed.bookingId === id) {
        setFoodOrder(parsed);
        sessionStorage.removeItem("foodOrderConfirmation");
        setLoading(false);
        return;
      }
      sessionStorage.removeItem("foodOrderConfirmation");
    }

    const fetchTickets = async () => {
      try {
        const data = await ticketsApi.getTicketsByBooking(id);
        setTickets(Array.isArray(data) ? data : [data]);
      } catch {
        setError("Unable to load booking details");
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, [hydrated, user, id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar showSearch={false} showJoinNow={false} />
        <main className="max-w-lg mx-auto px-4 pt-32 pb-24">
          <div className="space-y-4">
            <div className="h-8 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-64 bg-zinc-900 rounded-2xl animate-pulse" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || (!tickets.length && !foodOrder)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white">
        <Navbar showSearch={false} showJoinNow={false} />
        <main className="max-w-lg mx-auto px-4 pt-32 pb-24">
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <TicketIcon className="w-8 h-8 text-red-400" />
            </div>
            <h2 className="text-lg font-bold mb-2">Booking not found</h2>
            <p className="text-sm text-zinc-500 mb-6">{error || "We couldn't find this booking."}</p>
            <Link
              href="/my-tickets"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm hover:border-zinc-700 transition"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to My Tickets
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (foodOrder) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
        <Navbar showSearch={false} showJoinNow={false} />

        <main className="max-w-lg mx-auto px-4 pt-32 pb-24">
          <Link
            href="/my-tickets"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to My Tickets
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden"
          >
            <div className="bg-emerald-600/10 border-b border-emerald-600/20 px-6 py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-7 h-7 text-emerald-400" />
              </div>
              <h1 className="text-xl font-black uppercase tracking-tight">Order Confirmed!</h1>
              <p className="text-sm text-zinc-400 mt-1">
                Code:{" "}
                <span className="text-emerald-400 font-mono font-bold">
                  {foodOrder.bookingCode}
                </span>
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex items-start gap-3">
                <ShoppingCart className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold">Food & Beverage Order</p>
                  <p className="text-xs text-zinc-500">
                    {foodOrder.items.length} item{foodOrder.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Items Ordered
                </div>
                <div className="space-y-2">
                  {foodOrder.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-zinc-800/30 rounded-xl px-4 py-3 border border-zinc-800"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-4 h-4 text-zinc-500" />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-[10px] text-zinc-600">x{item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">
                          ${(Number(item.price) * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-[10px] text-zinc-600">
                          ${Number(item.price).toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/20 border border-zinc-800">
                {foodOrder.provider === "CASH" ? (
                  <Banknote className="w-5 h-5 text-emerald-400 shrink-0" />
                ) : (
                  <QrCode className="w-5 h-5 text-emerald-400 shrink-0" />
                )}
                <div>
                  <p className="text-xs text-zinc-500">Payment method</p>
                  <p className="text-sm font-semibold">
                    {foodOrder.provider === "CASH"
                      ? "Pay at Counter"
                      : "KHQR Scan to Pay"}
                  </p>
                </div>
              </div>

              <div className="h-px bg-zinc-800" />

              <div className="flex items-center justify-between">
                <span className="text-sm text-zinc-400 font-bold">Total</span>
                <span className="text-2xl font-black text-emerald-400">
                  ${Number(foodOrder.totalAmount).toFixed(2)}
                </span>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              href="/my-tickets"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm hover:border-zinc-700 transition"
            >
              <TicketIcon className="w-4 h-4" />
              My Tickets
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-sm hover:bg-red-500 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  const first = tickets[0];
  const { booking } = first;
  const { showtime } = booking;
  const { movie, screen } = showtime;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <Navbar showSearch={false} showJoinNow={false} />

      <main className="max-w-lg mx-auto px-4 pt-32 pb-24">
        <Link
          href="/my-tickets"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-300 transition mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to My Tickets
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden"
        >
          <div className="bg-emerald-600/10 border-b border-emerald-600/20 px-6 py-6 text-center">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-tight">Booking Confirmed!</h1>
            <p className="text-sm text-zinc-400 mt-1">
              Code:{" "}
              <span className="text-emerald-400 font-mono font-bold">
                {booking.bookingCode}
              </span>
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-start gap-3">
              <Film className="w-5 h-5 text-zinc-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold">{movie.title}</p>
                <p className="text-xs text-zinc-500">
                  {movie.language} &middot; {movie.durationMinutes} min
                </p>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Date</div>
                <div className="font-semibold">
                  {new Date(showtime.startTime).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-zinc-400 text-xs mt-0.5">
                  <Clock className="w-3 h-3 inline mr-1" />
                  {new Date(showtime.startTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1">Theater</div>
                <div className="font-semibold">{screen.theater.name}</div>
                <div className="text-zinc-400 text-xs">{screen.name}</div>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3">
                Tickets ({tickets.length})
              </div>
              <div className="space-y-2">
                {tickets.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between bg-zinc-800/30 rounded-xl px-4 py-3 border border-zinc-800"
                  >
                    <div className="flex items-center gap-3">
                      <QrCode className="w-5 h-5 text-zinc-500" />
                      <div>
                        <p className="text-sm font-medium">
                          Row {t.bookingSeat.seat.seatRow} - Seat {t.bookingSeat.seat.seatNumber}
                        </p>
                        <p className="text-xs text-zinc-500">{t.bookingSeat.seat.seatType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">${Number(t.bookingSeat.price).toFixed(2)}</p>
                      <p className="text-[10px] text-zinc-600 font-mono">{t.qrCode}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {booking.foodItems && booking.foodItems.length > 0 && (
              <>
                <div className="h-px bg-zinc-800" />
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-3 flex items-center gap-2">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Food & Beverage
                  </div>
                  <div className="space-y-2">
                    {booking.foodItems.map((fi) => (
                      <div
                        key={fi.id}
                        className="flex items-center justify-between bg-zinc-800/30 rounded-xl px-4 py-3 border border-zinc-800"
                      >
                        <div className="flex items-center gap-3">
                          <ShoppingCart className="w-4 h-4 text-zinc-500" />
                          <div>
                            <p className="text-sm font-medium">{fi.foodItem.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold">
                            ${(Number(fi.unitPrice) * fi.quantity).toFixed(2)}
                          </p>
                          <p className="text-[10px] text-zinc-600">x{fi.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="h-px bg-zinc-800" />

            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400 font-bold">Total paid</span>
              <span className="text-2xl font-black text-emerald-400">
                ${Number(booking.totalPrice).toFixed(2)}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="flex items-center justify-center gap-4 mt-6">
          <Link
            href="/my-tickets"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-sm hover:border-zinc-700 transition"
          >
            <TicketIcon className="w-4 h-4" />
            My Tickets
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 text-sm hover:bg-red-500 transition"
          >
            <ExternalLink className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
