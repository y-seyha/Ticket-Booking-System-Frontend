import ScreenDashboardView from "@/features/screen/components/admin-dashboard/ScreenDashboardView";

export const metadata = {
  title: "Screen Management Dashboard",
  description: "Configure theater screen blueprints, layouts, and seat maps.",
};

export default function ScreensPage() {
  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <ScreenDashboardView />
    </div>
  );
}
