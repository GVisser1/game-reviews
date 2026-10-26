export type Profile = {
  username: string;
  displayName: string;
  avatarUrl: string | null;
  isOwn: boolean;
};

// A rating on a player's profile, with or without review text.
export type ProfileReview = {
  gameId: number;
  gameName: string;
  coverUrl: string | null;
  rating: number;
  body: string | null;
  createdAt: string;
};
