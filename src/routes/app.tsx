import { createFileRoute } from "@tanstack/react-router";
import { AppError, AppLayout } from "../AppLayout";
import { sessionQueryOptions } from "../features/auth/sessionQuery";

export const Route = createFileRoute("/app")({
  // The app talks to Supabase as the visitor, so it only runs in the browser and signs in anonymously first.
  ssr: false,
  beforeLoad: ({ context }) => context.queryClient.ensureQueryData(sessionQueryOptions),
  component: AppLayout,
  errorComponent: AppError,
});
