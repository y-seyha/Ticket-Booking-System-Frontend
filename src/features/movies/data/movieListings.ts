export interface MovieCard {
  id: string;
  title: string;
  poster: string;
  releaseDate: string;
  tags?: string[];
  isAdvanceTicket?: boolean;
}

export const movieData: MovieCard[] = [
  {
    id: "shake-rattle-roll",
    title: "Shake Rattle & Roll: Evil Origins",
    poster: "/spiderman-movie.png",
    releaseDate: "24 Jun 2026",
    isAdvanceTicket: true,
  },
  {
    id: "umamusume",
    title: "Umamusume: Pretty Derby - Beginning of a New Era",
    poster: "/spiderman-movie.png",
    releaseDate: "19 Jun 2026",
    tags: ["2D"],
  },
  {
    id: "where-it-began",
    title: "Where It Began",
    poster: "/spiderman-movie.png",
    releaseDate: "19 Jun 2026",
    tags: ["2D", "Khmer"],
  },
  {
    id: "death-house",
    title: "Death House",
    poster: "/spiderman-movie.png",
    releaseDate: "18 Jun 2026",
    tags: ["2D", "Horror"],
  },
  {
    id: "avatar-fire-and-ash",
    title: "Avatar: Fire and Ash",
    poster: "/spiderman-movie.png",
    releaseDate: "10 Jul 2026",
    tags: ["3D", "IMAX"],
    isAdvanceTicket: true,
  },
  {
    id: "superman",
    title: "Superman",
    poster: "/spiderman-movie.png",
    releaseDate: "08 Jul 2026",
    tags: ["2D", "Action"],
  },
  {
    id: "jurassic-world",
    title: "Jurassic World: Rebirth",
    poster: "/spiderman-movie.png",
    releaseDate: "03 Jul 2026",
    tags: ["3D", "Adventure"],
  },
  {
    id: "how-to-train-your-dragon",
    title: "How to Train Your Dragon",
    poster: "/spiderman-movie.png",
    releaseDate: "27 Jun 2026",
    tags: ["2D", "Family"],
  },
  {
    id: "f1",
    title: "F1",
    poster: "/spiderman-movie.png",
    releaseDate: "26 Jun 2026",
    tags: ["2D", "Sports"],
  },
  {
    id: "mission-impossible",
    title: "Mission: Impossible - The Final Reckoning",
    poster: "/spiderman-movie.png",
    releaseDate: "25 Jun 2026",
    tags: ["IMAX", "Action"],
  },
  {
    id: "lilo-stitch",
    title: "Lilo & Stitch",
    poster: "/spiderman-movie.png",
    releaseDate: "20 Jun 2026",
    tags: ["2D", "Family"],
  },
  {
    id: "demon-slayer",
    title: "Demon Slayer: Infinity Castle",
    poster: "/spiderman-movie.png",
    releaseDate: "18 Jul 2026",
    tags: ["Anime", "2D"],
    isAdvanceTicket: true,
  },
];

// 6-day date tab bar generator logic matching your screenshot layout
export const dateTabs = [
  { day: "Today", date: "24", month: "Jun" },
  { day: "Thu", date: "25", month: "Jun" },
  { day: "Fri", date: "26", month: "Jun" },
  { day: "Sat", date: "27", month: "Jun" },
  { day: "Sun", date: "28", month: "Jun" },
  { day: "Mon", date: "29", month: "Jun" },
  { day: "Tue", date: "30", month: "Jun" },
  { day: "Wed", date: "1", month: "Jul" },
  { day: "Thu", date: "2", month: "Jul" },
  { day: "Fri", date: "3", month: "Jul" },
  { day: "Sat", date: "4", month: "Jul" },
  { day: "Sun", date: "5", month: "Jul" },
];
