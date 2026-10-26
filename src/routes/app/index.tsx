import { createFileRoute } from "@tanstack/react-router";
import { GamesPage } from "../../features/games/GamesPage";
import { validateGamesSearch } from "../../features/games/routeParams";
import { pageHead } from "../../lib/pageHead";

export const Route = createFileRoute("/app/")({
  head: () => pageHead("Games"),
  validateSearch: validateGamesSearch,
  component: GamesPage,
});
