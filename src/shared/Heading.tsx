import clsx from "clsx";
import type { ComponentPropsWithoutRef } from "react";

type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type HeadingProps = ComponentPropsWithoutRef<"h1"> & {
  /** The heading level. Pick it by the page's outline, not by size: the size comes from a text role in `className`. */
  as: HeadingLevel;
};

export const Heading = ({ as: Element, className, ...props }: HeadingProps): React.JSX.Element => (
  <Element className={clsx("font-heading", className)} {...props} />
);
