import { Scraper } from "../scraper/scraper";
import { SafeTelegramBot } from "../helper/safeTelegramBot";
import { InferenceClient } from "@huggingface/inference";
import { getBaseUrl } from "../helper/getBaseUrl";

export async function slashBucket(bot: SafeTelegramBot, url: string) {
  const scraper = new Scraper();
  const scraperPage = await scraper.newPage(url);

  const post = await scraperPage.scrape();

  // console.log(post)

  const client = new InferenceClient(process.env.HF_TOKEN);

  const summarizePostResponse = await fetch(`${getBaseUrl()}/api/v1/model/summarize_post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: post.content })
  })

  if (!summarizePostResponse.ok) {
    throw new Error("Failed to summarize post")
  }

  const summarizedPost = await summarizePostResponse.json();

  const commentsPrependPost = post.comments.map(e => `POST: ${summarizedPost.summary}\nCOMMENT: ${e.message}`)

  await bot.safeSendMessage(summarizedPost.summary)
}
