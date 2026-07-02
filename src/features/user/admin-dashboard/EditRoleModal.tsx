"use client";

import { useState, ChangeEvent } from "react";
import { X, Shield } from "lucide-react";

type UserRole = "USER" | "ADMIN" | "CASHIER";

interface EditRoleModalProps {
  isOpen: boolean;
  currentRole: UserRole | null;
  onClose: () => void;
  onConfirm: (role: UserRole) => void;
}

export default function EditRoleModal({
  isOpen,
  currentRole,
  onClose,
  onConfirm,
}: EditRoleModalProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole>("USER");
  const [prevRole, setPrevRole] = useState<UserRole | null>(null);

  if (currentRole && currentRole !== prevRole) {
    setPrevRole(currentRole);
    setSelectedRole(currentRole);
  }

  if (!isOpen) return null;

  const handleRoleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "USER" || value === "ADMIN" || value === "CASHIER") {
      setSelectedRole(value);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-900 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-zinc-100 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 rounded-lg">
              <Shield className="h-4 w-4" />
            </div>
            <h3 className="text-md font-semibold text-zinc-900 dark:text-zinc-50">
              Change Account Role
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-400 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-400">
              Select target access allocation
            </label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="w-full px-3 py-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-300 transition-all"
            >
              <option value="USER">Standard User Account</option>
              <option value="CASHIER">Point of Sale (Cashier)</option>
              <option value="ADMIN">System Administrator</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-900 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selectedRole)}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 rounded-xl text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
