export interface ShowtimeLocation {
  name: string;
  times: string[];
}

export interface MovieDetail {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  genre: string;
  duration: string;
  releaseDate: string;
  classification: string;
  description: string;
  showtimesByLocation: ShowtimeLocation[];
}

export const MOVIE_DETAILS_MOCK: Record<string, MovieDetail> = {
  "shake-rattle-roll": {
    id: "shake-rattle-roll",
    title: "Shake Rattle & Roll: Evil Origins",
    poster: "/spiderman-movie.png",
    backdrop: "/spiderman-movie.png",
    genre: "Horror",
    duration: "2h 25min",
    releaseDate: "24 Jun 2026",
    classification: "NC15",
    description:
      "The terrifying origin story of ancient dark entities unleashing nightmare scenarios.",
    showtimesByLocation: [
      {
        name: "Legend 271 Mega Mall",
        times: ["11:30 AM", "02:15 PM", "05:00 PM", "07:45 PM", "09:30 PM"],
      },
      {
        name: "Legend Eden Garden",
        times: ["01:00 PM", "03:45 PM", "06:30 PM", "09:20 PM"],
      },
    ],
  },
};

// Extracted for your location dropdown filter array mapping
export const LOCATIONS_LIST = [
  "All Locations",
  "Legend 271 Mega Mall",
  "Legend Eden Garden",
];
