"use client";

import { useState } from "react";
import { toast } from "sonner";
import { KeyRound, Mail, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/config/axios";
import axios from "axios";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      // Utilizing your custom apiRequest helper
      await apiRequest<void>("post", "/auth/forgot-password", { email });

      setIsSubmitted(true);
      toast.success("Reset link dispatch managed securely.");
    } catch (error) {
      let errorMessage = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto pt-12 md:pt-16 animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl">
          <Mail className="w-8 h-8 text-amber-500 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Check Your Inbox
          </h1>
          <p className="text-sm text-zinc-400">
            If an account exists for{" "}
            <span className="text-white font-medium">{email}</span>, a secure
            password modification link has been dispatched.
          </p>
        </div>
        <Link
          href="/auth/login"
          className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2 pt-4"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Log In
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col pt-4 animate-in fade-in duration-300">
      {/* Header Context */}
      <div className="space-y-1 text-center md:text-left mb-8">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
          <KeyRound className="w-5 h-5 text-red-500" /> Forgot Password
        </h1>
        <p className="text-xs text-zinc-400">
          Enter your email address to receive a secure password reset link.
        </p>
      </div>

      {/* Form Field Matrix */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-3">
          <label className="text-xs font-medium text-zinc-400" htmlFor="email">
            Email address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-900/40 border border-zinc-800 focus:border-red-500/80 text-white placeholder-zinc-600 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-500 active:scale-[0.99] disabled:opacity-40 disabled:pointer-events-none transition-all shadow-md shadow-red-950/20 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Send Reset Link"
          )}
        </button>
      </form>

      {/* Navigation Anchors */}
      <div className="text-center mt-6">
        <Link
          href="/auth/login"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
