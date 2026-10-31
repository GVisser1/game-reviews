import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "../../../utils/pageHeadUtil";

const NOT_FOUND_PAGE_NAME = "Docs page not found";

export const Route = createFileRoute("/dev/docs/$name")({
  // The tab shows the page's own title, like "Colours", which the address ("colors") can't always spell.
  loader: import.meta.env.DEV
    ? async ({ params }) => {
        const { findDocsPage } = await import("../../../docs/docsRegistry");
        return { title: findDocsPage(params.name)?.title };
      }
    : undefined,
  head: ({ loaderData }) => pageHead(loaderData?.title ?? NOT_FOUND_PAGE_NAME),
  component: import.meta.env.DEV ? lazyRouteComponent(() => import("../../../docs/DocsPage"), "DocsPage") : undefined,
});
