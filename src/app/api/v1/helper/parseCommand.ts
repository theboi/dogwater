export function parseCommand(msg: TelegramBotMessage) {
  const delimited_entries = msg.text.split(" ");
  const cmd = delimited_entries[0].match(/^\/(\w+)$/)?.[1];
  const args = delimited_entries.slice(1);

  return { cmd, args };
}