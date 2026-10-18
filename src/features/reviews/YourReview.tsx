import { isNil } from "lodash-es";
import { useState } from "react";
import { StarRating } from "../../shared/StarRating";
import { RemoveReviewButton } from "./RemoveReviewButton";
import { MAX_REVIEW_LENGTH, normalizeReviewBody } from "./reviewBody";
import type { Review } from "./types";

const NO_RATING = 0;

type YourReviewProps = {
  game: { id: number; name: string; coverUrl: string | null };
  review: Review | undefined;
  error: string | null;
  onSave: (review: Review) => void;
  onRemove: (gameId: number) => void;
};

export const YourReview = ({ game, review, error, onSave, onRemove }: YourReviewProps): React.JSX.Element => {
  const [draft, setDraft] = useState(review?.body ?? "");
  const savedBody = review?.body ?? null;
  const draftBody = normalizeReviewBody(draft);
  const hasUnsavedText = draftBody !== savedBody;

  const save = (rating: number, body: string | null): void => {
    onSave({ gameId: game.id, gameName: game.name, coverUrl: game.coverUrl, rating, body });
  };

  return (
    <section className="flex flex-col gap-2">
      <span className="text-sm font-medium">Your rating</span>
      {/* Changing the stars keeps the saved text, not the unsaved draft. */}
      <StarRating rating={review?.rating ?? NO_RATING} onChange={(rating) => save(rating, savedBody)} />
      <label className="flex flex-col gap-1">
        <span className="text-sm font-medium">Your review (optional)</span>
        <textarea
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          maxLength={MAX_REVIEW_LENGTH}
          rows={4}
          className="rounded border p-2"
        />
      </label>
      <div className="flex items-center gap-3">
        <button
          type="button"
          disabled={isNil(review) || !hasUnsavedText}
          onClick={() => !isNil(review) && save(review.rating, draftBody)}
          className="rounded border px-3 py-1 text-sm hover:bg-gray-100 disabled:opacity-50"
        >
          Save review
        </button>
        <span className="text-xs text-gray-600">
          {draft.length}/{MAX_REVIEW_LENGTH}
        </span>
        {isNil(review) && <span className="text-xs text-gray-600">Pick a star rating to save your review.</span>}
        {!isNil(review) && !hasUnsavedText && !isNil(savedBody) && <span className="text-xs text-gray-600">Saved</span>}
      </div>
      {!isNil(review) && <RemoveReviewButton onClick={() => onRemove(game.id)} />}
      {error && <p className="text-red-600">Could not update review: {error}</p>}
    </section>
  );
};
