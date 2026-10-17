import { useNavigate, useSearch } from "@tanstack/react-router";
import { useDebouncedValue } from "../../shared/useDebouncedValue";
import { GameGrid } from "./GameGrid";

const SEARCH_DEBOUNCE_MS = 300;

export const GamesPage = (): React.JSX.Element => {
  const { q: searchInput = "" } = useSearch({ from: "/" });
  const navigate = useNavigate({ from: "/" });
  const search = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

  return (
    <div className="flex flex-col gap-4">
      <input
        type="search"
        value={searchInput}
        // Replace instead of push so typing doesn't add a history entry per keystroke.
        onChange={(event) => void navigate({ search: { q: event.target.value || undefined }, replace: true })}
        placeholder="Search games…"
        className="w-full max-w-md rounded border px-3 py-2"
      />
      <GameGrid key={search} search={search} />
    </div>
  );
};
