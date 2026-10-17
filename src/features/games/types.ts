export type Game = {
  id: number;
  name: string;
  coverUrl: string | null;
  releaseYear: number | null;
};

export type GameDetails = {
  id: number;
  name: string;
  summary: string | null;
  coverUrl: string | null;
  releaseYear: number | null;
  genres: string[];
  platforms: string[];
  igdbRating: number | null;
};
