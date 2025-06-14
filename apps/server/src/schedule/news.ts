import {db} from "@/db";
import {financeSummary, newsSummary} from "@/db/schema";
import { Models, safeGenerateText } from "@/ai";
import { NewsModule } from "@/lib/modules/news";

const newsModule = new NewsModule();
interface SummaryResponse {
  title: string;
  url: string;
  summary: string;
}

export async function coindeskNews() {
  const newNews = await newsModule.fetchNewNews();
  if (newNews.length === 0) return;
  const message = `You are an AI assistant specializing in summarizing financial news. Your task is to process a list of news articles and provide a concise summary for each one.

You will be given a JSON array of news articles. For each article, extract the \`TITLE\`, \`URL\`, and \`BODY\`.

Your response MUST be a valid JSON array \`[...]\`. Each object in the output array must correspond to one article from the input and follow this exact schema:

{
  "title": "The original TITLE of the article.",
  "url": "The original URL of the article.",
  "summary": "A concise, neutral summary of the article in 2-4 sentences, capturing the main points."
}

**Instructions:**
1.  Process every article provided in the input array.
2.  Adhere strictly to the JSON schema provided above.
3.  Do not include any explanations, apologies, or introductory text. Your entire output must be the JSON array itself.

Here is the news data:
${JSON.stringify(newNews, null, 2)}`;

  const result = await safeGenerateText({
    messages: [
      {
        role: "user",
        content: message,
      }
    ],
    modelName: Models.GPT_4_MINI,
  });
  if (!result.isErr()) {
    const text = result;
    const summaryObj: SummaryResponse[] = JSON.parse(text.value.text);

    const summaries = summaryObj.map((obj, index) => ({ originalData: newNews[index], summary: obj.summary }));
    await db.insert(newsSummary).values(summaries);
    return text;
  } else {
    console.error("❌ Prompt Error:", result.error);
    return 'please try again';
  }
}

export async function twitterNews() {
  const latestTwitterNews = "";
}