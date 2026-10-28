import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "../features/privacy/PrivacyPage";
import { pageHead } from "../utils/pageHeadUtil";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead("Privacy"),
  component: PrivacyPage,
});
