import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { Pagination } from '../components/Pagination';
import { getLatestNews } from '../services/geminiService';
import { Article } from '../types';
import { Loader2, TrendingUp } from 'lucide-react';

export const LatestNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 8;

  const navigate = useNavigate();

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await getLatestNews();
        setArticles(data);
      } catch (error) {
        console.error("Failed to load articles", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const handleArticleClick = (id: string) => {
    const article = articles.find(a => a.id === id);
    if (article) {
      navigate(`/article/${id}`, { state: { article } });
    }
  };

  // Calculate Pagination
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const currentArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b pb-6 border-gray-200">
          <div>
             <span className="text-primary font-bold tracking-widest uppercase text-xs mb-2 block flex items-center">
                <TrendingUp size={14} className="mr-1" />
                Semua Berita
             </span>
             <h1 className="text-3xl font-serif font-bold text-gray-900">Berita Terkini</h1>
             <p className="text-gray-500 mt-2 text-sm">Daftar lengkap berita terbaru dari Polresta Sorong Kota.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
             <div className="flex flex-col items-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500">Memuat berita...</p>
             </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentArticles.map((article) => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={handleArticleClick}
                />
              ))}
            </div>
            
            {articles.length > ITEMS_PER_PAGE && (
               <Pagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
               />
            )}
          </>
        )}
        
        {!loading && articles.length > 0 && (
            <div className="mt-4 text-center text-gray-400 text-xs">
                Menampilkan {currentArticles.length} dari {articles.length} berita
            </div>
        )}
    </div>
  );
};