"use client";

import { useState, useEffect } from "react";
import { cinemasApi, CreateTheaterPayload } from "../../cinemas.api";
import { Cinema } from "../../cinemas.types";
import { X, Upload, Loader2, Mail } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  theater: Cinema | null;
  onSuccess: () => void;
}

export default function TheaterFormModal({
  isOpen,
  onClose,
  theater,
  onSuccess,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [animate, setAnimate] = useState(false);
  const [render, setRender] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    city: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;

    requestAnimationFrame(() => {
      if (isOpen) {
        setRender(true);
        timer = setTimeout(() => setAnimate(true), 10);
      } else {
        setAnimate(false);
        timer = setTimeout(() => setRender(false), 200);
      }
    });

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    requestAnimationFrame(() => {
      if (theater) {
        setFormData({
          name: theater.name || "",
          phone: theater.phone || "",
          email: theater.email || "",
          location: theater.location || "",
          city: theater.city || "",
          status: theater.status || "ACTIVE",
        });
      } else {
        setFormData({
          name: "",
          phone: "",
          email: "",
          location: "",
          city: "",
          status: "ACTIVE",
        });
      }
      setFile(null);
    });
  }, [isOpen, theater]);

  if (!render) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload: CreateTheaterPayload = {
      name: formData.name,
      location: formData.location,
      city: formData.city,
      status: formData.status as "ACTIVE" | "INACTIVE",
      phone: formData.phone || undefined,
      email: formData.email || undefined,
      file: file, 
    };

    try {
      if (theater) {
        await cinemasApi.updateCinema(theater.id, payload);
      } else {
        await cinemasApi.createCinema(payload);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save theater configurations:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        animate
          ? "bg-black/40 backdrop-blur-sm"
          : "bg-black/0 backdrop-blur-none"
      }`}
    >
      <div onClick={onClose} className="absolute inset-0" />
      <div
        className={`w-full max-w-md rounded-2xl bg-white dark:bg-zinc-950 p-6 shadow-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-200 relative z-10 ${
          animate ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 disabled:opacity-50"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-5 text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          {theater ? "Edit Theater Details" : "Create New Theater"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Theater Name
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Legend Cinema AEON Mall"
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
                City
              </label>
              <input
                name="city"
                type="text"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="e.g. Phnom Penh"
                className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 cursor-pointer"
                disabled={isSubmitting}
              >
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Street Location
            </label>
            <input
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. 123 Street 310, Phnom Penh"
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Phone Contact{" "}
              <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <input
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g. +85512345678"
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Email Address{" "}
              <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none" />
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="e.g. cinema@email.com"
                className="w-full pl-10 pr-4 border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Cover Display Image
            </label>
            <div className="flex items-center justify-center w-full">
              <label
                className={`flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl transition-all ${isSubmitting ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900/50"}`}
              >
                <div className="flex flex-col items-center justify-center pt-3 pb-3 px-4 text-center">
                  <Upload className="h-5 w-5 text-zinc-400 mb-1" />
                  <p className="w-full max-w-[220px] truncate text-xs text-zinc-500 dark:text-zinc-400">
                    {file ? file.name : "Click to upload media file"}
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                />
              </label>
            </div>
          </div>

          <div className="mt-6 flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 border border-zinc-200 dark:border-zinc-800 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm flex items-center justify-center gap-2 disabled:bg-zinc-400 dark:disabled:bg-zinc-800 disabled:text-zinc-200 dark:disabled:text-zinc-600"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {theater ? "Save Changes" : "Create Theater"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
