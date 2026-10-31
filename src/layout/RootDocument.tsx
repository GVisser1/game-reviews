import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { SiteFooter } from "./SiteFooter";

export const RootDocument = (): React.JSX.Element => (
  // The theme script in <head> may set data-theme before React hydrates the prerendered pages.
  <html lang="en" suppressHydrationWarning>
    <head>
      <HeadContent />
    </head>
    <body>
      <Outlet />
      <SiteFooter />
      <Scripts />
    </body>
  </html>
);
