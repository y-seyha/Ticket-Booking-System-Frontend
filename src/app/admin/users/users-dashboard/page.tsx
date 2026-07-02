"use client";

import UserManagementView from "@/features/user/admin-dashboard/UserManagementView";

export default function UserDashboard() {
  return (
    <UserManagementView
      roleTarget="USER"
      title="Standard Client Management"
      subtitle="View, monitor, audit profile parameters, toggle active statuses, or elevate operational roles for customer account structures."
    />
  );
}
