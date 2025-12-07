import { tool } from "@langchain/core/tools";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const ArticleOutputSchema = z.object({
  title: z.string().describe("Professional blog post title"),
  content: z.string().describe("Concise, well-structured article content"),
  summary: z.string().describe("A 1-2 sentence summary of the article."),
  author: z.string().describe("Professional author name"),
});

const getTrendingTopicsTool = tool(
  async () => {
    try {
      const HASDATA_API_KEY = process.env.HASDATA_API_KEY;
      const HASDATA_URL = process.env.HASDATA_API_URL||"https://api.hasdata.com/scrape/google/news";
      const params = new URLSearchParams({
        q: "top technology stories",
        hl: "en",
        geo: "US",
      });

      const response = await fetch(`${HASDATA_URL}?${params.toString()}`, {
        method: "GET",
        headers: {
          "x-api-key": HASDATA_API_KEY,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `HasData API failed with status: ${
            response.status
          }. Body: ${errorBody.slice(0, 100)}...`
        );
      }

      const data = await response.json();

      const newsResults = data.newsResults ?? [];
      const topics = newsResults.slice(0, 5).map((item) => item.title);

      if (topics.length === 0) {
        throw new Error(
          "HasData API returned no news topics or the response structure was unexpected."
        );
      }

      return { topics };
    } catch (error) {
      console.log(
        "Could not fetch live trends, using defaults. Error:",
        error.message
      );
      return {
        topics: [
          "Artificial Intelligence Developments",
          "Quantum Computing Breakthroughs",
          "Sustainable Technology",
          "Cybersecurity Trends",
          "Cloud Computing Innovation",
        ],
      };
    }
  },
  {
    name: "getTrendingTopics",
    description: "Fetch trending topics for blog content",
    schema: z.object({}),
  }
);

export async function generateArticle() {
  try {
    console.log("Fetching trending topics...");
    const topicsResult = await getTrendingTopicsTool.invoke({});
    const topics = topicsResult.topics || [];

    if (!topics.length) throw new Error("No trending topics found");

    const selectedTopic = topics[Math.floor(Math.random() * topics.length)];
    console.log(`Selected topic: ${selectedTopic}`);

    console.log("Generating professional article...");

    const prompt = `
You are an expert senior technology journalist writing for a high-authority publication.

Write a complete, well-structured technology article about the following trending topic:

Topic: ${selectedTopic}

STRICT REQUIREMENTS:
- Length: 900-1100 words (do NOT stop early)
- Format: clean Markdown (H1, H2, H3, paragraphs, lists)
- MUST include these sections clearly:
  - Introduction (2-3 paragraphs)
  - 3-4 Major Key Sections (H2 with optional H3 subsections)
  - Final Conclusion with clear insights (1-2 paragraphs)
- No incomplete sentences, no abrupt cut-offs
- No trailing commas in JSON
- Author name must be realistic and professional
- Summary must be a polished, journalistic 1-2 sentence overview
IMPORTANT:
- Ensure the *conclusion is fully written and complete*
- Ensure the Markdown structure is NOT broken
- Ensure no Markdown headings or formatting escape JSON strings
- Avoid extremely long sentences to reduce truncation risk

Return ONLY valid JSON matching EXACTLY this format:
{
  "title": string,
  "summary": string,
  "content": string,
  "author": string
}
`;

    const model = new ChatGoogleGenerativeAI({
      model: "gemini-2.5-flash",
      apiKey: process.env.GEMINI_API_KEY,
      temperature: 0.7,
    }).withStructuredOutput(ArticleOutputSchema);

    let article;
    try {
      article = await model.invoke(prompt);
    } catch (err) {
      if (err.message.includes("429")) {
        console.warn("Rate limit exceeded. Retrying in 2 seconds...");
        await new Promise((res) => setTimeout(res, 2000));
        article = await model.invoke(prompt);
      } else {
        throw err;
      }
    }

    console.log("Article generated successfully");

    return {
      success: true,
      article: article,
      message: `Article "${article.title}" by ${article.author} has been created!`,
    };
  } catch (error) {
    console.error("Error generating article:", error.message);
    return {
      success: false,
      error: error.message,
    };
  }
}
