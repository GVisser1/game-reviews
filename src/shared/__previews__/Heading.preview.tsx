import { PreviewSection } from "../../features/dev/PreviewSection";
import { Heading } from "../Heading";

export const title = "Heading";
export const group = "Components";
export const description = "A heading of a chosen level in the heading font; sizes come from the text roles.";

const HeadingPreview = (): React.JSX.Element => (
  <PreviewSection title="Levels with their usual sizes">
    <Heading as="h1" className="text-title">
      Page title (h1)
    </Heading>
    <Heading as="h2" className="text-heading">
      Section heading (h2)
    </Heading>
    <Heading as="h3">Smaller heading (h3)</Heading>
  </PreviewSection>
);

export default HeadingPreview;
