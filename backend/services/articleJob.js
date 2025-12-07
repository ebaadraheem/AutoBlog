import cron from "node-cron";
import { run } from "./db.js";
import { generateArticle } from "./aiAgent.js";

async function saveArticle(article) {
  try {
    const { title, content, summary, author } = article;

    const sql = `
      INSERT INTO articles (title, content, summary, author)
      VALUES ($1, $2, $3, $4);
    `;

    const result = await run(sql, [title, content, summary, author]);

    console.log(`Successfully saved new article with ID: ${result.lastID}`);
  } catch (error) {
    console.error("Error saving article to DB:", error);
  }
}

async function generateAndSaveNewArticle() {
  console.log("Starting automated article generation...");
  try {
    const newArticle = await generateArticle();

    if (newArticle && newArticle.success && newArticle.article) {
      await saveArticle(newArticle.article);
    } else {
      console.log("AI generation returned no article.");
    }
  } catch (error) {
    console.error("Article generation and save failed:", error);
  }
}

async function startArticleGenerationJob() {
  const CRON_SCHEDULE = "0 1 * * *";
  cron.schedule(
    CRON_SCHEDULE,
    () => {
      console.log(
        `Running daily article generation job: ${new Date().toISOString()}`
      );
      generateAndSaveNewArticle();
    },
    {
      scheduled: true,
      timezone: "Etc/UTC", 
    }
  );

  console.log(`Article generation scheduled for daily run at 1:00 AM UTC.`);
  generateAndSaveNewArticle();
}

export { startArticleGenerationJob, generateAndSaveNewArticle };
