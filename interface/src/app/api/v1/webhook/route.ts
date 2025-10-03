import { NextRequest } from "next/server";
import { configDotenv } from "dotenv";
import { parseCommand } from "../helper/parseCommand";
import { TelegramBotMessage } from "../types/telegramBot";
import { DogwaterCommand } from "../types/dogwater";
import { slashInsight } from "../endpoints/insight";
import { SafeTelegramBot } from "../helper/safeTelegramBot";
import { RedditPostScraperPage } from "../scraper/redditPost";
import { ScraperPage } from "../scraper/scraperPage";
import { slashBucket } from "../endpoints/bucket";

configDotenv();
const isProduction = process.env.VERCEL_ENV === "production";

ScraperPage.register("reddit.com", RedditPostScraperPage);

export async function POST(req: NextRequest) {
  const msg: TelegramBotMessage = (await req.json()).message;
  const chatId = msg.chat.id;

  const bot = new SafeTelegramBot(chatId, process.env.TELEGRAM_TOKEN ?? "MISSING_TOKEN");

  try {
    const { cmd, args } = parseCommand(msg);

    switch (cmd) {
      case DogwaterCommand.Insight: await slashInsight(bot, args[0]); break;
      case DogwaterCommand.Bucket: await slashBucket(bot, args[0]); break;
      default: 
        // await bot.sendMessage(chatId, `*Message received*\n\n${parseMarkdownEscape(msg.text)}`, { parse_mode: "MarkdownV2" });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    if (isProduction) throw e;
    await bot.safeSendMessage(`*Unexpected error occurred*\n\n${e instanceof Error ? e.message : e}`, { parse_mode: "MarkdownV2" })
    return new Response(`Webhook error: ${e}`, {
      status: 200, // 200 because otherwise Telegram will keep pinging webhook non-stop until 200 is returned
    });
  }
}
