import type { Locator, Page, Response } from "@playwright/test";
import { BasePage } from "../base";

export class AccountPage extends BasePage {
  public readonly heading: Locator;
  public readonly signInPrompt: Locator;
  public readonly deleteAccountButton: Locator;
  public readonly confirmDeleteButton: Locator;
  public readonly cancelButton: Locator;

  public constructor(page: Page) {
    super(page);

    this.heading = page.getByRole("heading", { name: "Account", level: 1 });
    this.signInPrompt = page.getByText("Sign in to manage your account.");
    this.deleteAccountButton = page.getByRole("button", { name: "Delete my account" });
    this.confirmDeleteButton = page.getByRole("button", { name: "Yes, delete my account" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
  }

  public goto = async (): Promise<Response | null> => this.page.goto("/app/account");
}
