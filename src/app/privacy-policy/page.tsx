"use client";

import { useState, useEffect, ReactNode } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { useLanguage } from "@/features/language/useLanuage";
import { translations } from "@/features/language/translations";

interface ScrollAnimateSectionProps {
  children: ReactNode;
  id: string;
  className?: string;
}

const sectionFadeVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.215, 0.61, 0.355, 1] },
  },
};

function ScrollAnimateSection({
  children,
  id,
  className = "",
}: ScrollAnimateSectionProps) {
  return (
    <motion.section
      id={id}
      variants={sectionFadeVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-10% 0px -20% 0px" }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function PrivacyPolicyPage() {
  const { currentLanguage } = useLanguage();
  const langCode = currentLanguage?.code || "en";
  const [activeSection, setActiveSection] = useState<string>("data-collection");

  const th = (key: string): string => {
    const lookupKey = key as keyof typeof translations;
    return (
      translations[lookupKey]?.[langCode] ||
      translations[lookupKey]?.["en"] ||
      key
    );
  };

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");

    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -60% 0px", 
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

  const handleScrollToSection = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    e.preventDefault();

    const targetSection = document.querySelector(`[id="${sectionId}"]`);
    if (targetSection) {
      // Adjusted offset to prevent sticky header blocks from overlapping content
      const yOffset = -220;
      const yPosition =
        targetSection.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({
        top: yPosition,
        behavior: "smooth",
      });
      setActiveSection(sectionId);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col text-zinc-300 select-none relative antialiased">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-200 md:w-325 h-150 md:h-175 bg-red-950/10 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      {/* Main Layout Viewport Shell */}
      <main className="flex-1 relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32 pb-12 sm:pb-16 overflow-x-hidden">
        <div className="sticky top-20 z-20 bg-black/80 backdrop-blur-md pt-2 pb-3 border-b border-zinc-900/60 lg:relative lg:top-0 lg:z-auto lg:bg-transparent lg:border-b-0 lg:pt-0 lg:backdrop-blur-none">
          {/* Breadcrumb Navigation Block */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 mb-4 tracking-wide"
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
              {th("privacyPolicy")}
            </span>
          </nav>

          {/* Heading Header */}
          <header className="pb-1 lg:border-b lg:border-zinc-900 lg:pb-4 lg:mb-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase m-0">
              {th("privacyPolicy")}
            </h1>
          </header>

          {/* Mobile Jump-To Navigation Bar */}
          <div className="lg:hidden bg-zinc-950/80 border border-zinc-900/80 rounded-xl p-2.5 my-2 backdrop-blur-xl flex flex-nowrap gap-2 items-center text-xs shadow-lg overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] pl-1 shrink-0">
              {th("jumpToLabel")}
            </span>
            <a
              href="#data-collection"
              onClick={(e) => handleScrollToSection(e, "data-collection")}
              className={`px-3 py-1.5 transition-colors rounded-lg font-medium text-xs shrink-0 whitespace-nowrap ${
                activeSection === "data-collection"
                  ? "bg-red-950/30 border border-red-900/40 text-red-500"
                  : "bg-zinc-900/60 text-zinc-200 active:bg-zinc-800"
              }`}
            >
              {th("dataCollectionTab")}
            </a>
            <a
              href="#data-usage"
              onClick={(e) => handleScrollToSection(e, "data-usage")}
              className={`px-3 py-1.5 transition-colors rounded-lg font-medium text-xs shrink-0 whitespace-nowrap ${
                activeSection === "data-usage"
                  ? "bg-red-950/30 border border-red-900/40 text-red-500"
                  : "bg-zinc-900/60 text-zinc-200 active:bg-zinc-800"
              }`}
            >
              {th("dataUsageTab")}
            </a>
            <a
              href="#data-security"
              onClick={(e) => handleScrollToSection(e, "data-security")}
              className={`px-3 py-1.5 transition-colors rounded-lg font-medium text-xs shrink-0 whitespace-nowrap ${
                activeSection === "data-security"
                  ? "bg-red-950/30 border border-red-900/40 text-red-500"
                  : "bg-zinc-900/60 text-zinc-200 active:bg-zinc-800"
              }`}
            >
              {th("dataSecurityTab")}
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start pt-4">
          {/* Sticky Quick-Links Side Panel Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-36 space-y-3 border-l border-zinc-900 pl-4 py-2">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">
              {th("jumpToSectionLabel")}
            </p>
            <a
              href="#data-collection"
              onClick={(e) => handleScrollToSection(e, "data-collection")}
              className={`block text-sm transition-colors duration-200 font-semibold focus-visible:outline-none ${
                activeSection === "data-collection"
                  ? "text-red-500"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              {th("dataCollectionTab")}
            </a>
            <a
              href="#data-usage"
              onClick={(e) => handleScrollToSection(e, "data-usage")}
              className={`block text-sm transition-colors duration-200 font-semibold focus-visible:outline-none ${
                activeSection === "data-usage"
                  ? "text-red-500"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              {th("dataUsageTab")}
            </a>
            <a
              href="#data-security"
              onClick={(e) => handleScrollToSection(e, "data-security")}
              className={`block text-sm transition-colors duration-200 font-semibold focus-visible:outline-none ${
                activeSection === "data-security"
                  ? "text-red-500"
                  : "text-zinc-400 hover:text-red-500"
              }`}
            >
              {th("dataSecurityTab")}
            </a>
          </aside>

          {/* Main Content Article Body */}
          <div className="lg:col-span-3 space-y-20 text-zinc-300 text-sm sm:text-base leading-relaxed font-normal pt-4 lg:pt-0 selection:bg-red-500/30">
            <ScrollAnimateSection
              id="data-collection"
              className="space-y-6 pt-1"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-zinc-900 pb-3">
                {th("dataCollectionTitle")}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                {th("dataCollectionIntro")}
              </p>

              <ol className="space-y-4 list-none pl-0 m-0">
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    1.
                  </span>
                  <p className="flex-1 m-0 p-0">
                    <strong className="text-zinc-100 font-semibold inline mr-1">
                      {th("personalDataLabel")}
                    </strong>
                    {th("personalDataDesc")}
                  </p>
                </li>
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    2.
                  </span>
                  <p className="flex-1 m-0 p-0">
                    <strong className="text-zinc-100 font-semibold inline mr-1">
                      {th("usageDataLabel")}
                    </strong>
                    {th("usageDataDesc")}
                  </p>
                </li>
                <li className="flex gap-4 items-start text-zinc-300">
                  <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                    3.
                  </span>
                  <p className="flex-1 m-0 p-0">
                    <strong className="text-zinc-100 font-semibold inline mr-1">
                      {th("cookiesLabel")}
                    </strong>
                    {th("cookiesDesc")}
                  </p>
                </li>
              </ol>
            </ScrollAnimateSection>

            <ScrollAnimateSection id="data-usage" className="space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-zinc-900 pb-3">
                {th("dataUsageTitle")}
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                {th("dataUsageIntro")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 space-y-2">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {th("useCaseServiceTitle")}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-normal">
                    {th("useCaseServiceDesc")}
                  </p>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 space-y-2">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {th("useCaseCommTitle")}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-normal">
                    {th("useCaseCommDesc")}
                  </p>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 space-y-2">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {th("useCaseSafetyTitle")}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-normal">
                    {th("useCaseSafetyDesc")}
                  </p>
                </div>

                <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-4 space-y-2">
                  <h3 className="text-white font-bold text-sm flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600" />
                    {th("useCaseImproveTitle")}
                  </h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-normal">
                    {th("useCaseImproveDesc")}
                  </p>
                </div>
              </div>
            </ScrollAnimateSection>

            <ScrollAnimateSection id="data-security" className="space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-zinc-900 pb-3">
                {th("dataSecurityTitle")}
              </h2>

              <div className="bg-red-950/10 border border-red-900/20 rounded-2xl p-5 sm:p-6 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-red-500 font-black text-xs sm:text-sm tracking-wider uppercase">
                  <span>🛡️ {th("securityHeader")}</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  {th("securityBody")}
                </p>
              </div>

              <div className="space-y-4 pl-1">
                <p className="text-sm">
                  {th("securityContactText")}{" "}
                  <a
                    href="mailto:privacy@legend.com.kh"
                    className="text-red-500 hover:text-red-400 font-medium underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded"
                    rel="noopener noreferrer"
                  >
                    privacy@legend.com.kh
                  </a>{" "}
                  {th("securityContactOr")}{" "}
                  <span className="text-white font-mono font-bold">
                    081300400
                  </span>
                  .
                </p>
              </div>

              <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 mt-6 text-xs text-zinc-500 space-y-1">
                <p className="font-medium">{th("privacyRightsDisclaimer")}</p>
                <p className="font-mono">{th("copyrightNotice")}</p>
              </div>
            </ScrollAnimateSection>
          </div>
        </div>

      </main>

      <div className="relative z-10 w-full mt-auto">
        <Footer />
      </div>
    </div>
  );
}
