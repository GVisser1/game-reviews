import { useWindowVirtualizer } from "@tanstack/react-virtual";
import type { VirtualItem } from "@tanstack/react-virtual";
import { chunk, isNil, last } from "lodash-es";
import { useEffect } from "react";
import { GameTile } from "../../shared/GameTile";
import { ShortRatingSummary } from "../reviews/ShortRatingSummary";
import type { RatingSummary } from "../reviews/types";
import type { Game } from "./types";

const ESTIMATED_ROW_HEIGHT = 320;
const OVERSCAN_ROW_COUNT = 3;

// Row heights measured on a previous visit. Reusing them makes the list exactly as tall as before,
// so the router's scroll restoration lands on the same row instead of drifting by estimated heights.
const measuredRowsByList = new Map<string, VirtualItem[]>();

type VirtualGameRowsProps = {
  // Identifies the list (search and sort), so each one remembers its own row heights.
  listKey: string;
  games: Game[];
  ratingSummaries: Map<number, RatingSummary>;
  columnCount: number;
  offsetTop: number;
  hasMore: boolean;
  loadMore: () => void;
};

export const VirtualGameRows = ({
  listKey: baseListKey,
  games,
  ratingSummaries,
  columnCount,
  offsetTop,
  hasMore,
  loadMore,
}: VirtualGameRowsProps): React.JSX.Element => {
  const listKey = `${baseListKey}|${columnCount}`;
  const rows = chunk(games, columnCount);

  // TanStack Virtual returns a new virtualizer state on every scroll, so the React Compiler
  // must skip this component; nothing else needs to change.
  // oxlint-disable-next-line react/incompatible-library
  const virtualizer = useWindowVirtualizer({
    count: rows.length,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    overscan: OVERSCAN_ROW_COUNT,
    scrollMargin: offsetTop,
    initialMeasurementsCache: measuredRowsByList.get(listKey),
  });
  const virtualRows = virtualizer.getVirtualItems();
  const lastVisibleRowIndex = last(virtualRows)?.index;

  useEffect(
    () => () => {
      measuredRowsByList.set(listKey, virtualizer.measurementsCache);
    },
    [listKey, virtualizer],
  );

  useEffect(() => {
    const isNearEnd = !isNil(lastVisibleRowIndex) && lastVisibleRowIndex >= rows.length - 1;
    if (isNearEnd && hasMore) {
      loadMore();
    }
  }, [lastVisibleRowIndex, rows.length, hasMore, loadMore]);

  return (
    <div className="relative w-full" style={{ height: virtualizer.getTotalSize() }}>
      {virtualRows.map((virtualRow) => (
        <ul
          key={virtualRow.key}
          data-index={virtualRow.index}
          ref={virtualizer.measureElement}
          className="absolute top-0 left-0 grid w-full gap-4 pb-4"
          style={{
            gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
            transform: `translateY(${virtualRow.start - offsetTop}px)`,
          }}
        >
          {rows[virtualRow.index].map((game) => (
            <GameTile key={game.id} gameId={game.id} name={game.name} coverUrl={game.coverUrl}>
              {/* One line for both, so a rating arriving later doesn't change the row's height. */}
              <span className="flex gap-2 text-xs text-muted">
                {game.releaseYear}
                <ShortRatingSummary summary={ratingSummaries.get(game.id)} />
              </span>
            </GameTile>
          ))}
        </ul>
      ))}
    </div>
  );
};
