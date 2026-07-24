import SeatPricingDashboard from "@/features/seat-pricing/admin-dashboard/SeatPricingDashboard";

export const metadata = {
  title: "Seat Pricing Management Architecture",
  description:
    "Configure systemic premium tiered baseline overhead surcharges.",
};

export default function Page() {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <SeatPricingDashboard />
    </div>
  );
}
