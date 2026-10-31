import { find, sortBy } from "lodash-es";
import type { ComponentType } from "react";
import type { PreviewGroup } from "./utils/previewUtil";
import { PREVIEW_GROUPS, toPreviewSlug } from "./utils/previewUtil";

// What every *.preview.tsx file exports: plain strings for the index, and the examples as its default export.
type PreviewModule = {
  title: string;
  group: PreviewGroup;
  description: string;
  default: ComponentType;
};

export type ComponentPreview = {
  slug: string;
  title: string;
  group: PreviewGroup;
  description: string;
  Examples: ComponentType;
};

// Finds every preview file in src, so adding a component's preview is adding one file. Only the development-only pages
// import this module, so none of the previews end up in the production bundle.
const modules = import.meta.glob<PreviewModule>("/src/**/*.preview.tsx", { eager: true });

export const PREVIEWS: ComponentPreview[] = sortBy(
  Object.entries(modules).map(([path, module]) => ({
    slug: toPreviewSlug(path),
    title: module.title,
    group: module.group,
    description: module.description,
    Examples: module.default,
  })),
  [(preview) => PREVIEW_GROUPS.indexOf(preview.group), "title"],
);

export const findPreview = (slug: string): ComponentPreview | undefined => find(PREVIEWS, { slug });
