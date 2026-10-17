import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";

export const RootDocument = (): React.JSX.Element => (
  <html lang="en">
    <head>
      <HeadContent />
    </head>
    <body>
      <Outlet />
      <Scripts />
    </body>
  </html>
);
