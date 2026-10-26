import { isNil } from "lodash-es";
import type { RatingSummary } from "./types";

const MAX_STARS = 5;
const AVERAGE_DECIMALS = 1;

export const formatRatingSummary = ({ averageRating, ratingCount }: RatingSummary): string => {
  if (isNil(averageRating) || ratingCount === 0) {
    return "No ratings yet";
  }
  const ratings = ratingCount === 1 ? "1 rating" : `${ratingCount} ratings`;
  return `${averageRating.toFixed(AVERAGE_DECIMALS)}/${MAX_STARS} from ${ratings}`;
};

// For tight spaces like the games list: "★ 4.3 (12)". Pair it with formatRatingSummary for screen readers.
export const formatShortRatingSummary = ({ averageRating, ratingCount }: RatingSummary): string | null =>
  isNil(averageRating) || ratingCount === 0 ? null : `★ ${averageRating.toFixed(AVERAGE_DECIMALS)} (${ratingCount})`;
