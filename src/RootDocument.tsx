import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { SiteFooter } from "./SiteFooter";

export const RootDocument = (): React.JSX.Element => (
  <html lang="en">
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
