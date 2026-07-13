import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import OfferDetailsContent from "@/features/offers/components/OfferDetailsContent";

interface PromotionDetails {
  id: string;
  title: string;
  imageUrl: string;
  publishDate: string;
  promotionPeriod: string;
  description: string;
  bullets: string[];
}

export const OFFERS_DATA: Record<string, PromotionDetails> = {
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
      "Minions Blind Box",
      "Minions Towel",
      "Minions ID Card",
      "Minions Bag",
      "50% Off Movie Voucher",
      "Buy 1 Get 1 Free Movie Voucher",
      "Buy $5 F&B Voucher",
      "Buy $1 F&B Voucher",
      "Prizes are limited, so don't miss out!",
    ],
  },
  "buy-play-win": {
    id: "offer-2",
    title: "Buy, Play, Win! 🎫✨",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 24, 2026",
    promotionPeriod: "24 June - 15 July 2026",
    description:
      "Book tickets online and stand a chance to unlock major cinematic rewards and exclusive perks.",
    bullets: [
      "Valid across all cinema locations.",
      "Applicable for 2D and 3D screenings.",
      "Online booking only.",
    ],
  },
  "diamond-class-package": {
    id: "offer-3",
    title: "Diamond Class Package",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 20, 2026",
    promotionPeriod: "20 June - 30 July 2026",
    description:
      "Experience premium cinema comfort with our Diamond Class seating and exclusive services.",
    bullets: [
      "Luxury reclining seats",
      "Priority booking",
      "Complimentary drinks",
    ],
  },
  "toy-story-5-now-screening": {
    id: "offer-4",
    title: "Toy Story 5 is NOW SCREENING!",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 18, 2026",
    promotionPeriod: "Now Showing",
    description:
      "The beloved Toy Story franchise returns with a brand-new adventure for all ages.",
    bullets: ["Now showing in all formats", "Book your tickets early"],
  },
  "spiderman-advance-booking": {
    id: "offer-5",
    title: "Spider-Man Advance Booking is LIVE!",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 22, 2026",
    promotionPeriod: "Limited Time",
    description:
      "Secure your seats early for the most anticipated Spider-Man release.",
    bullets: ["Early bird discounts available", "Limited seats per show"],
  },
  "legend-cinema-membership": {
    id: "offer-6",
    title: "Legend Cinema Membership Benefits",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 10, 2026",
    promotionPeriod: "Ongoing",
    description:
      "Become a member and unlock exclusive perks, discounts, and rewards.",
    bullets: ["Discounted tickets", "Birthday rewards", "Priority booking"],
  },
  "popcorn-combo-discount": {
    id: "offer-7",
    title: "Exclusive Popcorn Combo Discount 🍿",
    imageUrl: "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    publishDate: "Jun 25, 2026",
    promotionPeriod: "Weekend Offer",
    description: "Enjoy your movie with discounted popcorn and drink combos.",
    bullets: ["Save up to 30%", "Available on weekends only"],
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
      {/* BACKGROUND BLUR IMAGE */}
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

      {/* FOREGROUND CONTENT */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar showCinemaDropdown={false} />

        <main className="flex-1 text-white pt-28 sm:pt-28 md:pt-36 lg:pt-40 pb-12 sm:pb-16">
          <OfferDetailsContent currentOffer={currentOffer} />
        </main>

        <Footer />
      </div>
    </div>
  );
}
