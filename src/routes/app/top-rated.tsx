import { createFileRoute, redirect } from "@tanstack/react-router";

// The Top rated page became the games list's "Highest rated" sort; this keeps old links working.
export const Route = createFileRoute("/app/top-rated")({
  beforeLoad: () => {
    throw redirect({ to: "/app", search: { sort: "rating" }, replace: true });
  },
});
