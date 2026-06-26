"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Film, Clapperboard, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function RegisterSuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    toast.dismiss();
    toast.success("Access Granted! Enjoy the show.");

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  
  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
    }
  }, [countdown, router]);

  return (
    <div className="relative space-y-8 flex flex-col items-center justify-center min-h-87.5 text-center animate-in fade-in zoom-in-95 duration-500 max-w-md mx-auto px-4">
      {/* Dramatic Cinema Backdrop Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-600/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Cinematic Animated Icon Container */}
      <div className="relative mx-auto flex items-center justify-center w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 shadow-2xl shadow-red-950/20 group">
        <div className="absolute inset-0 rounded-2xl bg-red-500/5 animate-pulse" />
        {/* Film strip ambient track */}
        <div className="absolute left-1 top-0 bottom-0 w-1 flex flex-col justify-between py-1 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-sm" />
          ))}
        </div>

        <Clapperboard className="w-9 h-9 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.4)] animate-[bounce_2s_infinite]" />

        <div className="absolute right-1 top-0 bottom-0 w-1 flex flex-col justify-between py-1 opacity-20">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-1 h-1 bg-white rounded-sm" />
          ))}
        </div>
      </div>

      {/* Movie Pass Typography */}
      <div className="space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
          <Film className="w-3 h-3 animate-spin [animation-duration:8s]" />{" "}
          Ticket Activated
        </span>
        <h1 className="text-2xl font-black text-white tracking-tight sm:text-3xl bg-clip-text bg-gradient-to-b from-white to-zinc-400">
          Your Seat is Reserved
        </h1>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mx-auto">
          Account verified! You have been logged in. Grab your popcorn and dive
          into <span className="text-white font-semibold">YS Cineplex</span>.
        </p>
      </div>

      {/* Main Action Block */}
      <div className="w-full pt-2 flex flex-col items-center">
        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold shadow-lg shadow-red-950/50 hover:from-red-500 hover:to-amber-500 active:scale-[0.98] transition-all tracking-wide"
        >
          Explore Showtimes
          <ArrowRight className="w-4 h-4" />
        </Link>

        {/* Film countdown ticker */}
        <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>
            Starting feature presentation in{" "}
            <strong className="text-zinc-300 font-bold">{countdown}s</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
