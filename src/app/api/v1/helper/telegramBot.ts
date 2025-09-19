export interface TelegramBotBody {
  update_id: number;
  message: TelegramBotMessage;
}

export interface TelegramBotMessage {
  message_id: number;
  from: TelegramBotSender;
  chat: TelegramBotChat;
  date: number;
  text: string;
}

export interface TelegramBotChat {
  id: number;
  first_name: string;
  username: string;
  type: string;
}

export interface TelegramBotSender {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
}