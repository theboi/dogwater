import { Scraper } from "../scraper/scraper";
import { SafeTelegramBot } from "../helper/safeTelegramBot";

export async function slashInsight(bot: SafeTelegramBot, url: string) {
  const scraper = new Scraper();
  const scraperPage = await scraper.newPage(url);

  const post = await scraperPage.scrape();

  console.log(post)

  await bot.safeSendMessage(`Page Title: ${post.pageTitle}\nContent: ${post.content ?? "No Content Found."}`)
}