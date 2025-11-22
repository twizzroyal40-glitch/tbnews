import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { fetchNewsArticles } from '../services/geminiService';
import { Article, Category } from '../types';
import { Loader2 } from 'lucide-react';

interface CategoryPageProps {
  category: Category;
  title: string;
  subtitle: string;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ category, title, subtitle }) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadArticles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchNewsArticles(category);
      setArticles(data);
    } catch (error) {
      console.error("Failed to load articles", error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleArticleClick = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      navigate(`/article/${id}`, { state: { article } });
    }
  };

  return (
    <div className="min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b pb-6 border-gray-200">
          <div>
             <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block">{category}</span>
             <h1 className="text-3xl font-serif font-bold text-gray-900">{title}</h1>
             <p className="text-gray-500 mt-2 text-sm">{subtitle}</p>
          </div>
          <button 
            onClick={loadArticles} 
            disabled={loading}
            className="mt-4 md:mt-0 text-sm font-medium text-primary hover:text-primary-dark disabled:opacity-50 transition-colors flex items-center"
          >
             {loading ? <Loader2 className="animate-spin mr-2 w-4 h-4"/> : null}
             Perbarui Berita
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onClick={handleArticleClick}
              />
            ))}
          </div>
        )}
    </div>
  );
};