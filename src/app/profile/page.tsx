"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Shield,
  Phone,
  Calendar,
  ChevronRight,
  Settings,
  X,
  UploadCloud,
  EyeOff,
  Eye,
} from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

interface UserAvatar {
  id: string;
  url: string;
  description: string;
}

interface UserProfile {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: string;
  createdAt: string;
  avatar: UserAvatar;
}

const MOCK_PROFILE: UserProfile = {
  id: "f0235c55-a912-43f3-bb37-da9d58bec665",
  accountId: "6c8bc674-1084-4307-b906-09848236b0fc",
  firstName: "The",
  lastName: "Cat",
  phone: "023 324 352",
  status: "ACTIVE",
  createdAt: "2026-06-25T09:43:14.522Z",
  avatar: {
    id: "88c2469f-9a8f-4d0c-8ba0-fb6e5112cc65",
    url: "https://res.cloudinary.com/dzgku7m5j/image/upload/v1782380599/ticket_booking_system/avatars/tzhejhbg2d9tg5kamz3k.jpg",
    description: "User Avatar",
  },
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(MOCK_PROFILE);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [phone, setPhone] = useState(profile.phone || "");
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar.url);
  const [isDragging, setIsDragging] = useState(false);
  const [showId, setShowId] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Processes local selected files and establishes temporary object image pathing
  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const temporaryPreviewUrl = URL.createObjectURL(file);
      setAvatarUrl(temporaryPreviewUrl);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setProfile((prev) => ({
      ...prev,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone.trim() || null,
      avatar: {
        ...prev.avatar,
        url: avatarUrl.trim() || prev.avatar.url,
      },
    }));
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setFirstName(profile.firstName);
    setLastName(profile.lastName);
    setPhone(profile.phone || "");
    setAvatarUrl(profile.avatar.url);
    setIsModalOpen(false);
  };

  const displayName =
    profile.firstName || profile.lastName
      ? `${profile.firstName} ${profile.lastName}`.trim()
      : "Legend Member";

  const formattedDate = new Date(profile.createdAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div className="min-h-screen bg-black flex flex-col text-white select-none relative overflow-x-hidden antialiased">
      {/* Background Ambient Aura Glow */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0 mix-blend-screen select-none">
        <div className="w-[800px] md:w-[1300px] h-[600px] md:h-[700px] bg-red-950/15 rounded-full blur-[160px]" />
      </div>

      <Navbar />

      {/* Main Container Layout - Perfectly grid-locked with the Navbar boundaries */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-23 lg:px-25 pt-36 md:pt-48 pb-24 relative z-10 flex flex-col items-start">
        {/* Inner Content Wrapper - Stretches edge-to-edge to perfectly mimic the Navbar's horizontal span */}
        <div className="w-full text-left space-y-6 transition-all duration-500 ease-out animate-in fade-in slide-in-from-bottom-6">
          {/* Breadcrumb Navigation: Home / Profile */}
          <nav className="flex items-center space-x-2 text-zinc-500 text-xs font-semibold uppercase tracking-widest px-1">
            <Link
              href="/"
              className="hover:text-white transition-colors duration-200"
            >
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
            <span className="text-zinc-200">Profile</span>
          </nav>

          {/* Core Profile Card Dashboard View */}
          <div className="w-full bg-zinc-950/80 border border-white/15 rounded-2xl p-6 sm:p-8 md:p-10 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] relative overflow-hidden group">
            {/* Ambient Accent Edge Strip */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />

            {/* Profile Overview Header Row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 pb-8 border-b border-white/10">
              {/* Interactive Avatar Box with Multi-layered Glowing Rings */}
              <div
                onClick={() => setIsModalOpen(true)}
                className="relative w-24 h-24 rounded-full border-2 border-white/20 p-1 bg-zinc-900 shadow-2xl group/avatar transition-all duration-500 hover:border-red-500/50 cursor-pointer active:scale-95 flex-shrink-0"
              >
                <div className="relative w-full h-full rounded-full overflow-hidden">
                  <Image
                    src={profile.avatar.url}
                    alt={profile.avatar.description}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover/avatar:scale-110"
                    unoptimized
                  />
                  {/* Hover Overlay Action Shield */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300">
                    <Settings className="w-4 h-4 text-white animate-spin-slow mb-0.5" />
                    <span className="text-[9px] font-bold tracking-wider text-zinc-300 uppercase">
                      Change
                    </span>
                  </div>
                </div>
              </div>

              {/* Identity & Metadata Elements */}
              <div className="flex-1 space-y-2 pt-1 min-w-0 w-full">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                  <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white font-sans truncate">
                    {displayName}
                  </h1>
                  <span className="inline-flex items-center self-center sm:self-auto space-x-1 px-3 py-0.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold tracking-widest uppercase whitespace-nowrap">
                    <Shield className="w-3 h-3 mr-1" />
                    {profile.status}
                  </span>
                </div>

                {/* Interactive ID Container with Layout Transition Anchoring */}
                <div className="flex items-center justify-center sm:justify-start space-x-2">
                  <p className="text-xs font-mono text-zinc-400 bg-white/5 border border-white/5 rounded-md px-2.5 py-1 inline-flex items-center gap-2 max-w-full overflow-hidden">
                    <span className="whitespace-nowrap">
                      ID:{" "}
                      <span
                        key={showId ? "visible" : "hidden"}
                        className="text-zinc-200 select-all font-mono transition-opacity duration-300 ease-in-out animate-in fade-in"
                      >
                        {showId
                          ? profile.accountId
                          : "••••••••-••••-••••-••••-••••••••••••"}
                      </span>
                    </span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowId(!showId)}
                    className="p-1.5 rounded-md border border-white/5 text-zinc-500 hover:text-zinc-200 hover:bg-white/5 transition-all duration-300 ease-in-out cursor-pointer focus:outline-none flex-shrink-0"
                    title={showId ? "Hide Account ID" : "Show Account ID"}
                  >
                    <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                      {showId ? (
                        <EyeOff className="w-3.5 h-3.5 absolute transition-all duration-300 ease-out transform scale-100 rotate-0 opacity-100" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 absolute transition-all duration-300 ease-out transform scale-100 rotate-0 opacity-100" />
                      )}
                    </div>
                  </button>
                </div>

                <div className="flex items-center justify-center sm:justify-start text-xs text-zinc-400 space-x-2 pt-1 font-medium">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span>Joined {formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Static Information Display Grid */}
            <div className="mt-8 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Static First Name */}
                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl transition-all duration-300 hover:border-white/10 text-left">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                    <User className="w-3.5 h-3.5" /> First Name
                  </span>
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {profile.firstName || (
                      <span className="text-zinc-600 italic font-normal">
                        Not configured
                      </span>
                    )}
                  </p>
                </div>

                {/* Static Last Name */}
                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl transition-all duration-300 hover:border-white/10 text-left">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                    <User className="w-3.5 h-3.5" /> Last Name
                  </span>
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {profile.lastName || (
                      <span className="text-zinc-600 italic font-normal">
                        Not configured
                      </span>
                    )}
                  </p>
                </div>

                {/* Static Phone Number */}
                <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-xl sm:col-span-2 transition-all duration-300 hover:border-white/10 text-left">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2 mb-1.5">
                    <Phone className="w-3.5 h-3.5" /> Phone Number
                  </span>
                  <p className="text-sm font-medium text-zinc-200 truncate">
                    {profile.phone || (
                      <span className="text-zinc-600 italic font-normal">
                        No telephone linked
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Primary Launch Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-xs font-bold text-black hover:bg-zinc-200 active:scale-95 transition-all duration-300 shadow-xl cursor-pointer"
                >
                  <Settings className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modern High-Fidelity Modal Layer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
          {/* Blur Backdrop Overlay */}
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-300 animate-in fade-in"
            onClick={handleCancel}
          />

          {/* Modal Content Box Container */}
          <div className="bg-zinc-950 border border-white/15 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative my-auto z-10 animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent" />

            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-zinc-900/40">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">
                Update Account Profile
              </h2>
              <button
                type="button"
                onClick={handleCancel}
                className="p-1.5 rounded-lg border border-white/5 text-zinc-400 hover:text-white hover:bg-white/5 transition duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Input Workspaces */}
            <form onSubmit={handleSave}>
              <div className="p-6 space-y-5">
                {/* Drag and Drop Image Selection Container */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Profile Avatar
                  </label>

                  {/* Native Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 group/upload ${
                      isDragging
                        ? "border-red-500 bg-red-500/5"
                        : "border-white/10 bg-zinc-900/30 hover:border-white/25 hover:bg-zinc-900/50"
                    }`}
                  >
                    <div className="relative w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden bg-zinc-950 mb-3 shadow-md transition-transform duration-300 group-hover/upload:scale-105">
                      <Image
                        src={avatarUrl}
                        alt="Avatar upload preview"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                    <UploadCloud
                      className={`w-6 h-6 mb-1.5 transition-colors duration-200 ${isDragging ? "text-red-400" : "text-zinc-500 group-hover/upload:text-zinc-300"}`}
                    />
                    <p className="text-xs font-semibold text-zinc-200">
                      Click to browse or drag & drop photo
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium mt-0.5">
                      PNG, JPG, or WEBP formats accepted
                    </p>
                  </div>
                </div>

                {/* First Name Input Area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" /> First Name
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Enter first name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 transition duration-200"
                  />
                </div>

                {/* Last Name Input Area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-zinc-500" /> Last Name
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Enter last name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 transition duration-200"
                  />
                </div>

                {/* Phone Number Input Area */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-zinc-500" /> Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +855 12 345 678"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/5 transition duration-200"
                  />
                </div>
              </div>

              {/* Form Bottom Controls Bar */}
              <div className="px-6 py-4 bg-zinc-900/40 border-t border-white/10 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-white text-xs font-bold text-black hover:bg-zinc-200 active:scale-95 transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
