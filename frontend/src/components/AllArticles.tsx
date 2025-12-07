import React, { useEffect } from "react";
import type { Article } from "./Func_Types";
import { RefreshCcw } from "lucide-react";
import { LoadingSpinner, ScrollToTop } from "./Func_Types";
import ArticleCard from "./ArticleCard";

const AllArticles: React.FC<{
  articles: Article[];
  onArticleSelect: (article: Article) => void;
  onRefresh: () => void;
  loading: boolean;
}> = ({ articles, onArticleSelect, onRefresh, loading }) => {
  useEffect(() => {
    ScrollToTop();
  }, []);

  return (
    <div className="max-w-6xl mx-auto  p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-10 border-b pb-4">
        <h1 className="text-3xl max-sm:text-2xl font-extrabold text-gray-900 tracking-tight">
          All Articles
        </h1>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center max-sm:text-sm bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md hover:bg-indigo-500 transition-colors disabled:bg-gray-400 cursor-pointer"
        >
          <RefreshCcw
            className={`h-4 w-4 max-sm:w-3 max-sm:h-3 mr-2 ${
              loading ? "animate-spin" : ""
            }`}
          />
          Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : articles.length === 0 ? (
        <p className="text-center text-gray-500 text-lg  rounded-l flex justify-center items-center p-8  min-h-[40vh]">
          No articles found. The AI scheduler may need a moment to run!
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article) => (
            <ArticleCard
              key={article.id}
              article={article}
              onClick={() => onArticleSelect(article)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AllArticles;
