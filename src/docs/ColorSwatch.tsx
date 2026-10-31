import clsx from "clsx";

type ColorSwatchProps = {
  hex: string;
  className?: string;
};

// A colour as a small square, with a border so white and near-page colours still show.
export const ColorSwatch = ({ hex, className }: ColorSwatchProps): React.JSX.Element => (
  <span aria-hidden className={clsx("block shrink-0 rounded border", className)} style={{ backgroundColor: hex }} />
);
