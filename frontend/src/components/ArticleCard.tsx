import React from "react";
import { formatDate } from "./Func_Types";
import type { Article } from "./Func_Types";

const ArticleCard: React.FC<{ article: Article; onClick: () => void }> = ({
  article,
  onClick,
}) => (
  <div
    className="bg-white p-6 shadow-xl rounded-xl border border-gray-200 
               hover:shadow-2xl hover:border-indigo-500 transition-all duration-300 
               cursor-pointer flex flex-col justify-between"
    onClick={onClick}
  >
    <div>
      <h2 className="text-2xl max-sm:text-xl font-bold line-clamp-2 text-gray-800 mb-2 leading-snug">
        {article.title}
      </h2>
      <p className="text-gray-600 max-sm:text-sm mb-4 line-clamp-3">
        {article.summary}
      </p>
    </div>
    <div className="text-sm max-sm:text-xs text-gray-400 border-t pt-3">
      <span className="font-semibold text-gray-500">{article.author}</span> •{" "}
      {formatDate(article.createdAt)}
    </div>
  </div>
);

export default ArticleCard;
