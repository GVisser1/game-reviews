import { createFileRoute } from "@tanstack/react-router";
import { sessionQueryOptions } from "../features/auth/sessionQuery";
import { AppError, AppLayout, AppPending } from "../layout/AppLayout";

export const Route = createFileRoute("/app")({
  // The app talks to Supabase as the visitor, so it only runs in the browser and signs in anonymously first.
  ssr: false,
  beforeLoad: ({ context }) => context.queryClient.query({ ...sessionQueryOptions, staleTime: "static" }),
  component: AppLayout,
  pendingComponent: AppPending,
  errorComponent: AppError,
});
