import { isNil } from "lodash-es";
import { formatRatingSummary, formatShortRatingSummary } from "./formatRatingSummary";
import type { RatingSummary } from "./types";

type ShortRatingSummaryProps = {
  summary: RatingSummary | undefined;
};

// "★ 4.3 (12)" for sighted users; screen readers hear "Community rating: 4.3/5 from 12 ratings" instead.
export const ShortRatingSummary = ({ summary }: ShortRatingSummaryProps): React.JSX.Element | null => {
  const text = isNil(summary) ? null : formatShortRatingSummary(summary);
  if (isNil(summary) || isNil(text)) {
    return null;
  }
  return (
    <span>
      <span aria-hidden>{text}</span>
      <span className="sr-only">Community rating: {formatRatingSummary(summary)}</span>
    </span>
  );
};
