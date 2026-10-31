import AxeBuilder from "@axe-core/playwright";
import { expect, type Locator, type Page, test } from "@playwright/test";
import { isEmpty } from "lodash-es";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

type ColorScheme = "light" | "dark";
const APP_TITLE = "Game Reviews";

export abstract class BasePage {
  protected readonly page: Page;

  protected constructor(page: Page) {
    this.page = page;
  }

  // The app's top navigation, shared by every /app page.
  public get navSignInLink(): Locator {
    return this.page.getByRole("navigation").getByRole("link", { name: "Sign in" });
  }

  public get navSignOutButton(): Locator {
    return this.page.getByRole("navigation").getByRole("button", { name: "Sign out" });
  }

  public get footerPrivacyLink(): Locator {
    return this.page.getByRole("contentinfo").getByRole("link", { name: "Privacy" });
  }

  public navUserName(name: string): Locator {
    return this.page.getByRole("navigation").getByText(name);
  }

  private readonly checkAccessibility = async (colorScheme: ColorScheme): Promise<void> => {
    await this.page.emulateMedia({ colorScheme });
    const results = await new AxeBuilder({ page: this.page }).withTags(WCAG_TAGS).analyze();

    if (!isEmpty(results.violations)) {
      await test.info().attach(`axe-results-${colorScheme}.json`, {
        body: JSON.stringify(results, null, 2),
        contentType: "application/json",
      });
    }

    expect.soft(results.violations, `accessibility in ${colorScheme} mode`).toEqual([]);
  };

  // Checks the page as shown in light and in dark mode
  public assertPageIsAccessible = async (): Promise<void> => {
    await this.checkAccessibility("light");
    await this.checkAccessibility("dark");
    // Back to the browser's own setting for the rest of the test.
    await this.page.emulateMedia({ colorScheme: null });
  };

  public assertMeta = async (title = APP_TITLE): Promise<void> => {
    await expect(this.page).toHaveTitle(title);
    await expect(this.page.locator("html")).toHaveAttribute("lang", "en");
  };
}
