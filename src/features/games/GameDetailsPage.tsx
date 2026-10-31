import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { isEmpty, isNil } from "lodash-es";
import type { ReactNode } from "react";
import { BackLink } from "../../shared/BackLink";
import { Heading } from "../../shared/Heading";
import { toErrorMessage } from "../../utils/errorUtil";
import { SignInPrompt } from "../auth/SignInPrompt";
import { useAuthUser } from "../auth/useAuthUser";
import { CommunityRating } from "../reviews/CommunityRating";
import { GameReviews } from "../reviews/GameReviews";
import { useReviews } from "../reviews/useReviews";
import { YourReview } from "../reviews/YourReview";
import { gameDetailsQueryOptions } from "./gameDetailsQuery";

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
    <p className="text-danger">Could not load game: {toErrorMessage(error)}</p>
  </GamePageLayout>
);

export const GameDetailsPage = (): React.JSX.Element => {
  const { gameId } = useParams({ from: "/app/games/$gameId" });
  const { data: game } = useSuspenseQuery(gameDetailsQueryOptions(gameId));
  const { reviews, isLoading: isLoadingReviews, saveReview, removeReview, error: reviewError } = useReviews();
  const review = reviews.find((currentReview) => currentReview.gameId === gameId);
  const user = useAuthUser();

  return (
    <GamePageLayout>
      <article className="flex flex-col gap-6 sm:flex-row">
        {game.coverUrl && <img src={game.coverUrl} alt={game.name} className="w-48 self-start rounded" />}
        <div className="flex max-w-2xl flex-col gap-3">
          <Heading as="h1" className="text-title">
            {game.name} {game.releaseYear && <span className="text-muted">({game.releaseYear})</span>}
          </Heading>
          {user?.is_anonymous && <SignInPrompt message="Sign in to rate this game." />}
          {user && !user.is_anonymous && !isLoadingReviews && (
            <YourReview
              key={gameId}
              game={{ id: gameId, name: game.name, coverUrl: game.coverUrl, releaseYear: game.releaseYear }}
              review={review}
              error={reviewError}
              onSave={saveReview}
              onRemove={removeReview}
            />
          )}
          <CommunityRating gameId={gameId} />
          {!isNil(game.igdbRating) && <p>IGDB rating: {game.igdbRating}/100</p>}
          {!isEmpty(game.genres) && <p>Genres: {game.genres.join(", ")}</p>}
          {!isEmpty(game.platforms) && <p>Platforms: {game.platforms.join(", ")}</p>}
          {game.summary && <p className="whitespace-pre-line">{game.summary}</p>}
        </div>
      </article>
      <GameReviews gameId={gameId} />
    </GamePageLayout>
  );
};
