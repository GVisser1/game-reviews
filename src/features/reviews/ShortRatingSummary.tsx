import { isNil } from "lodash-es";
import { Star } from "lucide-react";
import { Icon } from "../../shared/Icon";
import type { RatingSummary } from "./types";
import { formatRatingSummary, formatShortRatingSummary } from "./utils/reviewUtil";

type ShortRatingSummaryProps = {
  /** The game's average rating and number of ratings. Nothing renders while it's undefined or has no ratings. */
  summary: RatingSummary | undefined;
};

// A star and "4.3 (12)" for sighted users; screen readers hear "Community rating: 4.3/5 from 12 ratings" instead.
export const ShortRatingSummary = ({ summary }: ShortRatingSummaryProps): React.JSX.Element | null => {
  const text = isNil(summary) ? null : formatShortRatingSummary(summary);
  if (isNil(summary) || isNil(text)) {
    return null;
  }
  return (
    <span>
      <span aria-hidden className="inline-flex items-center gap-0.5">
        <Icon icon={Star} isFilled />
        {text}
      </span>
      <span className="sr-only">Community rating: {formatRatingSummary(summary)}</span>
    </span>
  );
};
