"use client";

import UserManagementView from "@/features/user/admin-dashboard/UserManagementView";

export default function AdminDashboard() {
  return (
    <UserManagementView
      roleTarget="ADMIN"
      title="System Operations Administrators"
      subtitle="High-level structural platform users list. Audit accounts holding full operational security access across the architecture ecosystems."
    />
  );
}
