import { Suspense } from "react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { cinemasApi } from "@/features/cinemas/cinemas.api";
import { Cinema } from "@/features/cinemas/cinemas.types";

import CinemaHeroBanner from "@/features/cinemas/components/CinemaHeroBanner";
import CinemaDetailTabs from "@/features/cinemas/components/CinemaDetailTabs";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function CinemaDetailPage({ params }: PageProps) {
  const { id } = await params;

  let bannerDetails = null;
  let tabDetails = null;
  let errorMsg = "";

  try {
    const response = await cinemasApi.getCinema(id);

    const unknownResponse = response as unknown;
    let cinema: Cinema | null = null;

    if (unknownResponse && typeof unknownResponse === "object") {
      if (
        "data" in unknownResponse &&
        Array.isArray((unknownResponse as { data: unknown }).data)
      ) {
        const list = (unknownResponse as { data: Cinema[] }).data;
        cinema = list.find((item) => item.id === id) || null;
      } else if (
        "data" in unknownResponse &&
        (unknownResponse as { data: unknown }).data
      ) {
        cinema = (unknownResponse as { data: Cinema }).data;
      } else if ("id" in unknownResponse) {
        cinema = unknownResponse as Cinema;
      }
    }

    if (!cinema || !cinema.id) {
      throw new Error(
        `Cinema with ID ${id} could not be resolved from the API payload structure.`,
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const computedImageUrl = cinema.image?.url
      ? cinema.image.url
      : cinema.imageId
        ? `${baseUrl}/files/${cinema.imageId}`
        : "/courousel/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg";

    const mapsSearchQuery = encodeURIComponent(
      `${cinema.name}, ${cinema.city || ""}`.trim(),
    );
    const functionalMapUrl = `https://maps.google.com/maps?q=${mapsSearchQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

    bannerDetails = {
      id: cinema.id,
      name: cinema.name,
      address: `${cinema.location || ""}, ${cinema.city || ""}`,
      imageUrl: computedImageUrl,
    };

    tabDetails = {
      ...cinema,
      halls: cinema.screens?.length?.toString() || "0",
      openingHours: "09:30 - 22:30",
      mapUrl: functionalMapUrl,
    };
  } catch (error) {
    console.error("Error loading cinema details on server:", error);
    errorMsg = "Failed to load cinema details. Please try again later.";
  }

  if (errorMsg || !bannerDetails || !tabDetails) {
    return (
      <div className="min-h-screen bg-black flex flex-col text-white">
        <Navbar />
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="text-center py-16 text-red-500 font-medium bg-red-950/10 border border-red-900/30 rounded-2xl max-w-lg w-full">
            {errorMsg || "Cinema location not found."}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Decorative Background Aura */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/15 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      <main className="flex-1 pb-24 relative z-10">
        <CinemaHeroBanner cinema={bannerDetails} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 mt-6">
          <Suspense
            fallback={
              <div className="text-center py-12 text-zinc-400">
                Loading interactive details...
              </div>
            }
          >
            <CinemaDetailTabs cinemaDetails={tabDetails} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
