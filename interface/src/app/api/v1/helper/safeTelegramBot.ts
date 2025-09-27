import TelegramBot from "node-telegram-bot-api";

const TELEGRAM_MSG_LIMIT = 4095

// Extends TelegramBot with safeXX functions which automatically handles common errors.
export class SafeTelegramBot extends TelegramBot {
  chatId: number;

  constructor(chatId: number, token: string, options?: TelegramBot.ConstructorOptions) {
    super(token, options)
    this.chatId = chatId
  }

async safeSendMessage(msg: string, options?: TelegramBot.SendMessageOptions) {
    const newMsg = parseMarkdownEscape(msg);
    for (let i = 0; i < newMsg.length; i += TELEGRAM_MSG_LIMIT) {
      await this.sendMessage(this.chatId, newMsg.slice(i, i+TELEGRAM_MSG_LIMIT), options);
    }
  }
}

// As per the specifications in https://core.telegram.org/bots/api#formatting-options
export function parseMarkdownEscape(unparsed: string): string {
  return unparsed.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, "\\$1");
}
