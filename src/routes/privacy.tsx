import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "../features/privacy/PrivacyPage";
import { pageHead } from "../lib/pageHead";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy"),
  component: PrivacyPage,
});
