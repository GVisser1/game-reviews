import { find, sortBy } from "lodash-es";
import type { MDXContent } from "mdx/types";
import type { DocsGroup } from "./utils/docsUtil";
import { DOCS_GROUPS, toDocsSlug } from "./utils/docsUtil";

type DocsModule = {
  frontmatter: { title: string; group: DocsGroup; description: string };
  default: MDXContent;
};

export type DocsPage = {
  slug: string;
  title: string;
  group: DocsGroup;
  description: string;
  Content: MDXContent;
};

// Every *.docs.mdx page in src. Only the development-only /dev pages import this module, so none of it ends up in the
// production bundle. The type is on the variable rather than `import.meta.glob<DocsModule>(`: Vitest only notices a
// glob, and stops caching this module so it sees new pages, when it finds the text "import.meta.glob(".
const docsModules: Record<string, DocsModule> = import.meta.glob("/src/**/*.docs.mdx", { eager: true });

export const DOCS_PAGES: DocsPage[] = sortBy(
  Object.entries(docsModules).map(([path, module]) => ({
    slug: toDocsSlug(path),
    ...module.frontmatter,
    Content: module.default,
  })),
  [(page) => DOCS_GROUPS.indexOf(page.group), "title"],
);

export const findDocsPage = (slug: string): DocsPage | undefined => find(DOCS_PAGES, { slug });
