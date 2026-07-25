import SeatPricingDashboard from "@/features/seat-pricing/admin-dashboard/SeatPricingDashboard";

export const metadata = {
  title: "Seat Pricing Management Architecture",
  description:
    "Configure systemic premium tiered baseline overhead surcharges.",
};

export default function Page() {
  return (
    <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto min-h-screen">
      <SeatPricingDashboard />
    </div>
  );
}
