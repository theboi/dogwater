interface TelegramBotBody {
  update_id: number;
  message: TelegramBotMessage;
}

interface TelegramBotMessage {
  message_id: number;
  from: TelegramBotSender;
  chat: TelegramBotChat;
  date: number;
  text: string;
}

interface TelegramBotChat {
  id: number;
  first_name: string;
  username: string;
  type: string;
}

interface TelegramBotSender {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  language_code: string;
}