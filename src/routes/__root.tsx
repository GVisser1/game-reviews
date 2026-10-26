import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext } from "@tanstack/react-router";
import { SITE_DESCRIPTION, SITE_NAME, toPageTitle } from "../lib/pageHead";
import { NotFoundPage } from "../NotFoundPage";
import { RootDocument } from "../RootDocument";
import appCss from "../index.css?url";

type RouterContext = {
  queryClient: QueryClient;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: toPageTitle() },
      { name: "description", content: SITE_DESCRIPTION },
      // Link previews in chat apps and social media. Only the prerendered pages reach those crawlers with these tags.
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:title", content: toPageTitle() },
      { property: "og:description", content: SITE_DESCRIPTION },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
    ],
  }),
  component: RootDocument,
  notFoundComponent: NotFoundPage,
});
