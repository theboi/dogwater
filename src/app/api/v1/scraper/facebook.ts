import { Scraper } from "./scraper";

class FacebookScraper extends Scraper {
  scrape(): void {
    console.log("Scraping Facebook:", this.url);
  }
}
