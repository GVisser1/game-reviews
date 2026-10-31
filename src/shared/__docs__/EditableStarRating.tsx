import { useState } from "react";
import { StarRating } from "../StarRating";

// The StarRating docs' editable example, which needs state of its own.
export const EditableStarRating = (): React.JSX.Element => {
  const [rating, setRating] = useState(3);
  return <StarRating rating={rating} onChange={setRating} />;
};
