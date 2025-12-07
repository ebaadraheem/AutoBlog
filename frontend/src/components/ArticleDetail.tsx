import React, { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import {
  formatDate,
  LoadingSpinner,
  ScrollToTop,
} from "../components/Func_Types";
import type { Article } from "../components/Func_Types";
import { fetchArticleById } from "../api/article";

const ArticleDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();

  const [article, setArticle] = useState<Article | null>(
    () => (location.state as Article) || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = useCallback(async (articleId: string) => {
    try {
      setLoading(true);
      setError(null);

      const fetchedArticle = await fetchArticleById(articleId);

      if (!fetchedArticle) {
        setError("Article not found or deleted.");
        setArticle(null);
      } else {
        setArticle(fetchedArticle);
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to fetch article details. Check backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    ScrollToTop();

    if (id && !article) {
      loadArticle(id);
    }
  }, [id, article, loadArticle]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !article) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-gray-600 mb-4">
          {error || `Unable to load article details for id: ${id}`}
        </p>

        <button
          onClick={() => navigate("/")}
          className="text-indigo-700 underline"
        >
          Go Back to Home
        </button>
      </div>
    );
  }
const cleanedContent = article.content.replace(/^# .+\n/, "");
  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-indigo-700 cursor-pointer hover:text-indigo-500 mb-6 font-medium transition-colors"
      >
        <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
        Back
      </button>

      <article className="bg-white p-8 rounded-xl shadow-2xl border border-gray-100">
        <h1 className="text-4xl max-sm:text-2xl font-extrabold text-gray-900 mb-4 leading-tight">
          {article.title}
        </h1>

        <div className="text-sm max-sm:text-xs text-gray-500 mb-8 border-b pb-4">
          By{" "}
          <span className="font-semibold text-gray-700">{article.author}</span>{" "}
          • {formatDate(article.createdAt)}
        </div>

        <div className="max-w-none">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              h1: ({ node, ...props }) => (
                <h1
                  className="text-3xl font-extrabold text-gray-900 mt-8 mb-4 leading-tight"
                  {...props}
                />
              ),
              h2: ({ node, ...props }) => (
                <h2
                  className="text-2xl font-bold text-gray-900 mt-6 mb-4"
                  {...props}
                />
              ),
              h3: ({ node, ...props }) => (
                <h3
                  className="text-xl font-bold text-gray-900 mt-4 mb-3"
                  {...props}
                />
              ),
              p: ({ node, ...props }) => (
                <p className="text-gray-700 leading-relaxed mb-4" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <strong className="font-semibold text-gray-900" {...props} />
              ),
            }}
          >
            {cleanedContent}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetail;
