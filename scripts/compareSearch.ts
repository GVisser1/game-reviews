import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
// Runs a fixed set of searches straight against IGDB with the igdb-games function's own query code, so you can see
// what a filter change in supabase/functions/igdb-games/games.ts does before deploying it:
//   pnpm compare-search save before
//   (change the filters in games.ts)
//   pnpm compare-search save after
//   pnpm compare-search compare before after
// Saving needs TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET, which the script reads from supabase/functions/.env.
import { buildQuery, toGamesPage } from "../supabase/functions/igdb-games/games.ts";
import type { GamesPage, IgdbGame } from "../supabase/functions/igdb-games/games.ts";

const SEARCHES = [
  "gta",
  "elder scr",
  "witcher",
  "zelda",
  "mario",
  "fable",
  "wolverine",
  "judas",
  "subnautica",
  "slay the spire",
  "metroid",
  "kingdom hearts",
  "hades",
  "persona",
  "final fantasy",
  "resident evil",
  "pokemon",
  "star wars",
  "batman",
  "half-life",
  "portal",
  "minecraft",
  "sonic",
  "doom",
  "hollow",
  "death stranding",
  "intergalactic",
  "ghost of",
  "onimusha",
  "marathon",
  "crimson desert",
  "phantom blade",
  "gears of war",
  "halo",
  "perfect dark",
  "state of decay",
  "clockwork revolution",
  "witchbrook",
  "hytale",
  "deltarune",
  "borderlands",
  "mass effect",
  "kingdom come",
  "stalker",
  "bioshock",
];
const MAX_RESULTS_PER_SEARCH = 100;
const SNAPSHOT_DIR = join(import.meta.dirname, "search-snapshots");
const TWITCH_TOKEN_URL = "https://id.twitch.tv/oauth2/token";
const IGDB_GAMES_URL = "https://api.igdb.com/v4/games";
// IGDB allows 4 requests per second.
const REQUEST_INTERVAL_MS = 250;

type Snapshot = Record<string, string[]>;

type TwitchTokenResponse = {
  access_token: string;
};

type IgdbCredentials = {
  clientId: string;
  accessToken: string;
};

const readJson = <T>(path: string, fallback: T): T =>
  existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;

const getIgdbCredentials = async (): Promise<IgdbCredentials> => {
  const clientId = process.env.TWITCH_CLIENT_ID;
  const clientSecret = process.env.TWITCH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Set TWITCH_CLIENT_ID and TWITCH_CLIENT_SECRET in supabase/functions/.env");
  }
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });
  const response = await fetch(`${TWITCH_TOKEN_URL}?${params.toString()}`, { method: "POST" });
  if (!response.ok) {
    throw new Error(`Twitch token request failed: ${response.status}`);
  }
  const { access_token: accessToken } = (await response.json()) as TwitchTokenResponse;
  return { clientId, accessToken };
};

const fetchGamesPage = async (credentials: IgdbCredentials, search: string, offset: number): Promise<GamesPage> => {
  await sleep(REQUEST_INTERVAL_MS);
  const response = await fetch(IGDB_GAMES_URL, {
    method: "POST",
    headers: { "Client-ID": credentials.clientId, Authorization: `Bearer ${credentials.accessToken}` },
    body: buildQuery(search, offset),
  });
  if (!response.ok) {
    throw new Error(`Search "${search}" failed: IGDB answered ${response.status}`);
  }
  const igdbGames = (await response.json()) as IgdbGame[];
  return toGamesPage(igdbGames, offset);
};

const fetchSearchResults = async (credentials: IgdbCredentials, search: string): Promise<string[]> => {
  const names: string[] = [];
  let offset: number | null = 0;
  while (offset !== null && names.length < MAX_RESULTS_PER_SEARCH) {
    const page = await fetchGamesPage(credentials, search, offset);
    names.push(...page.games.map((game) => game.name));
    offset = page.nextOffset;
  }
  return names;
};

const saveSnapshot = async (name: string): Promise<void> => {
  const credentials = await getIgdbCredentials();
  const snapshot: Snapshot = {};
  for (const search of SEARCHES) {
    snapshot[search] = await fetchSearchResults(credentials, search);
    process.stdout.write(".");
  }
  writeFileSync(join(SNAPSHOT_DIR, `${name}.json`), JSON.stringify(snapshot, null, 2));
  const total = Object.values(snapshot).flat().length;
  console.log(`\nSaved ${total} results for ${SEARCHES.length} searches to search-snapshots/${name}.json`);
};

const compareSnapshots = (beforeName: string, afterName: string): void => {
  const load = (name: string): Snapshot => readJson<Snapshot>(join(SNAPSHOT_DIR, `${name}.json`), {});
  const before = load(beforeName);
  const after = load(afterName);
  let changedSearchCount = 0;
  for (const search of Object.keys({ ...before, ...after })) {
    const beforeNames = before[search] ?? [];
    const afterNames = after[search] ?? [];
    const removed = beforeNames.filter((name) => !afterNames.includes(name));
    const added = afterNames.filter((name) => !beforeNames.includes(name));
    if (removed.length === 0 && added.length === 0) {
      continue;
    }
    changedSearchCount++;
    console.log(`\n"${search}": ${beforeNames.length} → ${afterNames.length}`);
    removed.forEach((name) => console.log(`  - ${name}`));
    added.forEach((name) => console.log(`  + ${name}`));
  }
  console.log(changedSearchCount === 0 ? "No differences." : `\n${changedSearchCount} searches changed.`);
};

mkdirSync(SNAPSHOT_DIR, { recursive: true });
const [command, firstName, secondName] = process.argv.slice(2);
if (command === "save" && firstName) {
  await saveSnapshot(firstName);
} else if (command === "compare" && firstName && secondName) {
  compareSnapshots(firstName, secondName);
} else {
  console.log("Usage:\n  scripts/compareSearch.ts save <name>\n  scripts/compareSearch.ts compare <before> <after>");
  process.exitCode = 1;
}
