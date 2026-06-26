"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ShieldCheck, Loader2, CheckCircle2 } from "lucide-react";
import axios from "axios";
import { apiRequest } from "@/lib/config/axios";

interface Setup2FAResponse {
  qrCode: string;
  secret: string;
}

export default function Setup2FAPage() {
  const router = useRouter();
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const [secretKey, setSecretKey] = useState<string | null>(null);
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(""));
  const [loadingSetup, setLoadingSetup] = useState(true);
  const [loadingEnable, setLoadingEnable] = useState(false);
  const [completed, setCompleted] = useState(false);

  const [step, setStep] = useState<1 | 2>(1);

  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    async function fetchSetupParameters() {
      try {
        const data = await apiRequest<Setup2FAResponse>(
          "post",
          "/auth/2fa/setup",
        );
        setQrCodeData(data.qrCode);
        setSecretKey(data.secret);
      } catch (error) {
        let errorMessage = "Failed to initiate 2FA security setup parameters.";
        if (axios.isAxiosError(error)) {
          errorMessage =
            error.response?.data?.message || error.message || errorMessage;
        }
        toast.error(errorMessage);
      } finally {
        setLoadingSetup(false);
      }
    }
    fetchSetupParameters();
  }, []);

  const executeEnable2FA = useCallback(async (finalCode: string) => {
    setLoadingEnable(true);
    try {
      await apiRequest<{ message: string }>("post", "/auth/2fa/enable", {
        code: finalCode,
      });
      toast.success("Two-factor configuration activated safely.");
      setCompleted(true);
    } catch (error) {
      let errorMessage =
        "Activation failed. The code entered may be incorrect.";
      if (axios.isAxiosError(error)) {
        errorMessage =
          error.response?.data?.message || error.message || errorMessage;
      }
      toast.error(errorMessage);
      setCodeDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    } finally {
      setLoadingEnable(false);
    }
  }, []);

  const handleVerifyAndEnableForm = (e: React.FormEvent) => {
    e.preventDefault();
    const combinedCode = codeDigits.join("");
    if (combinedCode.length === 6 && /^\d+$/.test(combinedCode)) {
      executeEnable2FA(combinedCode);
    }
  };

  // Segmented Box Interactivity Rules
  const handleInputChange = (value: string, index: number) => {
    const cleanValue = value.replace(/\D/g, ""); // Keep only digits
    if (!cleanValue) return;

    const singleDigit = cleanValue.substring(cleanValue.length - 1);

    const newDigits = [...codeDigits];
    newDigits[index] = singleDigit;
    setCodeDigits(newDigits);

    const combinedCode = newDigits.join("");

    // Auto-trigger API route configuration instantly upon completeness
    if (combinedCode.length === 6 && /^\d+$/.test(combinedCode)) {
      executeEnable2FA(combinedCode);
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
        executeEnable2FA(pastedData);
      } else {
        inputRefs.current[pastedData.length]?.focus();
      }
    }
  };

  if (loadingSetup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-zinc-400 gap-2">
        <Loader2 className="w-6 h-6 animate-spin text-red-500" />
        <p className="text-xs">Generating secure crypto secret variables...</p>
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
            2FA Activated
          </h1>
          <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
            Your account authentication vector is fully modified and secured
            with hardware-tied rotating rulesets.
          </p>
        </div>
        <button
          onClick={() => router.push("/profile")}
          className="px-6 h-10 inline-flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-medium text-white hover:bg-zinc-800 transition-all duration-300 active:scale-[0.98] cursor-pointer"
        >
          Finish Setup
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-sm mx-auto flex flex-col pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-1 text-center md:text-left">
        <h1 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2 justify-center md:justify-start">
          <ShieldCheck className="w-5 h-5 text-red-500 shrink-0" /> Configure
          2FA
        </h1>
        <p className="text-xs text-zinc-400 leading-relaxed">
          {step === 1
            ? "Scan the barcode structure visualization layout below with Google Authenticator or multi-pass systems."
            : "Enter the temporary rotating code generated by your system application to lock down authorization rules."}
        </p>
      </div>

      {/* STEP 1: Scan QR Layout */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          {qrCodeData && (
            <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white border border-zinc-800 w-44 h-44 mx-auto shadow-md transition-transform duration-300 hover:scale-[1.02]">
              <img
                src={qrCodeData}
                alt="TOTP QR Code Target Block"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          {secretKey && (
            <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-1">
              <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider text-center md:text-left">
                Manual Secret Parameter String
              </p>
              <p className="text-xs font-mono text-zinc-300 break-all select-all tracking-wider text-center selection:bg-red-500/30">
                {secretKey}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm font-medium text-white hover:bg-zinc-800 active:scale-[0.98] transition-all duration-300 shadow-md cursor-pointer"
          >
            I have scanned the QR code
          </button>
        </div>
      )}

      {/* STEP 2: Input and Submit Activation */}
      {step === 2 && (
        <form
          onSubmit={handleVerifyAndEnableForm}
          className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300"
        >
          <div className="space-y-3">
            <label
              className="text-xs font-medium text-zinc-400 block text-center md:text-left"
              htmlFor="code-digit-0"
            >
              Verify Validation Token
            </label>

            {/* Segmented OTP Layout Rows */}
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
                  disabled={loadingEnable}
                  autoFocus={idx === 0}
                  onChange={(e) => handleInputChange(e.target.value, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className="w-12 h-14 text-center text-lg font-semibold font-mono rounded-xl bg-zinc-900/50 border border-zinc-800 text-white focus:border-red-500/60 focus:bg-zinc-900/90 focus:ring-1 focus:ring-red-500/20 outline-none transition-all duration-200 select-all disabled:opacity-50"
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              disabled={loadingEnable}
              onClick={() => {
                setStep(1);
                setCodeDigits(Array(6).fill(""));
              }}
              className="px-4 h-11 flex items-center justify-center rounded-xl bg-transparent border border-zinc-800 text-xs font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all duration-300 disabled:opacity-20 active:scale-[0.98]"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loadingEnable || codeDigits.join("").length !== 6}
              className="flex-1 h-11 flex items-center justify-center gap-2 rounded-xl bg-red-600 text-sm font-medium text-white hover:bg-red-500 active:scale-[0.98] disabled:opacity-20 disabled:pointer-events-none transition-all duration-300 shadow-lg shadow-red-950/20 cursor-pointer"
            >
              {loadingEnable ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Verify & Turn On 2FA"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
