"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import HeroCarousel from "@/features/movies/components/HeroCarousel";
import { CarouselItem } from "@/features/movies/data/carouselImages";
import NewsCard, { NewsActivity } from "@/features/news/NewsActivity";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

const MOCK_NEWS: NewsActivity[] = [
  {
    id: "news-1",
    title:
      "Having a Legend cinema membership card is the ultimate way to save!",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "legend-cinema-membership-save",
  },
  {
    id: "news-2",
    title:
      "Legend Cinemas Introduces Dual Premium Format ScreenX with Dolby...",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "legend-cinemas-screenx-dolby",
  },
  {
    id: "news-3",
    title:
      "Experience Luxury Cinema with Legend Cinema's Diamond Class Ticket Package",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "experience-luxury-diamond-class",
  },
  {
    id: "news-4",
    title:
      "Indulge in Culinary Excellence with Legend Cinema Catering Service!",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "legend-cinema-catering-service",
  },
  {
    id: "news-5",
    title:
      "Celebrating a 12 Years of Legend Cinema: A Business Success Story in the...",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "celebrating-12-years-legend-cinema",
  },
  {
    id: "news-6",
    title: "(COCA-COLA) CAMBODIA BEVERAGE COMPANY AND LEGEND CINEMA...",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "coca-cola-legend-cinema-partnership",
  },
  {
    id: "news-7",
    title: "Legend Cinema Expanding: Opening Brand New Locations Soon!",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "legend-cinema-expanding-new-locations",
  },
  {
    id: "news-8",
    title:
      "Exclusive Interview with the Winners of the Legend Movie Quiz Night",
    imageUrl: "/images/logo/ZlJ_ngr8_400x400.png",
    slug: "legend-movie-quiz-winners",
  },
];

const staticNewsBanner: CarouselItem[] = [
  {
    id: "news-page-banner",
    src: "/courousel/947cb7b7-0f54-462f-9f69-423c1f055aa0.jpeg",
    title: "Publications & Cinema Activities",
    publishDate: "2026-06-27",
  },
];

export default function NewsActivityPage() {
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

  const displayedNews = MOCK_NEWS.slice(0, visibleCount);
  const hasMoreThanDefault = MOCK_NEWS.length > 6;
  const isShowingAll = visibleCount >= MOCK_NEWS.length;

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
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/20 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <HeroCarousel
          carouselImg={staticNewsBanner}
          showBlurBackground={true}
          showDots={false}
          autoPlay={false}
        />

        <div
          ref={gridTopRef}
          className="max-w-6xl w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-6 md:mt-8 space-y-6 scroll-mt-24"
        >
          <div className="border-b border-zinc-900 pb-4">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
              {th("publicationsTitle")}
            </h1>
          </div>

          <div className="space-y-12">
            <motion.div
              layout="position"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10 pt-2"
            >
              <AnimatePresence mode="popLayout">
                {displayedNews.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 24, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -20, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
                  >
                    <NewsCard newsActivity={item} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {hasMoreThanDefault && (
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleToggleVisibility}
                  className="group/btn cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-red-800 hover:bg-red-700 text-white text-sm font-bold tracking-wider rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(220,38,38,0.3)] hover:shadow-[0_6px_20px_rgba(220,38,38,0.4)] hover:scale-[1.03] active:scale-[0.98]"
                >
                  <span>{isShowingAll ? th("seeLess") : th("seeMore")}</span>

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
