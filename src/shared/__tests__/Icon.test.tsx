// @vitest-environment jsdom
import { cleanup, render, screen } from "@testing-library/react";
import { Star } from "lucide-react";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { Icon } from "../Icon";

afterEach(cleanup);

describe("Icon", () => {
  it("is hidden from screen readers without a label", () => {
    const { container } = render(<Icon icon={Star} />);

    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("is an image with a label", () => {
    render(<Icon icon={Star} label="Favourite" />);

    expect(screen.getByRole("img", { name: "Favourite" }).getAttribute("aria-hidden")).toBeNull();
  });

  it("is an outline unless filled", () => {
    const { container, rerender } = render(<Icon icon={Star} />);
    expect(container.querySelector("svg")?.getAttribute("fill")).toBe("none");

    rerender(<Icon icon={Star} isFilled />);
    expect(container.querySelector("svg")?.getAttribute("fill")).toBe("currentColor");
  });

  it("is sized like the text around it and takes extra classes", () => {
    const { container } = render(<Icon icon={Star} className="text-rating" />);

    expect(container.querySelector("svg")?.getAttribute("class")).toContain("size-[1em] shrink-0 text-rating");
  });
});
