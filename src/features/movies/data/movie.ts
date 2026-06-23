export type Movie = {
  id: number;
  title: string;
  banner: string;
  description: string;
  primaryButton: {
    label: string;
    onClick: () => void;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
  };
};

export const movies: Movie[] = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    banner: "/login-background.jpeg",
    description: "Experience Pandora again.",
    primaryButton: {
      label: "Book Now",
      onClick: () => console.log("Avatar Book"),
    },
    secondaryButton: {
      label: "Watch Trailer",
      onClick: () => console.log("Avatar Trailer"),
    },
  },
  {
    id: 2,
    title: "Mission: Impossible",
    banner: "/login-background.jpeg",
    description: "One last mission.",
    primaryButton: {
      label: "Book Now",
      onClick: () => console.log("Mission Book"),
    },
  },
  {
    id: 3,
    title: "How to Train Your Dragon",
    banner: "/login-background.jpeg",
    description: "A legendary adventure awaits.",
    primaryButton: {
      label: "Book Now",
      onClick: () => console.log("Dragon Book"),
    },
  },
  {
    id: 4,
    title: "Jurassic World",
    banner: "/login-background.jpeg",
    description: "Dinosaurs rule the world again.",
    primaryButton: {
      label: "Book Now",
      onClick: () => console.log("Jurassic Book"),
    },
    secondaryButton: {
      label: "Trailer",
      onClick: () => console.log("Jurassic Trailer"),
    },
  },
  {
    id: 5,
    title: "Spider-Man",
    banner: "/login-background.jpeg",
    description: "The multiverse continues.",
    primaryButton: {
      label: "Book Now",
      onClick: () => console.log("Spider Book"),
    },
  },
  {
    id: 6,
    title: "The Batman",
    banner: "/login-background.jpeg",
    description: "Gotham needs a hero.",
    primaryButton: {
      label: "Book Now",
      onClick: () => console.log("Batman Book"),
    },
    secondaryButton: {
      label: "Watch Trailer",
      onClick: () => console.log("Batman Trailer"),
    },
  },
];
