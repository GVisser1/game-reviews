import { PreviewSection } from "../PreviewSection";

export const title = "Text sizes";
export const group = "Foundations";
export const description = "The text roles. The three heading sizes use the heading font.";

const TEXT_SIZES = [
  { name: "text-display", className: "text-display font-heading" },
  { name: "text-title", className: "text-title font-heading" },
  { name: "text-heading", className: "text-heading font-heading" },
  { name: "text-lead", className: "text-lead" },
  { name: "text-body", className: "text-body" },
  { name: "text-small", className: "text-small" },
  { name: "text-caption", className: "text-caption" },
];

const TextSizesPreview = (): React.JSX.Element => (
  <PreviewSection title="All sizes">
    {TEXT_SIZES.map((size) => (
      <div key={size.name} className="flex flex-col">
        <span className="text-caption text-muted">{size.name}</span>
        <span className={size.className}>The Witcher 3: Wild Hunt</span>
      </div>
    ))}
  </PreviewSection>
);

export default TextSizesPreview;
