import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-zinc-50 dark:bg-zinc-900/40">
      <Sidebar />
      <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 w-full">
        {children}
      </main>
    </div>
  );
}
