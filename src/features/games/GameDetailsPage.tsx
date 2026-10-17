import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { isEmpty, isNil } from "lodash";
import type { ReactNode } from "react";
import { toErrorMessage } from "../../lib/toErrorMessage";
import { BackLink } from "../../shared/BackLink";
import { StarRating } from "../../shared/StarRating";
import { RemoveRatingButton } from "../reviews/RemoveRatingButton";
import { useReviews } from "../reviews/useReviews";
import { gameDetailsQueryOptions } from "./gameDetailsQuery";

const NO_RATING = 0;

type GamePageLayoutProps = {
  children: ReactNode;
};

const GamePageLayout = ({ children }: GamePageLayoutProps): React.JSX.Element => (
  <div className="flex flex-col gap-4">
    <BackLink>← All games</BackLink>
    {children}
  </div>
);

export const GameDetailsPending = (): React.JSX.Element => (
  <GamePageLayout>
    <p>Loading game…</p>
  </GamePageLayout>
);

export const GameDetailsError = ({ error }: ErrorComponentProps): React.JSX.Element => (
  <GamePageLayout>
    <p className="text-red-600">Could not load game: {toErrorMessage(error)}</p>
  </GamePageLayout>
);

export const GameDetailsPage = (): React.JSX.Element => {
  const { gameId } = useParams({ from: "/games/$gameId" });
  const { data: game } = useSuspenseQuery(gameDetailsQueryOptions(gameId));
  const { reviews, saveReview, removeReview, error: reviewError } = useReviews();
  const review = reviews.find((currentReview) => currentReview.gameId === gameId);

  return (
    <GamePageLayout>
      <article className="flex flex-col gap-6 sm:flex-row">
        {game.coverUrl && <img src={game.coverUrl} alt={game.name} className="w-48 self-start rounded" />}
        <div className="flex max-w-2xl flex-col gap-3">
          <h1 className="text-2xl font-bold">
            {game.name} {game.releaseYear && <span className="text-gray-500">({game.releaseYear})</span>}
          </h1>
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Your rating</span>
            <StarRating
              rating={review?.rating ?? NO_RATING}
              onChange={(rating) => saveReview({ gameId, gameName: game.name, coverUrl: game.coverUrl, rating })}
            />
            {!isNil(review) && <RemoveRatingButton onClick={() => removeReview(gameId)} />}
            {reviewError && <p className="text-red-600">Could not update review: {reviewError}</p>}
          </div>
          {!isNil(game.igdbRating) && <p>IGDB rating: {game.igdbRating}/100</p>}
          {!isEmpty(game.genres) && <p>Genres: {game.genres.join(", ")}</p>}
          {!isEmpty(game.platforms) && <p>Platforms: {game.platforms.join(", ")}</p>}
          {game.summary && <p className="whitespace-pre-line">{game.summary}</p>}
        </div>
      </article>
    </GamePageLayout>
  );
};
