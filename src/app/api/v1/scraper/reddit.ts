import { BrowserContext, ChromiumBrowser } from "playwright";
import { DogwaterPost } from "../types/dogwater";
import { Scraper } from "./base";
import * as cheerio from "cheerio";
import fs from "fs";
import { expect } from "playwright/test";

export class RedditScraper extends Scraper {
  async scrape(): Promise<DogwaterPost> {
    this.ready();
    console.log("Scraping Reddit:", this.url);

    const page = await (this.context as BrowserContext).newPage();
    await page.goto(this.url);
    const title = await page.title();
    const content = await page.content();
    const $ = cheerio.load(content);

    fs.writeFile("output.html", content, () => {});

    const comments = $.extract({
      comments: [
        {
          selector: "shreddit-comment",
          value: {
            commentMeta: {
              selector: 'div[slot="commentMeta"]',
              value: {
                author: 'faceplate-tracker[noun="comment_author"] a',
                datetime: {
                  selector: "a time",
                  value: "datetime",
                },
              },
            },
            message: 'div[slot="comment"]',
            id: {
              selector: 'div[slot="comment"]',
              value: "id",
            },
          },
        },
      ],
    });
    const post = $.extract({
      post: {
        selector: "shreddit-post",
        value: {
          title: 'h1[slot="title"]',
          content: "shreddit-post-text-body",
        },
      },
    });

    // Certain properties cannot be obtained via Cheerio because it lives in #shadow-root (shadow DOM) and is not exposed when running page.content()
    const unresolvedLikes = await page.locator('shreddit-comment shreddit-comment-action-row span[slot="vote-button"] faceplate-number').all()
    const likes = await Promise.all(unresolvedLikes.map((e) => e.textContent()));

    console.log(comments);
    console.log(likes);

    await (this.browser as ChromiumBrowser).close();

    return {
      id: "",
      pageTitle: title,
      postTitle: post.post?.title as string,
      date: new Date(),
      author: "",
      content: post.post?.content as string,
      likes: -1,
      comments: comments.comments.map((e, i) => ({
        id: (e.id as string).slice(0, -23), // "-comment-rtjson-content".length=23
        date: new Date(e.commentMeta?.datetime as string),
        author: (e.commentMeta?.author as string).trim(),
        message: (e.message as string).trim(),
        likes: Number(likes[i] ?? "-1"),
        subcomments: [],
      })),
    };
  }
}
