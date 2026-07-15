"use client";

import { useEffect } from "react";
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
import type { Movie } from "@/features/movies/movie.type";
import type { PosStepId } from "../pos.types";

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
  movieTitle,
  movieId,
  onSelect,
}: {
  showtimes: Movie["showtimes"];
  movieTitle: string;
  movieId: string;
  onSelect: (st: Showtime) => void;
}) {
  if (!showtimes || showtimes.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-600 font-medium">
        No showtimes available
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-3">
      {showtimes.map((st) => (
        <button
          key={st.id}
          onClick={() => onSelect({
            id: st.id,
            movieId,
            screenId: "",
            startTime: st.startTime,
            endTime: st.endTime,
            basePrice: Number(st.basePrice),
            status: "SCHEDULED" as const,
            createdAt: "",
            updatedAt: "",
            movie: { id: movieId, title: movieTitle, durationMinutes: 0, language: "", poster: null, status: "NOW_SHOWING" as const, createdAt: "", updatedAt: "" },
            screen: { id: "", name: st.screenName, type: st.screenType },
          } as Showtime)}
          className="flex flex-col items-center gap-1 p-4 min-w-[100px] rounded-xl border border-zinc-800 bg-zinc-900/60 hover:border-red-500/50 hover:bg-zinc-900 transition-all cursor-pointer active:scale-[0.98]"
        >
          <span className="text-lg font-black text-white font-mono">
            {new Date(st.startTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
            {st.screenName || "Screen"}
          </span>
          <span className="text-xs text-zinc-400 font-mono">
            ${Number(st.basePrice).toFixed(2)}
          </span>
        </button>
      ))}
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
    mockFoods,
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

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get("step") as PosStepId | null;
    if (stepParam && STEP_IDS.includes(stepParam)) {
      goTo(stepParam);
    }
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("step", step);
    window.history.replaceState({}, "", url.toString());
  }, [step]);

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
              movieTitle={movie?.title || ""}
              movieId={movie?.id || ""}
              onSelect={selectShowtime}
            />
          </div>
        );

      case "seats":
        return showtime ? (
          <StepSeatSelection
            showtime={showtime}
            onBack={goBack}
            onConfirm={selectSeats}
          />
        ) : null;

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
            mockFoods={mockFoods}
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
