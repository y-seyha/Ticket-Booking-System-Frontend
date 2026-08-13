"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  User,
  Phone,
  Shield,
  Calendar,
  X,
  EyeOff,
  Eye,
  Key,
  LogOut,
  ChevronDown,
  ChevronUp,
  Pencil,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/auth.hook";
import { userApi } from "@/features/user/user.api";
import type { UpdateProfileDto } from "@/features/user/user.types";
import { ImageUploader } from "@/components/common/ImageUploader";

export default function AdminProfilePage() {
  const { logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/images/avatars/default-avatar.jpg");
  const [showId, setShowId] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await userApi.getMyProfile();
        setProfile(user);
        setFirstName(user.profile?.firstName ?? "");
        setLastName(user.profile?.lastName ?? "");
        setPhone(user.profile?.phone ?? "");
        setAvatarUrl(user.profile?.avatar?.url ?? "/images/avatars/default-avatar.jpg");
      } catch {
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleAvatarChange = (file: File | null) => {
    setSelectedFile(file);
    if (file) {
      setAvatarUrl(URL.createObjectURL(file));
    }
  };

  const handleAvatarRemove = () => {
    setSelectedFile(null);
    setAvatarUrl(
      profile?.profile?.avatar?.url ?? "/images/avatars/default-avatar.jpg",
    );
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    const dto: UpdateProfileDto = {};
    if (firstName.trim()) dto.firstName = firstName.trim();
    if (lastName.trim()) dto.lastName = lastName.trim();
    if (phone.trim()) dto.phone = phone.trim();

    toast.promise(userApi.updateMyProfile(dto, selectedFile || undefined), {
      loading: "Updating profile...",
      success: () => {
        setSelectedFile(null);
        setIsModalOpen(false);
        setIsUpdating(false);
        return "Profile updated successfully";
      },
      error: (err) => {
        console.error(err);
        setIsUpdating(false);
        return "Failed to save profile changes";
      },
    });
  };

  const handleCancel = () => {
    if (profile) {
      setFirstName(profile.profile?.firstName ?? "");
      setLastName(profile.profile?.lastName ?? "");
      setPhone(profile.profile?.phone ?? "");
      setAvatarUrl(profile.profile?.avatar?.url ?? "/images/avatars/default-avatar.jpg");
    }
    setSelectedFile(null);
    setIsModalOpen(false);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    await logout();
    setIsLoggingOut(false);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    setChangingPassword(true);
    toast.promise(userApi.changePassword(currentPassword, newPassword), {
      loading: "Changing password...",
      success: () => {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPassword(false);
        setChangingPassword(false);
        return "Password changed successfully";
      },
      error: () => {
        setChangingPassword(false);
        return "Failed to change password. Check your current password.";
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading profile...
        </div>
      </div>
    );
  }

  const displayName = firstName || lastName ? `${firstName} ${lastName}`.trim() : "User";
  const createdAt = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "";

  return (
    <div className="space-y-6 px-6 py-8 sm:px-8 sm:py-10 max-w-7xl mx-auto min-h-screen">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
          <p className="text-sm text-zinc-500 mt-1">Manage your account details and security</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all cursor-pointer"
          >
            <Pencil className="w-4 h-4" />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-950/30 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {isLoggingOut ? "Signing out..." : "Log Out"}
          </button>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        {/* Avatar + Name */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="relative w-24 h-24 rounded-full border-2 border-zinc-200 dark:border-zinc-700 p-1 flex-shrink-0">
            <div className="relative w-full h-full rounded-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
            </div>
          </div>
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <h2 className="text-xl font-bold tracking-tight truncate">{displayName}</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[11px] font-semibold tracking-wide uppercase">
                <Shield className="w-3 h-3" />
                {profile?.role || "USER"}
              </span>
            </div>
            <p className="text-sm text-zinc-500 mt-0.5">{profile?.email}</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <p className="text-xs font-mono text-zinc-400 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md px-2.5 py-1 inline-flex items-center gap-2">
                ID:{" "}
                <span className="text-zinc-600 dark:text-zinc-300">
                  {showId ? profile?.id : "••••••••-••••-••••-••••-••••••••••••"}
                </span>
              </p>
              <button
                onClick={() => setShowId(!showId)}
                className="p-1 rounded-md border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition cursor-pointer"
              >
                {showId ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-1.5 text-xs text-zinc-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined {createdAt}</span>
            </div>
          </div>
        </div>

        {/* Detail Fields */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> First Name
              </label>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {firstName || <span className="text-zinc-400 italic">Not configured</span>}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Last Name
              </label>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {lastName || <span className="text-zinc-400 italic">Not configured</span>}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone
              </label>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                {phone || <span className="text-zinc-400 italic">No phone linked</span>}
              </p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5" /> Password
              </label>
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">••••••••</p>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
        <button
          onClick={() => setShowPassword(!showPassword)}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer"
        >
          <span className="text-sm font-semibold flex items-center gap-2">
            <Key className="w-4 h-4 text-zinc-400" />
            Change Password
          </span>
          {showPassword ? (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          )}
        </button>
        {showPassword && (
          <form onSubmit={handleChangePassword} className="px-6 pb-6 space-y-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
                className="w-full h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                placeholder="Min 8 characters"
                className="w-full h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block mb-1.5">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter new password"
                className="w-full h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition placeholder:text-zinc-400"
              />
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition-all disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:text-zinc-500 disabled:pointer-events-none cursor-pointer"
              >
                {changingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleCancel} />
          <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 w-full max-w-lg rounded-2xl overflow-hidden shadow-xl relative z-10">
            <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Update Profile</h2>
              <button
                onClick={handleCancel}
                disabled={isUpdating}
                className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-5">
                {/* Avatar Upload */}
                <div className="space-y-2">
                  <ImageUploader
                    variant="avatar"
                    value={avatarUrl}
                    onChange={handleAvatarChange}
                    onRemove={handleAvatarRemove}
                    disabled={isUpdating}
                    label="Profile Avatar"
                    hint="PNG, JPG, or WEBP"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={isUpdating}
                    placeholder="First name"
                    className="w-full h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition placeholder:text-zinc-400 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5" /> Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={isUpdating}
                    placeholder="Last name"
                    className="w-full h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition placeholder:text-zinc-400 disabled:opacity-50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isUpdating}
                    placeholder="+855 12 345 678"
                    className="w-full h-10.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition placeholder:text-zinc-400 disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="px-6 py-4 bg-zinc-50 dark:bg-zinc-900/50 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={isUpdating}
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 active:scale-95 transition disabled:bg-zinc-300 dark:disabled:bg-zinc-700 disabled:text-zinc-500 disabled:pointer-events-none cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
