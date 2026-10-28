import { useQuery } from "@tanstack/react-query";
import { ratingSummaryQueryOptions } from "./ratingSummaryQuery";
import { formatRatingSummary } from "./utils/reviewUtil";

type CommunityRatingProps = {
  gameId: number;
};

export const CommunityRating = ({ gameId }: CommunityRatingProps): React.JSX.Element | null => {
  const { data: summary, error } = useQuery(ratingSummaryQueryOptions(gameId));

  // The rest of the page is still useful without it, so a failure just hides the line.
  if (error || !summary) {
    return null;
  }
  return <p>Community rating: {formatRatingSummary(summary)}</p>;
};
