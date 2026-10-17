export type Review = {
  gameId: number;
  gameName: string;
  coverUrl: string | null;
  rating: number;
  body: string | null;
};

// A review as shown publicly on a game's page.
export type GameReview = {
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
