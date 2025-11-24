import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNewsArticles } from '../services/geminiService';
import { Article, Category } from '../types';
import { ArticleCard } from '../components/ArticleCard';
import { ChevronRight, Loader2, TrendingUp, ShieldCheck, ChevronLeft } from 'lucide-react';

export const Home: React.FC = () => {
  const [featuredArticles, setFeaturedArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      try {
        // Fetch generic home news
        const news = await fetchNewsArticles(Category.HOME);
        
        // Ambil 3 berita pertama untuk Carousel (Sebelumnya 5)
        setFeaturedArticles(news.slice(0, 3));
        
        // Sisanya untuk list "Terkini" (Mulai dari indeks ke-3)
        setLatestArticles(news.slice(3));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Auto-play Carousel Logic
  useEffect(() => {
    if (featuredArticles.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === featuredArticles.length - 1 ? 0 : prev + 1));
    }, 5000); // Ganti slide setiap 5 detik

    return () => clearInterval(interval);
  }, [featuredArticles.length]);

  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === featuredArticles.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentSlide((prev) => (prev === 0 ? featuredArticles.length - 1 : prev - 1));
  };

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
      {/* Featured Carousel Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
                <div className="w-2 h-8 bg-primary"></div>
                <h2 className="text-2xl font-bold uppercase tracking-wide text-gray-900">Berita Utama</h2>
            </div>
        </div>
        
        {featuredArticles.length > 0 && (
          <div className="relative w-full h-[280px] sm:h-[400px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden group shadow-lg border border-gray-100 bg-gray-200">
             {/* Slides Container */}
             <div 
               className="flex h-full transition-transform duration-500 ease-out"
               style={{ transform: `translateX(-${currentSlide * 100}%)` }}
             >
                {featuredArticles.map((article) => (
                   <div 
                     key={article.id} 
                     className="w-full h-full flex-shrink-0 relative cursor-pointer"
                     onClick={() => handleArticleClick(article.id)}
                   >
                      <img 
                        src={article.imageUrl} 
                        alt={article.title} 
                        className="w-full h-full object-cover object-center"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                      
                      {/* Content Overlay - Simplified: Only Title */}
                      <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white">
                         <h3 className="text-xl md:text-3xl lg:text-4xl font-serif font-bold leading-tight mb-2 line-clamp-2 md:line-clamp-3 hover:text-red-200 transition-colors shadow-sm drop-shadow-md">
                            {article.title}
                         </h3>
                      </div>
                   </div>
                ))}
             </div>

             {/* Navigation Arrows */}
             <button 
               onClick={prevSlide}
               className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-primary/80 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0 z-10"
             >
                <ChevronLeft size={24} />
             </button>
             <button 
               onClick={nextSlide}
               className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-primary/80 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 z-10"
             >
                <ChevronRight size={24} />
             </button>

             {/* Dots Indicator */}
             <div className="absolute bottom-4 right-4 md:right-10 flex space-x-2 z-10">
                {featuredArticles.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setCurrentSlide(idx); }}
                    className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                      currentSlide === idx ? 'w-8 bg-primary' : 'w-2 bg-white/60 hover:bg-white'
                    }`}
                  />
                ))}
             </div>
          </div>
        )}
      </section>

      {/* Latest News Grid */}
      <section>
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <TrendingUp className="text-primary mr-2" />
              Terkini
            </h2>
            <button 
              onClick={() => navigate('/terkini')}
              className="text-sm font-semibold text-primary hover:text-primary-dark flex items-center group"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
            </button>
        </div>

        {latestArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {latestArticles.map(article => (
                <ArticleCard 
                  key={article.id} 
                  article={article} 
                  onClick={handleArticleClick} 
                />
              ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-400 italic">
            Belum ada berita terkini tambahan.
          </div>
        )}
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