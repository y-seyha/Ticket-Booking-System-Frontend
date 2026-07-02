"use client";

import UserManagementView from "@/features/user/admin-dashboard/UserManagementView";

export default function CashierDashboard() {
  return (
    <UserManagementView
      roleTarget="CASHIER"
      title="Box Office Cashier Crew Management"
      subtitle="Monitor your onsite physical point-of-sale employees. Manage account structural access or strip credential clears instantly."
    />
  );
}
