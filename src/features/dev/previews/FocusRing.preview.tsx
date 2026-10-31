import { PreviewSection } from "../PreviewSection";

export const title = "Focus ring";
export const group = "Foundations";
export const description = "Shown on keyboard focus only. Press Tab to move through the examples.";

const FocusRingPreview = (): React.JSX.Element => (
  <PreviewSection title="Button and text field">
    <div className="flex gap-3">
      <button type="button" className="rounded border px-3 py-1 text-small hover:bg-surface-raised">
        A button
      </button>
      <input aria-label="A text field" placeholder="A text field" className="rounded border px-3 py-1" />
    </div>
  </PreviewSection>
);

export default FocusRingPreview;
