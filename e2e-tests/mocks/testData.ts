export type TestGame = {
  id: number;
  name: string;
  coverUrl: string | null;
  releaseYear: number | null;
};

export type TestGameDetails = TestGame & {
  summary: string | null;
  genres: string[];
  platforms: string[];
  igdbRating: number | null;
};

// Covers are left out so tests never load images from IGDB.
export const TEST_GAMES: TestGameDetails[] = [
  {
    id: 72,
    name: "Portal 2",
    coverUrl: null,
    releaseYear: 2011,
    summary: "Sequel to the acclaimed Portal.",
    genres: ["Puzzle", "Platform"],
    platforms: ["PC (Microsoft Windows)", "PlayStation 3"],
    igdbRating: 92,
  },
  {
    id: 1942,
    name: "The Witcher 3: Wild Hunt",
    coverUrl: null,
    releaseYear: 2015,
    summary: "Geralt hunts for his adopted daughter.",
    genres: ["Role-playing (RPG)"],
    platforms: ["PC (Microsoft Windows)"],
    igdbRating: 93,
  },
  {
    id: 1020,
    name: "Grand Theft Auto V",
    coverUrl: null,
    releaseYear: 2013,
    summary: null,
    genres: ["Shooter", "Racing"],
    platforms: ["PlayStation 4"],
    igdbRating: 89,
  },
  {
    id: 119133,
    name: "Elden Ring",
    coverUrl: null,
    releaseYear: 2022,
    summary: null,
    genres: ["Role-playing (RPG)"],
    platforms: ["PC (Microsoft Windows)"],
    igdbRating: 94,
  },
];

export const TWITCH_DISPLAY_NAME = "E2E Tester";
export const TWITCH_USERNAME = "e2e-tester";

// Written reviews from other players, as get_game_reviews returns them.
export const OTHER_PLAYER_REVIEWS = [
  {
    game_id: 72,
    username: "other-player",
    display_name: "Other Player",
    avatar_url: null,
    rating: 5,
    body: "Best co-op puzzles ever made.",
    created_at: "2026-10-01T12:00:00Z",
  },
];

// Star ratings from other players without written text. Together with OTHER_PLAYER_REVIEWS: The Witcher 3 has 4.5
// from 2 ratings, Elden Ring 3.5 from 2, Portal 2 5.0 from 1 and GTA V none.
export const OTHER_PLAYER_RATINGS = [
  { game_id: 1942, rating: 4 },
  { game_id: 1942, rating: 5 },
  { game_id: 119133, rating: 3 },
  { game_id: 119133, rating: 4 },
];

export const TURNSTILE_TEST_TOKEN = "e2e-turnstile-token";
