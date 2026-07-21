"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import {
  CheckoutResponse,
  PaymentProvider,
} from "@/features/payment/payment.types";
import { paymentApi } from "@/features/payment/payment.api";
import { showtimesApi } from "@/features/showitmes/showtimes.api";
import { foodAndBeverageApi } from "@/features/foods-and-beverage/foods-and-beverage.api";
import { Loader2 } from "lucide-react";
import CheckoutCountdown from "@/features/payment/components/CheckoutCountdown";
import PaymentMethods from "@/features/payment/components/PaymentMethods";
import OrderSummary from "@/features/payment/components/OrderSummary";
import { usePageTitle } from "@/hooks/usePageTitle";
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

interface CartItemPayload {
  lockId: string;
  expiresAt: string;
  movie: { id: string; title: string };
  seat: { id: string; row: string; number: number; type: string };
}

interface CartResponseData {
  items: CartItemPayload[];
}

interface FoodItemStorage {
  foodItemId: string;
  name: string;
  price: number;
  quantity: number;
}

interface BackendErrorResponse {
  message: string;
}

export default function CheckoutPage() {
  usePageTitle("Checkout");
  const router = useRouter();
  const bootstrapCalled = useRef(false);

  const [summary, setSummary] = useState({
    movieTitle: "",
    showtimeDetails: "",
    seats: [] as Array<{ label: string; type: string }>,
  });

  const [foodItems, setFoodItems] = useState<FoodItemStorage[]>([]);
  const [checkout, setCheckout] = useState<CheckoutResponse | null>(null);
  const [provider, setProvider] = useState<PaymentProvider>("KHQR");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [cartExpiresAt, setCartExpiresAt] = useState<string | null>(null);
  const [hasSeats, setHasSeats] = useState(false);

  const foodTotal = useMemo(
    () => foodItems.reduce((sum, f) => sum + Number(f.price) * f.quantity, 0),
    [foodItems],
  );

  useEffect(() => {
    if (bootstrapCalled.current) return;
    bootstrapCalled.current = true;

    const bootstrapCheckout = async () => {
      try {
        setIsLoading(true);

        const stored = sessionStorage.getItem("bookingFoodItems");
        let parsedFood: FoodItemStorage[] = [];
        if (stored) {
          parsedFood = JSON.parse(stored);
          setFoodItems(parsedFood);
        }

        let hasSeatsLocally = false;
        let cartData: CartResponseData | null = null;
        try {
          cartData =
            (await showtimesApi.getCart()) as unknown as CartResponseData;
        } catch {
          cartData = null;
        }

        if (cartData && cartData.items && cartData.items.length > 0) {
          hasSeatsLocally = true;
          setHasSeats(true);
          const firstItem = cartData.items[0];
          setCartExpiresAt(firstItem.expiresAt);
          const expiresTime = new Date(firstItem.expiresAt);

          const summaryData = {
            movieTitle: firstItem.movie.title,
            showtimeDetails: `Reservation expires at ${expiresTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`,
            seats: cartData.items.map((item) => ({
              label: `Row ${item.seat.row} - Seat ${item.seat.number}`,
              type: item.seat.type,
            })),
          };
          setSummary(summaryData);

          const data = await paymentApi.createCheckout({
            paymentProvider: "KHQR",
            foodItems:
              parsedFood.length > 0
                ? parsedFood.map((f) => ({
                    foodItemId: f.foodItemId,
                    quantity: f.quantity,
                  }))
                : undefined,
          });
          setCheckout(data);
          setProvider(data.paymentProvider);

          sessionStorage.setItem(
            "checkoutData",
            JSON.stringify({
              bookingId: data.bookingId,
              bookingCode: data.bookingCode,
              totalAmount: data.totalAmount,
              paymentId: data.paymentId,
              paymentProvider: data.paymentProvider,
              paymentExpiresAt: data.paymentExpiresAt,
              paymentStatus: data.paymentStatus,
            }),
          );
          sessionStorage.setItem(
            "checkoutSummary",
            JSON.stringify({
              ...summaryData,
              cartExpiresAt: firstItem.expiresAt,
            }),
          );
        }

        if (!hasSeatsLocally) {
          const storedCheckout = sessionStorage.getItem("checkoutData");
          const storedSummary = sessionStorage.getItem("checkoutSummary");
          if (storedCheckout && storedSummary) {
            const parsedCheckout = JSON.parse(storedCheckout);
            const parsedSummary = JSON.parse(storedSummary);
            setHasSeats(true);
            setCartExpiresAt(parsedSummary.cartExpiresAt);
            setSummary({
              movieTitle: parsedSummary.movieTitle,
              showtimeDetails: parsedSummary.showtimeDetails,
              seats: parsedSummary.seats,
            });
            setCheckout(parsedCheckout);
            setProvider(parsedCheckout.paymentProvider);
          } else if (parsedFood.length === 0) {
            throw new Error("No items to checkout.");
          }
        }
      } catch (err) {
        const axiosError = err as AxiosError<BackendErrorResponse>;
        const genericError = err as Error;
        setErrorMessage(
          axiosError.response?.data?.message ||
            genericError.message ||
            "Failed to initialize secure checkout session.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapCheckout();
  }, []);

  const handleProviderChange = async (
    nextProvider: PaymentProvider,
  ): Promise<void> => {
    setProvider(nextProvider);
    setErrorMessage(null);
    if (!checkout) return;
    try {
      const updatedCheckout = await paymentApi.changePaymentMethod(
        checkout.paymentId,
        { paymentProvider: nextProvider },
      );
      setCheckout(updatedCheckout);
    } catch (err) {
      const axiosError = err as AxiosError<BackendErrorResponse>;
      setErrorMessage(
        axiosError.response?.data?.message || "Could not switch method.",
      );
    }
  };

  const handlePlaceOrder = async (): Promise<void> => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      if (hasSeats && checkout) {
        if (provider === "CASH") {
          const response = await paymentApi.payCash({
            paymentId: checkout.paymentId,
          });
          clearCheckoutStorage();
          toast.success("Checkout Complete via Cash Counter");
          router.push(`/bookings/confirmation/${response.bookingId}`);
        } else if (provider === "KHQR") {
          router.push(`/checkout/khqr?paymentId=${checkout.paymentId}`);
        }
      } else {
        const order = await foodAndBeverageApi.createFoodOrder({
          items: foodItems.map((f) => ({
            foodItemId: f.foodItemId,
            quantity: f.quantity,
          })),
        });
        sessionStorage.setItem(
          "foodOrderConfirmation",
          JSON.stringify({
            bookingId: order.bookingId,
            bookingCode: order.bookingCode,
            totalAmount: order.totalAmount,
            status: order.status,
            provider,
            items: foodItems.map((f) => ({
              name: f.name,
              price: f.price,
              quantity: f.quantity,
            })),
          }),
        );
        sessionStorage.removeItem("bookingFoodItems");
        sessionStorage.removeItem("foodCart");
        toast.success(
          `Order placed! Code: ${order.bookingCode.slice(0, 8).toUpperCase()}`,
        );
        router.push(`/bookings/confirmation/${order.bookingId}`);
      }
    } catch (err) {
      const axiosError = err as AxiosError<BackendErrorResponse>;
      const genericError = err as Error;
      setErrorMessage(
        axiosError.response?.data?.message ||
          genericError.message ||
          "Failed to process your order.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearCheckoutStorage = (): void => {
    sessionStorage.removeItem("checkoutData");
    sessionStorage.removeItem("checkoutSummary");
    sessionStorage.removeItem("bookingFoodItems");
    sessionStorage.removeItem("foodCart");
  };

  const handleSessionTimeout = (): void => {
    setErrorMessage("Your secure reservation window has expired.");
    setIsSubmitting(true);
    clearCheckoutStorage();
    setTimeout(() => {
      router.push(`/showtimes`);
    }, 2500);
  };

  const showLoading = isLoading || (hasSeats && !checkout);

  if (showLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col gap-3 items-center justify-center text-xs font-mono tracking-widest text-zinc-500 uppercase">
        <Loader2 className="w-4 h-4 animate-spin text-white" />
        {errorMessage ? (
          <span className="text-red-400 max-w-xs text-center normal-case tracking-normal px-4">
            {errorMessage}
          </span>
        ) : (
          "Syncing Secure Cart Session..."
        )}
      </div>
    );
  }

  if (errorMessage && !hasSeats && foodItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col gap-3 items-center justify-center text-xs font-mono tracking-widest text-zinc-500 uppercase">
        <span className="text-red-400 max-w-xs text-center normal-case tracking-normal px-4">
          {errorMessage}
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 font-sans antialiased relative overflow-x-hidden">
      <Navbar />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-125 sm:h-125 bg-red-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      <main className="max-w-7xl mx-auto px-4 md:px-8 pt-32 pb-24 relative z-10">
        <div className="mb-8 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-900/80 pb-4">
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
                  onClick={() => router.back()}
                  className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                >
                  Food & Drinks
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-zinc-700" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold tracking-wide">
                  Checkout
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <span className="text-[10px] font-mono tracking-widest text-zinc-600 font-bold select-none sm:text-right">
            SECURE TRANSACT v2.0
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-start">
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 bg-zinc-900/20 backdrop-blur-xl border border-zinc-900/80 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
            {hasSeats && (
              <CheckoutCountdown
                expiresAt={cartExpiresAt || checkout!.paymentExpiresAt}
                onExpire={handleSessionTimeout}
              />
            )}

            <PaymentMethods
              selectedProvider={provider}
              onSelect={handleProviderChange}
            />

            {errorMessage && (
              <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/10 text-xs font-semibold tracking-wide text-red-400 break-words">
                {errorMessage}
              </div>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
              className="w-full h-12 flex items-center justify-center bg-white text-zinc-950 text-xs font-black uppercase tracking-[0.2em] rounded-xl hover:bg-zinc-200 disabled:bg-zinc-900 disabled:text-zinc-600 disabled:border disabled:border-zinc-800 transition-all active:scale-[0.99] cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : provider === "CASH" ? (
                hasSeats ? "Pay at Counter" : "Place Order (Cash)"
              ) : (
                hasSeats ? "Generate KHQR Payment" : "Place Order (KHQR)"
              )}
            </button>
          </div>

          <aside className="order-1 lg:order-2 lg:col-span-5 lg:sticky lg:top-28 bg-zinc-900/20 backdrop-blur-xl border border-zinc-900/80 rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl">
            <OrderSummary
              movieTitle={summary.movieTitle}
              showtimeDetails={summary.showtimeDetails}
              seats={summary.seats}
              foodItems={foodItems.map((f) => ({
                name: f.name,
                quantity: f.quantity,
                price: f.price,
              }))}
              totalAmount={hasSeats && checkout ? checkout.totalAmount : foodTotal}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
