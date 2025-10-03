import { ScraperPage } from "./scraperPage";
import { DogwaterPost } from "../types/dogwater";
import * as cheerio from "cheerio";
import fs from "fs";

export class RedditPostScraperPage extends ScraperPage {
  async scrape(): Promise<DogwaterPost> {
    console.log("Scraping Reddit:", this.url);

    const title = await this.page!.title();
    const content = await this.page!.content();
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
    console.log(comments, post)

    // Certain properties cannot be obtained via Cheerio because it lives in #shadow-root (shadow DOM) and is not exposed when running page.content()
    const unresolvedLikes = await this.page!.locator('shreddit-comment shreddit-comment-action-row span[slot="vote-button"] faceplate-number').all()
    const likes = await Promise.all(unresolvedLikes.map((e) => e.textContent()));

    await this.page!.close();

    return {
      id: "",
      pageTitle: title,
      postTitle: post.post?.title as string,
      date: new Date(),
      author: "",
      content: post.post!.content!.trim().slice(0, -9).trim(), // Get rid of "Read more" hidden text
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
