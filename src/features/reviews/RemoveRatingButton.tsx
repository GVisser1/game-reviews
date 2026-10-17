type RemoveRatingButtonProps = {
  onClick: () => void;
};

export const RemoveRatingButton = ({ onClick }: RemoveRatingButtonProps): React.JSX.Element => (
  <button
    type="button"
    onClick={onClick}
    className="self-start text-xs text-gray-500 hover:text-red-600 hover:underline"
  >
    Remove rating
  </button>
);
