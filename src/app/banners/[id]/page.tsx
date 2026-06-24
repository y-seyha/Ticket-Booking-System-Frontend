// src/app/[id]/page.tsx
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import carouselImages from "@/features/movies/data/carouselImages";
import Footer from "@/components/common/Footer";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function CarouselDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const currentItem = carouselImages.find((item) => item.id === id);

  if (!currentItem) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-between overflow-x-hidden relative">
      {/* ================= BACKGROUND BLUR IMAGE ================= */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden h-[80vh]">
        <div className="absolute inset-0 will-change-transform transform-gpu opacity-40 sm:opacity-50">
          <Image
            src={currentItem.src}
            alt=""
            fill
            priority
            className="object-cover scale-110 blur-[40px] sm:blur-[80px]"
          />
        </div>
        {/* Soft gradient fadeout so the blur melts perfectly into the solid black background below */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* ================= FOREGROUND CONTENT ================= */}
      <div className="relative z-10 flex flex-col justify-between min-h-screen">
        <Navbar showCinemaDropdown={false} />

        <main className="flex-1 text-white pt-28 sm:pt-36 md:pt-44 lg:pt-48 pb-12 sm:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 w-full min-w-0">
            {/* BREADCRUMB  */}
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-zinc-400 font-medium min-w-0">
              <Link
                href="/"
                className="hover:text-white transition-colors shrink-0"
              >
                Home
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
                {currentItem.title}
              </span>
            </nav>

            {/* FADING DIVIDER  */}
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-4 sm:my-5" />

            {/* METADATA & TITLE  */}
            <div className="space-y-2 mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white break-words">
                {currentItem.title}
              </h1>

              <div className="flex items-center text-xs sm:text-sm text-zinc-400 gap-1.5 whitespace-nowrap overflow-hidden">
                <span className="text-white">Publish Date:</span>
                <span className="text-white font-medium">
                  {currentItem.publishDate}
                </span>
              </div>
            </div>

            {/* CAROUSEL IMAGE DISPLAY  */}
            <div className="overflow-hidden rounded-xl sm:rounded-3xl border border-zinc-900/80 shadow-2xl w-full bg-zinc-950/40 backdrop-blur-sm">
              <Image
                src={currentItem.src}
                alt={currentItem.title}
                width={1200}
                height={675}
                priority
                sizes="(max-w-1024px) 100vw, 896px"
                className="w-full h-auto object-contain block"
              />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
