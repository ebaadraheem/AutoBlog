import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import articleRoutes from "./routes/articleRoutes.js";
import { initializeDatabase } from "./services/db.js";
import { startArticleGenerationJob } from "./services/articleJob.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/articles", articleRoutes);
app.get("/api", (req, res) => {
    res.send("Welcome to the Blob Generator Backend!");
});

// Initialization
async function startServer() {
  await initializeDatabase();
  startArticleGenerationJob();
  app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
  });
}

startServer();
