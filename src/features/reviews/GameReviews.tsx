import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { isEmpty } from "lodash-es";
import { Heading } from "../../shared/Heading";
import { StarRating } from "../../shared/StarRating";
import { toErrorMessage } from "../../utils/errorUtil";
import { gameReviewsQueryOptions } from "./gameReviewsQuery";

const DATE_FORMAT = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

type GameReviewsProps = {
  gameId: number;
};

export const GameReviews = ({ gameId }: GameReviewsProps): React.JSX.Element => {
  const { data: reviews, isPending, error } = useQuery(gameReviewsQueryOptions(gameId));

  return (
    <section className="flex max-w-2xl flex-col gap-4">
      <Heading as="h2" className="text-xl font-bold">
        Reviews
      </Heading>
      {isPending && <p>Loading reviews…</p>}
      {error && <p className="text-red-600">Could not load reviews: {toErrorMessage(error)}</p>}
      {reviews && isEmpty(reviews) && <p className="text-gray-600">No written reviews yet.</p>}
      {reviews && !isEmpty(reviews) && (
        <ul className="flex flex-col gap-4">
          {reviews.map((review) => (
            <li key={review.username} className="flex flex-col gap-1 border-b pb-4">
              <div className="flex items-center gap-2">
                {review.avatarUrl && <img src={review.avatarUrl} alt="" className="size-6 rounded-full" />}
                <Link
                  to="/app/users/$username"
                  params={{ username: review.username }}
                  className="font-medium hover:underline"
                >
                  {review.displayName}
                  {review.isOwn && " (you)"}
                </Link>
                <time dateTime={review.createdAt} className="text-sm text-gray-600">
                  {DATE_FORMAT.format(new Date(review.createdAt))}
                </time>
              </div>
              <StarRating rating={review.rating} />
              <p className="whitespace-pre-line">{review.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
