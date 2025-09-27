import TelegramBot from "node-telegram-bot-api";
import { NextRequest } from "next/server";
import { configDotenv } from "dotenv";
import { parseCommand } from "../helper/parseCommand";
import { TelegramBotMessage } from "../types/telegramBot";
import { DogwaterCommand } from "../types/dogwater";
import { slashInsight } from "../endpoints/insight";
import { Scraper } from "../scraper/base";
import { RedditScraper } from "../scraper/reddit";
import { SafeTelegramBot } from "../helper/safeTelegramBot";

configDotenv();
const isProduction = process.env.VERCEL_ENV === "production";

Scraper.register("reddit.com", RedditScraper);

export async function POST(req: NextRequest) {
  const msg: TelegramBotMessage = (await req.json()).message;
  const chatId = msg.chat.id;

  const bot = new SafeTelegramBot(chatId, process.env.TELEGRAM_TOKEN ?? "MISSING_TOKEN");

  try {
    const { cmd, args } = parseCommand(msg);
    
    switch (cmd) {
      case DogwaterCommand.Insight: slashInsight(bot, args[0])
      default: 
        // await bot.sendMessage(chatId, `*Message received*\n\n${parseMarkdownEscape(msg.text)}`, { parse_mode: "MarkdownV2" });
    }

    return new Response("OK", { status: 200 });
  } catch (e) {
    await bot.sendMessage(chatId, `*Unexpected error occurred*`, { parse_mode: "MarkdownV2" });
    // await bot.sendMessage(chatId, `*Unexpected error occurred*\n\n${e instanceof Error ? e.message : e}`, { parse_mode: "MarkdownV2" });
    return new Response(`Webhook error: ${e}`, {
      status: 200, // 200 because otherwise Telegram will keep pinging non-stop until 200 is returned
    });
  }
}
