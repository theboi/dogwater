import { Scraper } from "../scraper/scraper";
import { SafeTelegramBot } from "../helper/safeTelegramBot";
import TelegramBot from "node-telegram-bot-api";

type getCommand = (bot: SafeTelegramBot, url: string) => void;

export async function slashInsight(bot: SafeTelegramBot, url: string) {
  const scraper = new Scraper();
  const scraperPage = await scraper.newPage(url);

  const post = await scraperPage.scrape();

  console.log(post)

  await bot.safeSendMessage(`The page title is: ${post.pageTitle}\nContent: ${post.content ?? "No Content Found."}`)
}