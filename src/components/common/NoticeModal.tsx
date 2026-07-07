"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";

export default function NoticeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);
  const hasClosed = useRef(false);

  useEffect(() => {
    const hasSeenNotice = localStorage.getItem("hasSeenEduNotice");
    if (!hasSeenNotice) {
      const frameId = requestAnimationFrame(() => {
        setIsOpen(true);
      });
      return () => cancelAnimationFrame(frameId);
    }
  }, []);

  const handleClose = () => {
    if (hasClosed.current) return;
    hasClosed.current = true;
    localStorage.setItem("hasSeenEduNotice", "true");
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    if (timeLeft <= 0) {
      handleClose();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft, isOpen]);

  const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3, ease: "easeIn" } },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 16 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 26, stiffness: 220 },
    },
    exit: {
      opacity: 0,
      scale: 0.97,
      y: 8,
      transition: { duration: 0.25, ease: "easeInOut" },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* High Blur Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-xl pointer-events-auto"
          />

          {/* Premium Dialog Card */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/90 backdrop-blur-2xl p-6 text-neutral-200 shadow-2xl md:p-8 z-10"
          >
            {/* Ambient Red Glow Backing */}
            <div className="absolute -top-20 -left-20 -z-10 h-48 w-48 rounded-full bg-red-600/15 blur-[60px] pointer-events-none" />

            {/* Khmer Salutation Header Segment */}
            <div className="flex flex-col items-center text-center mb-6">
              <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-b from-neutral-800 to-neutral-900/40 border border-white/10 mb-4 shadow-inner">
                {/* Khmer Sampeah Prayer Hands SVG (🙏) */}
                <svg
                  className="w-8 h-8 text-amber-500 animate-[sampeah_3s_ease-in-out_infinite]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path
                    d="M12 2c0 0-3 3.5-3 7.5s3 9.5 3 12.5c0-3 3-8.5 3-12.5S12 2 12 2z"
                    fill="currentColor"
                    fillOpacity="0.15"
                  />
                  <path d="M9 12c-1.5 0-2.5 1-2.5 2.5S7.5 17 9 17" />
                  <path d="M15 12c1.5 0 2.5 1 2.5 2.5S16.5 17 15 17" />
                  <path d="M12 2v2" />
                </svg>
                <style jsx global>{`
                  @keyframes sampeah {
                    0%,
                    100% {
                      transform: translateY(0) scale(1);
                    }
                    50% {
                      transform: translateY(-4px) scale(1.03);
                    }
                  }
                `}</style>
              </div>

              <h2 className="text-xl font-black tracking-tight text-white sm:text-2xl uppercase">
                Educational System Notice
              </h2>
            </div>

            {/* Content Text Matrix with Targeted High-Contrast Red & White Highlights */}
            <div className="space-y-4 text-sm leading-relaxed text-neutral-400 font-normal text-center sm:text-left">
              <p>
                This platform has been developed exclusively for{" "}
                <span className="text-white font-bold underline decoration-neutral-700 decoration-2 underline-offset-4">
                  educational and evaluation purposes
                </span>
                .
              </p>

              <p>
                All dynamic infrastructure models, media schedules, and digital
                transactions are simulated. This environment is strictly{" "}
                <span className="text-red-500 font-extrabold uppercase tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20">
                  not a commercial service
                </span>{" "}
                and must not be configured for functional real-world operations.
              </p>

              <p className="pt-4 text-neutral-400 text-xs font-medium border-t border-white/5">
                By acknowledging this dialogue, you verify that you recognize
                this setup is limited to academic review.
              </p>
            </div>

            {/* Confirmation Button */}
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleClose}
                className="relative w-full px-6 py-3.5 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 overflow-hidden flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white shadow-xl shadow-red-900/30 active:outline-none focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-neutral-900 cursor-pointer"
              >
                {/* Visual Background Countdown Loading Ribbon Fill */}
                {timeLeft > 0 && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-black/20 z-0 pointer-events-none"
                    initial={{ width: "0%" }}
                    animate={{ width: `${(5 - timeLeft) * 20}%` }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                )}

                <span className="relative z-10 flex items-center gap-2 font-mono">
                  I Understand
                  {timeLeft > 0 && (
                    <span className="bg-neutral-950/40 px-2 py-0.5 rounded-md text-xs font-black text-red-200 border border-white/5">
                      {timeLeft}s
                    </span>
                  )}
                </span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
