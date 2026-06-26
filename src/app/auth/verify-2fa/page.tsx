"use client";

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Suspense,
} from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Loader2, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { User } from "@/features/auth/auth.types";
import { apiRequest } from "@/lib/config/axios";

interface Verify2FAResponse {
  success: boolean;
  user: User;
}

function Verify2FAContent() {
  const searchParams = useSearchParams();

  const tempToken = searchParams.get("tempToken");

  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  const executeVerification = useCallback(
    async (finalCode: string) => {
      if (!tempToken) {
        toast.error("Authentication session missing.");
        return;
      }

      setLoading(true);
      try {
        await apiRequest<Verify2FAResponse>("post", "/auth/2fa/verify", {
          tempToken,
          code: finalCode,
        });

        toast.success("Authenticated successfully.");
        setCompleted(true);
      } catch (error) {
        let errorMessage = "Verification failed. Please try again.";
        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message || error.message || errorMessage;
        } else if (error instanceof Error) {
          errorMessage = error.message;
        }
        toast.error(errorMessage);
        setCodeDigits(Array(6).fill(""));
        inputRefs.current[0]?.focus();
      } finally {
        setLoading(false);
      }
    },
    [tempToken],
  );

  useEffect(() => {
    if (!completed) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          window.location.href = "/";
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [completed]);

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedCode = codeDigits.join("");
    if (combinedCode.length === 6 && /^\d+$/.test(combinedCode)) {
      executeVerification(combinedCode);
    }
  };

  const handleInputChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, "");
    if (!cleanValue) {
      const newDigits = [...codeDigits];
      newDigits[index] = "";
      setCodeDigits(newDigits);
      return;
    }

    const singleDigit = cleanValue.substring(cleanValue.length - 1);
    const newDigits = [...codeDigits];
    newDigits[index] = singleDigit;
    setCodeDigits(newDigits);

    const combinedCode = newDigits.join("");

    if (combinedCode.length === 6 && /^\d+$/.test(combinedCode)) {
      executeVerification(combinedCode);
      return;
    }

    if (index < 5 && singleDigit) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!codeDigits[index] && index > 0) {
        const newDigits = [...codeDigits];
        newDigits[index - 1] = "";
        setCodeDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...codeDigits];
        newDigits[index] = "";
        setCodeDigits(newDigits);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (pastedData.length > 0) {
      const newDigits = Array(6).fill("");
      for (let i = 0; i < pastedData.length; i++) {
        newDigits[i] = pastedData[i];
      }
      setCodeDigits(newDigits);

      if (pastedData.length === 6) {
        executeVerification(pastedData);
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  if (!tempToken) {
    return (
      <div className="text-center space-y-4 max-w-sm mx-auto py-12 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
        <p className="text-red-500 font-medium text-base tracking-tight">
          Session Invalid
        </p>
        <p className="text-xs text-zinc-400 leading-relaxed">
          Your two-factor authentication session has expired or is missing
          arguments.
        </p>
        <div className="pt-2">
          <Link
            href="/auth/login"
            className="inline-flex h-9 px-4 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors duration-300"
          >
            Return to login
          </Link>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-md mx-auto pt-12 md:pt-16 animate-in fade-in zoom-in-95 duration-500">
        <div className="w-16 h-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-xl">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 drop-shadow-[0_0_10px_rgba(16,185,129,0.25)] animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Access Authorized
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-sm mx-auto">
            Secure login verification passed. Accessing account in{" "}
            <span className="text-emerald-400 font-semibold tabular-nums px-0.5">
              {countdown}s
            </span>
            ...
          </p>
        </div>
        <button
          onClick={() => {
            window.location.href = "/";
          }}
          className="text-sm text-zinc-400 hover:text-white transition-colors duration-300 flex items-center gap-2 pt-4 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Proceed immediately
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-sm mx-auto flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 text-center md:text-left mb-1">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" /> Two-Factor
          Access
        </h1>
        <p className="text-xs text-zinc-400">
          Enter the 6-digit verification code generated by your authenticator
          application.
        </p>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        <div className="space-y-3">
          <label
            className="text-xs font-medium text-zinc-400 block text-center md:text-left"
            htmlFor="code-digit-0"
          >
            Verification Code
          </label>

          <div
            className="flex justify-between items-center gap-2"
            onPaste={handlePaste}
          >
            {codeDigits.map((digit, idx) => (
              <input
                key={idx}
                id={`code-digit-${idx}`}
                ref={(el) => {
                  if (el) inputRefs.current[idx] = el;
                }}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                disabled={loading}
                onChange={(e) => handleInputChange(e.target.value, idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className="w-12 h-14 text-center text-lg font-semibold font-mono rounded-xl bg-zinc-900/50 border border-zinc-800 text-white focus:border-red-500/60 focus:bg-zinc-900/90 focus:ring-1 focus:ring-red-500/20 outline-none transition-all duration-200 select-all disabled:opacity-50"
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || codeDigits.join("").length !== 6}
          className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-500 active:scale-[0.98] disabled:opacity-20 disabled:pointer-events-none transition-all duration-300 shadow-lg shadow-red-950/20 cursor-pointer"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            "Verify Identity"
          )}
        </button>
      </form>

      <div className="text-center mt-1">
        <Link
          href="/auth/login"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors duration-300"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}

export default function Verify2FAPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-zinc-500" />
        </div>
      }
    >
      <Verify2FAContent />
    </Suspense>
  );
}
