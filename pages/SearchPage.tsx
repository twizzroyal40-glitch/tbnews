import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchArticles } from '../services/geminiService';
import { Article } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { Search, Loader2 } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const doSearch = async () => {
      if (!query.trim()) {
        setArticles([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const results = await searchArticles(query);
        setArticles(results);
      } catch (e) {
        console.error("Search failed", e);
      } finally {
        setLoading(false);
      }
    };

    doSearch();
  }, [query]);

  const handleArticleClick = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      navigate(`/article/${id}`, { state: { article } });
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mb-8 border-b pb-6 border-gray-200">
         <div className="flex items-center text-primary font-bold tracking-widest uppercase text-xs mb-2">
            <Search size={14} className="mr-2" />
            Hasil Pencarian
         </div>
         <h1 className="text-3xl font-serif font-bold text-gray-900">
            "{query}"
         </h1>
         <p className="text-gray-500 mt-2 text-sm">
            {loading ? 'Mencari...' : `Ditemukan ${articles.length} artikel untuk kata kunci tersebut.`}
         </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
           <div className="flex flex-col items-center">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500">Sedang mencari berita...</p>
           </div>
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-gray-100 border-dashed">
           <Search size={48} className="mx-auto text-gray-300 mb-4" />
           <h3 className="text-lg font-bold text-gray-700">Tidak ada hasil ditemukan</h3>
           <p className="text-gray-500 text-sm mt-2">Coba gunakan kata kunci lain yang lebih umum.</p>
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