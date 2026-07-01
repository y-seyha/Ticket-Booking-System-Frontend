"use client";

import Image from "next/image";
import { Building2, MapPin, Phone, Mail, Edit3, Trash2 } from "lucide-react";
import { Cinema } from "../../cinemas.types";

interface TheaterTableProps {
  theaters: Cinema[];
  onEditClick: (theater: Cinema) => void;
  onDeleteClick: (theater: Cinema) => void;
  currentPage: number;
  limit: number;
  isLoading?: boolean;
}

function TableContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm overflow-hidden transition-all duration-200">
      <div className="w-full overflow-x-auto relative min-h-[200px]">
        {children}
      </div>
    </div>
  );
}

export default function TheaterTable({
  theaters,
  onEditClick,
  onDeleteClick,
  currentPage,
  limit,
  isLoading,
}: TheaterTableProps) {
  if (isLoading) {
    return (
      <TableContainer>
        <div className="space-y-3 p-6 animate-pulse">
          <div className="h-8 bg-zinc-100 dark:bg-zinc-800 rounded-xl w-full" />
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-16 bg-zinc-50 dark:bg-zinc-900/60 rounded-xl w-full"
            />
          ))}
        </div>
      </TableContainer>
    );
  }

  if (theaters.length === 0) {
    return (
      <TableContainer>
        <div className="flex flex-col items-center justify-center p-16 text-zinc-400 dark:text-zinc-600">
          <Building2 className="h-10 w-10 mb-3 stroke-[1.5] text-zinc-300 dark:text-zinc-700" />
          <p className="text-sm font-medium">No operational locations found</p>
          <p className="text-xs text-zinc-400 mt-1">
            Try adjusted search terms or clear existing filter sets.
          </p>
        </div>
      </TableContainer>
    );
  }

  return (
    <TableContainer>
      {/* Header Matrix mapping pattern */}
      <div className="grid grid-cols-12 gap-4 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 min-w-[900px]">
        <div className="col-span-1">Index</div>
        <div className="col-span-4">Theater Details</div>
        <div className="col-span-3">Contact</div>
        <div className="col-span-2">Location</div>
        <div className="col-span-1 text-center">Status</div>
        <div className="col-span-1 text-right">Actions</div>
      </div>

      {/* Semantic Zebra Stripe Rows list wrapper */}
      <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
        {theaters.map((t, idx) => {
          const isEven = idx % 2 === 1;
          return (
            <div
              key={t.id}
              className={`grid grid-cols-12 gap-4 items-center px-6 py-3.5 text-sm text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/40 transition-colors min-w-[900px] ${
                isEven
                  ? "bg-zinc-50/30 dark:bg-zinc-900/10"
                  : "bg-white dark:bg-zinc-950"
              }`}
            >
              {/* Mono Index Counter */}
              <div className="col-span-1 font-mono text-xs text-zinc-400 dark:text-zinc-600">
                {String((currentPage - 1) * limit + idx + 1).padStart(2, "0")}
              </div>

              {/* Theater Avatar Branding Profile column */}
              <div className="col-span-4 flex items-center gap-3 pr-2">
                <div className="relative h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900">
                  {t.image?.url ? (
                    <Image
                      src={t.image.url}
                      alt={t.name}
                      fill
                      sizes="36px"
                      className="object-cover relative z-0"
                    />
                  ) : (
                    <Building2 className="absolute inset-0 m-auto h-4 w-4 text-zinc-400 stroke-[1.5]" />
                  )}
                </div>
                <span className="font-semibold text-zinc-900 dark:text-zinc-50 tracking-tight truncate">
                  {t.name}
                </span>
              </div>

              {/* Multi-Row Contact Info stack column */}
              <div className="col-span-3 text-xs space-y-1 text-zinc-500 dark:text-zinc-400">
                <div className="flex items-center gap-2 truncate">
                  <Phone className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">
                    {t.phone || "No phone contact"}
                  </span>
                </div>
                <div className="flex items-center gap-2 truncate">
                  <Mail className="h-3.5 w-3.5 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">
                    {t.email || "No digital mailbox"}
                  </span>
                </div>
              </div>

              {/* Geographic Address positioning column */}
              <div className="col-span-2 text-xs">
                <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200 font-medium">
                  <MapPin className="h-3 w-3 text-zinc-400 flex-shrink-0" />
                  <span className="truncate">{t.city}</span>
                </div>
                <div className="mt-0.5 pl-4 text-zinc-400 dark:text-zinc-500 truncate max-w-[170px]">
                  {t.location}
                </div>
              </div>

              {/* Operational Status Pill Badge item */}
              <div className="col-span-1 flex justify-center">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide transition-colors ${
                    t.status === "ACTIVE"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200/40 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/20"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-400"
                  }`}
                >
                  {t.status}
                </span>
              </div>

              {/* Actions Interaction Suite button shortcuts */}
              <div className="col-span-1 flex items-center justify-end gap-0.5">
                <button
                  onClick={() => onEditClick(t)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all"
                  title="Modify Entry"
                >
                  <Edit3 className="h-4 w-4" />
                </button>
                <button
                  onClick={() => onDeleteClick(t)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                  title="Remove Location"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </TableContainer>
  );
}
