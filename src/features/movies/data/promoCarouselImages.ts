export interface PromoItem {
  id: string;
  title: string;
  description: string;
  src: string;
  linkUrl: string;
}

export const promoCarouselData: PromoItem[] = [
  {
    id: "promo-coke-win",
    title: "Buy, Play, Win! 🥳🎉",
    description:
      "Hurry up! Simply purchase any snack along with a Coca-Cola with a total receipt of $5.00 or more at Legend...",
    src: "/promotions/cb64c978-0fca-4ae5-ad26-2937c1515dc5.jpeg",
    linkUrl: "#",
  },
  {
    id: "promo-popcorn-deal",
    title: "Combo Upgrade Madness! 🍿🥤",
    description:
      "Upgrade your single combo to a family pack for just $1.50 extra. Offer valid on all weekday screenings this month.",
    src: "/promotions/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    linkUrl: "#",
  },
  {
    id: "promo-free-drink",
    title: "Free Drink Friday 🥤",
    description:
      "Get a free soft drink with every movie ticket purchased every Friday this month.",
    src: "/promotions/d7831d0d-faff-416d-bec5-06b413e5c8fe.jpeg",
    linkUrl: "#",
  },
  {
    id: "promo-member-reward",
    title: "Member Rewards Bonus ⭐",
    description:
      "Earn double points when you book tickets using your Legend Cinema membership account.",
    src: "/promotions/contact-hero.jpg",
    linkUrl: "#",
  },
  {
    id: "promo-family-night",
    title: "Family Movie Night 👨‍👩‍👧‍👦",
    description:
      "Special discount for family bundles every weekend screening. Enjoy movies together for less.",
    src: "/promotions/legend-cinema-hall.jpeg",
    linkUrl: "#",
  },
];
