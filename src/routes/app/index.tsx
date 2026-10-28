import { createFileRoute } from "@tanstack/react-router";
import { GamesPage } from "../../features/games/GamesPage";
import { validateGamesSearch } from "../../features/games/utils/gameUtil";
import { pageHead } from "../../utils/pageHeadUtil";

export const Route = createFileRoute("/app/")({
  head: () => pageHead("Games"),
  validateSearch: validateGamesSearch,
  component: GamesPage,
});
