"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Added hook

import { Send, Music2 } from "lucide-react";
import { FaFacebook, FaApple } from "react-icons/fa";
import { BsInstagram, BsYoutube } from "react-icons/bs";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname(); // Get current URL path

  const companyLinks = [
    { label: "About Us", href: "/about-us" },
    { label: "Contact Us", href: "/contact" },
    { label: "Cinemas", href: "/cinemas" },
  ];

  const moreLinks = [
    { label: "Promotions", href: "/promotions" },
    { label: "News & Activity", href: "/news-activity" },
    { label: "My Tickets", href: "/tickets" },
    { label: "Terms & Conditions", href: "/terms-&-conditions" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const socials = [
    {
      icon: FaFacebook,
      href: "https://www.facebook.com/LegendCinemas?mibextid=LQQJ4d",
      label: "Facebook",
    },
    {
      icon: BsInstagram,
      href: "https://www.instagram.com/legendcinemas?igshid=MzRlODBiNWFlZA%3D%3D",
      label: "Instagram",
    },
    {
      icon: BsYoutube,
      href: "https://www.youtube.com/@LegendCinemasKh",
      label: "YouTube",
    },
    {
      icon: Music2,
      href: "https://www.tiktok.com/@legendcinema?_t=8eX8Pz2BlvL&_r=1",
      label: "TikTok",
    },
    {
      icon: Send,
      href: "https://t.me/legendcinemas",
      label: "Telegram",
    },
  ];

  const payments = [
    "/aba-payway-logo.png",
    "/visa-logo.png",
    "/mastercard-logo.png",
  ];

  return (
    <footer className="relative z-20 border-t border-zinc-800 bg-black text-white mb-10 sm:mb-0">
      <div className="mx-auto max-w-7xl px-8 py-12 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-3">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold">Company</h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => {
                // Check if current path matches link href exactly or contextually
                const isActive = pathname === link.href;

                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-300 hover:text-white ${
                        isActive ? "text-white font-medium" : "text-zinc-400"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-lg font-semibold">More</h3>

            <ul className="mt-5 space-y-3">
              {moreLinks.map((link) => {
                const isActive = pathname === link.href;

                return (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className={`text-sm transition-colors duration-300 hover:text-white ${
                        isActive ? "text-white font-medium" : "text-zinc-400"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* App + Social */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold">Download Our App</h3>

            <div className="mt-5 flex gap-4">
              {/* Google Play */}
              <Link
                href="https://play.google.com/store/apps/details?id=kh.com.legend&hl=en"
                target="_blank"
                className="
    flex h-14 w-14 items-center justify-center
    rounded-full
    border border-zinc-700
    bg-zinc-900
    transition-all duration-300
    hover:scale-105
    hover:border-white
  "
              >
                {/* Modern Official Google Play Multi-Color SVG Logo */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.323 1.63a2.33 2.33 0 0 0-.48 1.625v17.483a2.32 2.32 0 0 0 .49 1.627l.062.06 9.805-9.806v-.235L3.385 1.57l-.062.06Z"
                    fill="#00F0FF"
                  />
                  <path
                    d="M16.48 15.353l-3.28-3.28v-.236l3.28-3.28.075.043 3.882 2.206c1.107.627 1.107 1.658 0 2.288l-3.882 2.206-.075.017Z"
                    fill="#FFC400"
                  />
                  <path
                    d="M13.2 11.957L3.323 22.075a1.768 1.768 0 0 0 2.186.068l10.971-6.236-3.28-3.28-.7 1.33Z"
                    fill="#FF3A44"
                  />
                  <path
                    d="M13.2 11.957l3.28-3.28L5.51 2.441a1.768 1.768 0 0 0-2.187.067l9.877 10.117v-.668Z"
                    fill="#00E676"
                  />
                </svg>
              </Link>
              {/* App Store */}
              <Link
                href="https://apps.apple.com/us/app/legend-cinema/id1494420578"
                target="_blank"
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-full
                  border border-zinc-700
                  bg-zinc-900
                  text-white
                  transition-all duration-300
                  hover:scale-105
                  hover:border-white
                "
              >
                <FaApple size={24} />
              </Link>
            </div>

            {/* Social */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold">Follow Our Social Media</h3>

              <div className="mt-4 flex flex-wrap gap-3">
                {socials.map((social) => {
                  const Icon = social.icon;

                  return (
                    <Link
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      aria-label={social.label}
                      className="
                        flex h-11 w-11 items-center justify-center
                        rounded-full
                        border border-zinc-700
                        bg-zinc-900
                        text-zinc-300
                        transition-all duration-300
                        hover:scale-110
                        hover:border-white
                        hover:bg-red-500
                        hover:text-white
                      "
                    >
                      <Icon size={18} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-14 border-t border-zinc-800 pt-8">
          <h3 className="text-lg font-semibold">Payment</h3>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            {payments.map((src) => (
              <div
                key={src}
                className="
                  rounded-xl
                  p-3
                  transition-all duration-300
                  hover:border-white
                "
              >
                <Image
                  src={src}
                  alt="Payment Method"
                  width={80}
                  height={40}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t border-zinc-800 pt-6">
          <p className="text-center text-sm text-zinc-500">
            © {currentYear} Ticket Booking System. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
