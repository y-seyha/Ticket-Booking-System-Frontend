import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

interface PromotionDetails {
  id: string;
  title: string;
  imageUrl: string;
  publishDate: string;
  promotionPeriod: string;
  description: string;
  bullets: string[];
}

const OFFERS_DATA: Record<string, PromotionDetails> = {
  "bello-ready-to-win": {
    id: "offer-1",
    title: "bello! Ready to win? ✨🐝",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 24, 2026",
    promotionPeriod: "24 June - 2 July 2026",
    description:
      "Don't miss your chance to win exclusive Toy Story Blind Boxes and many other exciting prizes at Legend Cinema! Simply spend $13.50 or more on Food & Beverages (F&B) and receive 1 Lucky Draw chance to win instantly!",
    bullets: [
      "Prizes include:",
      "Minions Blind Box, Minions Towel, Minions ID card, Minions Bag",
      "50% Off Movie Voucher",
      "Buy 1 Get 1 Free Movie Voucher",
      "$5 F&B Voucher",
      "$1 F&B Voucher",
      "Prizes are limited, so don't miss out! Enjoy your favorite movies and snacks for a chance to take home amazing rewards.",
    ],
  },
  "buy-play-win": {
    id: "offer-2",
    title: "Buy, Play, Win! 🎫✨",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 24, 2026",
    promotionPeriod: "24 June - 15 July 2026",
    description:
      "Book tickets online and stand a chance to unlock major cinematic tier items.",
    bullets: [
      "Valid across all cinema locations.",
      "Applicable for 2D and 3D format screenings.",
    ],
  },
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function OfferDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const currentOffer = OFFERS_DATA[id];

  if (!currentOffer) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between overflow-x-hidden relative">
      {/*  BACKGROUND BLUR IMAGE  */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden h-[80vh]">
        <div className="absolute inset-0 will-change-transform transform-gpu opacity-40 sm:opacity-50">
          <Image
            src={currentOffer.imageUrl}
            alt=""
            fill
            priority
            className="object-cover scale-110 blur-[40px] sm:blur-[80px]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/*  FOREGROUND CONTENT  */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar showCinemaDropdown={false} />

        <main className="flex-1 text-white pt-28 sm:pt-28 md:pt-36 lg:pt-40 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full min-w-0">
            {/* BREADCRUMB (Reflecting the layout in image_be1e02.jpg) */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 font-medium min-w-0">
              <Link
                href="/offers"
                className="hover:text-white transition-colors shrink-0"
              >
                Promotions
              </Link>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-3 h-3 text-zinc-600 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
              <span className="text-zinc-200 truncate">
                {currentOffer.title}
              </span>
            </nav>

            {/* FADING DIVIDER */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-4 sm:my-5" />

            {/* HEADER METADATA */}
            <div className="space-y-2 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white break-words">
                {currentOffer.title}
              </h1>

              <div className="flex items-center text-xs sm:text-sm text-zinc-400 gap-1.5 whitespace-nowrap overflow-hidden">
                <span className="text-white">Publish Date:</span>
                <span className="text-white font-medium">
                  {currentOffer.publishDate}
                </span>
              </div>
            </div>

            {/* PROMOTION IMAGE DISPLAY */}
            <div className="overflow-hidden rounded-xl sm:rounded-3xl border border-zinc-900/80 shadow-2xl w-full bg-zinc-950/40 backdrop-blur-sm mb-8">
              <Image
                src={currentOffer.imageUrl}
                alt={currentOffer.title}
                width={1200}
                height={750}
                priority
                sizes="(max-w-1024px) 100vw, 896px"
                className="w-full h-auto object-contain block"
              />
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-3xl">
              <p className="font-normal text-zinc-200">
                {currentOffer.description}
              </p>

              {/* Terms and Rewards Bulleted Block */}
              {currentOffer.bullets && currentOffer.bullets.length > 0 && (
                <ul className="space-y-1.5 list-none pl-0">
                  {currentOffer.bullets.map((bullet, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-zinc-300"
                    >
                      <span className="text-red-500 shrink-0 mt-0.5">▪</span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* Promotion Validation Window Footer Tag */}
              {currentOffer.promotionPeriod && (
                <div className="pt-4 flex items-center gap-2 text-xs text-zinc-400">
                  <span className="inline-block w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span>
                    Promotion Period:{" "}
                    <strong className="text-zinc-300 font-medium">
                      {currentOffer.promotionPeriod}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
