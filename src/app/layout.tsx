import type { Metadata } from "next";
import { Geist, Kantumruy_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/themes/theme-provider";
import { Toaster } from "sonner";
import { AuthInitProvider } from "@/features/auth/providers/authInit.provider";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { Suspense } from "react";

const khmerFont = Kantumruy_Pro({
  subsets: ["khmer"],
  weight: ["400", "500", "700"],
  variable: "--font-khmer",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "YS Cinema",
    template: "%s | YS Cinema",
  },
  description:
    "YS Cinema — Book movie tickets online. Browse now-showing and coming-soon movies, choose your seats, and enjoy the best cinema experience.",
  keywords: [
    "cinema",
    "movie tickets",
    "YS Cinema",
    "film booking",
    "now showing",
    "coming soon",
  ],
  openGraph: {
    title: "YS Cinema",
    description:
      "Book movie tickets online. Browse now-showing and coming-soon movies, choose your seats, and enjoy the best cinema experience.",
    type: "website",
    siteName: "YS Cinema",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        khmerFont.variable,
        "font-sans",
      )}
    >
      <body className="min-h-full flex flex-col bg-gray-500">
        <Suspense fallback={null}>
          <GoogleAnalytics />
        </Suspense>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthInitProvider>{children}</AuthInitProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
