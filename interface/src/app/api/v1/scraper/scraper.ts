import { BrowserContext, chromium, ChromiumBrowser, Page } from "playwright";
import { ScraperPage } from "./scraperPage";

export class Scraper {
  private browser?: ChromiumBrowser;
  private context?: BrowserContext;

  async newPage(url: string) {
    await this.readyBrowser();
    const page = ScraperPage.init(url, this.context!);
    return page
  }

  async readyBrowser() {
    if (!this.browser || !this.context) {
      this.browser = await chromium.launch({
        headless: true,
        args: ["--start-maximized"],
      });
      this.context = await this.browser.newContext({
        viewport: {
          width: 1920,
          height: 1080,
        },
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
      });
    }
  }

  // For pages, we automatically run page.close() after performing scraping.
  // For browsers, since we may have more pages to open, we manually call browser.close().
  async closeBrowser() {
    this.browser?.close()
  }

}

