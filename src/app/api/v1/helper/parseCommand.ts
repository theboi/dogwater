import { DogwaterCommand } from "../types/dogwater";
import { TelegramBotMessage } from "../types/telegramBot";

export function parseCommand(msg: TelegramBotMessage): { cmd: DogwaterCommand, args: string[] } {
  const delimited_entries = msg.text.split(" ");
  const cmd = delimited_entries[0].match(/^\/(\w+)$/)?.[1];
  const args = delimited_entries.slice(1);

  if (cmd === undefined) {
    throw new Error("Invalid Dogwater command: Messages must begin with '/command'.")
  } else if (!(Object).values(DogwaterCommand).includes(cmd as DogwaterCommand)) {
    throw new Error(`Invalid Dogwater command: Only the following commands are valid\n${(Object).values(DogwaterCommand).join(", ")}.`)
  }

  return { cmd: <DogwaterCommand>cmd, args };
  
}