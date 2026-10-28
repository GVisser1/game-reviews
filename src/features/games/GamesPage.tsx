import { useNavigate, useSearch } from "@tanstack/react-router";
import { useDebouncedValue } from "../../shared/useDebouncedValue";
import { GameGrid } from "./GameGrid";
import { DEFAULT_GAMES_SORT, GAMES_SORT_OPTIONS, isGamesSort } from "./utils/gameUtil";

const SEARCH_DEBOUNCE_MS = 300;

export const GamesPage = (): React.JSX.Element => {
  const { q: searchInput = "", sort = DEFAULT_GAMES_SORT } = useSearch({ from: "/app/" });
  const navigate = useNavigate({ from: "/app/" });
  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        <input
          type="search"
          value={searchInput}
          // Replace instead of push so typing doesn't add a history entry per keystroke.
          onChange={(event) =>
            void navigate({
              search: (previous) => ({ ...previous, q: event.target.value || undefined }),
              replace: true,
            })
          }
          placeholder="Search games…"
          aria-label="Search games"
          className="w-full max-w-md rounded border px-3 py-2"
        />
        <select
          value={sort}
          onChange={(event) => {
            const nextSort = isGamesSort(event.target.value) ? event.target.value : DEFAULT_GAMES_SORT;
            void navigate({
              search: (previous) => ({ ...previous, sort: nextSort === DEFAULT_GAMES_SORT ? undefined : nextSort }),
              replace: true,
            });
          }}
          aria-label="Sort games"
          className="rounded border px-3 py-2"
        >
          {GAMES_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <GameGrid key={`${search}|${sort}`} search={search} sort={sort} />
    </div>
  );
};
