import ShowtimeDashboard from "@/features/showitmes/components/admin-dashboard/ShowtimeDashboard";

export const metadata = {
  title: "Showtimes Configuration Control Hub | Admin Dashboard",
  description:
    "Configure theater screen allocations, manage dynamic schedules, and calibrate base cost indexes.",
};

export default function AdminShowtimesPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <ShowtimeDashboard />
    </div>
  );
}
