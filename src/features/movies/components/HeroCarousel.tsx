"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import { CarouselItem } from "../data/carouselImages";

interface HeroCarouselProps {
  carouselImg: CarouselItem[];
  showBlurBackground?: boolean;
  showDots?: boolean;
  autoPlay?: boolean;
  className?: string;
}

export default function HeroCarousel({
  carouselImg,
  showBlurBackground = true,
  showDots = true,
  autoPlay = true,
  className = "",
}: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const plugins = useMemo(() => {
    if (!autoPlay) return [];
    return [
      Autoplay({
        delay: 4000,
        stopOnInteraction: false,
      }),
    ];
  }, [autoPlay]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      duration: 25,
    },
    plugins,
  );

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setActiveIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on("select", onSelect);

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const scrollTo = (index: number) => {
    emblaApi?.scrollTo(index);
  };

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();

  if (!carouselImg.length) return null;

  return (
    <section
      className={`relative overflow-hidden pt-24 md:pt-28 lg:pt-32 pb-4 sm:pb-6 bg-black ${className}`}
    >
      {/*  BACKGROUND BLUR  */}
      {showBlurBackground && (
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={carouselImg[activeIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "linear" }}
              className="absolute inset-0 will-change-transform transform-gpu"
            >
              <Image
                src={carouselImg[activeIndex].src}
                alt=""
                fill
                priority
                className="object-cover scale-110 blur-[20px] sm:blur-[80px]"
              />
            </motion.div>
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
        </div>
      )}

      {/*  CAROUSEL  */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-12 sm:pt-16 md:pt-20 pb-4">
        <div className="relative group/carousel">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
            {/* Arrows */}
            <button
              onClick={scrollPrev}
              aria-label="Previous"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 pointer-events-auto hidden sm:flex items-center justify-center shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm border border-white/10 opacity-0 group-hover/carousel:opacity-100 transition-all duration-300 pointer-events-auto hidden sm:flex items-center justify-center shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </button>

            {/* Viewport wrapper */}
            <div
              ref={emblaRef}
              className="cursor-grab active:cursor-grabbing will-change-transform"
            >
              <div className="flex">
                {carouselImg.map((item) => (
                  <div
                    key={item.id}
                    className="flex-[0_0_100%] w-full transform-gpu"
                  >
                    <Link
                      href={`/${item.id}`}
                      className="block relative overflow-hidden border border-white/5 h-[240px] sm:h-[360px] md:h-[460px] lg:h-[520px]"
                    >
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-w-640px) 100vw, (max-w-1152px) 90vw, 1152px"
                        priority
                        className="object-cover select-none transition-transform duration-500 hover:scale-[1.02]"
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots Overlay */}
            {showDots && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex justify-center items-center gap-1.5 pointer-events-auto bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
                {carouselImg.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollTo(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className="p-1 group"
                  >
                    <motion.div
                      animate={{ width: activeIndex === index ? 24 : 8 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 28,
                      }}
                      className={`h-2 rounded-full transition-colors duration-300 ${activeIndex === index ? "bg-red-600" : "bg-white/40 group-hover:bg-white/70"}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
