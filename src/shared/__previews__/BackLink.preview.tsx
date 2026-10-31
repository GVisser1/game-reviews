import { PreviewSection } from "../../features/dev/PreviewSection";
import { BackLink } from "../BackLink";

export const title = "Back link";
export const group = "Components";
export const description = "Goes back in history when it can, so the previous search and scroll position stay.";

const BackLinkPreview = (): React.JSX.Element => (
  <PreviewSection title="Default">
    <BackLink>← All games</BackLink>
  </PreviewSection>
);

export default BackLinkPreview;
