"use client";

import { useState, useEffect, useRef } from "react";
import { foodAndBeverageApi } from "../../foods-and-beverage.api";
import { FoodItem } from "../../foods-and-beverage.types";
import { X, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { getApiClient } from "@/lib/config/api-client";

interface ItemFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: FoodItem | null;
  categoryId: string;
  categoryName: string;
  onSuccess: () => void;
}

export default function ItemFormModal({
  isOpen,
  onClose,
  item,
  categoryId,
  categoryName,
  onSuccess,
}: ItemFormModalProps) {
  const [animate, setAnimate] = useState(false);
  const [render, setRender] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      if (item) {
        setName(item.name);
        setDescription(item.description || "");
        setPrice(String(item.price));
        setSortOrder(item.sortOrder);
        setIsActive(item.isActive);
        setImagePreview(item.image?.url || null);
        setImageFile(null);
      } else {
        setName("");
        setDescription("");
        setPrice("");
        setSortOrder(0);
        setIsActive(true);
        setImagePreview(null);
        setImageFile(null);
      }
    });
  }, [isOpen, item]);

  if (!render) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return item?.imageId || null;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("folder", "food");
      const client = getApiClient();
      const response = await client.post("/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.id;
    } catch {
      toast.error("Failed to upload image");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let imageId = item?.imageId || null;
      if (imageFile) {
        const uploadedId = await uploadImage();
        if (!uploadedId) {
          setIsSubmitting(false);
          return;
        }
        imageId = uploadedId;
      }

      if (item) {
        await foodAndBeverageApi.updateItem(item.id, {
          name,
          description: description || undefined,
          price: parseFloat(price),
          sortOrder,
          isActive,
          imageId: imageId || undefined,
        });
      } else {
        await foodAndBeverageApi.createItem({
          name,
          description: description || undefined,
          price: parseFloat(price),
          categoryId,
          sortOrder,
          imageId: imageId || undefined,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save item", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-200 ${
        animate ? "bg-black/40 backdrop-blur-sm" : "bg-black/0 backdrop-blur-none"
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
          {item ? "Edit Item" : `Add Item to ${categoryName}`}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Image <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-xl p-4 cursor-pointer hover:border-zinc-400 dark:hover:border-zinc-500 transition-colors"
            >
              {imagePreview ? (
                <div className="relative w-full h-32">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageFile(null);
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 bg-black/60 rounded-full p-1 hover:bg-black/80 transition"
                  >
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-zinc-400">
                  <Upload className="w-6 h-6" />
                  <span className="text-xs">Click to upload image</span>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Item Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Large Popcorn"
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:bg-white dark:focus:bg-zinc-950"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Description <span className="text-zinc-400 font-normal">(Optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Butter-salted large popcorn"
              rows={3}
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900 resize-none"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 5.99"
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5 text-zinc-600 dark:text-zinc-400">
              Sort Order
            </label>
            <input
              type="number"
              value={sortOrder}
              onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
              className="w-full border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-2.5 text-sm rounded-xl text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-900"
              disabled={isSubmitting}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Active Status
            </label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              disabled={isSubmitting}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isActive ? "bg-emerald-500" : "bg-zinc-300 dark:bg-zinc-700"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isActive ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
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
              disabled={isSubmitting || uploading}
              className="flex-1 bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 shadow-sm flex items-center justify-center gap-2 disabled:bg-zinc-400 dark:disabled:bg-zinc-800 disabled:text-zinc-200 dark:disabled:text-zinc-600"
            >
              {(isSubmitting || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
              {uploading ? "Uploading..." : item ? "Save Changes" : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
