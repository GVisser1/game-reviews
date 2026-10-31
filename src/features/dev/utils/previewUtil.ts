import { kebabCase } from "lodash-es";

// Groups in the order the index lists them.
export const PREVIEW_GROUPS = ["Foundations", "Components"] as const;
export type PreviewGroup = (typeof PREVIEW_GROUPS)[number];

const PREVIEW_FILE_SUFFIX = ".preview.tsx";

// A preview's address comes from its file name: ".../StarRating.preview.tsx" becomes "star-rating".
export const toPreviewSlug = (path: string): string =>
  kebabCase(path.split("/").at(-1)?.replace(PREVIEW_FILE_SUFFIX, ""));
