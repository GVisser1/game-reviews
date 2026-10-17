import { isNil } from "lodash";
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
