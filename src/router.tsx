import { QueryClientProvider } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { queryClient } from "./lib/queryClient";
import { routeTree } from "./routeTree.gen";

export const getRouter = () =>
  createRouter({
    routeTree,
    context: { queryClient },
    // Start loading a page's data when its link is hovered or focused.
    defaultPreload: "intent",
    // Let TanStack Query decide what is fresh instead of the router's own cache.
    defaultPreloadStaleTime: 0,
    scrollRestoration: true,
    Wrap: ({ children }) => <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>,
  });

declare module "@tanstack/react-router" {
  // Module augmentation only works with an interface.
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
