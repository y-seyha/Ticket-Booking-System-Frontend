"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { RoleResponse } from "../roles.types";

interface RoleFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { id: string; name: string; description?: string; permissions: Record<string, boolean> }) => void;
  role?: RoleResponse | null;
}

export function RoleFormModal({ isOpen, onClose, onSave, role }: RoleFormModalProps) {
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [canManageUsers, setCanManageUsers] = useState(false);
  const [canManageMovies, setCanManageMovies] = useState(false);
  const [canManageBookings, setCanManageBookings] = useState(false);

  useEffect(() => {
    if (role) {
      setId(role.id);
      setName(role.name);
      setDescription(role.description || "");
      setCanManageUsers(!!role.permissions?.canManageUsers);
      setCanManageMovies(!!role.permissions?.canManageMovies);
      setCanManageBookings(!!role.permissions?.canManageBookings);
    } else {
      setId("");
      setName("");
      setDescription("");
      setCanManageUsers(false);
      setCanManageMovies(false);
      setCanManageBookings(false);
    }
  }, [role, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id,
      name,
      description: description || undefined,
      permissions: { canManageUsers, canManageMovies, canManageBookings },
    });
  };

  const PermissionToggle = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
    <label className="flex items-center gap-3 cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600" />
      <span className="text-sm font-medium">{label}</span>
    </label>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">{role ? "Edit Role" : "Create Role"}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Role ID</label>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              disabled={!!role}
              required
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 disabled:opacity-50"
              placeholder="e.g., MANAGER"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" placeholder="e.g., Manager" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800" placeholder="Optional description" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Permissions</label>
            <div className="space-y-2 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50">
              <PermissionToggle label="Manage Users" checked={canManageUsers} onChange={setCanManageUsers} />
              <PermissionToggle label="Manage Movies" checked={canManageMovies} onChange={setCanManageMovies} />
              <PermissionToggle label="Manage Bookings" checked={canManageBookings} onChange={setCanManageBookings} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800">Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700">{role ? "Save Changes" : "Create Role"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}