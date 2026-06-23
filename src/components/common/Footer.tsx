"use client";

import Image from "next/image";
import Link from "next/link";

import { Send, Music2 } from "lucide-react";
import { FaFacebook, FaApple } from "react-icons/fa";
import { BsInstagram, BsYoutube, BsGooglePlay } from "react-icons/bs";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: "About Us", href: "/about" },
    { label: "Contact Us", href: "/contact" },
    { label: "Cinemas", href: "/cinemas" },
  ];

  const moreLinks = [
    { label: "Promotions", href: "/promotions" },
    { label: "News & Activity", href: "/news" },
    { label: "My Tickets", href: "/tickets" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
  ];

  const socials = [
    {
      icon: FaFacebook,
      href: "#",
      label: "Facebook",
    },
    {
      icon: BsInstagram,
      href: "#",
      label: "Instagram",
    },
    {
      icon: BsYoutube,
      href: "#",
      label: "YouTube",
    },
    {
      icon: Music2,
      href: "#",
      label: "TikTok",
    },
    {
      icon: Send,
      href: "#",
      label: "Telegram",
    },
  ];

  const payments = [
    "/aba-payway-logo.png",
    "/visa-logo.png",
    "/mastercard-logo.png",
  ];

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-white mb-10 sm:mb-0">
      <div className="mx-auto max-w-7xl px-8 py-12 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid grid-cols-2 gap-10 lg:grid-cols-3">
          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold">Company</h3>

            <ul className="mt-5 space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="
                      text-sm text-zinc-400
                      transition-colors duration-300
                      hover:text-white
                    "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* More */}
          <div>
            <h3 className="text-lg font-semibold">More</h3>

            <ul className="mt-5 space-y-3">
              {moreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="
                      text-sm text-zinc-400
                      transition-colors duration-300
                      hover:text-white
                    "
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* App + Social */}
          <div className="col-span-2 lg:col-span-1">
            <h3 className="text-lg font-semibold">Download Our App</h3>

            <div className="mt-5 flex gap-4">
              {/* Google Play */}
              <Link
                href="https://play.google.com"
                target="_blank"
                className="
                  flex h-14 w-14 items-center justify-center
                  rounded-full
                  border border-zinc-700
                  bg-zinc-900
                  text-green-500
                  transition-all duration-300
                  hover:scale-105
                  hover:border-white
                "
              >
                <BsGooglePlay size={22} />
              </Link>

              {/* App Store */}
              <Link
                href="https://www.apple.com/app-store/"
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
