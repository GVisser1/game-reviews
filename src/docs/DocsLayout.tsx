import { Link, Outlet } from "@tanstack/react-router";
import { filter, isEmpty } from "lodash-es";
import { DOCS_PAGES } from "./docsRegistry";
import { DOCS_GROUPS } from "./utils/docsUtil";

// The docs' sidebar, listing every page by group, next to the open page. From md up it stays in view while the page
// scrolls, and scrolls itself if it's taller than the window. Below md it sits above the page, so it scrolls away.
export const DocsLayout = (): React.JSX.Element => (
  <div className="mx-auto flex max-w-6xl flex-col gap-8 p-8 md:flex-row">
    <nav
      aria-label="Docs"
      className="flex shrink-0 flex-col gap-4 md:sticky md:top-8 md:max-h-[calc(100dvh-4rem)] md:w-48 md:self-start md:overflow-y-auto"
    >
      <Link to="/dev/docs" className="font-heading text-lead font-semibold">
        Docs
      </Link>
      {DOCS_GROUPS.map((group) => ({ group, pages: filter(DOCS_PAGES, { group }) }))
        .filter(({ pages }) => !isEmpty(pages))
        .map(({ group, pages }) => (
          <div key={group} className="flex flex-col gap-1">
            <span className="text-caption text-muted">{group}</span>
            {pages.map((page) => (
              <Link
                key={page.slug}
                to="/dev/docs/$name"
                params={{ name: page.slug }}
                className="text-small hover:text-accent"
                activeProps={{ className: "text-accent font-medium" }}
              >
                {page.title}
              </Link>
            ))}
          </div>
        ))}
    </nav>
    <main className="flex min-w-0 flex-1 flex-col gap-4">
      <Outlet />
    </main>
  </div>
);
