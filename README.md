# ⚡ AutoBlog: Full-Stack Automated Content Platform

This repository contains the solution for the Full-Stack Technical Challenge, focusing on building and deploying a fully automated blog application with AI-powered content generation.

The application features a modern frontend for viewing articles, a Node.js backend with AI integration for content creation, and a production-ready CI/CD pipeline leveraging **AWS ECR, CodeBuild, and EC2**.

## 🔗 Live Deployment Details

| Item | Status | Link |
| :--- | :--- | :--- |
| **Live Demo URL** | Deployed on EC2 | `https://autoblog.skillmorph.store` 

---

## 📐 Architecture Overview

The system is a fully containerized, microservice-like architecture composed of three main services orchestrated by Docker Compose:

1. **Frontend** – React/Vite user interface served on port 80
2. **Backend** – Node.js/Express API with database and AI scheduler on port 3003
3. **Proxy** – Nginx reverse proxy routing traffic to appropriate services

**Traffic Flow:** `User (Port 8080)` → `Nginx Proxy` → Routes to Backend (`/api`) or Frontend (`/`)

---

## 🛠 Tech Stack

### Frontend
- **React** with **TypeScript** and **Vite**
- **Tailwind CSS** for styling
- **React Router** for client-side navigation
- **React Markdown** with `remark-gfm` and `rehype-raw` for secure Markdown rendering

### Backend & Data
- **Node.js** with **Express.js**
- **SQLite** for persistent article storage (mounted via Docker Volume)
- **AI/LLM:** **Gemini 2.5 Flash** via **LangChain** and `@langchain/google-genai`

### DevOps & Infrastructure
- **Docker** with multi-stage builds for optimized images
- **Docker Compose** for local and EC2 orchestration
- **Nginx** reverse proxy
- **AWS ECR**, **CodeBuild**, and **EC2** for CI/CD and deployment

---

## 💡 Key Technical Decisions

### 1. Robust AI Content Generation

The content generation logic in `backend/services/aiAgent.js` implements structured output for reliability:

- Uses a **Zod schema** (`ArticleOutputSchema`) to strictly define article fields: title, content, summary, and author
- The `@langchain/google-genai` module is configured with `.withStructuredOutput(ArticleOutputSchema)` to enforce valid JSON responses from the LLM, preventing malformed database entries
- An external tool fetches live trending topics before generating articles

### 2. Automated Scheduling

- The backend uses `node-cron` to automatically generate and save a new article **daily at 1:00 AM UTC**
- The generation function also runs on server startup, ensuring the application has content available immediately

### 3. CI/CD Pipeline (AWS)

**CodeBuild** executes the following steps via `infra/buildspec.yml`:
1. Authenticate with AWS ECR
2. Build frontend and backend images using multi-stage Dockerfiles
3. Tag images with both `latest` and a unique commit hash
4. Push tagged images to their respective ECR repositories

**EC2 Deployment:** The `infra/scripts/deploy.sh` script runs on the EC2 instance to:
1. Authenticate with ECR
2. Pull the latest images
3. Deploy the entire stack using `docker-compose up -d --force-recreate` for zero-downtime updates

---

## 🚀 Local Development Setup

To run the application locally, you need **Docker** and **Docker Compose** installed.

### Prerequisites

Create a `.env` file in the project root with the following variables:

```env

AWS_REGION=<Your_AWS_Region>
AWS_ACCOUNT_ID=<Your_AWS_Account_ID>

FRONTEND_IMAGE_NAME=autoblog-frontend
BACKEND_IMAGE_NAME=autoblog-backend

GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
HASDATA_API_URL="https://api.hasdata.com/scrape/google/news"
HASDATA_API_KEY="YOUR_HASDATA_API_KEY"

```

### Running the Application

1. **Build and run the application:**
   ```bash
   docker-compose up --build
   ```
   This command builds the images, creates the Docker network, and starts the frontend, backend, and proxy containers.

2. **Access the application:**
   Open your browser and navigate to `http://localhost:8080`

### Database Persistence

The SQLite database (`blog.sqlite`) is stored in a named Docker volume (`blog-data`) defined in `docker-compose.yaml`. This ensures articles persist across container restarts and updates.

---

## 📝 Notes

- Ensure all required API keys are set before running the application
- The database volume is automatically created and managed by Docker Compose
- For production deployment, update the environment variables in your EC2 instance or AWS Systems Manager Parameter Store
