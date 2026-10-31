import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/dev/docs")({
  component: import.meta.env.DEV ? lazyRouteComponent(() => import("../../docs/DocsLayout"), "DocsLayout") : undefined,
});
