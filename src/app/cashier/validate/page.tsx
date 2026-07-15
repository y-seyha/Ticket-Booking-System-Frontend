"use client";

import { useState } from "react";
import { ticketsApi } from "@/features/tickets/tickets.api";
import { Ticket } from "@/features/tickets/tickets.types";
import { Search, CheckCircle, XCircle } from "lucide-react";

export default function CashierValidatePage() {
  const [qrCode, setQrCode] = useState("");
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [result, setResult] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);

  const handleLookup = async () => {
    if (!qrCode.trim()) return;
    setLookupLoading(true);
    setResult(null);
    setTicket(null);
    try {
      const data = await ticketsApi.lookupByQrCode(qrCode.trim());
      setTicket(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Ticket not found";
      setResult({ type: "error", message: msg });
    } finally {
      setLookupLoading(false);
    }
  };

  const handleValidate = async () => {
    if (!ticket || !qrCode.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await ticketsApi.validateTicket(qrCode.trim());
      setTicket(data);
      setResult({
        type: "success",
        message: "Entry granted — ticket validated successfully",
      });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Validation failed";
      setResult({ type: "error", message: msg });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setQrCode("");
    setTicket(null);
    setResult(null);
  };

  const movie = ticket?.booking?.showtime?.movie;
  const theater = ticket?.booking?.showtime?.screen?.theater;
  const screen = ticket?.booking?.showtime?.screen;
  const seat = ticket?.bookingSeat?.seat;
  const startTime = ticket
    ? new Date(ticket.booking.showtime.startTime)
    : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black uppercase tracking-wider">
            Ticket Validation
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Scan or enter ticket QR code
          </p>
        </div>
        {ticket && (
          <button
            onClick={handleReset}
            className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            New Scan
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            value={qrCode}
            onChange={(e) => setQrCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLookup()}
            placeholder="Enter ticket code (e.g. TKT-a3Bx9kQm)"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl pl-11 pr-4 py-3 text-sm text-white outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
        <button
          onClick={handleLookup}
          disabled={lookupLoading || !qrCode.trim()}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 rounded-xl text-sm font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          {lookupLoading ? "..." : "Look Up"}
        </button>
      </div>

      {/* Result Message */}
      {result && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
            result.type === "success"
              ? "bg-green-500/10 border-green-500/20 text-green-400"
              : "bg-red-500/10 border-red-500/20 text-red-400"
          }`}
        >
          {result.type === "success" ? (
            <CheckCircle className="w-5 h-5 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 shrink-0" />
          )}
          <span className="text-sm font-semibold">{result.message}</span>
        </div>
      )}

      {/* Ticket Details */}
      {ticket && (
        <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="p-6 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-bold">{movie?.title}</h2>
                <p className="text-sm text-zinc-400">
                  {theater?.name} — {screen?.name}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-lg text-xs font-bold uppercase border ${
                  ticket.status === "ACTIVE"
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : ticket.status === "USED"
                      ? "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                      : ticket.status === "REFUNDED"
                        ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                        : "bg-red-500/10 text-red-400 border-red-500/20"
                }`}
              >
                {ticket.status}
              </span>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                  Ticket Code
                </div>
                <div className="font-mono text-xs">{ticket.qrCode}</div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                  Booking Code
                </div>
                <div className="font-mono text-xs">
                  {ticket.booking.bookingCode}
                </div>
              </div>
              {startTime && (
                <div>
                  <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                    Showtime
                  </div>
                  <div>
                    {startTime.toLocaleDateString([], {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {startTime.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                  Seat
                </div>
                <div className="font-semibold">
                  {seat && `Row ${seat.seatRow} — Seat ${seat.seatNumber}`}
                </div>
              </div>
            </div>

            <div className="h-px bg-zinc-800" />

            {/* Customer Info */}
            <div className="text-sm">
              <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">
                Customer
              </div>
              <div className="font-semibold">
                {ticket.booking.account?.profile?.firstName}{" "}
                {ticket.booking.account?.profile?.lastName}
              </div>
              <div className="text-zinc-400 text-xs">
                {ticket.booking.account?.email}
              </div>
            </div>

            {/* Validity */}
            {ticket.validatedAt && (
              <div className="bg-zinc-800/50 rounded-xl px-4 py-3 text-sm">
                <span className="text-zinc-400">Validated at:</span>{" "}
                <span className="font-semibold">
                  {new Date(ticket.validatedAt).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Action */}
          <div className="border-t border-zinc-800 p-4">
            <button
              onClick={handleValidate}
              disabled={
                loading ||
                ticket.status !== "ACTIVE"
              }
              className="w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer disabled:cursor-not-allowed bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white"
            >
              {loading
                ? "Validating..."
                : ticket.status === "ACTIVE"
                  ? "Validate Entry"
                  : ticket.status === "USED"
                    ? "Already Used"
                    : `Ticket ${ticket.status}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
