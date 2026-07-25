"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, Shield } from "lucide-react";
import { rolesApi } from "@/features/roles/roles.api";
import { RoleResponse } from "@/features/roles/roles.types";
import Modal from "@/components/ui/Modal";

export default function RolesDashboard() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<RoleResponse | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<RoleResponse | null>(null);

  const [formId, setFormId] = useState("");
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [permUsers, setPermUsers] = useState(false);
  const [permMovies, setPermMovies] = useState(false);
  const [permBookings, setPermBookings] = useState(false);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rolesApi.getAll();
      setRoles(data);
    } catch {
      /* toast handled by api client */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const openCreate = () => {
    setEditingRole(null);
    setFormId("");
    setFormName("");
    setFormDesc("");
    setPermUsers(false);
    setPermMovies(false);
    setPermBookings(false);
    setFormOpen(true);
  };

  const openEdit = (role: RoleResponse) => {
    setEditingRole(role);
    setFormId(role.id);
    setFormName(role.name);
    setFormDesc(role.description || "");
    setPermUsers(!!role.permissions?.canManageUsers);
    setPermMovies(!!role.permissions?.canManageMovies);
    setPermBookings(!!role.permissions?.canManageBookings);
    setFormOpen(true);
  };

  const handleSave = async () => {
    const data = {
      id: formId,
      name: formName,
      description: formDesc || undefined,
      permissions: { canManageUsers: permUsers, canManageMovies: permMovies, canManageBookings: permBookings },
    };
    try {
      if (editingRole) await rolesApi.update(editingRole.id, data);
      else await rolesApi.create(data);
      setFormOpen(false);
      setEditingRole(null);
      fetchRoles();
    } catch {
      /* toast handled by api client */
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await rolesApi.delete(deleteTarget.id);
      setDeleteTarget(null);
      fetchRoles();
    } catch {
      /* toast handled by api client */
    }
  };

  const RoleForm = () => (
    <Modal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditingRole(null); }} title={editingRole ? "Edit Role" : "Create Role"}>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Role ID</label>
          <input type="text" value={formId} onChange={(e) => setFormId(e.target.value)} disabled={!!editingRole} required
            className="w-full h-10.5 rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50 disabled:opacity-50" placeholder="e.g. MANAGER" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Display Name</label>
          <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} required
            className="w-full h-10.5 rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50" placeholder="e.g. Manager" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">Description</label>
          <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={2}
            className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-2">Permissions</label>
          <div className="space-y-2 p-3 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800">
            {[
              { label: "Manage Users", value: permUsers, set: setPermUsers },
              { label: "Manage Movies", value: permMovies, set: setPermMovies },
              { label: "Manage Bookings", value: permBookings, set: setPermBookings },
            ].map((p) => (
              <label key={p.label} className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={p.value} onChange={(e) => p.set(e.target.checked)}
                  className="w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-50" />
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{p.label}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button onClick={() => { setFormOpen(false); setEditingRole(null); }}
            className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Cancel</button>
          <button onClick={handleSave}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors">{editingRole ? "Save" : "Create"}</button>
        </div>
      </div>
    </Modal>
  );

  return (
    <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full border-b border-zinc-100 dark:border-zinc-800 pb-5">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Role Management</h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Create and manage user roles with granular permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchRoles} className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer">
            <RefreshCw className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
          </button>
          <button onClick={openCreate} className="inline-flex items-center justify-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white dark:bg-zinc-50 dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors cursor-pointer">
            <Plus className="w-4 h-4" />
            New Role
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />)}
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-zinc-50/70 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Role ID</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">Users</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">System</th>
                <th className="px-6 py-3.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-900/40 transition-colors">
                  <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-50">{role.id}</td>
                  <td className="px-6 py-4 text-zinc-700 dark:text-zinc-300">{role.name}</td>
                  <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400 max-w-[200px] truncate">{role.description || "-"}</td>
                  <td className="px-6 py-4 text-center text-zinc-700 dark:text-zinc-300">{role.userCount}</td>
                  <td className="px-6 py-4 text-center">
                    {role.isSystem ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400">
                        <Shield className="w-3 h-3" />
                        System
                      </span>
                    ) : <span className="text-zinc-400">-</span>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => openEdit(role)}
                        className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors cursor-pointer"
                        title="Edit">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {!role.isSystem && (
                        <button onClick={() => setDeleteTarget(role)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete">
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {roles.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-zinc-400">No roles found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <RoleForm />

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-zinc-950/40 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative w-full max-w-md transform rounded-2xl bg-white p-6 shadow-2xl dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/80 z-10 animate-in fade-in-50 zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm">
              <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
              <p>Delete <strong>{deleteTarget.name}</strong> ({deleteTarget.id})? This cannot be undone.</p>
            </div>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer">Cancel</button>
              <button onClick={handleDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 active:bg-red-800 shadow-sm transition-colors cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
