// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { seconds } from "./timeUtil";
import { getTurnstileToken } from "./turnstile";

type RenderOptions = Parameters<NonNullable<Window["turnstile"]>["render"]>[1];

const SITE_KEY = "test-site-key";
const TIMEOUT_MS = seconds(30);

// A stand-in for Cloudflare's script that lets each test decide how the check ends.
const installFakeTurnstile = (finish: (options: RenderOptions) => void): { remove: ReturnType<typeof vi.fn> } => {
  const remove = vi.fn();
  window.turnstile = {
    render: (_container, options) => {
      setTimeout(() => finish(options));
      return "widget-1";
    },
    remove,
  };
  return { remove };
};

describe("getTurnstileToken", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    delete window.turnstile;
  });

  it("resolves with the token and cleans up the widget", async () => {
    const { remove } = installFakeTurnstile((options) => options.callback("token-123"));

    const token = getTurnstileToken(SITE_KEY);
    await vi.runAllTimersAsync();

    await expect(token).resolves.toBe("token-123");
    expect(remove).toHaveBeenCalledWith("widget-1");
    expect(document.body.children).toHaveLength(0);
  });

  it("passes the site key and stays hidden unless interaction is needed", async () => {
    let renderedOptions: RenderOptions | undefined;
    installFakeTurnstile((options) => {
      renderedOptions = options;
      options.callback("token");
    });

    const token = getTurnstileToken(SITE_KEY);
    await vi.runAllTimersAsync();
    await token;

    expect(renderedOptions).toMatchObject({ sitekey: SITE_KEY, appearance: "interaction-only" });
  });

  it("rejects with an explanation when the check fails", async () => {
    installFakeTurnstile((options) => options["error-callback"]());

    const token = getTurnstileToken(SITE_KEY);
    const assertion = expect(token).rejects.toThrow("challenges.cloudflare.com");
    await vi.runAllTimersAsync();

    await assertion;
  });

  it("gives up when no token arrives in time", async () => {
    installFakeTurnstile(() => {});

    const token = getTurnstileToken(SITE_KEY);
    const assertion = expect(token).rejects.toThrow("Couldn't confirm you're not a bot");
    await vi.advanceTimersByTimeAsync(TIMEOUT_MS);

    await assertion;
  });
});
