"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight } from "lucide-react";

function VerifyRequestContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your email address";

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[350px] text-center animate-fadeIn">
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.15)] animate-pulse">
        <Mail className="w-8 h-8 text-red-500" />
      </div>

      <div className="space-y-2 max-w-md">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Check Your Inbox
        </h1>
        <p className="text-sm text-gray-400 leading-relaxed">
          We have sent a verification email to{" "}
          <span className="text-red-400 font-medium break-all">{email}</span>.
          Please click the link inside to activate your account.
        </p>
      </div>

      <div className="w-full max-w-sm pt-4 border-t border-white/5 space-y-4">
        <p className="text-xs text-gray-500">
          Didn&apos;t receive an email? Check your spam folder or contact
          support.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors group"
        >
          Back to Login
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}

export default function VerifyRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyRequestContent />
    </Suspense>
  );
}
