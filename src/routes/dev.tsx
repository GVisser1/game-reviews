import { createFileRoute, notFound } from "@tanstack/react-router";

// Development-only pages, like the component previews. Production builds show the not-found page for all of them, and
// each page only imports its code in development, so none of it ends up in the production bundle.
export const Route = createFileRoute("/dev")({
  ssr: false,
  beforeLoad: () => {
    if (!import.meta.env.DEV) {
      throw notFound();
    }
  },
});
