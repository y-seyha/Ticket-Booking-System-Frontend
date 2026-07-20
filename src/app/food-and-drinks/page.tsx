"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ShoppingCart, Plus, Minus, X, Loader2, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import { toast } from "sonner";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";
import { foodAndBeverageApi } from "@/features/foods-and-beverage/foods-and-beverage.api";
import { useAuthStore } from "@/features/auth/auth.store";
import type { FoodCategory, FoodItem } from "@/features/foods-and-beverage/foods-and-beverage.types";

interface CartItem {
  item: FoodItem;
  quantity: number;
}

const CART_STORAGE_KEY = "foodCart";
const INITIAL_VISIBLE = 6;

const foodDrinksBanner: CarouselItem[] = [
  {
    id: "food-drinks-banner",
    src: "/courousel/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
    title: "Food & Beverage Selection",
    publishDate: "2026-06-24",
    isClickable: false,
  },
];

export default function FoodAndDrinksPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<FoodCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const { user } = useAuthStore();
  const restored = useRef(false);
  const syncReady = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await foodAndBeverageApi.getCategories();
        setCategories(cats);
        if (cats.length > 0) setActiveCategory(cats[0].id);

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
    fetchData();
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [activeCategory]);

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
    toast.success(`${item.name} added to cart`);
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
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setCart([]);
    sessionStorage.removeItem(CART_STORAGE_KEY);
    toast.success("Cart cleared");
  };

  const cartTotal = cart.reduce(
    (sum, c) => sum + Number(c.item.price) * c.quantity,
    0,
  );
  const cartCount = cart.reduce((sum, c) => sum + c.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please log in to place an order");
      return;
    }
    setSubmitting(true);
    try {
      sessionStorage.setItem("bookingFoodItems", JSON.stringify(cart.map((c) => ({
        foodItemId: c.item.id,
        quantity: c.quantity,
        name: c.item.name,
        price: Number(c.item.price),
      }))));
      router.push("/checkout");
    } catch {
      toast.error("Failed to proceed to checkout");
    } finally {
      setSubmitting(false);
    }
  };

  const activeCategories = categories.filter((c) => c.isActive);
  const allItems = activeCategories.flatMap((c) => c.items.filter((i) => i.isActive));
  const displayItems =
    activeCategory === "__all__"
      ? allItems
      : activeCategories.find((c) => c.id === activeCategory)?.items.filter((i) => i.isActive) || [];

  const slicedItems = displayItems.slice(0, visibleCount);
  const hasMore = visibleCount < displayItems.length;

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-28 relative z-10">
        <HeroCarousel
          carouselImg={foodDrinksBanner}
          showBlurBackground={true}
          showDots={false}
          autoPlay={false}
        />

        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-4 md:mt-6 space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[6/5] bg-white/5 rounded-2xl border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-20 text-zinc-600">
              <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg font-bold">Menu not available</p>
              <p className="text-sm mt-2">No food & beverage items available yet.</p>
            </div>
          ) : (
            <>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => setActiveCategory("__all__")}
                  className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    activeCategory === "__all__"
                      ? "bg-red-500 text-white"
                      : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
                  }`}
                >
                  All
                </button>
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

              {displayItems.length > 0 && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {slicedItems.map((item) => {
                      const inCart = cart.find((c) => c.item.id === item.id);
                      return (
                        <div
                          key={item.id}
                          className="group/card bg-zinc-900/10 rounded-2xl overflow-hidden border border-white/20 hover:border-zinc-700/60 transition-all duration-300 shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
                        >
                          <div className="w-full p-4 pb-0 relative overflow-hidden">
                            <div className="relative aspect-[6/5] w-full overflow-hidden rounded-xl bg-zinc-950/80">
                              <div className="absolute inset-0 w-full h-full">
                                {item.image ? (
                                  <Image
                                    src={item.image.url}
                                    alt={item.name}
                                    fill
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 380px"
                                    className="object-cover select-none transition-transform duration-500 ease-out group-hover/card:scale-105"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full text-zinc-700">
                                    <ShoppingCart className="w-10 h-10" />
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                              <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-lg">
                                <span className="text-sm font-bold text-emerald-400">
                                  ${Number(item.price).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="p-4 pt-3.5 space-y-3">
                            <h3 className="font-bold text-base sm:text-lg text-zinc-100 group-hover/card:text-red-500 transition-colors duration-200 line-clamp-1 tracking-tight">
                              {item.name}
                            </h3>

                            {item.description && (
                              <p className="text-sm text-zinc-500 line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            )}

                            <div className="pt-1">
                              {inCart ? (
                                <div className="flex items-center justify-between bg-zinc-900/60 rounded-xl p-1.5 border border-zinc-800">
                                  <button
                                    onClick={() => removeFromCart(item.id)}
                                    className="w-9 h-9 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition cursor-pointer"
                                  >
                                    <Minus className="w-4 h-4" />
                                  </button>
                                  <span className="text-sm font-bold tabular-nums">
                                    {inCart.quantity}
                                  </span>
                                  <button
                                    onClick={() => addToCart(item)}
                                    className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center hover:bg-red-500 transition cursor-pointer"
                                  >
                                    <Plus className="w-4 h-4" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => addToCart(item)}
                                  className="w-full py-2.5 rounded-xl bg-red-600 text-xs font-bold uppercase tracking-wider hover:bg-red-500 transition cursor-pointer flex items-center justify-center gap-2"
                                >
                                  <Plus className="w-4 h-4" />
                                  Add to Cart
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {displayItems.length > INITIAL_VISIBLE && (
                    <div className="flex justify-center pt-2 pb-4">
                      <button
                        onClick={() =>
                          setVisibleCount(hasMore ? displayItems.length : INITIAL_VISIBLE)
                        }
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-red-800 hover:bg-red-700 text-white text-sm font-bold tracking-wider transition-all duration-300 shadow-lg shadow-red-900/30 active:scale-[0.97] cursor-pointer"
                      >
                        {hasMore ? (
                          <>See All <ChevronDown className="w-4 h-4" /></>
                        ) : (
                          <>See Less <ChevronUp className="w-4 h-4" /></>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>

      {cartCount > 0 && (
        <>
          {/* Cart Drawer */}
          {showCartDrawer && (
            <div className="fixed inset-0 z-40" onClick={() => setShowCartDrawer(false)}>
              <div className="absolute inset-0 bg-black/50" />
            </div>
          )}

          <div
            className={`fixed bottom-16 md:bottom-0 left-0 right-0 z-50 bg-zinc-900 border-t border-zinc-800 backdrop-blur-xl transition-all duration-300 max-h-[60vh] overflow-y-auto ${
              showCartDrawer ? "translate-y-0" : "translate-y-full"
            }`}
          >
            <div className="max-w-5xl mx-auto px-4 md:px-8 py-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider">Cart Items</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-400 hover:text-red-400 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear All
                  </button>
                  <button
                    onClick={() => setShowCartDrawer(false)}
                    className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-zinc-700 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {cart.map((c) => (
                  <div
                    key={c.item.id}
                    className="flex items-center justify-between bg-zinc-800/50 rounded-xl px-4 py-3 border border-zinc-800"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => removeFromCart(c.item.id)}
                          className="w-7 h-7 rounded-lg bg-zinc-700 flex items-center justify-center hover:bg-zinc-600 transition cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-bold w-6 text-center">{c.quantity}</span>
                        <button
                          onClick={() => addToCart(c.item)}
                          className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center hover:bg-red-500 transition cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-sm font-medium truncate">{c.item.name}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm font-bold text-emerald-400">
                        ${(Number(c.item.price) * c.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItemCompletely(c.item.id)}
                        className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center hover:bg-red-600/20 hover:text-red-400 transition cursor-pointer"
                        title="Remove item"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Checkout Bar */}
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-zinc-900/95 border-t border-zinc-800 backdrop-blur-xl">
            <div className="max-w-5xl mx-auto px-3 md:px-8 py-3 flex items-center justify-between gap-2">
              <button
                onClick={() => setShowCartDrawer(!showCartDrawer)}
                className="flex items-center gap-2 md:gap-3 cursor-pointer min-w-0"
              >
                <div className="relative shrink-0">
                  <ShoppingCart className="w-5 h-5 text-zinc-300" />
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-600 rounded-full text-[10px] font-bold flex items-center justify-center">
                    {cartCount}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] md:text-xs text-zinc-500 truncate">{cartCount} item{cartCount !== 1 ? "s" : ""}</p>
                  <p className="text-xs md:text-sm font-bold">${cartTotal.toFixed(2)}</p>
                </div>
              </button>
              <button
                onClick={handleCheckout}
                disabled={submitting}
                className="shrink-0 px-4 md:px-6 py-2 rounded-lg bg-red-600 text-xs md:text-sm font-bold hover:bg-red-500 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {submitting ? "Processing..." : "Checkout"}
              </button>
            </div>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
