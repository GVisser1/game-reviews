import clsx from "clsx";
import { isNil } from "lodash-es";
import type { LucideIcon } from "lucide-react";

type IconProps = {
  /** The Lucide icon to show, imported by name from lucide-react, like `ArrowLeft`. */
  icon: LucideIcon;
  /** What the icon means, for screen readers. Leave it out when text next to the icon already says it. */
  label?: string;
  /** Fills the icon's shape with its colour, like a filled star. */
  isFilled?: boolean;
  /** Extra classes. The icon takes its size from the text around it and its colour from `text-*`. */
  className?: string;
};

// A Lucide icon sized like the text it sits in (1em), in the text's colour, so it needs no size or colour of its own.
// Icons are decorative and hidden from screen readers unless they have a label.
export const Icon = ({ icon: LucideGlyph, label, isFilled = false, className }: IconProps): React.JSX.Element => (
  <LucideGlyph
    // Set explicitly: Lucide hides an icon by itself, but not when it's passed aria-label, even an undefined one.
    aria-hidden={isNil(label) ? true : undefined}
    aria-label={label}
    role={isNil(label) ? undefined : "img"}
    fill={isFilled ? "currentColor" : "none"}
    className={clsx("inline-block size-[1em] shrink-0", className)}
  />
);
