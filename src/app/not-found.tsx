"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white select-none relative overflow-hidden antialiased px-4">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen">
        <div className="w-[600px] sm:w-[900px] h-[500px] bg-red-950/20 rounded-full blur-[120px]" />
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
              className="w-12 h-12 text-red-500 animate-pulse"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.75 9.25l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
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
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-bold text-zinc-200 tracking-tight"
          >
            This scene was cut from the script
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm font-normal text-zinc-400 max-w-xs mx-auto leading-relaxed"
          >
            The page or cinema destination you are looking for doesn&apos;t
            exist or has been moved.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="pt-2"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all duration-300 shadow-[0_4px_20px_rgba(220,38,38,0.2)] hover:shadow-[0_4px_24px_rgba(220,38,38,0.4)] active:scale-95"
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
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
