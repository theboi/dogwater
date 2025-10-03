import { Scraper } from "../scraper/scraper";
import { SafeTelegramBot } from "../helper/safeTelegramBot";
import { getBaseUrl } from "../helper/getBaseUrl";

export async function slashBucket(bot: SafeTelegramBot, url: string) {
  const scraper = new Scraper();
  const scraperPage = await scraper.newPage(url);

  const post = await scraperPage.scrape();

  // console.log(post)

  const summarizePostResponse = await fetch(`${getBaseUrl()}/api/v1/model/summarize_post`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: post.content })
  })

  if (!summarizePostResponse.ok) {
    throw new Error("Failed to summarize post")
  }
  const summarizedPost = await summarizePostResponse.json();

  const commentsPrependPost = post.comments.map(e => `POST: ${summarizedPost.summary}\nCOMMENT: ${e.message}`)


  const clusterCommentsResponse = await fetch(`${getBaseUrl()}/api/v1/model/cluster_comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      comments: commentsPrependPost,
      persona: "Singapore"
    })
  });

  if (!clusterCommentsResponse.ok) {
    throw new Error("Failed to cluster comments");
  }
  const clusteredComments = await clusterCommentsResponse.json();
  console.log(JSON.stringify(clusteredComments))

  await bot.safeSendMessage(summarizedPost.summary)
}
