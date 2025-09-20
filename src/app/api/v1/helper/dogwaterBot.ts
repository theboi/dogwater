import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_MSG_LIMIT = 4095

// Safe version of Telegram bot that automatically handles common errors.
export class DogwaterBot {
  bot: TelegramBot;
  chatId: number;

  constructor(bot: TelegramBot, chatId: number) {
    this.bot = bot;
    this.chatId = chatId;
  }

  async sendMessage(msg: string) {
    const newMsg = parseMarkdownEscape(msg);
    for (let i = 0; i < newMsg.length; i += TELEGRAM_MSG_LIMIT) {
      await this.bot.sendMessage(this.chatId, newMsg.slice(i, i+TELEGRAM_MSG_LIMIT));
    }
  }
}

// As per the specifications in https://core.telegram.org/bots/api#formatting-options
export function parseMarkdownEscape(unparsed: string): string {
  return unparsed.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
}