"use client";

import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/common/Navbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const isLogin = pathname === "/auth/login";

  const breadcrumbMap: Record<string, string[]> = {
    "/auth/login": ["Home", "Login"],
    "/auth/register": ["Home", "Register"],
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-[#0d1117] text-white p-4 overflow-hidden">
      {/* Navbar */}
      <Navbar
        showSearch={false}
        showTicket={false}
        showJoinNow={false}
        showNotification={false}
        showBottomNav={false}
        showCinemaDropdown={false}
        showMobileBottomNav={false}
      />

      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/login-background.jpeg"
          alt="background"
          className="absolute w-[120%] h-[120%] top-[-10%] left-[-10%] object-cover scale-110 blur-2xl opacity-60"
        />
        <div className="absolute inset-0 bg-[#0d1117]/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col lg:mt-10 md:mt-10">
        {/* Breadcrumb */}
        <div className="mb-4 self-start text-sm text-zinc-400">
          <Breadcrumb>
            <BreadcrumbList className="text-lg gap-2">
              {breadcrumbMap[pathname]?.map((item, index, arr) => {
                const isLast = index === arr.length - 1;

                return (
                  <React.Fragment key={item}>
                    <BreadcrumbItem>
                      {isLast ? (
                        <BreadcrumbPage className="text-white">
                          {item}
                        </BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink
                          href="/"
                          className="text-zinc-400 hover:text-white transition-colors"
                        >
                          {item}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>

                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Card */}
        <div className="w-full grid md:grid-cols-2 bg-[#161b22]/80 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          {/* LEFT IMAGE */}
          <div className="relative hidden md:block min-h-[650px]">
            <img
              src="/login-background.jpeg"
              className="object-cover w-full h-full"
              alt="Cinema"
            />
          </div>

          {/* RIGHT SIDE */}
          <div className="p-8 md:p-12 flex flex-col min-h-[650px]">
            {/* ROUTE TABS */}
            <div className="flex gap-10 mb-10 text-3xl font-semibold">
              <button
                onClick={() => router.push("/auth/login")}
                className={`relative pb-2 transition-colors duration-200 ${
                  isLogin ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Log In
                <span
                  className={`absolute left-0 -bottom-1 h-[3px] w-full bg-red-500 rounded-full transition-transform origin-left duration-300 ${
                    isLogin ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>

              <button
                onClick={() => router.push("/auth/register")}
                className={`relative pb-2 transition-colors duration-200 ${
                  !isLogin ? "text-white" : "text-gray-500 hover:text-gray-300"
                }`}
              >
                Sign Up
                <span
                  className={`absolute left-0 -bottom-1 h-[3px] w-full bg-red-500 rounded-full transition-transform origin-left duration-300 ${
                    !isLogin ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </button>
            </div>

            {/* PAGE SLOT (SMOOTH FADE) */}
            <div key={pathname} className="w-full min-h-[420px] animate-fadeIn">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
