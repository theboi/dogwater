import { ScraperPage } from "./scraperPage";
import { DogwaterPost } from "../types/dogwater";
import * as cheerio from "cheerio";
import { hardwarezoneNoOfLikes } from "../helper/hardwarezoneNoOfLikes";

export class HardwarezonePostScraperPage extends ScraperPage {
  async scrape(): Promise<DogwaterPost> {
    console.log("Scraping HardwareZone:", this.url);
    const content = await this.page!.content();
    const pageTitle = await this.page?.title();

    const $ = cheerio.load(content);

    $("blockquote").remove()
    const extractedPage = $.extract({
      title: ".p-title-value",
      author: ".p-description ul:first-child a",
      datetime: {
        selector: ".p-description ul:last-child time",
        value: "datetime",
      },
      pageNumber: ".block-outer--after .pageNav-main:last-child a",
      comments: [
        {
          selector: ".message",
          value: {
            id: {
              selector: "span",
              value: "id",
            },
            datetime: {
              selector: ".message-attribution-main time",
              value: "datetime",
            },
            author: ".message-userDetails .message-name",
            content: ".message-content .bbWrapper",
            reactionSummary: ".reactionsBar-link"
          },
        },
      ],
    });

    // console.log(extractedPage);
    // this.page?.goto(`${this.url}/page-${extractedPage.pageNumber}`)

    return {
      id: extractedPage.comments[0].id!,
      pageTitle: pageTitle ?? "No Title",
      postTitle: extractedPage.title ?? "No Title",
      date: new Date(extractedPage.datetime!),
      author: extractedPage.author ?? "No Author",
      content: extractedPage.comments[0].content?.trim() ?? "No Content",
      likes: hardwarezoneNoOfLikes(extractedPage.comments[0].reactionSummary ?? ""),
      comments: extractedPage.comments.slice(1).map(e => ({
        id: e.id!,
        date: new Date(e.datetime!),
        author: e.author ?? "No Author",
        message: e.content?.trim() ?? "No Content",
        likes: hardwarezoneNoOfLikes(e.reactionSummary ?? ""),
        subcomments: [], // HardwareZone has no subcomments feature
      })),
    };
  }
}
