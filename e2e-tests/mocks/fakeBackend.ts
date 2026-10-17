import type { Page, Route } from "@playwright/test";
import { find } from "lodash-es";
import { OTHER_PLAYER_REVIEWS, TEST_GAMES, TWITCH_DISPLAY_NAME } from "./testData";

// Stands in for Supabase (auth, the reviews table and the IGDB edge functions) inside the browser, so tests need no
// secrets, create no real users and don't depend on live IGDB results. Saved reviews live for one test.

type StoredReview = {
  game_id: number;
  game_name: string;
  cover_url: string | null;
  rating: number;
  body: string | null;
};

type FakeUser = {
  id: string;
  isAnonymous: boolean;
};

const ANONYMOUS_USER: FakeUser = { id: "e2e-anonymous-user", isAnonymous: true };
const TWITCH_USER: FakeUser = { id: "e2e-twitch-user", isAnonymous: false };
const ONE_HOUR_S = 3600;
const MS_PER_SECOND = 1000;
const HTTP_OK = 200;
const HTTP_NO_CONTENT = 204;
const HTTP_CREATED = 201;
const HTTP_FORBIDDEN = 403;
const HTTP_SERVER_ERROR = 500;

const CORS_HEADERS = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "*",
  "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
  "access-control-expose-headers": "*",
};

const toBase64Url = (value: string): string => Buffer.from(value).toString("base64url");

// supabase-js reads claims from the token, so it needs JWT structure; the signature is never checked here.
const createAccessToken = (user: FakeUser): string => {
  const expiresAt = Math.floor(Date.now() / MS_PER_SECOND) + ONE_HOUR_S;
  const payload = {
    sub: user.id,
    role: "authenticated",
    aud: "authenticated",
    is_anonymous: user.isAnonymous,
    exp: expiresAt,
  };
  return [toBase64Url(JSON.stringify({ alg: "HS256", typ: "JWT" })), toBase64Url(JSON.stringify(payload)), "e2e"].join(
    ".",
  );
};

const toSupabaseUser = (user: FakeUser): Record<string, unknown> => ({
  id: user.id,
  aud: "authenticated",
  role: "authenticated",
  is_anonymous: user.isAnonymous,
  app_metadata: { provider: user.isAnonymous ? "anonymous" : "twitch" },
  user_metadata: {},
  identities: user.isAnonymous
    ? []
    : [
        {
          id: "e2e-identity",
          user_id: user.id,
          identity_id: "e2e-identity",
          provider: "twitch",
          identity_data: { nickname: TWITCH_DISPLAY_NAME },
        },
      ],
  created_at: "2026-10-17T00:00:00Z",
});

const toSession = (user: FakeUser): Record<string, unknown> => ({
  access_token: createAccessToken(user),
  token_type: "bearer",
  expires_in: ONE_HOUR_S,
  expires_at: Math.floor(Date.now() / MS_PER_SECOND) + ONE_HOUR_S,
  refresh_token: `e2e-refresh-${user.id}`,
  user: toSupabaseUser(user),
});

const userFromRequest = (route: Route): FakeUser => {
  const authorization = route.request().headers()["authorization"] ?? "";
  const token = authorization.replace("Bearer ", "");
  const payload: unknown = token.includes(".")
    ? JSON.parse(Buffer.from(token.split(".")[1] ?? "", "base64url").toString())
    : {};
  const isSignedIn =
    typeof payload === "object" && payload !== null && "sub" in payload && payload.sub === TWITCH_USER.id;
  return isSignedIn ? TWITCH_USER : ANONYMOUS_USER;
};

const json = (route: Route, body: unknown, status = HTTP_OK): Promise<void> =>
  route.fulfill({
    status,
    headers: { ...CORS_HEADERS, "content-type": "application/json" },
    body: JSON.stringify(body),
  });

const handlePreflight = async (route: Route): Promise<boolean> => {
  if (route.request().method() !== "OPTIONS") {
    return false;
  }
  await route.fulfill({ status: HTTP_NO_CONTENT, headers: CORS_HEADERS });
  return true;
};

export type FakeBackend = {
  reviews: StoredReview[];
  anonymousSignInCount: number;
};

export const installFakeBackend = async (page: Page): Promise<FakeBackend> => {
  const backend: FakeBackend = { reviews: [], anonymousSignInCount: 0 };

  await page.route("**/auth/v1/**", async (route) => {
    if (await handlePreflight(route)) {
      return;
    }
    const url = new URL(route.request().url());

    if (url.pathname.endsWith("/signup")) {
      backend.anonymousSignInCount++;
      await json(route, toSession(ANONYMOUS_USER));
    } else if (url.pathname.endsWith("/user")) {
      await json(route, toSupabaseUser(userFromRequest(route)));
    } else if (url.pathname.endsWith("/logout")) {
      await route.fulfill({ status: HTTP_NO_CONTENT, headers: CORS_HEADERS });
    } else if (url.pathname.endsWith("/authorize")) {
      // Skips Twitch: sends the browser straight back the way Supabase does after a successful login.
      const session = toSession(TWITCH_USER);
      const hash = new URLSearchParams({
        access_token: String(session.access_token),
        refresh_token: String(session.refresh_token),
        expires_in: String(ONE_HOUR_S),
        expires_at: String(session.expires_at),
        token_type: "bearer",
      });
      // A page that redirects itself, because WebKit doesn't let Playwright fake a 302 response.
      const target = JSON.stringify(`${url.searchParams.get("redirect_to")}#${hash}`);
      await route.fulfill({ contentType: "text/html", body: `<script>location.replace(${target})</script>` });
    } else {
      await json(route, { message: `Unhandled auth request: ${url.pathname}` }, HTTP_SERVER_ERROR);
    }
  });

  await page.route("**/functions/v1/igdb-games", async (route) => {
    if (await handlePreflight(route)) {
      return;
    }
    const { search = "" }: { search?: string } = route.request().postDataJSON() ?? {};
    const games = TEST_GAMES.filter((game) => game.name.toLowerCase().includes(search.toLowerCase())).map(
      ({ id, name, coverUrl, releaseYear }) => ({ id, name, coverUrl, releaseYear }),
    );
    await json(route, { games, nextOffset: null });
  });

  await page.route("**/functions/v1/igdb-game-details", async (route) => {
    if (await handlePreflight(route)) {
      return;
    }
    const { id }: { id?: number } = route.request().postDataJSON() ?? {};
    const game = find(TEST_GAMES, { id });
    await (game ? json(route, game) : json(route, { error: `Game ${id} not found` }, HTTP_SERVER_ERROR));
  });

  // The public review list for one game: the signed-in user's written review (if any) plus other players' reviews.
  await page.route("**/rest/v1/rpc/get_game_reviews", async (route) => {
    if (await handlePreflight(route)) {
      return;
    }
    const { target_game_id: gameId }: { target_game_id?: number } = route.request().postDataJSON() ?? {};
    const user = userFromRequest(route);
    const ownReviews = user.isAnonymous
      ? []
      : backend.reviews
          .filter((review) => review.game_id === gameId && review.body !== null)
          .map((review) => ({
            display_name: TWITCH_DISPLAY_NAME,
            avatar_url: null,
            rating: review.rating,
            body: review.body,
            created_at: new Date().toISOString(),
            is_own: true,
          }));
    const otherReviews = OTHER_PLAYER_REVIEWS.filter((review) => review.game_id === gameId).map(
      ({ game_id: _gameId, ...review }) => ({ ...review, is_own: false }),
    );
    await json(route, [...ownReviews, ...otherReviews]);
  });

  await page.route("**/rest/v1/reviews**", async (route) => {
    if (await handlePreflight(route)) {
      return;
    }
    const request = route.request();
    const user = userFromRequest(route);

    if (request.method() === "GET") {
      await json(route, user.isAnonymous ? [] : backend.reviews);
      return;
    }
    // Mirrors the database rule: anonymous users can't write reviews.
    if (user.isAnonymous) {
      await json(
        route,
        { code: "42501", message: 'new row violates row-level security policy for table "reviews"' },
        HTTP_FORBIDDEN,
      );
      return;
    }
    if (request.method() === "POST") {
      const review: StoredReview = request.postDataJSON();
      backend.reviews = [review, ...backend.reviews.filter((stored) => stored.game_id !== review.game_id)];
      await route.fulfill({ status: HTTP_CREATED, headers: CORS_HEADERS });
      return;
    }
    if (request.method() === "DELETE") {
      const gameId = Number(new URL(request.url()).searchParams.get("game_id")?.replace("eq.", ""));
      backend.reviews = backend.reviews.filter((stored) => stored.game_id !== gameId);
      await route.fulfill({ status: HTTP_NO_CONTENT, headers: CORS_HEADERS });
      return;
    }
    await json(route, { message: `Unhandled reviews request: ${request.method()}` }, HTTP_SERVER_ERROR);
  });

  return backend;
};
