# Game Reviews

> Personal learning project, not maintained for outside use. No license: all rights reserved.

[Vite+](https://viteplus.dev) + React front end, Supabase back end, game data from IGDB.

## Scripts

| Command                                        | What it does                                                      |
| ---------------------------------------------- | ----------------------------------------------------------------- |
| `pnpm dev`                                     | Start the dev server (`vp dev`)                                   |
| `pnpm check`                                   | Format check, lint and type check in one go (`vp check`)          |
| `pnpm fmt`                                     | Format all files (`vp fmt`)                                       |
| `pnpm build`                                   | Type check and build for production                               |
| `pnpm test`                                    | Run the unit tests (`vp test`)                                    |
| `pnpm compare-search save <name>`              | Snapshot 45 searches against the deployed `igdb-games` function   |
| `pnpm compare-search compare <before> <after>` | Show which games each search gained or lost between two snapshots |

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
