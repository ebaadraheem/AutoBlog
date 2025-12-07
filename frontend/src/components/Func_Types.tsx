import { Loader2 } from "lucide-react";
interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  createdAt: string;
}

const formatDate = (isoString: string): string => {
  return new Date(isoString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center items-center p-8  min-h-[60vh]">
    <Loader2 className="h-8 w-8 max-sm:h-6 max-sm:w-6 animate-spin text-indigo-500" />
    <span className="ml-3 sm:text-lg  font-medium text-gray-600">
      Loading Content...
    </span>
  </div>
);
const ScrollToTop = () => {
  window.scrollTo(0, 0);
};

export type { Article };
export { formatDate, LoadingSpinner, ScrollToTop };
