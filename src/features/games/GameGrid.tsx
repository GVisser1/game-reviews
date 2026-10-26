import { isEmpty, isNil } from "lodash-es";
import { useRef } from "react";
import { useGridLayout } from "../../shared/useGridLayout";
import { useRatingSummaries } from "../reviews/useRatingSummaries";
import type { GamesSort } from "./gamesSort";
import { useGames } from "./useGames";
import { VirtualGameRows } from "./VirtualGameRows";

const MIN_TILE_WIDTH = 160;

type GameGridProps = {
  search: string;
  sort: GamesSort;
};

export const GameGrid = ({ search, sort }: GameGridProps): React.JSX.Element => {
  const { games, gameIdsByPage, isLoading, hasMore, error, loadMore } = useGames(search, sort);
  const ratingSummaries = useRatingSummaries(gameIdsByPage);
  const gridRef = useRef<HTMLDivElement>(null);
  const layout = useGridLayout(gridRef, MIN_TILE_WIDTH);

  return (
    <>
      {error && <p className="text-red-600">Could not load games: {error}</p>}
      {!isLoading && isEmpty(games) && !error && <p>No games found.</p>}
      <div ref={gridRef}>
        {!isNil(layout) && (
          <VirtualGameRows
            key={layout.columnCount}
            listKey={`${search}|${sort}`}
            games={games}
            ratingSummaries={ratingSummaries}
            columnCount={layout.columnCount}
            offsetTop={layout.offsetTop}
            hasMore={hasMore}
            loadMore={loadMore}
          />
        )}
      </div>
      {isLoading && <p>Loading games…</p>}
    </>
  );
};
