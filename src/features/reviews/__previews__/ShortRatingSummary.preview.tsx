import { PreviewSection } from "../../dev/PreviewSection";
import { ShortRatingSummary } from "../ShortRatingSummary";

export const title = "Short rating summary";
export const group = "Components";
export const description =
  "A game's community rating in tight spaces like the games list. Renders nothing without ratings.";

const ShortRatingSummaryPreview = (): React.JSX.Element => (
  <>
    <PreviewSection title="With ratings">
      <ShortRatingSummary summary={{ averageRating: 4.3, ratingCount: 12 }} />
    </PreviewSection>
    <PreviewSection title="Without ratings (renders nothing)">
      <ShortRatingSummary summary={{ averageRating: null, ratingCount: 0 }} />
    </PreviewSection>
  </>
);

export default ShortRatingSummaryPreview;
