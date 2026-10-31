// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { StarRating } from "../StarRating";

const MAX_STARS = 5;

afterEach(cleanup);

describe("StarRating", () => {
  it("calls onChange with the clicked star's value", async () => {
    const onChange = vi.fn();
    render(<StarRating rating={0} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "4 stars" }));

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("shows one button per star when editable", () => {
    render(<StarRating rating={2} onChange={vi.fn()} />);

    expect(screen.getAllByRole("button")).toHaveLength(MAX_STARS);
  });

  it("fills the stars up to the rating", () => {
    render(<StarRating rating={3} onChange={vi.fn()} />);

    const fills = screen.getAllByRole("button").map((button) => button.querySelector("svg")?.getAttribute("fill"));
    expect(fills).toEqual(["currentColor", "currentColor", "currentColor", "none", "none"]);
  });

  it("is read-only without onChange", () => {
    render(<StarRating rating={3} />);

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByRole("img", { name: "Rated 3 out of 5" })).toBeDefined();
  });
});
