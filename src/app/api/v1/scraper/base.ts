import { BrowserContext, chromium, ChromiumBrowser } from "playwright";
import { DogwaterPost } from "../types/dogwater";

export abstract class Scraper {
  protected url: string;
  abstract scrape(): Promise<DogwaterPost>;

  protected browser?: ChromiumBrowser;
  protected context?: BrowserContext;

  constructor(url: string) {
    this.url = url;
  }

  private isReady: boolean = false;
  async ready() {
    if (!this.isReady) {
      this.browser = await chromium.launch({
        // headless: true,
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
      this.isReady = true;
    }
  }

  private static registry: Record<string, new (url: string) => Scraper> = {};
  static register(domain: string, ScraperClass: new (url: string) => Scraper) {
    this.registry[domain] = ScraperClass;
  }

  static async init(url: string): Promise<Scraper> {
    for (const domain in this.registry) {
      if (url.includes(domain)) {
        const ScraperClass = this.registry[domain];
        const scraper = new ScraperClass(url);
        await scraper.ready();
        return scraper;
      }
    }
    throw new Error(`No scraper registered for this URL (${url}).`);
  }
}
