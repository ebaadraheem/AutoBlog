import type { Article } from "../components/Func_Types";
const API_BASE_URL: string = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export async function fetchArticles(): Promise<Article[]> {
    const response = await fetch(`${API_BASE_URL}/api/articles`);
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Article[] = await response.json();
    return data;
}

export async function fetchArticleById(id: string): Promise<Article | null> {
    const response = await fetch(`${API_BASE_URL}/api/articles/${id}`);

    if (response.status === 404) {
        return null; 
    }
    
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: Article = await response.json();
    return data;
}