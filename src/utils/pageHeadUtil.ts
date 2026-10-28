import { isNil } from "lodash-es";

export const SITE_NAME = "Game Reviews";
export const SITE_DESCRIPTION = "Find any game, rate it, and keep track of everything you've played.";

export const toPageTitle = (pageName?: string): string => (isNil(pageName) ? SITE_NAME : `${pageName} - ${SITE_NAME}`);

// The browser tab title plus the title link previews use. Child routes replace the root route's tags with the same name.
export const pageHead = (pageName: string) => {
  const title = toPageTitle(pageName);
  return { meta: [{ title }, { property: "og:title", content: title }] };
};
