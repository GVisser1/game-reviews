import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "../../../utils/pageHeadUtil";

export const Route = createFileRoute("/dev/docs/")({
  head: () => pageHead("Docs"),
  component: import.meta.env.DEV
    ? lazyRouteComponent(() => import("../../../docs/DocsIndexPage"), "DocsIndexPage")
    : undefined,
});
