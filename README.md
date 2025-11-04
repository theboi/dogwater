## Development

1. Run `interface` Next.js server and `inference` Python server.
```zsh
cd interface
npm run dev
```
```zsh
cd inference
source ./bin/activate
python main.py
```
2. Link localhost:3000 (or the respective port) to the web via `ngrok`.
```zsh
ngrok http 3000
```
3. Pass the exposed endpoint URL to the Telegram Bot.
```zsh
curl -X POST https://api.telegram.org/bot<TELEGRAM_TOKEN>/setWebhook -H "Content-type: application/json" -d '{"url": "<ENDPOINT>/api/webhook", "drop_pending_updates": "true"}'
```