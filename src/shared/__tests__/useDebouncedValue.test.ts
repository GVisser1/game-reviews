// @vitest-environment jsdom
import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { useDebouncedValue } from "../useDebouncedValue";

const DELAY_MS = 300;
const JUST_BEFORE_DELAY_MS = DELAY_MS - 1;

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it("starts with the initial value", () => {
    const { result } = renderHook(() => useDebouncedValue("zel", DELAY_MS));

    expect(result.current).toBe("zel");
  });

  it("only updates once the value has stopped changing for the delay", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, DELAY_MS), {
      initialProps: { value: "zel" },
    });

    rerender({ value: "zeld" });
    act(() => {
      vi.advanceTimersByTime(JUST_BEFORE_DELAY_MS);
    });
    expect(result.current).toBe("zel");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("zeld");
  });

  it("restarts the delay on every change, so typing quickly only updates once", () => {
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(value, DELAY_MS), {
      initialProps: { value: "z" },
    });

    rerender({ value: "ze" });
    act(() => {
      vi.advanceTimersByTime(JUST_BEFORE_DELAY_MS);
    });
    rerender({ value: "zel" });
    act(() => {
      vi.advanceTimersByTime(JUST_BEFORE_DELAY_MS);
    });
    expect(result.current).toBe("z");

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current).toBe("zel");
  });
});
