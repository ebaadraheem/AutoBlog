import { open } from "sqlite";
import sqlite3 from "sqlite3";
import path from "path";

let db;

export async function initializeDatabase() {
  try {
    const dbPath = process.env.DB_FILE_PATH || path.resolve(process.cwd(), "blog.sqlite");

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });

    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS articles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    summary TEXT,
    author TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);`;

    await db.run(createTableQuery);

    console.log(`SQLite database connected at: ${dbPath}`);
  } catch (err) {
    console.error("Error initializing SQLite database:", err);
    process.exit(1);
  }
}

export function query(sql, params = []) {
  return db.all(sql, params);
}

export function run(sql, params = []) {
  return db.run(sql, params);
}
