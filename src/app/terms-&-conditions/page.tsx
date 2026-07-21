"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.215, 0.61, 0.355, 1] as const },
  },
};

export default function TermsAndConditionsPage() {
  usePageTitle("Terms & Conditions");
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage?.code || "en";
  const [activeSection, setActiveSection] = useState<string>("tickets-rules");

  const th = (key: string): string => {
    const lookupKey = key as keyof typeof translations;
    return (
      translations[lookupKey]?.[langCode] ||
      translations[lookupKey]?.["en"] ||
      key
    );
  };

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();
    const targetSection = document.querySelector(`[id="${sectionId}"]`);
    if (targetSection) {
      const yOffset = -240;
      const yPosition =
        targetSection.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -65% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col text-zinc-300 select-none relative antialiased">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-200 md:w-325 h-150 md:h-175 bg-red-950/10 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      {/* Main Layout Viewport Shell */}
      <main className="flex-1 relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 overflow-x-hidden">
        <div className="sticky top-16 sm:top-20 z-20 bg-black/80 backdrop-blur-md pt-4 pb-3 border-b border-zinc-900/60 lg:relative lg:top-0 lg:z-auto lg:bg-transparent lg:border-b-0 lg:pt-0 lg:backdrop-blur-none">
          {/* Breadcrumb Navigation Block */}
          <nav
            aria-label="Breadcrumb"
            className="hidden sm:flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 mb-4 tracking-wide"
          >
            <Link
              href="/"
              className="hover:text-red-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded px-0.5"
            >
              {th("homeBreadcrumb")}
            </Link>
            <span className="text-zinc-700 select-none" aria-hidden="true">
              /
            </span>
            <span className="text-zinc-100 font-semibold" aria-current="page">
              {th("termsAndConditions")}
            </span>
          </nav>

          {/* Heading Header */}
          <header className="pb-1 lg:border-b lg:border-zinc-900 lg:pb-4 lg:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-4xl font-black tracking-tight text-white uppercase">
              {th("termsAndConditions")}
            </h1>
          </header>

          {/* Mobile/Tablet Fixed Jump-To Navigation Bar */}
          <div className="lg:hidden bg-zinc-950/90 border border-zinc-900/80 rounded-xl p-2.5 my-2 backdrop-blur-xl flex flex-nowrap gap-2 items-center text-xs shadow-lg overflow-x-auto overflow-y-hidden select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] pl-1 shrink-0">
              {th("jumpToLabel")}
            </span>
            <a
              href="#tickets-rules"
              onClick={(e) => handleScrollToSection(e, "tickets-rules")}
              className={`px-3 py-1.5 transition-all rounded-lg font-medium text-xs shrink-0 whitespace-nowrap ${
                activeSection === "tickets-rules"
                  ? "bg-red-950/40 border border-red-900/60 text-red-400 shadow-sm"
                  : "bg-zinc-900/60 text-zinc-300 border border-transparent active:bg-zinc-800"
              }`}
            >
              {th("ticketRegsTab")}
            </a>
            <a
              href="#4dx-safety"
              onClick={(e) => handleScrollToSection(e, "4dx-safety")}
              className={`px-3 py-1.5 transition-all rounded-lg font-medium text-xs shrink-0 whitespace-nowrap ${
                activeSection === "4dx-safety"
                  ? "bg-red-950/40 border border-red-900/60 text-red-400 shadow-sm"
                  : "bg-zinc-900/60 text-zinc-300 border border-transparent active:bg-zinc-800"
              }`}
            >
              {th("dxSafetyTab")}
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start pt-6">
          {/* Sticky Quick-Links Side Panel Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-36 space-y-3 border-l border-zinc-900 pl-4 py-2">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">
              {th("jumpToSectionLabel")}
            </p>
            <a
              href="#tickets-rules"
              onClick={(e) => handleScrollToSection(e, "tickets-rules")}
              className={`block text-sm transition-colors duration-200 font-semibold focus-visible:outline-none ${
                activeSection === "tickets-rules"
                  ? "text-red-500"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              {th("ticketRegsTab")}
            </a>
            <a
              href="#4dx-safety"
              onClick={(e) => handleScrollToSection(e, "4dx-safety")}
              className={`block text-sm transition-colors duration-200 font-semibold focus-visible:outline-none ${
                activeSection === "4dx-safety"
                  ? "text-red-500"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              {th("dxSafetyTab")}
            </a>
          </aside>

          {/* Main Content Article Body */}
          <motion.article
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 space-y-20 text-zinc-300 text-sm sm:text-base leading-relaxed font-normal pt-4 lg:pt-0"
          >
            {/* SECTION 1: Ticket Purchased Rule and Regulation */}
            <motion.section
              variants={itemVariants}
              id="tickets-rules"
              className="space-y-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-zinc-900 pb-3">
                {th("ticketRulesTitle")}
              </h2>

              <ol className="space-y-4 list-none pl-0">
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    1.
                  </span>
                  <span className="flex-1">{th("ticketRule1")}</span>
                </li>
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    2.
                  </span>
                  <span className="flex-1">{th("ticketRule2")}</span>
                </li>
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    3.
                  </span>
                  <span className="flex-1">{th("ticketRule3")}</span>
                </li>
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    4.
                  </span>
                  <span className="flex-1">
                    {th("ticketRule4Part1")}{" "}
                    <a
                      href="mailto:hotline@legend.com.kh"
                      className="text-red-500 hover:text-red-400 font-medium underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded"
                      rel="noopener noreferrer"
                    >
                      hotline@legend.com.kh
                    </a>{" "}
                    {th("ticketRule4Part2")}{" "}
                    <span className="text-white font-mono font-bold">
                      081300400
                    </span>{" "}
                    {th("ticketRule4Part3")}{" "}
                    <span className="text-white font-bold font-mono">30</span>{" "}
                    {th("ticketRule4Part4")}
                  </span>
                </li>
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    5.
                  </span>
                  <span className="flex-1">
                    {th("ticketRule5Part1")}{" "}
                    <span className="text-white font-mono font-bold">4</span>{" "}
                    {th("ticketRule5Part2")}
                  </span>
                </li>
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    6.
                  </span>
                  <span className="flex-1">{th("ticketRule6")}</span>
                </li>
              </ol>

              <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 mt-6 text-xs text-zinc-500 space-y-1">
                <p className="font-medium">{th("ticketRightsDisclaimer")}</p>
                <p className="font-mono">{th("copyrightNotice")}</p>
              </div>
            </motion.section>

            {/* SECTION 2: 4DX Safety Guidelines */}
            <motion.section
              variants={itemVariants}
              id="4dx-safety"
              className="space-y-6"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-zinc-900 pb-3">
                {th("dxSafetyTitle")}
              </h2>

              {/* Advisory Warning Callout */}
              <div className="bg-red-950/10 border border-red-900/20 rounded-2xl p-5 sm:p-6 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-red-500 font-black text-xs sm:text-sm tracking-wider uppercase">
                  <span>⚠️ {th("dxNoticeHeader")}</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {th("dxNoticeBody")}
                </p>
                <p className="text-zinc-500 text-[11px] sm:text-xs font-semibold">
                  {th("dxNoticeDisclaimer")}
                </p>
              </div>

              {/* Subsections Stack */}
              <div className="space-y-8 mt-8">
                {/* Subsection 1 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">1.</span>{" "}
                    {th("dxSub1Title")}
                  </h3>
                  <p className="text-zinc-400 text-sm pl-6">
                    {th("dxSub1Desc")}
                  </p>
                  <ul className="list-none pl-6 space-y-2.5 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxHeightLabel")}{" "}
                        </strong>
                        {th("dxHeightPart1")}{" "}
                        <span className="text-white font-mono font-bold">
                          100 cm
                        </span>{" "}
                        ({th("dxHeightPart2")}{" "}
                        <span className="text-white font-mono font-bold">
                          3.2 feet
                        </span>
                        ) {th("dxHeightPart3")}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxAgeLabel")}{" "}
                        </strong>
                        {th("dxAgePart1")}{" "}
                        <span className="text-white font-mono font-bold">
                          4
                        </span>{" "}
                        {th("dxAgePart2")}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxWeightLabel")}{" "}
                        </strong>
                        {th("dxWeightPart1")}{" "}
                        <span className="text-white font-mono font-bold">
                          120 kg
                        </span>{" "}
                        ({th("dxWeightPart2")}{" "}
                        <span className="text-white font-mono font-bold">
                          264 lbs
                        </span>
                        ).
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxSupervisionLabel")}{" "}
                        </strong>
                        {th("dxSupervisionPart1")}{" "}
                        <span className="text-white font-mono font-bold">
                          4
                        </span>{" "}
                        {th("dxSupervisionPart2")}{" "}
                        <span className="text-white font-mono font-bold">
                          7
                        </span>{" "}
                        {th("dxSupervisionPart3")}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxSeatingLabel")}{" "}
                        </strong>
                        {th("dxSeatingDesc")}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Subsection 2 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">2.</span>{" "}
                    {th("dxSub2Title")}
                  </h3>
                  <p className="text-zinc-400 text-sm pl-6">
                    {th("dxSub2Desc")}
                  </p>
                  <ul className="list-none pl-6 space-y-2.5 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{th("dxMedicalCondition1")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{th("dxMedicalCondition2")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{th("dxMedicalCondition3")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{th("dxMedicalCondition4")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{th("dxMedicalCondition5")}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>{th("dxMedicalCondition6")}</span>
                    </li>
                  </ul>
                </div>

                {/* Subsection 3 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">3.</span>{" "}
                    {th("dxSub3Title")}
                  </h3>
                  <p className="text-zinc-400 text-sm pl-6">
                    {th("dxSub3Desc")}
                  </p>
                  <ul className="list-none pl-6 space-y-4 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxEffectsRespLabel")}{" "}
                        </strong>
                        {th("dxEffectsRespDesc")}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxEffectsWaterLabel")}{" "}
                        </strong>
                        {th("dxEffectsWaterDesc")}
                        <span className="block mt-2 text-xs text-zinc-400 bg-zinc-950 px-3 py-2 border border-zinc-900 rounded-md font-semibold max-w-xl">
                          {th("dxEffectsWaterControl")}
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxEffectsStartleLabel")}{" "}
                        </strong>
                        {th("dxEffectsStartleDesc")}
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Subsection 4 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">4.</span>{" "}
                    {th("dxSub4Title")}
                  </h3>
                  <ul className="list-none pl-6 space-y-4 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxRulesSeatedLabel")}{" "}
                        </strong>
                        {th("dxRulesSeatedDesc")}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxRulesLostLabel")}{" "}
                        </strong>
                        {th("dxRulesLostDesc")}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxRulesDrinksLabel")}{" "}
                        </strong>
                        {th("dxRulesDrinksDesc")}
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          {th("dxRulesValuablesLabel")}{" "}
                        </strong>
                        {th("dxRulesValuablesDesc")}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </motion.article>
        </div>
        {/* ====================================================== */}
      </main>

      {/* Structured Footer wrapper guarantees layer stacking clarity over atmospheric elements */}
      <div className="relative z-10 w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
