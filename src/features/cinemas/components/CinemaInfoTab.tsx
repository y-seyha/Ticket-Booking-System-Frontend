"use client";

interface CinemaInfoTabProps {
  cinema: {
    halls: string;
    openingHours: string;
    address: string;
    mapUrl: string;
  };
  isActive: boolean;
}

export default function CinemaInfoTab({
  cinema,
  isActive,
}: CinemaInfoTabProps) {
  return (
    <div
      className={`w-full max-w-4xl mx-auto px-4 py-8 space-y-12 transition-all duration-500 ease-out transformation ${
        isActive
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4 pointer-events-none absolute top-0 left-0 w-full"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 text-center md:text-left border-b border-zinc-900/60 pb-10">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Number of Halls:
          </p>
          <p className="text-xl font-black text-white">{cinema.halls}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Opening Hour:
          </p>
          <p className="text-xl font-black text-white">{cinema.openingHours}</p>
        </div>

        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
            Address:
          </p>
          <p className="text-sm sm:text-base font-semibold text-zinc-300 leading-tight md:max-w-xs">
            {cinema.address}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <div className="md:col-span-3">
          <div className="relative w-full aspect-[16/8] md:aspect-[2.4/1] rounded-xl overflow-hidden border border-zinc-800/80 shadow-2xl bg-zinc-950">
            <iframe
              src={cinema.mapUrl}
              className="absolute inset-0 w-full h-full border-0 opacity-100"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
