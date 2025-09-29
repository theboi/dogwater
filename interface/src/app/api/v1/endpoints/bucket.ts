import { Scraper } from "../scraper/scraper";
import { SafeTelegramBot } from "../helper/safeTelegramBot";
import { InferenceClient } from "@huggingface/inference";

export async function slashBucket(bot: SafeTelegramBot, url: string) {
  const scraper = new Scraper();
  const scraperPage = await scraper.newPage(url);

  const post = await scraperPage.scrape();

  // console.log(post)

  const client = new InferenceClient(process.env.HF_TOKEN);

  const summarisedPost = await client.summarization({
    model: "philschmid/distilbart-cnn-12-6-samsum",
    inputs: post.content!,
    provider: "hf-inference",
  });

  const commentsPrependPost = post.comments.map(e => `POST: ${summarisedPost}\nCOMMENT: ${e.message}`)

  await bot.safeSendMessage(summarisedPost.summary_text)
}
