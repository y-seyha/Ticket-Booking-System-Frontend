"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { paymentApi } from "@/features/payment/payment.api";
import { CheckoutResponse } from "@/features/payment/payment.types";
import {
  Loader2,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Copy,
  QrCode,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { toast } from "sonner";
import { QRCodeSVG } from "qrcode.react";
import CheckoutCountdown from "@/features/payment/components/CheckoutCountdown";

export default function KhqrPaymentPage() {
  return (
    <Suspense fallback={null}>
      <KhqrPaymentContent />
    </Suspense>
  );
}

function KhqrPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentId = searchParams.get("paymentId");

  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!paymentId) {
        setErrorMessage("Missing payment parameters.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await paymentApi.createCheckout({
          paymentProvider: "KHQR",
        });
        setCheckout(data);
      } catch {
        setErrorMessage("Failed to retrieve your transaction details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [paymentId]);

  useEffect(() => {
    if (!checkout || !paymentId) return;

    pollingRef.current = setInterval(async () => {
      try {
        const statusCheck = await paymentApi.createCheckout({
          paymentProvider: "KHQR",
        });

        if (statusCheck.qrCode === null) {
          if (pollingRef.current) clearInterval(pollingRef.current);
          setIsVerifying(true);
          toast.success("Payment detected successfully!");
          sessionStorage.removeItem("checkoutData");
          sessionStorage.removeItem("checkoutSummary");
          sessionStorage.removeItem("bookingFoodItems");
          sessionStorage.removeItem("foodCart");

          setTimeout(() => {
            router.push(`/bookings/confirmation/${paymentId}`);
          }, 2000);
        }
      } catch (err) {
        console.error("Polled check validation rejected:", err);
      }
    }, 4000);

    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [checkout, paymentId, router]);

  const copyToClipboard = () => {
    if (!checkout?.qrCode) return;
    navigator.clipboard.writeText(checkout.qrCode);
    setCopied(true);
    toast.info("Raw payment string saved to clipboard.");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSessionTimeout = () => {
    setErrorMessage("Your secure reservation window has expired.");
    setTimeout(() => {
      router.push("/showtimes");
    }, 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col gap-3 items-center justify-center text-xs font-mono text-zinc-500 uppercase tracking-widest">
        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
        Generating Encrypted KHQR Payload...
      </div>
    );
  }

  if (errorMessage || !checkout) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-zinc-950 flex flex-col gap-4 items-center justify-center px-4">
          <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/10 text-xs text-red-400 font-mono text-center max-w-sm">
            {errorMessage || "Invalid context profile."}
          </div>
          <button
            onClick={() => router.push("/showtimes")}
            className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Selection Map
          </button>
        </div>
        <Footer />
      </>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col gap-3 items-center justify-center text-center px-4">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-pulse" />
        <h2 className="text-lg font-black text-white tracking-tight uppercase mt-2">
          Settlement Confirmed
        </h2>
        <p className="text-xs text-zinc-400 max-w-xs font-medium">
          Preparing your electronic entry passes. Do not close or reload this
          application...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased relative overflow-x-hidden">
      <Navbar />
      {/* Decorative background ambient flare */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Main Page Container */}
      <main className="w-full pt-36 sm:pt-40 pb-24 relative z-10">
        {/* WIDE BREADCRUMB WRAPPER (Aligns far-left matching max-w-7xl navbar content grids) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-8 mb-8">
          <div className="w-full flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900 pb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => router.push("/")}
                    className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                  >
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-zinc-700" />
                <BreadcrumbItem>
                  <BreadcrumbLink
                    onClick={() => router.push("/showtimes")}
                    className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                  >
                    Showtime
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="text-zinc-700" />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-white font-bold tracking-wide">
                    KHQR Payment
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>

        {/* CENTERED NARROW CARD CONTAINER */}
        <div className="max-w-md mx-auto px-4 flex flex-col items-center">
          {/* AUTHENTIC KHQR PORTAL CONTAINER */}
          <div className="w-full bg-white text-zinc-900 rounded-3xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7)] flex flex-col items-center relative border border-zinc-200">
            {/* Authentic Crimson KHQR Header */}
            <div className="w-full bg-rose-600 text-white pt-5 pb-4 px-6 text-center flex flex-col items-center justify-center relative shadow-sm">
              <div className="flex items-center gap-1.5 mb-0.5">
                <QrCode className="w-5 h-5 text-white stroke-[2.5]" />
                <span className="text-xl font-black tracking-tight font-sans">
                  KHQR
                </span>
              </div>
              <div className="text-[10px] font-bold tracking-widest text-rose-100/90 uppercase font-sans">
                គយូអរ • Cambodia Universal QR
              </div>
            </div>

            {/* Internal Body Container with Authentic Blue / Red Corner Accents */}
            <div className="w-full p-6 flex flex-col items-center space-y-5 bg-zinc-50/50">
              {/* Account Metadata Inlay */}
              <div className="text-center w-full">
                <h2 className="text-base font-extrabold text-zinc-900 tracking-tight uppercase">
                  Cinema Box Office
                </h2>
                <p className="text-[11px] font-semibold text-zinc-400 mt-0.5 tracking-wide uppercase">
                  Phnom Penh, Cambodia
                </p>
              </div>

              {/* Simulated KHQR Stylized QR Frame wrapper */}
              <div className="relative p-6 bg-white border-2 border-zinc-200/80 rounded-2xl shadow-sm flex items-center justify-center">
                <div className="absolute top-2 left-2 w-4 h-4 border-t-4 border-l-4 border-blue-600 rounded-tl" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-4 border-r-4 border-rose-600 rounded-tr" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-4 border-l-4 border-rose-600 rounded-bl" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-4 border-r-4 border-blue-600 rounded-br" />

                {checkout.qrCode ? (
                  <QRCodeSVG
                    value={checkout.qrCode}
                    size={190}
                    level="M"
                    includeMargin={false}
                    className="mx-auto"
                  />
                ) : (
                  <div className="w-48 h-48 bg-zinc-100 flex items-center justify-center text-xs font-mono text-zinc-400 text-center rounded">
                    Missing Payload
                  </div>
                )}
              </div>

              {/* Official KHR / USD Payment Sum Area */}
              <div className="text-center space-y-0.5 bg-zinc-100/70 border border-zinc-200/50 rounded-xl py-2.5 px-6 w-full max-w-[260px]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Total Payable Amount
                </span>
                <h1 className="text-2xl font-black font-mono tracking-tight text-zinc-900">
                  ${checkout.totalAmount.toFixed(2)}
                </h1>
              </div>

              {/* Dynamic Live Countdown Element */}
              <div className="w-full text-zinc-100">
                <CheckoutCountdown
                  expiresAt={checkout.paymentExpiresAt}
                  onExpire={handleSessionTimeout}
                />
              </div>

              <div className="h-[1px] w-full bg-zinc-200" />

              {/* Technical Metadata Fields */}
              <div className="w-full bg-white border border-zinc-200 rounded-xl p-3 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-zinc-400 font-medium">
                  <span>Ecosystem Protocol:</span>
                  <span className="text-zinc-700 font-bold">
                    Bakong Member Network
                  </span>
                </div>
                <div className="flex justify-between text-zinc-400 font-medium items-center gap-2">
                  <span>Payment Reference:</span>
                  <button
                    onClick={copyToClipboard}
                    className="text-zinc-500 hover:text-zinc-900 flex items-center gap-1 transition-colors select-all font-mono"
                  >
                    <span className="truncate max-w-[140px] block font-bold">
                      {paymentId}
                    </span>
                    {copied ? (
                      <span className="text-[9px] text-emerald-600 font-sans font-bold">
                        Saved
                      </span>
                    ) : (
                      <Copy className="w-3 h-3 text-zinc-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Secure Badging */}
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-400 pt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                <span>NBC Standard End-To-End Security Protocol</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
