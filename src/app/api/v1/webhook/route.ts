import TelegramBot from "node-telegram-bot-api";
import { NextRequest } from "next/server";
import FF from "../forum";
import { configDotenv } from "dotenv";
import { parseCommand } from "../helper/parseCommand";

configDotenv();
const isProduction = process.env.VERCEL_ENV === "production";

export async function POST(req: NextRequest) {
  const bot = new TelegramBot(process.env.TELEGRAM_TOKEN ?? "MISSING_TOKEN");
  const msg: TelegramBotMessage = (await req.json()).message;

  try {
    const chatId = msg.chat.id;
    const { cmd, args } = parseCommand(msg);

    await bot.sendMessage(chatId, `Message received: ${msg.text}`);

    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(`Webhook error: ${err}`, {
      status: 200, // 200 because otherwise Telegram will keep pinging non-stop until 200 is returned
    });
  }
}
