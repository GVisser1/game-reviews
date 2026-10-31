// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { Heading } from "../Heading";

afterEach(cleanup);

describe("Heading", () => {
  it.each(["h1", "h2", "h3", "h4", "h5", "h6"] as const)("renders a %s with the heading font", (level) => {
    render(<Heading as={level}>Portal 2</Heading>);

    const heading = screen.getByRole("heading", { level: Number(level.slice(1)), name: "Portal 2" });
    expect(heading.tagName).toBe(level.toUpperCase());
    expect(heading).toHaveProperty("className", "font-heading");
  });

  it("adds its own classes to the heading font", () => {
    render(
      <Heading as="h1" className="text-title">
        Portal 2
      </Heading>,
    );

    expect(screen.getByRole("heading").className).toBe("font-heading text-title");
  });

  it("passes other props to the element", () => {
    render(
      <Heading as="h2" id="reviews">
        Reviews
      </Heading>,
    );

    expect(screen.getByRole("heading", { name: "Reviews" }).id).toBe("reviews");
  });
});
