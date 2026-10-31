type RemoveReviewButtonProps = {
  onClick: () => void;
};

export const RemoveReviewButton = ({ onClick }: RemoveReviewButtonProps): React.JSX.Element => (
  <button type="button" onClick={onClick} className="self-start text-xs text-muted hover:text-danger hover:underline">
    Remove review
  </button>
);
