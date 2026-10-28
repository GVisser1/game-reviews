import { createFileRoute } from "@tanstack/react-router";
import { AccountPage } from "../../features/auth/AccountPage";
import { pageHead } from "../../utils/pageHeadUtil";

export const Route = createFileRoute("/app/account")({
  head: () => pageHead("Account"),
  component: AccountPage,
});
