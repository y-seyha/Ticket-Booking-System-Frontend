"use client";

import Link from "next/link";
import { usePageTitle } from "@/hooks/usePageTitle";
import { motion } from "framer-motion";

export default function Unauthorized() {
  usePageTitle("Unauthorized");
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white select-none relative overflow-hidden antialiased px-4">
      {/* Background Cinematic Aura glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen">
        <div className="w-[600px] sm:w-[900px] h-[500px] bg-amber-950/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 text-center max-w-md mx-auto space-y-8">
        {/* Animated Icon Block */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center"
        >
          <div className="p-5 rounded-3xl bg-zinc-900/40 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-amber-500 animate-pulse"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        </motion.div>

        {/* Typography Content */}
        <div className="space-y-3">
          <motion.h1
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-6xl sm:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-zinc-200 to-zinc-500"
          >
            403
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-bold text-zinc-200 tracking-tight"
          >
            VIP Access Only
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm font-normal text-zinc-400 max-w-xs mx-auto leading-relaxed"
          >
            Your current account credentials lack the permissions needed to cross this clearance checkpoint.
          </motion.p>
        </div>

        {/* Home Button Redirect Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-2"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700/50 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.3)] active:scale-95"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
            Go Back Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}