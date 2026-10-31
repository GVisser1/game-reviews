import { PreviewSection } from "../PreviewSection";

export const title = "Colours";
export const group = "Foundations";
export const description = "The colour roles components use. The palette itself is never used directly.";

const BACKGROUND_ROLES = [
  { name: "page", className: "bg-page" },
  { name: "surface", className: "bg-surface" },
  { name: "surface-raised", className: "bg-surface-raised" },
  { name: "line", className: "bg-line" },
  { name: "accent", className: "bg-accent" },
  { name: "accent-hover", className: "bg-accent-hover" },
  { name: "accent-subtle", className: "bg-accent-subtle" },
  { name: "danger-solid", className: "bg-danger-solid" },
  { name: "danger-solid-hover", className: "bg-danger-solid-hover" },
];

const TEXT_ROLES = [
  { name: "foreground", className: "text-foreground" },
  { name: "muted", className: "text-muted" },
  { name: "accent", className: "text-accent" },
  { name: "danger", className: "text-danger" },
  { name: "rating", className: "text-rating" },
];

const ColorsPreview = (): React.JSX.Element => (
  <>
    <PreviewSection title="Backgrounds">
      <div className="grid grid-cols-3 gap-3">
        {BACKGROUND_ROLES.map((role) => (
          <div key={role.name} className="flex flex-col gap-1">
            <div className={`h-12 rounded border ${role.className}`} />
            <span className="text-caption text-muted">{role.name}</span>
          </div>
        ))}
      </div>
    </PreviewSection>
    <PreviewSection title="Text">
      <div className="flex flex-wrap gap-4">
        {TEXT_ROLES.map((role) => (
          <span key={role.name} className={`text-small font-medium ${role.className}`}>
            {role.name}
          </span>
        ))}
        <span className="rounded bg-accent px-2 text-small font-medium text-on-accent">on-accent</span>
        <span className="rounded bg-danger-solid px-2 text-small font-medium text-on-danger">on-danger</span>
      </div>
    </PreviewSection>
  </>
);

export default ColorsPreview;
