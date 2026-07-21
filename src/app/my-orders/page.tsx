"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingCart, ChevronRight, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { foodAndBeverageApi } from "@/features/foods-and-beverage/foods-and-beverage.api";
import { useAuthStore } from "@/features/auth/auth.store";
import { useRouter } from "next/navigation";
import type { UserFoodOrder } from "@/features/foods-and-beverage/foods-and-beverage.types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  EXPIRED: {
    label: "Expired",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  },
};

export default function MyOrdersPage() {
  usePageTitle("My Orders");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrated = useAuthStore((s) => s.hydrated);
  const [orders, setOrders] = useState<UserFoodOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hydrated && !user) {
      router.push("/auth/login");
      return;
    }
    if (!hydrated) return;

    const fetchOrders = async () => {
      try {
        const data = await foodAndBeverageApi.getMyOrders();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [hydrated, user, router]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans antialiased">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 md:px-8 pt-32 pb-24">
        <div className="mb-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
                  Home
                </Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-zinc-700" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold">
                  My Orders
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-black tracking-tight uppercase">
            Food & Beverage Orders
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-zinc-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 text-zinc-600">
            <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-bold">No orders yet</p>
            <p className="text-sm mt-2">Food orders will appear here after you make a purchase.</p>
            <Link
              href="/food-and-drinks"
              className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-500 transition"
            >
              <ShoppingCart className="w-4 h-4" />
              Browse Menu
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {orders.map((order) => {
              const status = statusConfig[order.status] || statusConfig.PENDING;
              const createdDate = new Date(order.createdAt);
              return (
                <div
                  key={order.bookingId}
                  className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 hover:border-zinc-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-white truncate">
                          Order #{order.bookingCode.slice(0, 8)}
                        </h3>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-zinc-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {createdDate.toLocaleDateString([], {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          {createdDate.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <span>{order.items.length} item{order.items.length !== 1 ? "s" : ""}</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {order.items.map((item) => (
                          <span
                            key={item.id}
                            className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded"
                          >
                            {item.name} x{item.quantity}
                          </span>
                        ))}
                      </div>

                      {order.paymentStatus && (
                        <div className="flex items-center gap-1.5 mt-2">
                          {order.paymentStatus === "SUCCESS" ? (
                            <CheckCircle className="w-3 h-3 text-green-400" />
                          ) : (
                            <XCircle className="w-3 h-3 text-zinc-500" />
                          )}
                          <span className="text-[10px] font-medium text-zinc-500 uppercase">
                            Payment: {order.paymentStatus}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 text-right flex flex-col items-end gap-2">
                      <div className="text-sm font-bold text-zinc-300">
                        ${Number(order.totalAmount).toFixed(2)}
                      </div>
                      <div className="text-[10px] text-zinc-600 flex items-center gap-1">
                        View details
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
