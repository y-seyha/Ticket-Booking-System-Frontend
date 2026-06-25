import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LocationAccordionListProps {
  displayedLocations: Array<{
    name: string;
    times: string[];
  }>;
}

export default function LocationAccordionList({
  displayedLocations,
}: LocationAccordionListProps) {
  const [expandedLocations, setExpandedLocations] = useState<string[]>(
    displayedLocations.map((loc) => loc.name),
  );

  const toggleLocation = (locName: string) => {
    setExpandedLocations((prev) =>
      prev.includes(locName)
        ? prev.filter((name) => name !== locName)
        : [...prev, locName],
    );
  };

  return (
    <div className="space-y-4 pt-2">
      {displayedLocations.map((loc) => {
        const isExpanded = expandedLocations.includes(loc.name);
        return (
          <div
            key={loc.name}
            className="border border-zinc-900 bg-zinc-950/10 rounded-xl overflow-hidden backdrop-blur-md"
          >
            <button
              onClick={() => toggleLocation(loc.name)}
              className="w-full flex items-center justify-between p-4 sm:p-5 text-left font-black text-base sm:text-lg text-zinc-200 hover:text-white cursor-pointer"
            >
              <span>{loc.name}</span>
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
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden border-t border-zinc-900"
                >
                  <div className="p-5 bg-zinc-950/40 space-y-4">
                    <div className="flex items-center gap-2.5 pb-1">
                      <span className="text-[10px] font-black bg-blue-600/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded">
                        2D
                      </span>
                      <span className="text-xs uppercase font-extrabold text-zinc-500">
                        KH | EN | Regular Hall
                      </span>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:flex md:flex-wrap gap-2">
                      {loc.times.map((time) => (
                        <button
                          key={time}
                          className="w-full md:w-32 text-center px-3 py-2 md:py-2.5 bg-transparent border border-white hover:border-red rounded-full text-[11px] md:text-sm font-semibold text-white hover:text-white transition-all duration-300 shadow-sm cursor-pointer active:scale-95 transform-gpu"
                        >
                          {time}
                        </button>
                      ))}
                    </div>
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
