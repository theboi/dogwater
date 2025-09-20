import { Scraper } from "../scraper/base";
import { DogwaterBot } from "../helper/dogwaterBot";

type getCommand = (bot: DogwaterBot, url: string) => void;

export async function getInsight(bot: DogwaterBot, url: string) {
  const scraper = await Scraper.init(url)
  const post = await scraper.scrape();

  await bot.sendMessage(`The page title is: ${post.pageTitle}\nContent: ${post.content}`)
}