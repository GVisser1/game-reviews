import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { pageHead } from "../../../utils/pageHeadUtil";

export const Route = createFileRoute("/dev/components/")({
  head: () => pageHead("Components"),
  component: import.meta.env.DEV
    ? lazyRouteComponent(() => import("../../../features/dev/ComponentsIndexPage"), "ComponentsIndexPage")
    : undefined,
});
