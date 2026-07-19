"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { usePos } from "../usePos";
import { POS_STEPS } from "../pos.types";
import StepMovieShowtime from "./StepMovieShowtime";
import StepSeatSelection from "./StepSeatSelection";
import StepReviewOrder from "./StepReviewOrder";
import StepPayment from "./StepPayment";
import StepConfirmation from "./StepConfirmation";
import { Check, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Showtime } from "@/features/showitmes/showtimes.types";
import type { Movie, ShowTime } from "@/features/movies/movie.type";
import type { PosStepId } from "../pos.types";
import { posApi } from "../pos.api";

const stepVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const STEP_IDS: PosStepId[] = [
  "movie",
  "showtime",
  "seats",
  "review",
  "payment",
  "confirmation",
];

function ShowtimeGrid({
  showtimes,
  movie,
  onSelect,
}: {
  showtimes: Movie["showtimes"];
  movie: Movie;
  onSelect: (st: Showtime) => void;
}) {
  const locations = useMemo(() => {
    if (!showtimes) return [];
    const map = new Map<string, ShowTime[]>();
    for (const st of showtimes) {
      const key = st.theaterName;
      const group = map.get(key);
      if (group) group.push(st);
      else map.set(key, [st]);
    }
    return Array.from(map.entries()).map(([name, sts]) => ({
      name,
      location: sts[0].theaterLocation,
      city: sts[0].theaterCity,
      showtimes: sts,
    }));
  }, [showtimes]);

  const [expanded, setExpanded] = useState<string[]>(
    () => locations.map((l) => l.name),
  );

  const toggleLocation = useCallback((name: string) => {
    setExpanded((prev) =>
      prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name],
    );
  }, []);

  if (!showtimes || showtimes.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-600 font-medium">
        No showtimes available
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {locations.map((loc) => {
        const isExpanded = expanded.includes(loc.name);

        const groupedByScreen = loc.showtimes.reduce(
          (acc, st) => {
            if (!acc[st.screenName]) acc[st.screenName] = [];
            acc[st.screenName].push(st);
            return acc;
          },
          {} as Record<string, typeof loc.showtimes>,
        );

        return (
          <div
            key={loc.name}
            className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/30"
          >
            <button
              onClick={() => toggleLocation(loc.name)}
              className="w-full flex items-center justify-between px-4 py-3 text-left cursor-pointer hover:bg-zinc-800/40 transition-colors"
            >
              <div>
                <span className="text-sm font-bold text-white">{loc.name}</span>
                <span className="text-xs text-zinc-500 ml-2">
                  {loc.location}, {loc.city}
                </span>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2.5}
                stroke="currentColor"
                className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? "rotate-180 text-white" : ""}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-zinc-800"
                >
                  <div className="p-4 space-y-4">
                    {Object.entries(groupedByScreen).map(
                      ([screenName, times]) => (
                        <div key={screenName} className="space-y-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                              {times[0].screenType}
                            </span>
                            <span className="text-[11px] uppercase font-extrabold text-zinc-500">
                              {screenName}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {times.map((st) => (
                              <button
                                key={st.id}
                                onClick={() => onSelect({
                                  id: st.id,
                                  movieId: movie.id,
                                  screenId: "",
                                  startTime: st.startTime,
                                  endTime: st.endTime,
                                  basePrice: Number(st.basePrice),
                                  status: "SCHEDULED" as const,
                                  createdAt: "",
                                  updatedAt: "",
                                  movie: { id: movie.id, title: movie.title, durationMinutes: movie.durationMinutes, language: movie.language, poster: null, status: "NOW_SHOWING" as const, createdAt: "", updatedAt: "" },
                                  screen: { id: "", name: st.screenName, type: st.screenType },
                                } as Showtime)}
                                className="px-4 py-2 rounded-full border border-white/10 hover:border-red-600 bg-transparent hover:bg-red-600/10 text-sm font-semibold text-white transition-all cursor-pointer active:scale-95"
                              >
                                {new Date(st.startTime).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </button>
                            ))}
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function PosTerminal() {
  const pos = usePos();

  const {
    step,
    movie,
    showtime,
    seats,
    foods,
    paymentMethod,
    bookingCode,
    isProcessing,
    selectedDate,
    totalBasePrice,
    totalSeatPrice,
    totalFoodPrice,
    grandTotal,
    foodItems,
    currentStepIndex,
    goBack,
    selectMovie,
    goTo,
    setSelectedDate,
    selectShowtime,
    selectSeats,
    addFood,
    removeFood,
    setPaymentMethod,
    processPayment,
    reset,
  } = pos;

  const initialized = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step") as PosStepId | null;
    const movieIdParam = params.get("movieId");
    const showtimeIdParam = params.get("showtimeId");
    const dateParam = params.get("selectedDate");

    async function restore() {
      if (!stepParam || !STEP_IDS.includes(stepParam)) return;

      const stepIdx = STEP_IDS.indexOf(stepParam);
      const date = dateParam || new Date().toISOString().split("T")[0];

      if (stepIdx === 0) {
        goTo("movie");
        return;
      }

      if (!movieIdParam) {
        goTo("movie");
        return;
      }

      // Fetch movie by date
      let movie: Movie | undefined;
      try {
        const movies = await posApi.getMovies(date);
        movie = movies.find((mv) => mv.id === movieIdParam);
      } catch {}

      if (!movie) {
        goTo("movie");
        return;
      }

      if (dateParam && dateParam !== selectedDate) setSelectedDate(dateParam);
      selectMovie(movie, date);

      // If restoring to seats+ and we have showtimeId
      if (stepIdx >= 2 && showtimeIdParam) {
        try {
          const apiRes = await import("@/features/showitmes/showtimes.api").then(
            (m) => m.showtimesApi.getById(showtimeIdParam),
          );
          selectShowtime(apiRes);
        } catch {
          // if showtime fetch fails, stay on showtime step
        }
      }
    }

    restore().finally(() => {
      initialized.current = true;
    });
  }, []);

  useEffect(() => {
    if (!initialized.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set("step", step);
    if (movie?.id) url.searchParams.set("movieId", movie.id);
    else url.searchParams.delete("movieId");
    if (showtime?.id) url.searchParams.set("showtimeId", showtime.id);
    else url.searchParams.delete("showtimeId");
    if (selectedDate) url.searchParams.set("selectedDate", selectedDate);
    else url.searchParams.delete("selectedDate");
    if (seats.length > 0) {
      url.searchParams.set("seatIds", seats.map((s) => s.id).join(","));
    } else if (step !== "seats") {
      url.searchParams.delete("seatIds");
    }
    window.history.replaceState({}, "", url.toString());
  }, [step, movie?.id, showtime?.id, selectedDate, seats]);

  const renderStep = () => {
    switch (step) {
      case "movie":
        return (
          <StepMovieShowtime
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            onSelectMovie={selectMovie}
          />
        );

      case "showtime":
        return (
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <button
                onClick={goBack}
                className="mt-0.5 p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all cursor-pointer active:scale-90"
                aria-label="Back to movie selection"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2 className="text-lg font-black text-white uppercase tracking-wide">
                  Select Showtime
                </h2>
                <p className="text-sm text-zinc-500 mt-1">{movie?.title}</p>
              </div>
            </div>
            <ShowtimeGrid
              showtimes={movie?.showtimes}
              movie={movie!}
              onSelect={selectShowtime}
            />
          </div>
        );

      case "seats": {
        const initialIds = seats.length > 0
          ? seats.map((s) => s.id)
          : new URLSearchParams(window.location.search).get("seatIds")?.split(",") ?? [];
        return showtime ? (
          <StepSeatSelection
            showtime={showtime}
            initialSelectedIds={initialIds}
            onBack={goBack}
            onConfirm={selectSeats}
          />
        ) : null;
      }

      case "review":
        return showtime ? (
          <StepReviewOrder
            showtime={showtime}
            seats={seats}
            foods={foods}
            totalBasePrice={totalBasePrice}
            totalSeatPrice={totalSeatPrice}
            totalFoodPrice={totalFoodPrice}
            grandTotal={grandTotal}
            foodItems={foodItems}
            onAddFood={addFood}
            onRemoveFood={removeFood}
            onBack={goBack}
            onProceed={() => {
              setPaymentMethod("CASH");
              pos.goTo("payment");
            }}
          />
        ) : null;

      case "payment":
        return (
          <StepPayment
            grandTotal={grandTotal}
            paymentMethod={paymentMethod}
            isProcessing={isProcessing}
            khqrData={pos.khqrData}
            onChangeMethod={setPaymentMethod}
            onBack={goBack}
            onPay={processPayment}
            onConfirmKhqr={pos.confirmKhqrPayment}
            onCancelKhqr={pos.cancelKhqrPayment}
          />
        );

      case "confirmation":
        return showtime && bookingCode ? (
          <StepConfirmation
            bookingCode={bookingCode}
            showtime={showtime}
            seats={seats}
            foods={foods}
            grandTotal={grandTotal}
            onNewSale={reset}
            paymentMethod={paymentMethod}
          />
        ) : null;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-1">
        {POS_STEPS.map((s, i) => {
          const isActive = i === currentStepIndex;
          const isDone = i < currentStepIndex;
          return (
            <div key={s.id} className="flex items-center gap-1 flex-1">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-[10px] font-black transition-all ${
                  isDone
                    ? "bg-red-600 text-white"
                    : isActive
                      ? "bg-red-600 text-white ring-2 ring-red-500/30"
                      : "bg-zinc-800 text-zinc-600"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                  isActive
                    ? "text-white"
                    : isDone
                      ? "text-zinc-400"
                      : "text-zinc-700"
                }`}
              >
                {s.label}
              </span>
              {i < POS_STEPS.length - 1 && (
                <div
                  className={`h-[1px] flex-1 mx-1 ${
                    isDone ? "bg-red-600/50" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
