import { apiRequest } from "@/lib/config/axios";
import { FoodCategory, FoodItem, BookingFoodItem, FoodOrderResponse, UserFoodOrder } from "./foods-and-beverage.types";

export const foodAndBeverageApi = {
  /* ─── Public ────────────────────────────── */
  getCategories() {
    return apiRequest<FoodCategory[]>(
      "get",
      "/food-and-beverage/categories",
    );
  },

  getItems(categoryId: string) {
    return apiRequest<FoodItem[]>(
      "get",
      `/food-and-beverage/categories/${categoryId}/items`,
    );
  },

  getItem(id: string) {
    return apiRequest<FoodItem>("get", `/food-and-beverage/items/${id}`);
  },

  /* ─── Booking Food Items (auth) ────────── */
  addFoodItems(bookingId: string, items: { foodItemId: string; quantity: number }[]) {
    return apiRequest<BookingFoodItem[]>(
      "post",
      `/food-and-beverage/booking/${bookingId}/items`,
      { items },
    );
  },

  getBookingFoodItems(bookingId: string) {
    return apiRequest<BookingFoodItem[]>(
      "get",
      `/food-and-beverage/booking/${bookingId}/items`,
    );
  },

  removeFoodItem(bookingId: string, itemId: string) {
    return apiRequest<{ message: string }>(
      "delete",
      `/food-and-beverage/booking/${bookingId}/items/${itemId}`,
    );
  },

  createFoodOrder(data: { items: { foodItemId: string; quantity: number }[] }) {
    return apiRequest<FoodOrderResponse>("post", "/food-and-beverage/order", data);
  },

  getMyOrders() {
    return apiRequest<UserFoodOrder[]>("get", "/food-and-beverage/my-orders");
  },

  getOrderById(bookingId: string) {
    return apiRequest<UserFoodOrder>("get", `/food-and-beverage/orders/${bookingId}`);
  },

  /* ─── Admin Categories ─────────────────── */
  getAllCategories() {
    return apiRequest<FoodCategory[]>("get", "/food-and-beverage/categories");
  },

  createCategory(data: { name: string; sortOrder?: number }) {
    return apiRequest<FoodCategory>("post", "/food-and-beverage/categories", data);
  },

  updateCategory(id: string, data: Partial<{ name: string; sortOrder: number }>) {
    return apiRequest<FoodCategory>("patch", `/food-and-beverage/categories/${id}`, data);
  },

  deleteCategory(id: string) {
    return apiRequest<void>("delete", `/food-and-beverage/categories/${id}`);
  },

  getAllItems() {
    return apiRequest<FoodItem[]>("get", "/food-and-beverage/items");
  },

  createBulkItems(data: { name: string; description?: string; price: number; sortOrder?: number; categoryIds: string[] }) {
    return apiRequest<FoodItem[]>("post", "/food-and-beverage/items/bulk", data);
  },

  /* ─── Admin Items ──────────────────────── */
  createItem(data: { name: string; description?: string; price: number; categoryId: string; sortOrder?: number; imageId?: string }) {
    return apiRequest<FoodItem>("post", "/food-and-beverage/items", data);
  },

  updateItem(id: string, data: Partial<{ name: string; description: string; price: number; categoryId: string; sortOrder: number; isActive: boolean; imageId: string }>) {
    return apiRequest<FoodItem>("patch", `/food-and-beverage/items/${id}`, data);
  },

  deleteItem(id: string) {
    return apiRequest<void>("delete", `/food-and-beverage/items/${id}`);
  },

  toggleItemStatus(id: string) {
    return apiRequest<{ message: string }>("patch", `/food-and-beverage/items/${id}/toggle-status`);
  },

  toggleCategoryStatus(id: string) {
    return apiRequest<{ message: string }>("patch", `/food-and-beverage/categories/${id}/toggle-status`);
  },
};
