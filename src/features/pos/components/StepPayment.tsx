"use client";

import { QRCodeSVG } from "qrcode.react";
import CheckoutCountdown from "@/features/payment/components/CheckoutCountdown";
import type { PaymentMethod, KhqrData } from "../pos.types";
import { Banknote, QrCode, Loader2, CheckCircle } from "lucide-react";

interface StepPaymentProps {
  grandTotal: number;
  paymentMethod: PaymentMethod;
  isProcessing: boolean;
  khqrData: KhqrData | null;
  onChangeMethod: (method: PaymentMethod) => void;
  onBack: () => void;
  onPay: () => void;
  onConfirmKhqr: () => void;
  onCancelKhqr: () => void;
}

export default function StepPayment({
  grandTotal,
  paymentMethod,
  isProcessing,
  khqrData,
  onChangeMethod,
  onBack,
  onPay,
  onConfirmKhqr,
  onCancelKhqr,
}: StepPaymentProps) {
  if (khqrData) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-lg font-black text-white uppercase tracking-wide">
            Scan QR to Pay
          </h2>
          <p className="text-4xl font-black text-white font-mono mt-2">
            ${khqrData.totalAmount.toFixed(2)}
          </p>
        </div>

        <CheckoutCountdown
          expiresAt={khqrData.expiresAt}
          onExpire={onCancelKhqr}
        />

        <div className="flex justify-center">
          <div className="bg-white p-4 rounded-2xl">
            {khqrData.qrCode ? (
              <QRCodeSVG
                value={khqrData.qrCode}
                size={200}
                level="M"
                includeMargin={false}
              />
            ) : (
              <div className="w-48 h-48 bg-zinc-100 flex items-center justify-center text-xs font-mono text-zinc-400 text-center rounded">
                Missing Payload
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-zinc-500 text-center">
          Ask customer to scan this QR with Bakong app
        </p>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancelKhqr}
            disabled={isProcessing}
            className="flex-1 py-3.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmKhqr}
            disabled={isProcessing}
            className="flex-1 py-3.5 rounded-xl bg-green-600 hover:bg-green-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Confirm Payment
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-lg font-black text-white uppercase tracking-wide">
          Payment
        </h2>
        <p className="text-4xl font-black text-white font-mono mt-4">
          ${grandTotal.toFixed(2)}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onChangeMethod("CASH")}
          className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
            paymentMethod === "CASH"
              ? "border-red-500 bg-red-500/10"
              : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
          }`}
        >
          <Banknote
            className={`w-10 h-10 ${
              paymentMethod === "CASH" ? "text-red-400" : "text-zinc-400"
            }`}
          />
          <span
            className={`font-bold text-sm ${
              paymentMethod === "CASH" ? "text-white" : "text-zinc-400"
            }`}
          >
            Cash
          </span>
          <span className="text-xs text-zinc-600 text-center">
            Accept cash payment at counter
          </span>
        </button>

        <button
          onClick={() => onChangeMethod("KHQR")}
          className={`flex flex-col items-center gap-3 p-6 rounded-2xl border-2 transition-all cursor-pointer ${
            paymentMethod === "KHQR"
              ? "border-red-500 bg-red-500/10"
              : "border-zinc-800 bg-zinc-900/60 hover:border-zinc-700"
          }`}
        >
          <QrCode
            className={`w-10 h-10 ${
              paymentMethod === "KHQR" ? "text-red-400" : "text-zinc-400"
            }`}
          />
          <span
            className={`font-bold text-sm ${
              paymentMethod === "KHQR" ? "text-white" : "text-zinc-400"
            }`}
          >
            KHQR
          </span>
          <span className="text-xs text-zinc-600 text-center">
            Scan QR with Bakong app
          </span>
        </button>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          onClick={onBack}
          disabled={isProcessing}
          className="flex-1 py-3.5 rounded-xl border border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700 text-sm font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={onPay}
          disabled={isProcessing}
          className="flex-1 py-3.5 rounded-xl bg-red-600 hover:bg-red-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white text-sm font-bold uppercase tracking-wider transition-all active:scale-[0.98] cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : paymentMethod === "CASH" ? (
            "Accept Cash"
          ) : (
            "Generate QR"
          )}
        </button>
      </div>
    </div>
  );
}
