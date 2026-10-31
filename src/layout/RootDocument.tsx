import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { SiteFooter } from "./SiteFooter";

export const RootDocument = (): React.JSX.Element => (
  // The theme script in <head> may set data-theme before React hydrates the prerendered pages.
  <html lang="en" suppressHydrationWarning>
    <head>
      <HeadContent />
    </head>
    {/* At least as tall as the window, with the page growing to fill it, so the footer sits at the bottom of short
        pages. The wrapper keeps the pages in normal block layout, so their own `mx-auto` widths work as before. */}
    <body className="flex min-h-dvh flex-col">
      <div className="flex-1">
        <Outlet />
      </div>
      <SiteFooter />
      <Scripts />
    </body>
  </html>
);
