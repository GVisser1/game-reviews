import { describe, expect, test } from "vite-plus/test";
import { minutes, seconds } from "./timeUtil";

describe("timeUtil", () => {
  describe("seconds", () => {
    test.each([
      [1, 1000],
      [2, 2000],
      [0.5, 500],
      [0, 0],
    ])("seconds(%i) returns %i milliseconds", (input, expected) => {
      expect(seconds(input)).toBe(expected);
    });
  });

  describe("minutes", () => {
    test.each([
      [1, 60000],
      [2, 120000],
      [0.5, 30000],
      [0, 0],
    ])("minutes(%i) returns %i milliseconds", (input, expected) => {
      expect(minutes(input)).toBe(expected);
    });
  });
});
