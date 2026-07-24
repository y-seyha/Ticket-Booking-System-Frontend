"use client";

import { RoleResponse } from "../roles.types";
import { Shield, Users, Pencil, Trash2 } from "lucide-react";

interface RoleListTableProps {
  roles: RoleResponse[];
  onEdit: (role: RoleResponse) => void;
  onDelete: (role: RoleResponse) => void;
}

export function RoleListTable({ roles, onEdit, onDelete }: RoleListTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-zinc-100 dark:bg-zinc-800">
          <tr>
            <th className="px-6 py-3">Role ID</th>
            <th className="px-6 py-3">Name</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3 text-center">Users</th>
            <th className="px-6 py-3 text-center">System</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-6 py-4 font-medium">{role.id}</td>
              <td className="px-6 py-4">{role.name}</td>
              <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 max-w-xs truncate">{role.description || "-"}</td>
              <td className="px-6 py-4 text-center">
                <span className="inline-flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {role.userCount}
                </span>
              </td>
              <td className="px-6 py-4 text-center">
                {role.isSystem ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                    <Shield className="w-3 h-3" />
                    System
                  </span>
                ) : (
                  <span className="text-zinc-400">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => onEdit(role)}
                    className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400"
                    title="Edit role"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {!role.isSystem && role.userCount === 0 && (
                    <button
                      onClick={() => onDelete(role)}
                      className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400"
                      title="Delete role"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td colSpan={6} className="px-6 py-12 text-center text-zinc-400">
                No roles found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}