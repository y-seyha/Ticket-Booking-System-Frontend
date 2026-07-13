"use client";

import { useRef, MouseEvent } from "react";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

interface DateTabItem {
  day: string;
  date: string;
  month: string;
  dateString: string;
}

interface MonthTabItem {
  id: string;
  label: string;
  value: string;
}

interface MovieDateTabsProps {
  mode: "showing" | "coming";
  dateTabs: DateTabItem[];
  monthTabs: MonthTabItem[];
  selectedDate: string;
  onSelectDate: (value: string) => void;
}

export default function MovieDateTabs({
  mode,
  dateTabs,
  monthTabs,
  selectedDate,
  onSelectDate,
}: MovieDateTabsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage?.code || "en";

  const monthKeys = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

 
  const th = (key: string): string => {
    return translations[key]?.[langCode] || translations[key]?.["en"] || key;
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    isDown.current = true;
    scrollRef.current.style.scrollSnapType = "none";
    scrollRef.current.style.scrollBehavior = "auto";
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDown.current = false;
    if (!scrollRef.current) return;
    scrollRef.current.style.scrollSnapType = "x mandatory";
    scrollRef.current.style.scrollBehavior = "smooth";
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const items = (mode === "showing" ? dateTabs : monthTabs) || [];

  return (
    <div
      ref={scrollRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeaveOrUp}
      onMouseUp={handleMouseLeaveOrUp}
      onMouseMove={handleMouseMove}
      className="w-full overflow-x-auto py-4 md:py-6 flex flex-row flex-nowrap gap-3 scrollbar-none snap-x snap-mandatory touch-pan-x cursor-grab active:cursor-grabbing select-none"
    >
      {items.map((item) => {
        const isShowing = mode === "showing";

        const itemValue = isShowing
          ? (item as DateTabItem).dateString
          : (item as MonthTabItem).value;
        const isSelected = selectedDate === itemValue;

        let localizedDayName = "";
        let localizedMonthName = "";
        let yearDisplay = "";

        if (isShowing) {
          const dateObj = new Date((item as DateTabItem).dateString);
          
          const dayIndex = dateObj.getDay();     // 0-6
          const monthIndex = dateObj.getMonth(); // 0-11
          
          localizedDayName = th(dayKeys[dayIndex]);
          localizedMonthName = th(monthKeys[monthIndex]);
        } else {
          const [yearStr, monthStr] = (item as MonthTabItem).value.split("-");
          const monthIndex = parseInt(monthStr, 10) - 1;
          
          localizedMonthName = th(monthKeys[monthIndex]);
          yearDisplay = yearStr;
        }

        return (
          <button
            key={itemValue}
            onClick={() => onSelectDate(itemValue)}
            className={`w-[75px] sm:w-[95px] md:w-[115px] lg:w-[150px] h-[78px] sm:h-[86px] rounded-[10px] bg-black p-2 border-2 transition-colors shrink-0 snap-start text-center cursor-pointer ${
              isSelected
                ? "border-red-600 text-white"
                : "border-zinc-800 text-white hover:border-zinc-500"
            }`}
          >
            {isShowing ? (
              <div className="flex flex-col gap-0.5 pointer-events-none">
                <p
                  className={`text-[10px] sm:text-xs ${isSelected ? "text-red-500" : "text-zinc-400"}`}
                >
                  {localizedDayName}
                </p>
                <h3 className="text-sm sm:text-base font-extrabold text-white">
                  {(item as DateTabItem).date}
                </h3>
                <p
                  className={`text-[10px] sm:text-xs ${isSelected ? "text-red-500" : "text-zinc-400"}`}
                >
                  {localizedMonthName}
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-0.5 pointer-events-none">
                <p
                  className={`text-[10px] sm:text-xs ${isSelected ? "text-red-500" : "text-zinc-400"}`}
                >
                  {th("comingLabel")}
                </p>
                <h3 className="text-xs sm:text-sm font-extrabold text-white line-clamp-1">
                  {localizedMonthName}
                </h3>
                <p
                  className={`text-[10px] sm:text-xs ${isSelected ? "text-red-500" : "text-zinc-400"}`}
                >
                  {yearDisplay}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}