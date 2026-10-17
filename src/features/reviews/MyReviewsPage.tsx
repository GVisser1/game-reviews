import { isEmpty } from "lodash";
import { GameTile } from "../../shared/GameTile";
import { StarRating } from "../../shared/StarRating";
import { useReviews } from "./useReviews";

export const MyReviewsPage = (): React.JSX.Element => {
  const { reviews, isLoading, error } = useReviews();

  if (isLoading) {
    return <p>Loading your reviews…</p>;
  }
  if (error) {
    return <p className="text-red-600">Could not load reviews: {error}</p>;
  }
  if (isEmpty(reviews)) {
    return <p>You haven't reviewed any games yet.</p>;
  }

  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {reviews.map((review) => (
        <GameTile key={review.gameId} gameId={review.gameId} name={review.gameName} coverUrl={review.coverUrl}>
          <StarRating rating={review.rating} />
        </GameTile>
      ))}
    </ul>
  );
};
