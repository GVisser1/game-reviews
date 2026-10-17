import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
// Runs a fixed set of searches against the deployed igdb-games function, so you can see what a filter change does.
//   node --env-file=.env.local scripts/compareSearch.ts save before
//   (change the filters in supabase/functions/igdb-games/games.ts and deploy)
//   node --env-file=.env.local scripts/compareSearch.ts save after
//   node --env-file=.env.local scripts/compareSearch.ts compare before after
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient, SupportedStorage } from "@supabase/supabase-js";

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
// Reusing the anonymous session avoids creating a new Supabase user on every run.
const SESSION_FILE = join(SNAPSHOT_DIR, ".session.json");

type GamesPage = {
  games: { name: string }[];
  nextOffset: number | null;
};

type Snapshot = Record<string, string[]>;

const readJson = <T>(path: string, fallback: T): T =>
  existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : fallback;

const fileStorage: SupportedStorage = {
  getItem: (key) => readJson<Record<string, string>>(SESSION_FILE, {})[key] ?? null,
  setItem: (key, value) => {
    writeFileSync(SESSION_FILE, JSON.stringify({ ...readJson(SESSION_FILE, {}), [key]: value }));
  },
  removeItem: (key) => {
    const { [key]: _removed, ...rest } = readJson<Record<string, string>>(SESSION_FILE, {});
    writeFileSync(SESSION_FILE, JSON.stringify(rest));
  },
};

const createSupabase = async (): Promise<SupabaseClient> => {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error("Run with --env-file=.env.local so VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set");
  }
  const supabase = createClient(url, key, { auth: { storage: fileStorage, persistSession: true } });
  const { data } = await supabase.auth.getSession();
  if (!data.session) {
    const { error } = await supabase.auth.signInAnonymously();
    if (error) {
      throw error;
    }
  }
  return supabase;
};

const fetchGamesPage = async (supabase: SupabaseClient, search: string, offset: number): Promise<GamesPage> => {
  const { data, error } = await supabase.functions.invoke<GamesPage>("igdb-games", { body: { search, offset } });
  if (error || !data) {
    throw new Error(`Search "${search}" failed: ${error?.message ?? "no data"}`);
  }
  return data;
};

const fetchSearchResults = async (supabase: SupabaseClient, search: string): Promise<string[]> => {
  const names: string[] = [];
  let offset: number | null = 0;
  while (offset !== null && names.length < MAX_RESULTS_PER_SEARCH) {
    const page = await fetchGamesPage(supabase, search, offset);
    names.push(...page.games.map((game) => game.name));
    offset = page.nextOffset;
  }
  return names;
};

const saveSnapshot = async (name: string): Promise<void> => {
  const supabase = await createSupabase();
  const snapshot: Snapshot = {};
  for (const search of SEARCHES) {
    snapshot[search] = await fetchSearchResults(supabase, search);
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
