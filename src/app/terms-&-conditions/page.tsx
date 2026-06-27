"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

// Smooth staggered animation presets with explicit type definition
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
  return (
    <div className="min-h-screen bg-black flex flex-col text-zinc-300 select-none relative overflow-x-hidden antialiased scroll-smooth">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-200 md:w-325 h-150 md:h-175 bg-red-950/10 rounded-full blur-[140px]" />
      </div>

      <Navbar />

      {/* Main Layout Container - Highly padded to explicitly clear the stacked custom navbar */}
      <main className="flex-1 pb-24 relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-30 sm:pt-32 ">
        {/* Breadcrumb Navigation Block */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs sm:text-sm font-medium text-zinc-500 mb-6 tracking-wide"
        >
          <Link
            href="/"
            className="hover:text-red-500 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded px-0.5"
          >
            Home
          </Link>
          <span className="text-zinc-700 select-none" aria-hidden="true">
            /
          </span>
          <span className="text-zinc-100 font-semibold" aria-current="page">
            Terms & Conditions
          </span>
        </nav>

        {/* Heading Header */}
        <header className="border-b border-zinc-900 pb-5 mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
            Terms & Conditions
          </h1>
        </header>

        {/* Mobile Jump-To Navigation (Sticky bar below mobile viewport navbar) */}
        <div className="lg:hidden sticky top-16 sm:top-20 z-40 bg-black/80 border border-zinc-900/80 rounded-xl p-2.5 mb-8 backdrop-blur-xl flex flex-wrap gap-2 items-center text-xs shadow-lg">
          <span className="text-zinc-500 font-bold uppercase tracking-wider text-[10px] pl-1">
            Jump To:
          </span>
          <a
            href="#tickets-rules"
            className="px-3 py-1.5 bg-zinc-900/60 active:bg-zinc-800 text-zinc-200 transition-colors rounded-lg font-medium"
          >
            Ticket Regulations
          </a>
          <a
            href="#4dx-safety"
            className="px-3 py-1.5 bg-zinc-900/60 active:bg-zinc-800 text-zinc-200 transition-colors rounded-lg font-medium"
          >
            4DX Safety Guidelines
          </a>
        </div>

        {/* Two-Column Document Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12 items-start">
          {/* Sticky Quick-Links Side Panel Navigation (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-44 space-y-3 border-l border-zinc-900 pl-4">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-4">
              Jump To Section
            </p>
            <a
              href="#tickets-rules"
              className="block text-sm text-zinc-400 hover:text-red-500 transition-colors duration-200 font-semibold focus-visible:outline-none focus-visible:text-red-500"
            >
              Ticket Regulations
            </a>
            <a
              href="#4dx-safety"
              className="block text-sm text-zinc-400 hover:text-red-500 transition-colors duration-200 font-semibold focus-visible:outline-none focus-visible:text-red-500"
            >
              4DX Safety Guidelines
            </a>
          </aside>

          {/* Main Content Article Body */}
          <motion.article
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-3 space-y-16 text-zinc-300 text-sm sm:text-base leading-relaxed font-normal"
          >
            {/* SECTION 1: Ticket Purchased Rule and Regulation */}
            <motion.section
              variants={itemVariants}
              id="tickets-rules"
              className="space-y-6 scroll-mt-32 md:scroll-mt-48"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-zinc-900 pb-3">
                Ticket Purchased Rule and Regulation
              </h2>

              <ol className="space-y-4 list-none pl-0">
                {[
                  "Every movie tickets purchased via the Sale Channels are strictly non-refundable and are not available for exchange under whatever circumstances.",
                  "Purchased tickets are not exchangeable for tickets at a different price, for another movie, or for another screening or day.",
                  "Movie tickets purchased via the Sales Channels will be available for collection at the relevant cinema from the ticket counter or at our KIOSK machine (where available) by producing the booking numbers/reservation sent by email or as available under the purchased history feature in Legend Mobile application or any other means that shall be introduced by Legend Cinema from time time.",
                  <>
                    In case of any malfunctions of the reservation or purchase
                    form placed on the website or mobile application, please
                    contact us immediately at the following e-mail address{" "}
                    <a
                      href="mailto:hotline@legend.com.kh"
                      className="text-red-500 hover:text-red-400 font-medium underline transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-500 rounded"
                      rel="noopener noreferrer"
                    >
                      hotline@legend.com.kh
                    </a>{" "}
                    or contact our hotline{" "}
                    <span className="text-white font-mono font-bold">
                      081300400
                    </span>{" "}
                    at least{" "}
                    <span className="text-white font-bold font-mono">30</span>{" "}
                    minutes before the movie start. We would also like to inform
                    you that it is the basis and condition for an effective
                    complaint about the impossibility or difficulties in
                    purchasing tickets online.
                  </>,
                  <>
                    If the User fails to purchase a ticket for the screening for
                    which he or she has reserved a seat in the Legend Cinema
                    within the time limit specified in clause{" "}
                    <span className="text-white font-mono font-bold">4</span>{" "}
                    above, the reservation of such a seat cannot be guaranteed.
                  </>,
                  "Movie tickets are made available subject to the classification of relevant film given by the Film Censorship Board of Cambodia. Legend Cinema has a legal obligation to refuse admission to a person, who in the opinion of its duty manager, is under the minimum age required for NC15 and R18 classified films (including children in arms). Proof of age may be required in certain instances.",
                ].map((text, idx) => (
                  <li
                    key={idx}
                    className="flex gap-4 items-start text-zinc-300"
                  >
                    <span className="text-white font-mono font-bold text-sm select-none shrink-0 min-w-5 text-left mt-0.75">
                      {idx + 1}.
                    </span>
                    <span className="flex-1">{text}</span>
                  </li>
                ))}
              </ol>

              <div className="bg-zinc-950/60 border border-zinc-900 rounded-xl p-4 mt-6 text-xs text-zinc-500 space-y-1">
                <p className="font-medium">
                  Legend Cinema reserved the rights to have term and condition
                  changed.
                </p>
                <p className="font-mono">
                  All rights reserved Legend Cinema Co, Ltd 2024.
                </p>
              </div>
            </motion.section>

            {/* SECTION 2: 4DX Safety Guidelines */}
            <motion.section
              variants={itemVariants}
              id="4dx-safety"
              className="space-y-6 scroll-mt-32 md:scroll-mt-48"
            >
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight border-b border-zinc-900 pb-3">
                4DX Auditorium Safety Guideline & Advisory Notice
              </h2>

              {/* Advisory Warning Callout */}
              <div className="bg-red-950/10 border border-red-900/20 rounded-2xl p-5 sm:p-6 space-y-3 shadow-inner">
                <div className="flex items-center gap-2 text-red-500 font-black text-xs sm:text-sm tracking-wider uppercase">
                  <span>⚠️ Important Notice to All Guests</span>
                </div>
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                  The 4DX auditorium features advanced environmental effects
                  including high-velocity motion-controlled seating, sudden
                  pitching/rolling, vibrations, leg/back ticklers, water sprays,
                  wind blasts, intense strobe lighting, fog, and artificial
                  scents.
                </p>
                <p className="text-zinc-500 text-[11px] sm:text-xs font-semibold">
                  By purchasing a ticket, you acknowledge and agree to adhere to
                  the safety protocols detailed below. Admission is at your own
                  risk.
                </p>
              </div>

              {/* Subsections Grid Stack */}
              <div className="space-y-8 mt-8">
                {/* Subsection 1 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">1.</span>{" "}
                    Critical Admission Restrictions
                  </h3>
                  <p className="text-zinc-400 text-sm pl-6">
                    Guests who do not meet the physical criteria below will be
                    denied entry for mechanical safety and injury prevention:
                  </p>
                  <ul className="list-none pl-6 space-y-2.5 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Minimum Height:
                        </strong>{" "}
                        Must be at least{" "}
                        <span className="text-white font-mono font-bold">
                          100 cm
                        </span>{" "}
                        (
                        <span className="text-white font-mono font-bold">
                          3.2 feet
                        </span>
                        ) tall.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Minimum Age:
                        </strong>{" "}
                        Must be at least{" "}
                        <span className="text-white font-mono font-bold">
                          4
                        </span>{" "}
                        years old.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Maximum Weight:
                        </strong>{" "}
                        Must not exceed{" "}
                        <span className="text-white font-mono font-bold">
                          120 kg
                        </span>{" "}
                        (
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
                          Supervision:
                        </strong>{" "}
                        Children aged{" "}
                        <span className="text-white font-mono font-bold">
                          4
                        </span>{" "}
                        to{" "}
                        <span className="text-white font-mono font-bold">
                          7
                        </span>{" "}
                        must be accompanied and directly supervised by an adult
                        at all times.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Seating Configuration:
                        </strong>{" "}
                        Lap-sitting is strictly prohibited. Every guest must
                        occupy their own assigned seat. Child booster seats are
                        forbidden as they interfere with the seat mechanics.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Subsection 2 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">2.</span>{" "}
                    Medical & Health Prohibitions
                  </h3>
                  <p className="text-zinc-400 text-sm pl-6">
                    Entry is strictly prohibited or highly discouraged for
                    individuals with the following medical conditions, as the
                    intense physical environment may aggravate injuries or cause
                    severe distress:
                  </p>
                  <ul className="list-none pl-6 space-y-2.5 text-sm text-zinc-300">
                    {[
                      "Expectant mothers (Pregnancy)",
                      "Individuals with chronic back, neck, or spinal injuries/conditions",
                      "Individuals with heart conditions, high blood pressure, or cardiovascular irregularities",
                      "Individuals prone to epilepsy, photosensitive seizures, or severe migraines (due to strobe lights)",
                      "Individuals suffering from severe motion sickness, vertigo, or balance disorders",
                      "Individuals who have recently undergone surgery or have limited physical mobility",
                    ].map((phrase, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                        <span>{phrase}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Subsection 3 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">3.</span>{" "}
                    Ambient Effects & Customer Uneasiness Warnings
                  </h3>
                  <p className="text-zinc-400 text-sm pl-6">
                    Even healthy guests may experience unexpected physical
                    discomfort during the screening. Please note the following
                    environmental factors:
                  </p>
                  <ul className="list-none pl-6 space-y-4 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Respiratory & Scent Triggers:
                        </strong>{" "}
                        The theater uses synthetic fragrances (e.g., smoke,
                        gunpowder, floral scents) and artificial fog. Guests
                        with severe asthma, respiratory issues, or chemical
                        sensitivities may experience irritation.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Water Effects:
                        </strong>{" "}
                        Water will be sprayed directly at your face from the
                        seat ahead. While the water is purified, it may smudge
                        makeup, spot eyewear, or damage delicate clothing (e.g.,
                        silk, suede, leather).
                        <span className="block mt-2 text-xs text-zinc-400 bg-zinc-950 px-3 py-2 border border-zinc-900 rounded-md font-semibold max-w-xl">
                          Control Option: Guests may manually deactivate the
                          water effects using the On/Off button located on their
                          individual armrest.
                        </span>
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Startle Reflexes:
                        </strong>{" "}
                        High-pressure air jets located near the headrest
                        simulate projectiles passing close to the ears. This
                        produces a sudden, loud hissing sound that can startle
                        sensitive viewers.
                      </span>
                    </li>
                  </ul>
                </div>

                {/* Subsection 4 */}
                <div className="space-y-3">
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span className="text-white font-mono font-bold">4.</span>{" "}
                    In-Theater Safety & Liability Rules
                  </h3>
                  <ul className="list-none pl-6 space-y-4 text-sm text-zinc-300">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          The &quot;Stay Seated&quot; Rule:
                        </strong>{" "}
                        Guests must remain fully seated with feet on the
                        footrest throughout the duration of the movie. Do not
                        stand or walk while the seats are in motion.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Lost Items Hazard:
                        </strong>{" "}
                        If a personal item (phone, wallet, keys) falls beneath
                        the seating platform, DO NOT attempt to retrieve it
                        while the film is playing. The mechanical lift systems
                        underneath the chairs move without warning and pose a
                        severe crush hazard. Wait until the credits roll, the
                        house lights turn on, and the seats completely power
                        down, or alert a floor staff member.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Hot Beverage Ban:
                        </strong>{" "}
                        No hot drinks or open soup containers are permitted
                        inside the auditorium to prevent severe spill or burn
                        injuries during sudden seat movements. All cold
                        beverages must be securely capped.
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 mt-2 h-1.5 w-1.5 rounded-full bg-red-600 shrink-0" />
                      <span>
                        <strong className="text-zinc-200 font-medium">
                          Valuables Protection:
                        </strong>{" "}
                        Secure all loose personal belongings, bags, and coats.
                        The cinema is not liable for items damaged, wet, or lost
                        due to motion and environmental effects.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.section>
          </motion.article>
        </div>
      </main>

      <Footer />
    </div>
  );
}
