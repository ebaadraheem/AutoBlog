import React, { useState, useEffect, useCallback } from "react";
import type { Article } from "../components/Func_Types";
import AllArticles from "../components/AllArticles";
import { useNavigate } from "react-router-dom";
import { fetchArticles } from "../api/article";
const Home: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const loadArticles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedArticles = await fetchArticles();
      setArticles(fetchedArticles);
    } catch (err) {
      console.error("API Error:", err);
      setError("Could not load articles. Check backend connectivity.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleSelectArticle = (article: Article) => {
    navigate(`/description/${article.id}`);
  };

  return (
    <div className="min-h-[75vh] font-sans antialiased ">
      <main className="py-2">
        {error && (
          <div className="max-w-6xl mx-auto p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        <AllArticles
          articles={articles}
          onArticleSelect={handleSelectArticle}
          onRefresh={loadArticles}
          loading={loading}
        />
      </main>
    </div>
  );
};

export default Home;
