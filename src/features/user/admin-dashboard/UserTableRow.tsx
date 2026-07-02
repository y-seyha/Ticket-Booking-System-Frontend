"use client";

import Image from "next/image";
import {
  Ban,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { UserResponse } from "../user.types";

interface RowProps {
  user: UserResponse;
  actionLoadingId: string | null;
  onBanToggle: (id: string, isSuspended: boolean) => void;
  onEditRoleClick: (user: UserResponse) => void;
  onDeleteClick: (user: UserResponse) => void;
}

export default function UserTableRow({
  user,
  actionLoadingId,
  onBanToggle,
  onEditRoleClick,
  onDeleteClick,
}: RowProps) {
  const isSuspended = user.status === "SUSPENDED";
  const isDeleted = user.status === "DELETED";
  const operationsBlocked = actionLoadingId === user.id || isDeleted;

  const getStatusStyles = (status: typeof user.status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50";
      case "SUSPENDED":
        return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50";
      case "DELETED":
        return "bg-zinc-100 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
      default:
        return "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-900 dark:text-zinc-400 dark:border-zinc-800";
    }
  };

  const getStatusDotColor = (status: typeof user.status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500";
      case "SUSPENDED":
        return "bg-amber-500";
      default:
        return "bg-zinc-400";
    }
  };

  return (
    <tr className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/30 transition-colors group">
      {/* User Information */}
      <td className="p-4 align-middle">
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 shrink-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-semibold text-zinc-700 dark:text-zinc-300 overflow-hidden border border-zinc-200/80 dark:border-zinc-700/80 shadow-sm">
            {user.profile?.avatar?.url ? (
              <Image
                src={user.profile.avatar.url}
                alt="avatar"
                fill
                sizes="40px"
                className="object-cover"
              />
            ) : (
              `${user.profile?.firstName?.[0] || ""}${user.profile?.lastName?.[0] || "U"}`.toUpperCase()
            )}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[140px] sm:max-w-xs">
              {user.profile?.firstName || user.profile?.lastName
                ? `${user.profile.firstName || ""} ${user.profile.lastName || ""}`.trim()
                : "Anonymous User"}
            </div>
            <div className="text-xs text-zinc-400 font-mono tracking-tight truncate max-w-[140px] sm:max-w-xs">
              {user.id}
            </div>
          </div>
        </div>
      </td>

      {/* Contact Information */}
      <td className="p-4 align-middle">
        <div className="text-zinc-900 dark:text-zinc-100 font-medium truncate max-w-[180px] sm:max-w-xs">
          {user.email}
        </div>
        <div className="text-xs text-zinc-400">
          {user.profile?.phone || "No phone added"}
        </div>
      </td>

      {/* Status Badge */}
      <td className="p-4 align-middle">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-xl border transition-all ${getStatusStyles(
            user.status,
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full shadow-sm animate-pulse ${getStatusDotColor(
              user.status,
            )}`}
          />
          <span className="tracking-wide text-[11px] font-bold">
            {user.status}
          </span>
        </span>
      </td>

      {/* Actions */}
      <td className="p-4 text-right align-middle">
        <div className="flex items-center justify-end gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
          {/* Suspension/Activation Toggle Action */}
          <button
            onClick={() => onBanToggle(user.id, isSuspended)}
            disabled={operationsBlocked}
            title={isSuspended ? "Activate Account" : "Suspend Account"}
            className={`p-2 rounded-xl border text-xs font-medium shadow-sm transition-all ${
              isSuspended
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100/80 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/60"
                : "bg-amber-50 text-amber-600 border-amber-200 hover:bg-amber-100/80 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/60"
            } disabled:opacity-40 disabled:pointer-events-none`}
          >
            {isSuspended ? (
              <RefreshCw className="h-4 w-4" />
            ) : (
              <Ban className="h-4 w-4" />
            )}
          </button>

          {/* Role Customization Action */}
          <button
            onClick={() => onEditRoleClick(user)}
            disabled={operationsBlocked}
            title="Edit Allocation Access Role"
            className="p-2 bg-white hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            {user.role === "ADMIN" ? (
              <ShieldCheck className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
            ) : user.role === "CASHIER" ? (
              <ShieldAlert className="h-4 w-4 text-sky-500 dark:text-sky-400" />
            ) : (
              <UserCheck className="h-4 w-4" />
            )}
          </button>

          {/* Account Deletion Purge Action */}
          <button
            onClick={() => onDeleteClick(user)}
            disabled={operationsBlocked}
            title="Purge / Delete User"
            className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-red-600 hover:border-red-200 dark:hover:text-red-400 dark:hover:border-red-950 rounded-xl bg-white dark:bg-zinc-950 shadow-sm transition-all disabled:opacity-40 disabled:pointer-events-none"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
