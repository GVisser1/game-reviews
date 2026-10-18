import { createFileRoute } from "@tanstack/react-router";
import { PrivacyPage } from "../features/privacy/PrivacyPage";

export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy - Game Reviews" }] }),
  component: PrivacyPage,
});
