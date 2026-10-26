import { useQuery } from "@tanstack/react-query";
import { isEmpty } from "lodash-es";
import { GameTile } from "../../shared/GameTile";
import { formatRatingSummary } from "./formatRatingSummary";
import { MIN_TOP_RATED_RATINGS, topRatedGamesQueryOptions } from "./topRatedGamesQuery";

const TopRatedGames = (): React.JSX.Element => {
  const { data: games, isPending, error } = useQuery(topRatedGamesQueryOptions);

  if (isPending) {
    return <p>Loading top rated games…</p>;
  }
  if (error) {
    return <p className="text-red-600">Could not load top rated games: {error.message}</p>;
  }
  if (isEmpty(games)) {
    return <p>No games have enough ratings yet.</p>;
  }

  return (
    <ol className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
      {games.map((game) => (
        <GameTile key={game.gameId} gameId={game.gameId} name={game.gameName} coverUrl={game.coverUrl}>
          <span className="text-sm text-gray-600">{formatRatingSummary(game.ratingSummary)}</span>
        </GameTile>
      ))}
    </ol>
  );
};

export const TopRatedPage = (): React.JSX.Element => (
  <div className="flex flex-col gap-4">
    <div>
      <h1 className="text-2xl font-bold">Top rated</h1>
      <p className="text-sm text-gray-600">
        The best-rated games by players here, with at least {MIN_TOP_RATED_RATINGS} ratings each.
      </p>
    </div>
    <TopRatedGames />
  </div>
);
