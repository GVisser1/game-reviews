import { useState } from "react";
import { PreviewSection } from "../../features/dev/PreviewSection";
import { StarRating } from "../StarRating";

export const title = "Star rating";
export const group = "Components";
export const description = "A 1–5 star rating, read-only or editable.";

const EXAMPLE_RATING = 3;
const MAX_RATING = 5;

const EditableStarRating = (): React.JSX.Element => {
  const [rating, setRating] = useState(EXAMPLE_RATING);
  return <StarRating rating={rating} onChange={setRating} />;
};

const StarRatingPreview = (): React.JSX.Element => (
  <>
    <PreviewSection title="Read-only: 0, 3 and 5 stars">
      <StarRating rating={0} />
      <StarRating rating={EXAMPLE_RATING} />
      <StarRating rating={MAX_RATING} />
    </PreviewSection>
    <PreviewSection title="Editable">
      <EditableStarRating />
    </PreviewSection>
  </>
);

export default StarRatingPreview;
