// Matches the check on reviews.body in the database.
export const MAX_REVIEW_LENGTH = 2000;

// Blank text means "no written review", stored as null.
export const normalizeReviewBody = (text: string): string | null => {
  const trimmed = text.trim();
  return trimmed === "" ? null : trimmed;
};
