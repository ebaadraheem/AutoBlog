import express from "express";
import { query } from "../services/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT 
        id, 
        title, 
        summary,
        author,
        created_at AS createdAt
      FROM articles
      ORDER BY created_at DESC;
    `;

    const articles = await query(sql);
    res.json(articles);
  } catch (error) {
    console.error("Error fetching article list:", error);
    res.status(500).json({ error: "Failed to retrieve articles" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const sql = `
            SELECT id, title,summary, content, created_at AS createdAt, author
            FROM articles
            WHERE id = $1;
        `;

    const rows = await query(sql, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: "Article not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(`Error fetching article: ${id}`, error);
    res.status(500).json({ error: "Failed to retrieve article details" });
  }
});

export default router;
