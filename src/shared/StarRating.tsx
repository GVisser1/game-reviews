import { isNil } from "lodash-es";
import { Star } from "lucide-react";
import { Icon } from "./Icon";

const MAX_STARS = 5;
const STAR_VALUES = Array.from({ length: MAX_STARS }, (_, index) => index + 1);
// The stars are icons, not text, so they have their own size instead of a text role: 24px stars in a 32px row.
const STAR_CLASS_NAME = "text-[1.5rem] text-rating";

type StarRatingProps = {
  /** The number of filled stars, from 0 to 5. */
  rating: number;
  /** Called with the star a user picks, from 1 to 5. Leave it out to show the rating read-only. */
  onChange?: (rating: number) => void;
};

export const StarRating = ({ rating, onChange }: StarRatingProps): React.JSX.Element => {
  if (isNil(onChange)) {
    return (
      <div
        role="img"
        aria-label={`Rated ${rating} out of ${MAX_STARS}`}
        className={`flex h-8 items-center ${STAR_CLASS_NAME}`}
      >
        {STAR_VALUES.map((value) => (
          <Icon key={value} icon={Star} isFilled={value <= rating} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex">
      {STAR_VALUES.map((value) => (
        <button
          key={value}
          type="button"
          onClick={() => onChange(value)}
          aria-label={`${value} star${value > 1 ? "s" : ""}`}
          // A 32px target around the 24px star, above WCAG's 24px minimum.
          className={`inline-flex size-8 items-center justify-center ${STAR_CLASS_NAME}`}
        >
          <Icon icon={Star} isFilled={value <= rating} />
        </button>
      ))}
    </div>
  );
};
