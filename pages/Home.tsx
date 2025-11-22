import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNewsArticles } from '../services/geminiService';
import { Article, Category } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { ChevronRight, Loader2, TrendingUp, ShieldCheck } from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Fetch generic home news
        const news = await fetchNewsArticles(Category.HOME);
        setFeaturedArticles(news.slice(0, 1));
        setLatestArticles(news.slice(1));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const handleArticleClick = (id: string) => {
    const all = [...featuredArticles, ...latestArticles];
    const article = all.find(a => a.id === id);
    if (article) {
      navigate(`/article/${id}`, { state: { article } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center bg-white rounded-xl">
        <div className="flex flex-col items-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-gray-500 font-serif italic">Memuat berita terbaru...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Featured Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-8 bg-primary"></div>
                <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900">Berita Utama</h2>
            </div>
        </div>
        
        {featuredArticles.map(article => (
          <div key={article.id} className="mb-6">
             <ArticleCard 
                article={article} 
                onClick={handleArticleClick} 
                featured={true}
             />
          </div>
        ))}
      </section>

      {/* Latest News Grid */}
      <section>
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="text-primary mr-2" />
              Terkini
            </h2>
            <button className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center group">
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {latestArticles.map(article => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                onClick={handleArticleClick} 
              />
            ))}
        </div>
      </section>

      {/* Categories Preview Section - Reimagined for Column */}
      <section>
         <h2 className="text-xl font-bold text-gray-900 mb-6 border-l-4 border-primary pl-3">Kategori Pilihan</h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Inspiration */}
              <div className="bg-gray-900 text-white rounded-2xl p-8 relative overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/inspirasi')}>
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path><path d="M8.5 8.5v.01"></path><path d="M16 16v.01"></path><path d="M12 12v.01"></path><path d="M12 17h.01"></path><path d="M17 12h.01"></path></svg>
                 </div>
                 <h3 className="text-2xl font-serif font-bold mb-4">Inspirasi</h3>
                 <p className="text-gray-300 mb-6 relative z-10 text-sm">Kisah-kisah inspiratif dari personel dan masyarakat.</p>
                 <span className="text-primary-light font-bold flex items-center text-sm">
                    Baca Kisah <ChevronRight className="ml-2 w-4 h-4" />
                 </span>
              </div>

              {/* Security */}
              <div className="bg-primary text-white rounded-2xl p-8 relative overflow-hidden group cursor-pointer shadow-lg" onClick={() => navigate('/keamanan')}>
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-32 h-32" />
                 </div>
                 <h3 className="text-2xl font-serif font-bold mb-4">Keamanan</h3>
                 <p className="text-red-100 mb-6 relative z-10 text-sm">Update situasi keamanan terkini dan himbauan kamtibmas.</p>
                 <span className="text-white font-bold flex items-center underline decoration-2 decoration-red-300 underline-offset-4 text-sm">
                    Cek Situasi <ChevronRight className="ml-2 w-4 h-4" />
                 </span>
              </div>
           </div>
      </section>
    </div>
  );
};