"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function OAuthSuccessPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    toast.success("Successfully signed in!");

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) return 100;
        return p + 5;
      });
    }, 600);

    const timer = setTimeout(() => {
      router.replace("/");
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [router]);

  return (
    <div className="space-y-6 flex flex-col items-center justify-center min-h-[350px] text-center">
      {/* Status Icon Wrapper */}
      <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 shadow-[0_0_20px_rgba(220,38,38,0.15)]">
        <CheckCircle2 className="w-8 h-8 text-red-500" />
      </div>

      {/* Header Info */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-white tracking-tight">
          Welcome Back!
        </h1>
        <p className="text-sm text-gray-400">
          You have successfully signed in via social login.
        </p>
      </div>

      {/* Loading Bar (Matches your form elements style layout) */}
      <div className="w-full max-w-sm pt-4 space-y-3">
        <div className="h-3 w-full bg-white/5 border border-white/10 rounded-full overflow-hidden p-[2px]">
          <div
            className="h-full bg-red-600 rounded-full transition-all duration-100 ease-out shadow-[0_0_10px_rgba(220,38,38,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 font-medium tracking-wide animate-pulse">
          Redirecting to home...
        </p>
      </div>
    </div>
  );
}
