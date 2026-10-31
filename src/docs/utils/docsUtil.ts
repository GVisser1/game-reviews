import { isEmpty, isNil, kebabCase } from "lodash-es";
import type { PropDescriptor } from "react-docgen";

// Groups in the order the sidebar and index list them.
export const DOCS_GROUPS = ["Foundations", "Components"] as const;
export type DocsGroup = (typeof DOCS_GROUPS)[number];

const DOCS_FILE_SUFFIX = ".docs.mdx";

// A docs page's address comes from its file name: ".../StarRating.docs.mdx" becomes "star-rating".
export const toDocsSlug = (path: string): string => kebabCase(path.split("/").at(-1)?.replace(DOCS_FILE_SUFFIX, ""));

// How a prop's type reads in the props table: the type as written, like "(rating: number) => void", or its name.
export const toTypeLabel = (prop: PropDescriptor): string => {
  const type = prop.tsType;
  if (isNil(type)) {
    return "unknown";
  }
  const raw = "raw" in type ? type.raw : undefined;
  return isNil(raw) || isEmpty(raw) ? type.name : raw;
};
