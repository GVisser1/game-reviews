# Game Reviews

> Personal learning project, not maintained for outside use. No license: all rights reserved.

[Vite+](https://viteplus.dev) + React with [TanStack Start](https://tanstack.com/start), Supabase back end, game data from IGDB.

## Routes

| Path                 | Page                    | Rendering                                  |
| -------------------- | ----------------------- | ------------------------------------------ |
| `/`                  | Landing page            | Prerendered to static HTML at build time   |
| `/login`             | Sign in                 | In the browser                             |
| `/app`               | Games list and search   | In the browser, signs in anonymously first |
| `/app/games/:gameId` | Game details and rating | In the browser                             |
| `/app/my-reviews`    | Your reviews            | In the browser                             |

Routes are files in `src/routes/`; `src/routeTree.gen.ts` is generated from them by the dev server and build.

### Hosting

The build writes static files to `dist/client`: `index.html` (the landing page) and `_shell.html`, which renders every
`/app` page in the browser. The host must serve `_shell.html` for `/app` and `/app/*`, e.g. a Netlify `_redirects` rule
`/app/* /_shell.html 200`.

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
| `pnpm compare-search save <name>`              | Snapshot 45 searches against the deployed `igdb-games` function     |
| `pnpm compare-search compare <before> <after>` | Show which games each search gained or lost between two snapshots   |

### End-to-end tests

The tests in `e2e-tests/` run against `pnpm dev` locally (reusing a dev server that's already running) and against the
production build (`pnpm preview`) in CI. `e2e-tests/mocks/fakeBackend.ts` stands in for Supabase and IGDB inside the
browser, including a fake Twitch sign-in, so the tests need no secrets, create no real users and don't depend on live
IGDB results. That also means they don't catch a broken real backend; use `pnpm compare-search` for the search side.

### Tuning search

The search rules live in `supabase/functions/igdb-games/games.ts` and are covered by `games.test.ts`.
Unit tests only check the query we send; to see what IGDB actually returns, snapshot before and after a change:

```bash
pnpm compare-search save before
# edit games.ts, then: pnpm exec supabase functions deploy igdb-games
pnpm compare-search save after
pnpm compare-search compare before after
```

Lint and format settings live in `vite.config.ts` under `lint` and `fmt`.
