import { Scraper } from "./base";

class FacebookScraper extends Scraper {
  scrape(): void {
    console.log("Scraping Facebook:", this.url);
  }
}
