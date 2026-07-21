"use client";

import { usePageTitle } from "@/hooks/usePageTitle";
import PosTerminal from "@/features/pos/components/PosTerminal";

export default function CashierPosPage() {
  usePageTitle("Cashier");
  return <PosTerminal />;
}
