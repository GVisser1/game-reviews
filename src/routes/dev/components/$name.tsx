import { createFileRoute, lazyRouteComponent } from "@tanstack/react-router";
import { startCase } from "lodash-es";
import { pageHead } from "../../../utils/pageHeadUtil";

export const Route = createFileRoute("/dev/components/$name")({
  head: ({ params }) => pageHead(startCase(params.name)),
  component: import.meta.env.DEV
    ? lazyRouteComponent(() => import("../../../features/dev/ComponentPreviewPage"), "ComponentPreviewPage")
    : undefined,
});
