export interface PromoItem {
  id: string;
  title: string;
  description: string;
  src: string;
  linkUrl: string;
}

const sharedPromoImage = "/courousel/a2a41de6-0c10-4f87-95bd-4250d4bfaf3f.jpeg";

export const promoCarouselData: PromoItem[] = [
  {
    id: "promo-coke-win",
    title: "Buy, Play, Win! 🥳🎉",
    description:
      "Hurry up! Simply purchase any snack along with a Coca-Cola with a total receipt of $5.00 or more at Legend...",
    src: sharedPromoImage,
    linkUrl: "/promotions/coke-win",
  },
  {
    id: "promo-popcorn-deal",
    title: "Combo Upgrade Madness! 🍿🥤",
    description:
      "Upgrade your single combo to a family pack for just $1.50 extra. Offer valid on all weekday screenings this month.",
    src: sharedPromoImage,
    linkUrl: "/promotions/popcorn-deal",
  },
  {
    id: "promo-free-drink",
    title: "Free Drink Friday 🥤",
    description:
      "Get a free soft drink with every movie ticket purchased every Friday this month.",
    src: sharedPromoImage,
    linkUrl: "/promotions/free-drink-friday",
  },
  {
    id: "promo-member-reward",
    title: "Member Rewards Bonus ⭐",
    description:
      "Earn double points when you book tickets using your Legend Cinema membership account.",
    src: sharedPromoImage,
    linkUrl: "/promotions/member-reward",
  },
  {
    id: "promo-family-night",
    title: "Family Movie Night 👨‍👩‍👧‍👦",
    description:
      "Special discount for family bundles every weekend screening. Enjoy movies together for less.",
    src: sharedPromoImage,
    linkUrl: "/promotions/family-night",
  },
  {
    id: "promo-limited-ticket",
    title: "Limited Time Ticket Deal ⏳",
    description:
      "Book early and save up to 30% on selected blockbuster movies before release day.",
    src: sharedPromoImage,
    linkUrl: "/promotions/early-bird",
  },
  {
    id: "promo-student-night",
    title: "Student Night Discount 🎓",
    description:
      "Exclusive discount for students every Wednesday with valid student ID.",
    src: sharedPromoImage,
    linkUrl: "/promotions/student-night",
  },
];
