"use client";

import { QRCodeSVG } from "qrcode.react";
import { CheckCircle, Ticket, Receipt, ShoppingBag, MapPin, Clock } from "lucide-react";
import type { PosSeat, PosFoodItem } from "../pos.types";
import type { Showtime } from "@/features/showitmes/showtimes.types";

interface StepConfirmationProps {
  bookingCode: string;
  showtime: Showtime;
  seats: PosSeat[];
  foods: PosFoodItem[];
  grandTotal: number;
  onNewSale: () => void;
  paymentMethod: string;
}

export default function StepConfirmation({
  bookingCode,
  showtime,
  seats,
  foods,
  grandTotal,
  onNewSale,
  paymentMethod,
}: StepConfirmationProps) {
  const handlePrint = () => window.print();

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500/30">
          <CheckCircle className="w-8 h-8 text-green-400" />
        </div>
        <h2 className="text-xl font-black text-white">Payment Successful</h2>
        <p className="text-sm text-zinc-500">Booking confirmed</p>
      </div>

      {/* RECEIPT CARD */}
      <div
        id="pos-receipt"
        className="rounded-2xl border border-zinc-800 bg-zinc-900/60 overflow-hidden print:border-gray-300 print:bg-white print:text-black"
      >
        {/* Header */}
        <div className="text-center pt-6 pb-4 px-6 border-b border-zinc-800 print:border-gray-300">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] print:text-gray-500">
            CineBook Cinema
          </p>
          <p className="text-xs text-zinc-600 mt-0.5 print:text-gray-400">
            Official Receipt
          </p>
          <p className="text-xl font-mono font-black text-white mt-2 tracking-wider print:text-black">
            {bookingCode.slice(0, 8).toUpperCase()}
          </p>
        </div>

        {/* QR Code */}
        <div className="flex justify-center py-4 bg-zinc-950/40 print:bg-gray-50">
          <div className="bg-white rounded-lg p-1.5">
            <QRCodeSVG
              value={bookingCode}
              size={100}
              level="M"
            />
          </div>
        </div>

        {/* Movie & Showtime */}
        <div className="px-6 py-4 space-y-3">
          <div className="flex items-start gap-3">
            <Ticket className="w-4 h-4 text-zinc-500 mt-0.5 print:text-gray-400" />
            <div>
              <p className="font-bold text-white text-sm print:text-black">
                {showtime.movie.title}
              </p>
              <p className="text-xs text-zinc-400 print:text-gray-500">
                {showtime.movie.language} · {showtime.movie.durationMinutes} min
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 print:text-gray-400" />
            <div>
              <p className="font-semibold text-white text-sm print:text-black">
                {showtime.screen?.theater?.name || "Legend Cinema"}
              </p>
              <p className="text-xs text-zinc-400 print:text-gray-500">
                {showtime.screen?.name || ""}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-4 h-4 text-zinc-500 mt-0.5 print:text-gray-400" />
            <div>
              <p className="font-semibold text-white text-sm print:text-black">
                {new Date(showtime.startTime).toLocaleDateString([], {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
              <p className="text-xs text-zinc-400 print:text-gray-500">
                {new Date(showtime.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Seats */}
        <div className="px-6 py-4 border-t border-zinc-800 print:border-gray-300">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-3 print:text-gray-500">
            Seats
          </p>
          <div className="flex flex-wrap gap-2">
            {seats.map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 text-white print:bg-gray-100 print:text-black"
              >
                <span className="font-mono font-bold text-sm">
                  {s.seatRow}{s.seatNumber}
                </span>
                <span className="text-[9px] uppercase text-zinc-500 print:text-gray-400">
                  {s.seatType}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* F&B */}
        {foods.length > 0 && (
          <div className="px-6 py-4 border-t border-zinc-800 print:border-gray-300">
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-3 flex items-center gap-1.5 print:text-gray-500">
              <ShoppingBag className="w-3 h-3" />
              Food & Beverages
            </p>
            <div className="space-y-2">
              {foods.map((f) => (
                <div
                  key={f.item.id}
                  className="flex justify-between text-sm text-zinc-400 print:text-gray-600"
                >
                  <span>
                    {f.item.name}{" "}
                    <span className="text-zinc-600 print:text-gray-400">
                      x{f.quantity}
                    </span>
                  </span>
                  <span className="font-mono text-white print:text-black">
                    ${(f.item.price * f.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Info */}
        <div className="px-6 py-4 border-t border-zinc-800 print:border-gray-300">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-500 print:text-gray-500">Payment Method</span>
            <span className="font-bold text-white print:text-black uppercase">
              {paymentMethod}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="px-6 py-5 border-t-2 border-zinc-700 print:border-gray-400 flex justify-between items-center bg-zinc-950/60 print:bg-gray-50">
          <span className="text-sm font-bold text-zinc-300 uppercase tracking-wider print:text-gray-700">
            Total Paid
          </span>
          <span className="text-2xl font-black text-white font-mono print:text-black">
            ${grandTotal.toFixed(2)}
          </span>
        </div>

        {/* Footer */}
        <div className="text-center pb-6 pt-2 px-6">
          <p className="text-[8px] text-zinc-700 uppercase tracking-[0.2em] print:text-gray-400">
            Thank you for your purchase
          </p>
          <p className="text-[8px] text-zinc-800 mt-0.5 print:text-gray-400">
            {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handlePrint}
          className="flex-1 py-3.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <Receipt className="w-4 h-4" />
          Print Receipt
        </button>
        <button
          onClick={onNewSale}
          className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer"
        >
          New Sale
        </button>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #pos-receipt,
          #pos-receipt * {
            visibility: visible;
          }
          #pos-receipt {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100%;
            border: none;
            border-radius: 0;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
