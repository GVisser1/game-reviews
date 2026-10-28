# Game Reviews

> Personal learning project, not maintained for outside use. No license: all rights reserved.

[Vite+](https://viteplus.dev) + React with [TanStack Start](https://tanstack.com/start), Supabase back end, game data from IGDB.

## Routes

| Path                 | Page                            | Rendering                                  |
| -------------------- | ------------------------------- | ------------------------------------------ |
| `/`                  | Landing page                    | Prerendered to static HTML at build time   |
| `/privacy`           | Privacy page                    | Prerendered to static HTML at build time   |
| `/login`             | Sign in                         | In the browser                             |
| `/app`               | Games list and search           | In the browser, signs in anonymously first |
| `/app/games/:gameId` | Game details and rating         | In the browser                             |
| `/app/top-rated`     | Redirects to `/app?sort=rating` | In the browser                             |
| `/app/users/:name`   | A player's profile and reviews  | In the browser                             |
| `/app/my-reviews`    | Redirects to your profile       | In the browser                             |
| `/app/account`       | Account and account deletion    | In the browser                             |

Routes are files in `src/routes/`; `src/routeTree.gen.ts` is generated from them by the dev server and build.

### Hosting

Production runs on Cloudflare Pages at https://game-reviews-ccu.pages.dev. Deploys are manual: run the **Deploy to PROD**
workflow from the Actions tab and pick the branch to deploy. It checks, tests and builds with `pnpm build:pages`, then uploads
`dist/client` with `wrangler`.

The build writes `index.html` (landing) and `privacy.html` as static HTML, plus `_shell.html`, which renders every
other page in the browser. `public/_redirects` serves the shell for `/app`, `/app/*` and `/login`, and `404.html` (a
copy of the shell) shows the app's not-found page. Try a build locally with
`pnpm build:pages && pnpm exec wrangler pages dev dist/client --binding SUPABASE_URL=<Supabase project URL>`.

Game pages go through a Cloudflare Pages Function, `functions/app/games/[gameId].ts`, which `wrangler` deploys along
with `dist/client`. Link-preview crawlers (Discord, Slack, WhatsApp, etc.) don't run JavaScript, so for them it fills
the shell's title, description and image with the game's details from the `igdb-game-details` Supabase function.
That function doesn't require a session (`verify_jwt = false` in `supabase/config.toml`). Browsers get the shell
unchanged.

The workflow reads these from the `production` environment in the repository settings:

| Name                            | Type     | Value                                              |
| ------------------------------- | -------- | -------------------------------------------------- |
| `VITE_SUPABASE_URL`             | Variable | Supabase project URL                               |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Variable | Supabase publishable key                           |
| `VITE_TURNSTILE_SITE_KEY`       | Variable | Cloudflare Turnstile site key                      |
| `CLOUDFLARE_ACCOUNT_ID`         | Secret   | Cloudflare account ID                              |
| `CLOUDFLARE_API_TOKEN`          | Secret   | Cloudflare API token with "Cloudflare Pages: Edit" |

The Pages Function reads one setting from the Cloudflare Pages project itself (**Settings → Variables and Secrets**,
Production): `SUPABASE_URL`, the Supabase project URL. Without it, game links get the site's default preview.

## Scripts

| Command                                        | What it does                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------- |
| `pnpm dev`                                     | Start the dev server (`vp dev`)                                     |
| `pnpm check`                                   | Format check, lint and type check in one go (`vp check`)            |
| `pnpm fmt`                                     | Format all files (`vp fmt`)                                         |
| `pnpm build`                                   | Type check and build for production                                 |
| `pnpm test`                                    | Run the unit tests (`vp test`)                                      |
| `pnpm test:e2e`                                | Run the Playwright end-to-end tests in Chromium, Firefox and WebKit |
| `pnpm test:e2e-ui`                             | Open Playwright's UI to run and debug E2E tests                     |
| `pnpm test:e2e-report`                         | Open the report of the last E2E run                                 |
| `pnpm compare-search save <name>`              | Snapshot 45 searches straight from IGDB with the local search rules |
| `pnpm compare-search compare <before> <after>` | Show which games each search gained or lost between two snapshots   |

### End-to-end tests

The tests in `e2e-tests/` run against `pnpm dev` locally (reusing a dev server that's already running) and against the
production build (`pnpm preview`) in CI. `e2e-tests/mocks/fakeBackend.ts` stands in for Supabase and IGDB inside the
browser, including a fake Twitch sign-in, so the tests need no secrets, create no real users and don't depend on live
IGDB results. That also means they don't catch a broken real backend; use `pnpm compare-search` for the search side.

### Tuning search

The search rules live in `supabase/functions/igdb-games/games.ts` and are covered by `games.test.ts`.
Unit tests only check the query we send; to see what IGDB actually returns, snapshot before and after a change. The
script runs the local `games.ts` against IGDB, so there's nothing to deploy in between. It needs `TWITCH_CLIENT_ID` and
`TWITCH_CLIENT_SECRET` in `supabase/functions/.env`, the same Twitch app the edge functions use:

```bash
pnpm compare-search save before
# edit games.ts
pnpm compare-search save after
pnpm compare-search compare before after
```

Lint and format settings live in `vite.config.ts` under `lint` and `fmt`.
