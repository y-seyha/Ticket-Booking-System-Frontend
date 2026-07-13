"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";
import PromotionCard, {
  Promotion,
} from "@/features/offers/components/PromotionCard";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

const MOCK_OFFERS: Promotion[] = [
  {
    id: "offer-1",
    title: "bello! Ready to win? ✨🐝",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    slug: "bello-ready-to-win",
  },
  {
    id: "offer-2",
    title: "Buy, Play, Win! 🎫✨",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    slug: "buy-play-win",
  },
  {
    id: "offer-3",
    title: "Diamond Class Package",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    slug: "diamond-class-package",
  },
  {
    id: "offer-4",
    title: "Toy Story 5 is NOW SCREENING!",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    slug: "toy-story-5-now-screening",
  },
  {
    id: "offer-5",
    title: "Spider-Man Advance Booking is LIVE!",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    slug: "spiderman-advance-booking",
  },
  {
    id: "offer-6",
    title: "Having a Legend cinema membership",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    slug: "legend-cinema-membership",
  },
  {
    id: "offer-7",
    title: "Exclusive Popcorn Combo Discount 🍿",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    slug: "popcorn-combo-discount",
  },
];

const staticOfferBanner: CarouselItem[] = [
  {
    id: "offers-page-banner",
    src: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    title: "Special Offers & Movie Rewards",
    publishDate: "2026-06-24",
    isClickable: false,
  },
];

export default function OffersPage() {
  const [visibleCount, setVisibleCount] = useState(6);
  const gridTopRef = useRef<HTMLDivElement>(null);

  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage?.code || "en";

  const th = (key: string): string => {
    const lookupKey = key as keyof typeof translations;
    return (
      translations[lookupKey]?.[langCode] ||
      translations[lookupKey]?.["en"] ||
      key
    );
  };

  const displayedOffers = MOCK_OFFERS.slice(0, visibleCount);
  const hasMoreThanDefault = MOCK_OFFERS.length > 6;
  const isShowingAll = visibleCount >= MOCK_OFFERS.length;

  const handleToggleVisibility = () => {
    if (isShowingAll) {
      setVisibleCount(6);
      gridTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      setVisibleCount((prevCount) => prevCount + 6);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <HeroCarousel
          carouselImg={staticOfferBanner}
          showBlurBackground={true}
          showDots={false}
          autoPlay={false}
        />

        {/* Layout Grid Containment Block */}
        <div
          ref={gridTopRef}
          className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-6 md:mt-8 space-y-6 scroll-mt-24"
        >
          {/* Label Heading & Subtitle line */}
          <div className="border-b border-zinc-900 pb-4">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              {th("promotionsTitle") || "Promotions"}
            </h1>
          </div>

          <div className="space-y-12">
            {/* Animated Grid Container */}
            <motion.div
              layout="position"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 pt-2"
            >
              <AnimatePresence mode="popLayout">
                {displayedOffers.map((offer) => (
                  <motion.div
                    key={offer.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <PromotionCard promotion={offer} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Action Button Container */}
            {hasMoreThanDefault && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleToggleVisibility}
                  className="group/btn cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-red-800 hover:bg-red-700 text-white text-sm font-bold tracking-wider rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>
                    {isShowingAll
                      ? th("seeLess") || "See Less"
                      : th("seeMore") || "See More"}
                  </span>

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className={`w-4 h-4 transition-transform duration-300 ease-in-out ${
                      isShowingAll
                        ? "transform rotate-180 group-hover/btn:-translate-y-0.5"
                        : "group-hover/btn:translate-y-0.5"
                    }`}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
