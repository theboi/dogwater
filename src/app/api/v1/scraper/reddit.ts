import { BrowserContext, ChromiumBrowser } from "playwright";
import { DogwaterPost } from "../types/dogwater";
import { Scraper } from "./base";
import * as cheerio from "cheerio";
import fs from "fs";

export class RedditScraper extends Scraper {
  async scrape(): Promise<DogwaterPost> {
    this.ready();
    console.log("Scraping Reddit:", this.url);

    const page = await (this.context as BrowserContext).newPage();
    await page.goto(this.url);
    const title = await page.title();

    // await page.locator(`button[data-read-more-experiment-name='desktop_post_body_read_more']`).click();
    console.log("clicked")
    const content = await page.content();
    const postContent = await page.locator("shreddit-post-text-body").textContent()
    // const $ = cheerio.load(content);

    fs.writeFile('output.html', content, () => {})

    // console.log($('#comment-tree').text())

    // const postContent = $("shreddit-post-text-body");
    // console.log(postContent.text())

    await (this.browser as ChromiumBrowser).close();

    return {
      id: "",
      pageTitle: title,
      postTitle: "",
      date: new Date(),
      author: "",
      content: postContent ?? "NULL",
      likes: 0,
      comments: [],
    };
  }
}
