import Link from "next/link";
import { LogOut, ShoppingCart, Scan } from "lucide-react";

export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-500/30 font-sans antialiased">
      {/* Minimal top bar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/cashier" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-sm uppercase tracking-wider text-white hidden sm:block">
              CineBook <span className="text-red-500">POS</span>
            </span>
          </a>

          <nav className="flex items-center gap-4">
            <a
              href="/cashier"
              className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Terminal
            </a>
            <Link
              href="/cashier/orders"
              className="text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              Orders
            </Link>
            <Link
              href="/cashier/validate"
              className="flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white transition-colors uppercase tracking-wider"
            >
              <Scan className="w-3.5 h-3.5" />
              Validate
            </Link>
            <form action="/auth/login" method="GET">
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs font-bold text-zinc-600 hover:text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>
    </div>
  );
}
