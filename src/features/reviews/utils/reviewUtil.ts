import { isNil } from "lodash-es";
import type { RatingSummary } from "../types";

// Matches the check on reviews.body in the database.
export const MAX_REVIEW_LENGTH = 2000;
const MAX_STARS = 5;
const AVERAGE_DECIMALS = 1;

// Blank text means "no written review", stored as null.
export const normalizeReviewBody = (text: string): string | null => {
  const trimmed = text.trim();
  return trimmed === "" ? null : trimmed;
};

export const formatRatingSummary = ({ averageRating, ratingCount }: RatingSummary): string => {
  if (isNil(averageRating) || ratingCount === 0) {
    return "No ratings yet";
  }
  const ratings = ratingCount === 1 ? "1 rating" : `${ratingCount} ratings`;
  return `${averageRating.toFixed(AVERAGE_DECIMALS)}/${MAX_STARS} from ${ratings}`;
};

// For tight spaces like the games list: "4.3 (12)", shown after a star icon. Pair it with formatRatingSummary for screen
// readers.
export const formatShortRatingSummary = ({ averageRating, ratingCount }: RatingSummary): string | null =>
  isNil(averageRating) || ratingCount === 0 ? null : `${averageRating.toFixed(AVERAGE_DECIMALS)} (${ratingCount})`;
