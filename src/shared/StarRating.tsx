import { isNil } from "lodash-es";

const MAX_STARS = 5;
const STAR_VALUES = Array.from({ length: MAX_STARS }, (_, index) => index + 1);
const STAR_CLASS_NAME = "text-heading text-rating";

type StarRatingProps = {
  /** The number of filled stars, from 0 to 5. */
  rating: number;
  /** Called with the star a user picks, from 1 to 5. Leave it out to show the rating read-only. */
  onChange?: (rating: number) => void;
};

const toStar = (value: number, rating: number): string => (value <= rating ? "★" : "☆");

export const StarRating = ({ rating, onChange }: StarRatingProps): React.JSX.Element => {
  if (isNil(onChange)) {
    return (
      <div role="img" aria-label={`Rated ${rating} out of ${MAX_STARS}`} className={`flex ${STAR_CLASS_NAME}`}>
        {STAR_VALUES.map((value) => (
          <span key={value} aria-hidden>
            {toStar(value, rating)}
          </span>
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
          // A fixed 32px target: the star glyph alone is ~24px and narrower in some fonts, below WCAG's 24px minimum.
          className={`inline-flex size-8 items-center justify-center ${STAR_CLASS_NAME}`}
        >
          {toStar(value, rating)}
        </button>
      ))}
    </div>
  );
};
