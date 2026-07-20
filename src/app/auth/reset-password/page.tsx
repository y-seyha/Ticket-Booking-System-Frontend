"use client";

import React, { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import {
  Lock,
  Loader2,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/config/axios";
import axios from "axios";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!completed) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/auth/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [completed, router]);

  // Internal validation logic
  const isValidForm =
    newPassword.length >= 8 &&
    /[A-Z]/.test(newPassword) &&
    /[0-9]/.test(newPassword) &&
    newPassword === confirmNewPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token is missing.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      toast.error(
        "Password must contain at least one uppercase letter and one number.",
      );
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await apiRequest<void>(
        "post",
        `/auth/reset-password?token=${encodeURIComponent(token)}`,
        {
          newPassword,
          confirmNewPassword,
        },
      );

      toast.success("Password updated successfully.");
      setCompleted(true);
    } catch (error) {
      let errorMessage = "An error occurred. Please try again.";

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

  if (!token) {
    return (
      <div className="text-center space-y-4 max-w-sm mx-auto py-12 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
        <p className="text-red-500 font-medium text-base tracking-tight">
          Invalid Reset Link
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          This password reset link is invalid or has expired.
        </p>
        <div className="pt-2">
          <Link
            href="/auth/forgot-password"
            className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors duration-200"
          >
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto pt-12 md:pt-16 animate-in fade-in zoom-in-95 duration-300">
        {/* Animated Success Icon Container */}
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.15)] animate-bounce" />
        </div>

        {/* Messaging Layout */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Password Updated
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Your credentials have been successfully updated. Redirecting to
            login in{" "}
            <span className="text-emerald-400 font-semibold tabular-nums px-0.5">
              {countdown}s
            </span>
            ...
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
    <div className="space-y-6 max-w-sm mx-auto flex flex-col pt-2 animate-in fade-in slide-in-from-bottom-3 duration-300 ease-out">
      {/* Header Context */}
      <div className="space-y-1 text-center md:text-left mb-1">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" /> Reset
          Password
        </h1>
        <p className="text-xs text-zinc-400">
          Enter your new password parameters below to update your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* NEW PASSWORD FIELD */}
        <div className="space-y-3">
          <label
            className="text-xs font-medium text-zinc-400"
            htmlFor="password"
          >
            New Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500/70 transition-colors duration-200" />
            <input
              id="password"
              type={showPass ? "text" : "password"}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-zinc-900/40 border border-zinc-800 focus:border-red-500/60 text-white placeholder-zinc-600 outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors duration-200"
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* CONFIRM PASSWORD FIELD */}
        <div className="space-y-3">
          <label
            className="text-xs font-medium text-zinc-400"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-red-500/70 transition-colors duration-200" />
            <input
              id="confirmPassword"
              type={showConfirmPass ? "text" : "password"}
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm rounded-xl bg-zinc-900/40 border border-zinc-800 focus:border-red-500/60 text-white placeholder-zinc-600 outline-none transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPass(!showConfirmPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 p-1 rounded transition-colors duration-200"
            >
              {showConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* REFINED CTA BUTTON COMPONENT */}
        <button
          type="submit"
          disabled={loading || !isValidForm}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-500 active:scale-[0.99] disabled:opacity-20 disabled:pointer-events-none transition-all duration-200 shadow-md shadow-red-950/10 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Update Password"
          )}
        </button>
      </form>

      {/* BACK TO LOGIN NAVIGATION */}
      <div className="text-center mt-1">
        <Link
          href="/auth/login"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-200"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
