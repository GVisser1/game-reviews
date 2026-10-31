import { noop } from "lodash-es";
import { PreviewSection } from "../../dev/PreviewSection";
import { RemoveReviewButton } from "../RemoveReviewButton";

export const title = "Remove review button";
export const group = "Components";
export const description = "A quiet link-style button that removes your rating and review of a game.";

const RemoveReviewButtonPreview = (): React.JSX.Element => (
  <PreviewSection title="Default">
    <RemoveReviewButton onClick={noop} />
  </PreviewSection>
);

export default RemoveReviewButtonPreview;
