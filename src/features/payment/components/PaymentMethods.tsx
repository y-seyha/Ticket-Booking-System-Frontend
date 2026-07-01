"use client";

import { CreditCard, Banknote, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentProvider } from "../payment.types";

interface PaymentMethodsProps {
  selectedProvider: PaymentProvider;
  onSelect: (provider: PaymentProvider) => void;
  isStripeComingSoon?: boolean;
}

export default function PaymentMethods({
  selectedProvider,
  onSelect,
  isStripeComingSoon = false,
}: PaymentMethodsProps) {
  const methods = [
    {
      id: "CASH" as PaymentProvider,
      label: "Cash Counter",
      desc: "Pay in person directly at the physical box office counter.",
      icon: Banknote,
      disabled: false,
    },
    {
      id: "STRIPE" as PaymentProvider,
      label: "Credit Card",
      desc: "Instant and secure digital checkout via encrypted gateway.",
      icon: CreditCard,
      disabled: isStripeComingSoon, // Governed dynamically by the prop
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div>
        <h3 className="text-[11px] font-bold tracking-[0.15em] text-zinc-500 uppercase">
          Select Settlement Method
        </h3>
      </div>

      {/* Stacked List Layout - Multiline Selection Rows */}
      <div className="flex flex-col gap-2.5 isolation-auto">
        {methods.map((method) => {
          const Icon = method.icon;
          const isSelected = selectedProvider === method.id && !method.disabled;

          return (
            <button
              key={method.id}
              type="button"
              disabled={method.disabled}
              onClick={() => !method.disabled && onSelect(method.id)}
              className={`group relative flex items-center justify-between gap-4 p-4 rounded-xl text-left border transition-all duration-300 focus:outline-none ${
                method.disabled
                  ? "bg-zinc-950/20 border-zinc-900/50 opacity-40 cursor-not-allowed select-none"
                  : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700/60 cursor-pointer"
              }`}
            >
              {/* Premium Layout Slider Dynamic Frame Animation */}
              {isSelected && (
                <motion.div
                  layoutId="activePaymentBackground"
                  className="absolute inset-0 border border-zinc-400 bg-zinc-900/90 rounded-xl -z-10"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}

              {/* Left Column: Icon + Core Content Stack */}
              <div className="flex items-center gap-4 min-w-0">
                {/* Icon Box */}
                <div
                  className={`p-2.5 rounded-lg transition-all duration-300 shrink-0 ${
                    isSelected
                      ? "bg-zinc-100 text-zinc-950 shadow-md shadow-white/5"
                      : "bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:not-disabled:text-zinc-200"
                  }`}
                >
                  <Icon className="w-4 h-4 stroke-[1.75]" />
                </div>

                {/* Vertical Text Stack */}
                <div className="space-y-0.5 min-w-0">
                  <p
                    className={`text-sm font-medium tracking-tight transition-colors duration-300 ${
                      isSelected ? "text-white" : "text-zinc-300"
                    }`}
                  >
                    {method.label}
                  </p>
                  <p
                    className={`text-xs leading-normal break-words transition-colors duration-300 max-w-md ${
                      isSelected ? "text-zinc-400" : "text-zinc-500"
                    }`}
                  >
                    {method.desc}
                  </p>
                </div>
              </div>

              {/* Right Column: Status / Action Indicator */}
              <div className="flex items-center shrink-0 pr-1">
                {method.disabled ? (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-zinc-900/80 text-zinc-500 px-1.5 py-0.5 rounded border border-zinc-800/80">
                    Soon
                  </span>
                ) : (
                  /* Subtle selection dot indicator */
                  <div
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      isSelected
                        ? "bg-white ring-4 ring-white/10 scale-100"
                        : "bg-transparent scale-50 group-hover:bg-zinc-700"
                    }`}
                  />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer Security Badge */}
      <div className="flex items-center gap-2 pt-1 text-xs text-zinc-600">
        <ShieldCheck className="w-4 h-4 text-zinc-500 shrink-0" />
        <span className="font-medium tracking-tight">
          Fully encrypted end-to-end ticketing protocol.
        </span>
      </div>
    </div>
  );
}
