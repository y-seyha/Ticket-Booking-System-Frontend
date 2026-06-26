"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { apiRequest } from "@/lib/config/axios";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const verificationStarted = useRef(false);

  const [status, setStatus] = useState<"loading" | "error">(
    token ? "loading" : "error",
  );
  const [errorMessage, setErrorMessage] = useState(
    token ? "" : "Verification token is missing.",
  );

  useEffect(() => {
    if (!token || verificationStarted.current) return;

    // Flag immediately to block the second synchronous execution
    verificationStarted.current = true;

    const verifyToken = async () => {
      try {
        await apiRequest(
          "get",
          `/auth/verify-email?token=${encodeURIComponent(token)}`,
        );

        // Verification succeeded
        setTimeout(() => {
          router.push("/auth/success");
        }, 2000);
      } catch (err) {
        console.error(err);

        setStatus("error");

        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("Something went wrong during verification.");
        }
      }
    };

    verifyToken();
  }, [token, router]);

  if (status === "error") {
    return (
      <div className="space-y-6 flex flex-col items-center justify-center min-h-87.5 text-center">
        <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30">
          <XCircle className="w-8 h-8 text-red-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-white">
            Verification Failed
          </h1>
          <p className="text-sm text-gray-400 max-w-sm">{errorMessage}</p>
        </div>
        <Link
          href="/auth/login"
          className="text-sm text-red-400 hover:underline"
        >
          Back to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-87.5 text-center">
      <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
      <div className="space-y-2">
        <h1 className="text-xl font-medium text-white">
          Verifying your account
        </h1>
        <p className="text-sm text-gray-400">
          Please wait a moment while we secure your access...
        </p>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-87.5">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
