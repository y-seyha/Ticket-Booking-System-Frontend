"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Search, Loader2, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

import { useDebounce } from "@/hooks/useDebounce";
import { UserResponse } from "../user.types";
import { userApi } from "../user.api";
import EditRoleModal from "./EditRoleModal";
import DeleteUserModal from "./DeleteUserModal";
import UserTableRow from "./UserTableRow";
import BanUserModal from "./BanUserModal";

interface ManagementProps {
  roleTarget?: "USER" | "ADMIN" | "CASHIER";
  title: string;
  subtitle: string;
}

export default function UserManagementView({
  roleTarget,
  title,
  subtitle,
}: ManagementProps) {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filter States
  const [selectedRole, setSelectedRole] = useState<string>(roleTarget || "ALL");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");

  // Modal States
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userEmail: string | null;
  }>({ isOpen: false, userId: null, userEmail: null });

  const [banModal, setBanModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    userEmail: string | null;
    isSuspended: boolean;
  }>({ isOpen: false, userId: null, userEmail: null, isSuspended: false });

  const [editRoleModal, setEditRoleModal] = useState<{
    isOpen: boolean;
    userId: string | null;
    currentRole: "USER" | "ADMIN" | "CASHIER" | null;
  }>({ isOpen: false, userId: null, currentRole: null });

  const debouncedSearch = useDebounce(search, 400);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await userApi.getAllUsers(page, limit);
      const usersData = Array.isArray(response) ? response : [];
      setUsers(usersData);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load user records");
    } finally {
      setIsLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      fetchUsers();
    });
    return () => cancelAnimationFrame(handle);
  }, [fetchUsers]);

  // Combined Search & Multi-criteria Filtering
  const processedUsers = useMemo(() => {
    if (!Array.isArray(users)) return [];

    return users.filter((u) => {
      if (!u) return false;

      //  Filter by Role
      if (selectedRole !== "ALL" && u.role !== selectedRole) {
        return false;
      }

      // Filter by Account Status
      if (selectedStatus !== "ALL" && u.status !== selectedStatus) {
        return false;
      }

      // Filter by Name / Email text search
      if (!debouncedSearch) return true;

      const normalize = (str: string | undefined) => str?.toLowerCase() || "";
      const searchStr = debouncedSearch.toLowerCase();

      return (
        normalize(u.email).includes(searchStr) ||
        normalize(u.profile?.firstName).includes(searchStr) ||
        normalize(u.profile?.lastName).includes(searchStr)
      );
    });
  }, [users, selectedRole, selectedStatus, debouncedSearch]);

  const maxPage = Math.ceil(processedUsers.length / limit) || 1;
  const currentPage = page > maxPage ? maxPage : page;

  const handleBanToggle = async (id: string, isSuspended: boolean) => {
    setActionLoadingId(id);
    const promise = isSuspended ? userApi.unbanUser(id) : userApi.banUser(id);

    toast.promise(promise, {
      loading: isSuspended ? "Unbanning user..." : "Banning user...",
      success: () => {
        fetchUsers();
        return isSuspended
          ? "User unbanned successfully"
          : "User banned successfully";
      },
      error: "Failed to update user status",
      finally: () => setActionLoadingId(null),
    });
  };

  const handleChangeRole = async (
    id: string,
    targetRole: "USER" | "ADMIN" | "CASHIER",
  ) => {
    setActionLoadingId(id);
    try {
      await userApi.changeUserRole(id, targetRole);
      toast.success(`Role updated to ${targetRole}`);
      setEditRoleModal({ isOpen: false, userId: null, currentRole: null });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to change user role");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (id: string) => {
    setActionLoadingId(id);
    try {
      await userApi.deleteUser(id);
      toast.success("Account deleted successfully");
      setDeleteModal({ isOpen: false, userId: null, userEmail: null });
      fetchUsers();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete user");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 max-w-7xl mx-auto min-h-screen">
      <div className="border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {title}
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          {subtitle}
        </p>
      </div>

      {/* Filter and Search Action Control Panel */}
      <div className="bg-white dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            placeholder="Search name or email..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white dark:focus:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-all"
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-start md:justify-end">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider select-none mr-1">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filters</span>
          </div>

          {/* Role Filter Selector */}
          <select
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="ALL">All Roles</option>
            <option value="USER">User</option>
            <option value="CASHIER">Cashier</option>
            <option value="ADMIN">Admin</option>
          </select>

          {/* Status Filter Selector */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-900"
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="DELETED">Deleted</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50/70 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                <th className="p-4">User</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-zinc-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-zinc-400" />
                    Loading updates...
                  </td>
                </tr>
              ) : processedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-8 text-center text-zinc-500 dark:text-zinc-400"
                  >
                    No users found matching this criteria.
                  </td>
                </tr>
              ) : (
                processedUsers
                  .slice((currentPage - 1) * limit, currentPage * limit)
                  .map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      actionLoadingId={actionLoadingId}
                      onBanToggle={(id, isSuspended) =>
                        setBanModal({
                          isOpen: true,
                          userId: id,
                          userEmail: user.email,
                          isSuspended,
                        })
                      }
                      onEditRoleClick={(clickedUser) =>
                        setEditRoleModal({
                          isOpen: true,
                          userId: clickedUser.id,
                          currentRole: clickedUser.role as
                            | "USER"
                            | "ADMIN"
                            | "CASHIER",
                        })
                      }
                      onDeleteClick={(clickedUser) =>
                        setDeleteModal({
                          isOpen: true,
                          userId: clickedUser.id,
                          userEmail: clickedUser.email,
                        })
                      }
                    />
                  ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
            Page {currentPage} of {maxPage}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1 || isLoading}
              className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-50 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setPage((p) => (p * limit < processedUsers.length ? p + 1 : p))
              }
              disabled={
                currentPage * limit >= processedUsers.length || isLoading
              }
              className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-950 text-xs font-semibold text-zinc-700 dark:text-zinc-300 disabled:opacity-50 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-900"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <BanUserModal
        isOpen={banModal.isOpen}
        userEmail={banModal.userEmail}
        isSuspended={banModal.isSuspended}
        onClose={() =>
          setBanModal({
            isOpen: false,
            userId: null,
            userEmail: null,
            isSuspended: false,
          })
        }
        onConfirm={() => {
          handleBanToggle(banModal.userId!, banModal.isSuspended);
          setBanModal({
            isOpen: false,
            userId: null,
            userEmail: null,
            isSuspended: false,
          });
        }}
      />

      <EditRoleModal
        isOpen={editRoleModal.isOpen}
        // Force evaluation if component is missing CASHIER definition internally
        currentRole={editRoleModal.currentRole as "USER" | "ADMIN"}
        onClose={() =>
          setEditRoleModal({ isOpen: false, userId: null, currentRole: null })
        }
        onConfirm={(targetRole) =>
          handleChangeRole(
            editRoleModal.userId!,
            targetRole as "USER" | "ADMIN" | "CASHIER",
          )
        }
      />

      <DeleteUserModal
        isOpen={deleteModal.isOpen}
        userEmail={deleteModal.userEmail}
        onClose={() =>
          setDeleteModal({ isOpen: false, userId: null, userEmail: null })
        }
        onConfirm={() => handleDeleteUser(deleteModal.userId!)}
      />
    </div>
  );
}
