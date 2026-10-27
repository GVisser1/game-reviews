export type Review = {
  gameId: number;
  gameName: string;
  coverUrl: string | null;
  releaseYear: number | null;
  rating: number;
  body: string | null;
};

// A review as shown publicly on a game's page.
export type GameReview = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  rating: number;
  body: string;
  createdAt: string;
  isOwn: boolean;
};

export type RatingSummary = {
  averageRating: number | null;
  ratingCount: number;
};

export type TopRatedGame = {
  gameId: number;
  gameName: string;
  coverUrl: string | null;
  ratingSummary: RatingSummary;
};
