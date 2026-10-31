import { Link } from "@tanstack/react-router";
import { Heading } from "../shared/Heading";
import { DOCS_PAGES } from "./docsRegistry";

export const DocsIndexPage = (): React.JSX.Element => (
  <>
    <Heading as="h1" className="text-title">
      Docs
    </Heading>
    <p className="max-w-prose text-lead text-muted">
      The design foundations and shared components, with live demos in light and dark mode and their props. Add a{" "}
      <code>*.docs.mdx</code> file to a <code>__docs__</code> folder to list it here.
    </p>
    <ul className="flex flex-col divide-y divide-line rounded border">
      {DOCS_PAGES.map((page) => (
        <li key={page.slug}>
          <Link
            to="/dev/docs/$name"
            params={{ name: page.slug }}
            className="flex flex-col gap-1 p-4 hover:bg-surface-raised"
          >
            <span className="font-medium">{page.title}</span>
            <span className="text-small text-muted">{page.description}</span>
          </Link>
        </li>
      ))}
    </ul>
  </>
);
