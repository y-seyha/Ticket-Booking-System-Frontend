"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Minus, X, ShoppingCart, Ticket, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { showtimesApi, BackendCartResponse } from "@/features/showitmes/showtimes.api";
import { foodAndBeverageApi } from "@/features/foods-and-beverage/foods-and-beverage.api";
import { useAuthStore } from "@/features/auth/auth.store";
import type { FoodCategory, FoodItem } from "@/features/foods-and-beverage/foods-and-beverage.types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface CartItem {
  item: FoodItem;
  quantity: number;
}

const CART_STORAGE_KEY = "foodCart";

export default function ShowtimeFoodPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const user = useAuthStore((s) => s.user);

  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [cartData, setCartData] = useState<BackendCartResponse | null>(null);
  const restored = useRef(false);
  const syncReady = useRef(false);

  useEffect(() => {
    if (!user) {
      router.push("/auth/login");
      return;
    }

    const init = async () => {
      try {
        const [cats, cartRes] = await Promise.all([
          foodAndBeverageApi.getCategories(),
          showtimesApi.getCart(),
        ]);
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0].id);
        setCartData(cartRes as unknown as BackendCartResponse);

        const stored = sessionStorage.getItem(CART_STORAGE_KEY);
        if (stored && !restored.current) {
          try {
            const parsed: { id: string; quantity: number }[] = JSON.parse(stored);
            const allItems = cats.flatMap((c) => c.items);
            const restoredCart: CartItem[] = [];
            for (const entry of parsed) {
              const match = allItems.find((i) => i.id === entry.id);
              if (match) {
                restoredCart.push({ item: match, quantity: entry.quantity });
              }
            }
            if (restoredCart.length > 0) {
              setCart(restoredCart);
              restored.current = true;
            }
          } catch {
            sessionStorage.removeItem(CART_STORAGE_KEY);
          }
        }
      } catch {
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
        syncReady.current = true;
      }
    };
    init();
  }, [user, router]);

  useEffect(() => {
    if (!syncReady.current) return;
    const data = cart.map((c) => ({ id: c.item.id, quantity: c.quantity }));
    if (data.length > 0) {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
    } else {
      sessionStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cart]);

  const addToCart = (item: FoodItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c,
        );
      }
      return [...prev, { item, quantity: 1 }];
    });
    toast.success(`${item.name} added`);
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.item.id === itemId);
      if (existing && existing.quantity > 1) {
        return prev.map((c) =>
          c.item.id === itemId ? { ...c, quantity: c.quantity - 1 } : c,
        );
      }
      return prev.filter((c) => c.item.id !== itemId);
    });
  };

  const removeItemCompletely = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.item.id !== itemId));
    toast.success("Item removed");
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem(CART_STORAGE_KEY);
    toast.success("Cart cleared");
  };

  const cartTotal = cart.reduce((sum, c) => sum + Number(c.item.price) * c.quantity, 0);
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleProceed = () => {
    if (cart.length > 0) {
      sessionStorage.setItem("bookingFoodItems", JSON.stringify(cart.map((c) => ({
        foodItemId: c.item.id,
        name: c.item.name,
        price: c.item.price,
        quantity: c.quantity,
      }))));
    } else {
      sessionStorage.removeItem("bookingFoodItems");
    }
    router.push("/checkout");
  };

  const activeCategories = categories.filter((c) => c.isActive);
  const activeItems = activeCategories.find((c) => c.id === activeCategory)?.items.filter((i) => i.isActive) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
      </div>
    );
  }

  const seats = cartData?.items || [];

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pt-32 space-y-6">
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
                  onClick={() => router.push(`/showtime/${id}`)}
                  className="text-zinc-500 hover:text-white cursor-pointer transition-colors"
                >
                  Seat Selection
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-zinc-700" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white font-bold tracking-wide">
                  Food & Drinks
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
                  Food & Drinks
                </h1>
                <p className="text-sm text-zinc-500 mt-1">
                  Add snacks and beverages to your booking
                </p>
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {activeCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                      activeCategory === cat.id
                        ? "bg-red-500 text-white"
                        : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {activeItems.map((item) => {
                  const inCart = cart.find((c) => c.item.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden hover:border-zinc-700 transition-colors"
                    >
                      <div className="relative h-36 bg-zinc-800">
                        {item.image ? (
                          <Image
                            src={item.image.url}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 50vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-zinc-700">
                            <ShoppingCart className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold truncate">{item.name}</h3>
                            {item.description && (
                              <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                          <span className="shrink-0 text-sm font-bold text-emerald-400">
                            ${Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          {inCart ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition cursor-pointer"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="text-sm font-bold w-6 text-center">{inCart.quantity}</span>
                              <button
                                onClick={() => addToCart(item)}
                                className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center hover:bg-red-500 transition cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => addToCart(item)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600 text-xs font-bold hover:bg-red-500 transition cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Your Seats</h3>
                  {seats.length === 0 ? (
                    <p className="text-xs text-zinc-600">No seats selected</p>
                  ) : (
                    <div className="space-y-2">
                      {seats.map((item) => (
                        <div key={item.seat.id} className="flex items-center gap-2 text-sm">
                          <Ticket className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
                          <span className="text-zinc-300 font-mono text-xs">
                            Row {item.seat.row} - Seat {item.seat.number}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                      Food Cart ({cartCount})
                    </h3>
                    {cart.length > 0 && (
                      <button
                        onClick={clearCart}
                        className="flex items-center gap-1 text-[10px] text-zinc-500 hover:text-red-400 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        Clear
                      </button>
                    )}
                  </div>
                  {cart.length === 0 ? (
                    <p className="text-xs text-zinc-600">No items added yet</p>
                  ) : (
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {cart.map((c) => (
                        <div key={c.item.id} className="flex items-center justify-between text-sm group">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-zinc-300 truncate text-xs">{c.item.name}</span>
                            <span className="text-zinc-600 text-xs">x{c.quantity}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-zinc-300 font-mono text-xs">
                              ${(Number(c.item.price) * c.quantity).toFixed(2)}
                            </span>
                            <button
                              onClick={() => removeItemCompletely(c.item.id)}
                              className="opacity-0 group-hover:opacity-100 w-5 h-5 rounded bg-zinc-800 flex items-center justify-center hover:bg-red-600/20 hover:text-red-400 transition-all cursor-pointer"
                              title="Remove item"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {cartCount > 0 && (
                    <div className="border-t border-zinc-800 pt-3 flex justify-between items-center">
                      <span className="text-xs text-zinc-500">Total</span>
                      <span className="text-lg font-bold">${cartTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={handleProceed}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold uppercase tracking-wider hover:from-red-400 hover:to-red-500 transition-all active:scale-[0.98] cursor-pointer"
                >
                  {cartCount > 0 ? `Proceed to Checkout (${cartCount})` : "Skip — Proceed to Checkout"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
