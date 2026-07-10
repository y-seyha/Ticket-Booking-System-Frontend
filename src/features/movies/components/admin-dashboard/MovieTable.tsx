"use client";

import Image from "next/image";
import { Film, Calendar, Clock, Languages, Pencil, Trash2 } from "lucide-react"; // 👈 Exchanged Eye for Pencil
import { Movie, MovieStatus } from "../../movie.type";
import SmoothSelect from "@/components/ui/SmoothSelect";

interface MovieTableProps {
  movies: Movie[];
  onStatusChange: (id: string, status: MovieStatus) => void;
  onEditClick: (movie: Movie) => void;
  onDeleteClick: (movie: Movie) => void;
  currentPage?: number;
  limit?: number;
}

export default function MovieTable({
  movies,
  onStatusChange,
  onEditClick,
  onDeleteClick,
  currentPage = 1,
  limit = 10,
}: MovieTableProps) {
  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <Film className="h-10 w-10 text-zinc-400 mb-3" />
        <p className="text-zinc-600 dark:text-zinc-400 font-medium">
          No movies found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-visible rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm">
      <div className="overflow-visible">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 w-16">
                No.
              </th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                Movie Details
              </th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                Metadata
              </th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100">
                Status
              </th>
              <th className="px-6 py-4 font-semibold text-zinc-900 dark:text-zinc-100 text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {movies.map((movie, index) => {
              const rowNumber = (currentPage - 1) * limit + index + 1;
              const poster = movie.poster as { url?: string } | undefined;
              const resolvedUrl = poster?.url || null;

              const invertedZIndex = movies.length + 10 - index;

              return (
                <tr
                  key={movie.id}
                  style={{ zIndex: invertedZIndex }}
                  className="group hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors relative"
                >
                  <td className="px-6 py-4 text-zinc-500 font-medium">
                    {rowNumber}
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-200 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 shadow-sm">
                        {resolvedUrl ? (
                          <Image
                            src={resolvedUrl}
                            alt={movie.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <Film className="h-full w-full p-2 text-zinc-400" />
                        )}
                      </div>
                      <div className="flex flex-col max-w-50">
                        <span className="font-bold text-zinc-900 dark:text-zinc-50 truncate">
                          {movie.title}
                        </span>
                        <p className="text-xs text-zinc-500 line-clamp-2 mt-0.5 leading-relaxed italic">
                          {movie.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="space-y-1.5 text-zinc-600 dark:text-zinc-400">
                      <div className="flex items-center gap-2 text-xs">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(movie.releaseDate).toLocaleDateString(
                          "en-US",
                          { year: "numeric", month: "short", day: "numeric" },
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Clock className="h-3.5 w-3.5" />{" "}
                        {movie.durationMinutes} min
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <Languages className="h-3.5 w-3.5" /> {movie.language}
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 w-52 overflow-visible relative">
                    <SmoothSelect
                      label=""
                      placeholder="Select status..."
                      selectedValue={movie.status}
                      onChange={(val) =>
                        onStatusChange(movie.id, val as MovieStatus)
                      }
                      options={[
                        {
                          value: MovieStatus.NOW_SHOWING,
                          label: "Now Showing",
                        },
                        {
                          value: MovieStatus.COMING_SOON,
                          label: "Coming Soon",
                        },
                        { value: MovieStatus.ARCHIVED, label: "Archived" },
                      ]}
                    />
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => onEditClick(movie)}
                        title="Edit Movie details"
                        className="p-2 text-zinc-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-all cursor-pointer"
                      >
                        <Pencil className="h-4 w-4" />{" "}
                      </button>
                      <button
                        onClick={() => onDeleteClick(movie)}
                        title="Delete Movie catalog link"
                        className="p-2 text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-all cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
