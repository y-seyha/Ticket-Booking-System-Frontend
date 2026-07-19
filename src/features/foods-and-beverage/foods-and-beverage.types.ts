export interface FoodItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageId: string | null;
  image: { id: string; url: string } | null;
  categoryId: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
  items: FoodItem[];
  createdAt: string;
  updatedAt: string;
}

export interface BookingFoodItem {
  id: string;
  bookingId: string;
  foodItemId: string;
  quantity: number;
  unitPrice: number;
  createdAt: string;
  foodItem: FoodItem;
}

export interface FoodOrderResponse {
  bookingId: string;
  bookingCode: string;
  totalAmount: number;
  status: string;
}
