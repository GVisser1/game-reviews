type RemoveReviewButtonProps = {
  onClick: () => void;
};

export const RemoveReviewButton = ({ onClick }: RemoveReviewButtonProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className="self-start text-xs text-gray-500 hover:text-red-600 hover:underline"
  >
    Remove review
  </button>
);
