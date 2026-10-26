import { isNil, truncate } from "lodash-es";
import { SITE_DESCRIPTION, toPageTitle } from "../../src/lib/pageHead";

const MAX_DESCRIPTION_LENGTH = 200;
const REQUEST_TIMEOUT_MS = 3000;

// Crawlers that fetch a page to show a link preview (Discord, Slack, WhatsApp, iMessage, X, etc.) don't run
// JavaScript. Most of them call themselves "...bot"; the rest are listed by name.
const LINK_PREVIEW_CRAWLER = /bot|facebookexternalhit|embedly|whatsapp|skypeuripreview|vkshare/i;

export type GamePreview = {
  name: string;
  summary: string | null;
  coverUrl: string | null;
};

export type GamePreviewTags = {
  title: string;
  description: string;
  imageUrl: string | null;
};

export const isLinkPreviewCrawler = (userAgent: string | null): boolean =>
  !isNil(userAgent) && LINK_PREVIEW_CRAWLER.test(userAgent);

export const parseGameId = (value: string | string[]): number | null => {
  const gameId = Number(value);
  return Number.isInteger(gameId) && gameId > 0 ? gameId : null;
};

export const toGamePreviewTags = (game: GamePreview): GamePreviewTags => ({
  title: toPageTitle(game.name),
  description: isNil(game.summary)
    ? SITE_DESCRIPTION
    : truncate(game.summary, { length: MAX_DESCRIPTION_LENGTH, separator: /\s/ }),
  imageUrl: game.coverUrl,
});

export const fetchGamePreview = async (supabaseUrl: string, gameId: number): Promise<GamePreview> => {
  const response = await fetch(`${supabaseUrl}/functions/v1/igdb-game-details`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ id: gameId }),
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`Game ${gameId} details failed: ${response.status}`);
  }
  return response.json();
};
