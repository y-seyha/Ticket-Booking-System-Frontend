import ShowtimeDashboard from "@/features/showitmes/components/admin-dashboard/ShowtimeDashboard";

export const metadata = {
  title: "Showtimes Configuration Control Hub | Admin Dashboard",
  description:
    "Configure theater screen allocations, manage dynamic schedules, and calibrate base cost indexes.",
};

export default function AdminShowtimesPage() {
  return (
    <main className="w-full min-h-screen bg-zinc-50/50 dark:bg-zinc-950">
      <ShowtimeDashboard />
    </main>
  );
}
