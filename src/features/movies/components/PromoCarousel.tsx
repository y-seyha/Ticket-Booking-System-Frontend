"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import { PromoItem } from "../data/promoCarouselImages";

interface PromoCarouselProps {
  promos: PromoItem[];
  autoPlay?: boolean;
  className?: string;
}

export default function PromoCarousel({
  promos,
  autoPlay = true,
  className = "",
}: PromoCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const plugins = useMemo(() => {
    if (!autoPlay) return [];
    return [
      Autoplay({
        delay: 5000,
        stopOnInteraction: false,
      }),
    ];
  }, [autoPlay]);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "center",
      skipSnaps: false,
      duration: 30,
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

  if (!promos.length) return null;

  return (
    <div className={`w-full bg-transparent ${className}`}>
      <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-5">
        What&apos;s new?
      </h2>

      {/* Embla Viewport Frame */}
      <div className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-zinc-950/40 backdrop-blur-md border border-zinc-900/60 shadow-2xl">
        {/* Dynamic Background Blur Glow */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={promos[activeIndex].id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute inset-0 will-change-transform transform-gpu"
            >
              <Image
                src={promos[activeIndex].src}
                alt=""
                fill
                priority
                className="object-cover scale-150 blur-[50px] md:blur-[90px] origin-right"
              />
            </motion.div>
          </AnimatePresence>

          <div className="absolute inset-0 bg-zinc-950/20 mix-blend-multiply" />
        </div>

        <div
          ref={emblaRef}
          className="relative z-10 cursor-grab active:cursor-grabbing"
        >
          <div className="flex">
            {promos.map((item) => (
              <div
                key={item.id}
                className="flex-[0_0_100%] min-w-0 w-full relative"
              >
                {/* The container grid that switches to flex-col on mobile */}
                <div className="flex flex-col md:grid md:grid-cols-12 min-h-[400px] md:h-[380px] w-full">
                  {/* Left Action Metadata Panel */}
                  <article className="order-2 md:order-1 md:col-span-4 bg-zinc-950/40 md:bg-gradient-to-r md:from-zinc-950/80 md:to-zinc-950/20 backdrop-blur-xl p-6 md:p-8 lg:p-10 flex flex-col justify-between z-20 border-t md:border-t-0 md:border-r border-zinc-900/40 h-full">
                    <div className="space-y-3">
                      {/* Title: Truncate if too long */}
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white leading-tight tracking-tight line-clamp-2">
                        {item.title}
                      </h3>

                      {/* Description: Controlled with line-clamp */}
                      <p className="text-sm sm:text-base text-zinc-300 font-medium leading-relaxed line-clamp-3 md:line-clamp-4">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-6">
                      <Link
                        href={item.linkUrl}
                        className="inline-flex items-center justify-center bg-white hover:bg-zinc-100 text-black text-sm font-bold px-6 py-2.5 rounded-full shadow-md transition-all active:scale-[0.98]"
                      >
                        Learn More
                      </Link>
                    </div>
                  </article>

                  {/* Right High Impact Key Visual Asset Frame */}
                  <div className="order-1 md:order-2 md:col-span-8 relative w-full h-[200px] md:h-full bg-zinc-900 overflow-hidden">
                    <Image
                      src={item.src}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 66vw"
                      priority
                      className="object-cover select-none"
                    />
                    {/* Subtle overlay for text readability on mobile */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/60 to-transparent md:hidden" />

                    {/* Desktop gradient fade */}
                    <div className="hidden md:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-zinc-950/80 to-transparent pointer-events-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Dots Underneath */}
      <div className="flex justify-center items-center gap-1.5 mt-5">
        {promos.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            aria-label={`Go to promotion slide ${index + 1}`}
            className="p-1 group flex items-center justify-center"
          >
            <motion.div
              animate={{ width: activeIndex === index ? 24 : 8 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 28,
              }}
              className={`h-2 rounded-full transition-colors duration-300 ${
                activeIndex === index
                  ? "bg-red-600"
                  : "bg-zinc-700 group-hover:bg-zinc-500"
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
