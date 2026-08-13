"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { UploadCloud, X, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export interface ImageUploaderProps {
  value?: string | null;
  onChange: (file: File | null) => void;
  onRemove?: () => void;
  accept?: string;
  maxSizeMB?: number;
  variant?: "tile" | "avatar";
  label?: string;
  hint?: string;
  disabled?: boolean;
  className?: string;
  previewClassName?: string;
}

function matchesAccept(file: File, accept: string): boolean {
  if (!accept || accept === "*" || accept === "*/*") return true;
  return accept.split(",").some((token) => {
    const rule = token.trim().toLowerCase();
    if (!rule) return false;
    if (rule === "*" || rule === "*/*") return true;
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) {
      return file.type.toLowerCase().startsWith(rule.replace("/*", "/"));
    }
    return file.type.toLowerCase() === rule;
  });
}

export function ImageUploader({
  value,
  onChange,
  onRemove,
  accept = "image/*",
  maxSizeMB = 5,
  variant = "tile",
  label,
  hint,
  disabled = false,
  className,
  previewClassName,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const releasePreview = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    setPreviewUrl(null);
  }, []);

  const processFile = useCallback(
    (file: File) => {
      if (!matchesAccept(file, accept)) {
        toast.error(`Unsupported file type. Accepted formats: ${accept}`);
        return;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`File too large. Maximum size is ${maxSizeMB}MB.`);
        return;
      }
      releasePreview();
      const url = URL.createObjectURL(file);
      objectUrlRef.current = url;
      setPreviewUrl(url);
      onChange(file);
    },
    [accept, maxSizeMB, onChange, releasePreview],
  );

  const clear = useCallback(() => {
    releasePreview();
    onChange(null);
    onRemove?.();
  }, [onChange, onRemove, releasePreview]);

  const displaySrc = previewUrl ?? value ?? null;

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
          {label}
        </label>
      )}

      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label={label ?? "Upload image"}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFile = e.dataTransfer.files?.[0];
          if (droppedFile) {
            processFile(droppedFile);
          }
        }}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled) {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 ${
          isDragging
            ? "border-zinc-500 bg-zinc-50 dark:bg-zinc-800/40"
            : "border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-500"
        } ${disabled ? "opacity-50 pointer-events-none" : ""} ${className ?? ""}`}
      >
        {displaySrc ? (
          <div
            className={
              previewClassName ??
              (variant === "avatar"
                ? "relative h-20 w-20 rounded-full mx-auto overflow-hidden border border-zinc-200 dark:border-zinc-700"
                : "relative w-full aspect-[4/3] overflow-hidden rounded-lg")
            }
          >
            <Image
              src={displaySrc}
              alt="Image preview"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-2 text-zinc-400">
            <UploadCloud
              className={`h-6 w-6 transition-colors ${
                isDragging ? "text-zinc-600 dark:text-zinc-300" : ""
              }`}
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              Click to browse or drag &amp; drop image
            </span>
            {hint && <span className="text-[10px] text-zinc-400">{hint}</span>}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              processFile(file);
            }
            e.target.value = "";
          }}
        />
      </div>

      {displaySrc && (
        <div className="flex items-center justify-center gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw className="h-3 w-3" /> Change
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={clear}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-500 border border-rose-200 dark:border-rose-900/50 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <X className="h-3 w-3" /> Remove
          </button>
        </div>
      )}
    </div>
  );
}
