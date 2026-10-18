import { isNil } from "lodash";
import { seconds } from "./timeUtil";

const SCRIPT_URL = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TOKEN_TIMEOUT_MS = seconds(30);
const BLOCKED_MESSAGE =
  "Couldn't confirm you're not a bot. Make sure challenges.cloudflare.com isn't blocked, then reload the page.";

type TurnstileRenderOptions = {
  sitekey: string;
  appearance: "always" | "execute" | "interaction-only";
  callback: (token: string) => void;
  "error-callback": () => void;
  "expired-callback": () => void;
};

type Turnstile = {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  remove: (widgetId: string) => void;
};

declare global {
  // Global augmentation only works with an interface.
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Window {
    turnstile?: Turnstile;
  }
}

let scriptLoad: Promise<Turnstile> | undefined;

const loadTurnstile = (): Promise<Turnstile> => {
  if (!isNil(window.turnstile)) {
    return Promise.resolve(window.turnstile);
  }
  scriptLoad ??= new Promise<Turnstile>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => (isNil(window.turnstile) ? reject(new Error(BLOCKED_MESSAGE)) : resolve(window.turnstile));
    script.onerror = () => {
      scriptLoad = undefined;
      reject(new Error(BLOCKED_MESSAGE));
    };
    document.head.append(script);
  });
  return scriptLoad;
};

// Runs Cloudflare Turnstile and returns a one-time token for Supabase to verify. It stays invisible unless Cloudflare
// needs the visitor to click a checkbox, which then appears in the bottom corner of the page.
export const getTurnstileToken = async (siteKey: string): Promise<string> => {
  const turnstile = await loadTurnstile();
  const container = document.createElement("div");
  container.className = "fixed right-4 bottom-4 z-50";
  document.body.append(container);

  let widgetId: string | undefined;
  try {
    return await new Promise<string>((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error(BLOCKED_MESSAGE)), TOKEN_TIMEOUT_MS);
      const fail = (): void => {
        clearTimeout(timeout);
        reject(new Error(BLOCKED_MESSAGE));
      };
      widgetId = turnstile.render(container, {
        sitekey: siteKey,
        appearance: "interaction-only",
        callback: (token) => {
          clearTimeout(timeout);
          resolve(token);
        },
        "error-callback": fail,
        "expired-callback": fail,
      });
    });
  } finally {
    if (!isNil(widgetId)) {
      turnstile.remove(widgetId);
    }
    container.remove();
  }
};
