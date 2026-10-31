type RemoveReviewButtonProps = {
  /** Removes the review. The button doesn't ask for confirmation itself. */
  onClick: () => void;
};

export const RemoveReviewButton = ({ onClick }: RemoveReviewButtonProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className="self-start text-caption text-muted hover:text-danger hover:underline"
  >
    Remove review
  </button>
);
