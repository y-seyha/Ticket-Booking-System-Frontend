import Sidebar from "@/components/dashboard/sidebar/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen w-full bg-zinc-50 dark:bg-zinc-950">
      <Sidebar />
      <main className="flex-1 min-w-0 w-full">
        {children}
      </main>
    </div>
  );
}
