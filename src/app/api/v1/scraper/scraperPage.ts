import { BrowserContext, Page } from "playwright";
import { DogwaterPost } from "../types/dogwater";

export abstract class ScraperPage {
  protected readonly url: string;
  protected readonly parentContext: BrowserContext;
  protected page?: Page;

  abstract scrape(): Promise<DogwaterPost>;

  constructor(url: string, parentContext: BrowserContext) {
    this.url = url;
    this.parentContext = parentContext;
  }

  private async readyPage() {
    if (!this.page) {
      this.page = await this.parentContext.newPage();
      await this.page.goto(this.url);
    }
  }

  private static registry: Record<string, new (url: string, parentScraper: BrowserContext) => ScraperPage> = {};
  static register(domain: string, ScraperPageClass: new (url: string, parentScraper: BrowserContext) => ScraperPage) {
    this.registry[domain] = ScraperPageClass;
  }
  static async init(url: string, parentContext: BrowserContext): Promise<ScraperPage> {
    for (const domain in this.registry) {
      if (url.includes(domain)) {
        const ScraperPageClass = this.registry[domain];
        const scraperPage = new ScraperPageClass(url, parentContext);
        await scraperPage.readyPage();
        return scraperPage;
      }
    }
    throw new Error(`No scraper registered for this URL (${url}).`);
  }
}
