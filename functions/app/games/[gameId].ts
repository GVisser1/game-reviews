import { escape, isNil } from "lodash-es";
import {
  fetchGamePreview,
  type GamePreviewTags,
  isLinkPreviewCrawler,
  parseGameId,
  toGamePreviewTags,
} from "../../_lib/gamePreview";

type Env = {
  ASSETS: Fetcher;
  // Set in the Cloudflare Pages project settings, like the Supabase URL the app is built with.
  SUPABASE_URL?: string;
};

const SHELL_PATH = "/_shell";

const withGameTags = (shell: Response, tags: GamePreviewTags, pageUrl: string): Response => {
  const extraTags = [
    `<meta property="og:url" content="${escape(pageUrl)}" />`,
    isNil(tags.imageUrl) ? "" : `<meta property="og:image" content="${escape(tags.imageUrl)}" />`,
  ].join("");

  return new HTMLRewriter()
    .on("title", { element: (element) => void element.setInnerContent(tags.title) })
    .on('meta[property="og:title"]', { element: (element) => void element.setAttribute("content", tags.title) })
    .on('meta[name="description"], meta[property="og:description"]', {
      element: (element) => void element.setAttribute("content", tags.description),
    })
    .on("head", { element: (element) => void element.append(extraTags, { html: true }) })
    .transform(shell);
};

// Game pages render in the browser, so link-preview crawlers only see the app shell with the site's default tags.
// For them, this fills in the game's name, summary and cover. Everyone else gets the shell as-is, like `_redirects`
// serves it for the other /app pages, without waiting for IGDB.
export const onRequestGet: PagesFunction<Env, "gameId"> = async ({ request, env, params }) => {
  const shell = await env.ASSETS.fetch(new URL(SHELL_PATH, request.url));
  const gameId = parseGameId(params.gameId);
  if (!isLinkPreviewCrawler(request.headers.get("user-agent")) || isNil(gameId) || isNil(env.SUPABASE_URL)) {
    return shell;
  }

  try {
    const game = await fetchGamePreview(env.SUPABASE_URL, gameId);
    return withGameTags(shell, toGamePreviewTags(game), request.url);
  } catch {
    // A missing game or a slow IGDB still gets a preview, just the site's default one.
    return shell;
  }
};
