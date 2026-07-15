export interface MockFoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "popcorn" | "drinks" | "combo" | "candy" | "snacks";
}

export const mockFoods: MockFoodItem[] = [
  {
    id: "food-1",
    name: "Classic Popcorn",
    description: "Freshly popped buttery popcorn",
    price: 3.50,
    image: "/images/foods/popcorn.jpg",
    category: "popcorn",
  },
  {
    id: "food-2",
    name: "Large Popcorn",
    description: "Large bucket of buttery popcorn",
    price: 5.50,
    image: "/images/foods/large-popcorn.jpg",
    category: "popcorn",
  },
  {
    id: "food-3",
    name: "Coca-Cola",
    description: "Regular carbonated soft drink",
    price: 2.00,
    image: "/images/foods/coke.jpg",
    category: "drinks",
  },
  {
    id: "food-4",
    name: "Iced Tea",
    description: "Refreshing lemon iced tea",
    price: 2.50,
    image: "/images/foods/iced-tea.jpg",
    category: "drinks",
  },
  {
    id: "food-5",
    name: "Popcorn & Drink Combo",
    description: "Classic popcorn + regular drink",
    price: 5.00,
    image: "/images/foods/combo.jpg",
    category: "combo",
  },
  {
    id: "food-6",
    name: "Nachos Supreme",
    description: "Crispy nachos with cheese sauce",
    price: 4.50,
    image: "/images/foods/nachos.jpg",
    category: "snacks",
  },
  {
    id: "food-7",
    name: "Hot Dog",
    description: "Classic beef hot dog",
    price: 3.75,
    image: "/images/foods/hotdog.jpg",
    category: "snacks",
  },
  {
    id: "food-8",
    name: "Chocolate Bar",
    description: "Assorted chocolate candy bar",
    price: 2.50,
    image: "/images/foods/chocolate.jpg",
    category: "candy",
  },
];
