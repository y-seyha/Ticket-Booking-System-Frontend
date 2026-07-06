"use client";

import React, { useState } from "react";
import { Movie } from "../../movie.type";
import Modal from "@/components/ui/Modal";
import { Film } from "lucide-react";
import { extractYouTubeVideoId } from "@/lib/helpers";
import Image from "next/image";

export interface CreateMoviePayload {
  title: string;
  description?: string;
  durationMinutes: number;
  language: string;
  releaseDate: string;
  trailerYoutubeId?: string;
  file?: File | null;
}

interface MovieFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateMoviePayload) => Promise<void>;
  movie?: Movie | null;
}

export default function MovieFormModal({
  isOpen,
  onClose,
  onSubmit,
  movie,
}: MovieFormModalProps) {
  const [title, setTitle] = useState(movie ? movie.title : "");
  const [description, setDescription] = useState(movie?.description || "");
  const [duration, setDuration] = useState(
    movie ? movie.durationMinutes.toString() : "",
  );
  const [language, setLanguage] = useState(movie ? movie.language : "");

  const [posterFile, setPosterFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(
    movie?.poster &&
      typeof movie.poster === "string" &&
      movie.poster.trim() !== ""
      ? movie.poster
      : null,
  );

  const getInitialDate = () => {
    if (!movie?.releaseDate) return "";
    return new Date(movie.releaseDate).toISOString().split("T")[0];
  };
  const [releaseDate, setReleaseDate] = useState(getInitialDate());
  const [trailerYoutubeId, setTrailerYoutubeId] = useState(
    movie?.trailerYoutubeId || "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const youtubeId = extractYouTubeVideoId(trailerYoutubeId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPosterFile(file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload: CreateMoviePayload = {
        title: title.trim(),
        durationMinutes: parseInt(duration, 10) || 0,
        language: language.trim(),
        releaseDate: releaseDate
          ? new Date(releaseDate).toISOString()
          : new Date().toISOString(),
        description: description.trim() || undefined,
        trailerYoutubeId: youtubeId ?? undefined,
        file: posterFile,
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error("Failed to submit film schema:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={movie ? "Edit Movie Details" : "Add New Catalog Entry"}
    >
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-h-[80vh] overflow-y-auto px-1 custom-scrollbar"
      >
        {/* Poster Upload Section with Visual Preview Feedback */}
        <div className="flex items-center gap-4 p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-100 dark:border-zinc-800">
          <div className="relative h-24 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-200 dark:border-zinc-700 shrink-0">
            {previewUrl ? (
              <div className="relative h-24 w-16 overflow-hidden rounded-md">
                <Image
                  src={previewUrl}
                  alt="Movie Poster Canvas Preview"
                  fill
                  sizes="64px"
                  priority
                  className="object-cover"
                />
              </div>
            ) : (
              <Film className="h-6 w-6 text-zinc-400" />
            )}
          </div>
          <div className="flex-1 space-y-1">
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              {movie ? "Replace Movie Poster" : "Upload Movie Poster"}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-900 file:text-white dark:file:bg-zinc-50 dark:file:text-zinc-950 hover:file:opacity-90 transition-opacity"
            />
            <p className="text-[10px] text-zinc-400">
              Accepts PNG, JPG, JPEG formats.
            </p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Movie Title
          </label>
          <input
            type="text"
            required
            value={title}
            placeholder="Spiderman..."
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-10.5 rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
            Description (Optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            placeholder="Synopsis narrative..."
            className="w-full rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Duration (mins)
            </label>
            <input
              type="number"
              required
              min={1}
              value={duration}
              placeholder="150"
              onChange={(e) => setDuration(e.target.value)}
              className="w-full h-10.5 rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Language
            </label>
            <input
              type="text"
              required
              value={language}
              placeholder="English, Khmer..."
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10.5 rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              Release Date
            </label>
            <input
              type="date"
              required
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="w-full h-10.5 rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1">
              YouTube Trailer ID
            </label>
            <input
              type="text"
              placeholder="e.g. avz06PDqDbM"
              value={trailerYoutubeId}
              onChange={(e) => setTrailerYoutubeId(e.target.value)}
              className="w-full h-10.5 rounded-lg border border-zinc-200 bg-white p-2 text-sm text-zinc-900 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 focus:border-zinc-900 dark:focus:border-zinc-50"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-zinc-200 dark:border-zinc-800 px-4 py-2 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
