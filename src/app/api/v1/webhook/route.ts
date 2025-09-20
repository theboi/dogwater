import TelegramBot from "node-telegram-bot-api";
import { NextRequest } from "next/server";
import { configDotenv } from "dotenv";
import { parseCommand } from "../helper/parseCommand";
import { TelegramBotMessage } from "../types/telegramBot";
import { DogwaterCommand } from "../types/dogwater";
import { getInsight } from "../endpoints/insight";
import { Scraper } from "../scraper/base";
import { RedditScraper } from "../scraper/reddit";
import { DogwaterBot } from "../helper/dogwaterBot";

configDotenv();
const isProduction = process.env.VERCEL_ENV === "production";

Scraper.register("reddit.com", RedditScraper);

export async function POST(req: NextRequest) {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN ?? "MISSING_TOKEN");
  const msg: TelegramBotMessage = (await req.json()).message;
  const chatId = msg.chat.id;

  try {
    const { cmd, args } = parseCommand(msg);
    
    switch (cmd) {
      case DogwaterCommand.Insight: getInsight(new DogwaterBot(bot, chatId), args[0])
      default: 
        // await bot.sendMessage(chatId, `*Message received*\n\n${parseMarkdownEscape(msg.text)}`, { parse_mode: "MarkdownV2" });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    await bot.sendMessage(chatId, `*Unexpected error occurred*\n\n${e instanceof Error ? e.message : e}`, { parse_mode: "MarkdownV2" });
    return new Response(`Webhook error: ${e}`, {
      status: 200, // 200 because otherwise Telegram will keep pinging non-stop until 200 is returned
    });
  }
}
