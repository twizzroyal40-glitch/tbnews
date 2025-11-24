import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getArticlesByMonth } from '../services/geminiService';
import { Article } from '../types';
import { Pagination } from '../components/Pagination';
import { Loader2, Calendar, ChevronRight, Archive, AlertCircle } from 'lucide-react';

export const IndexPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const navigate = useNavigate();

  const loadArchive = async (dateString: string) => {
    setLoading(true);
    try {
      const [yearStr, monthStr] = dateString.split('-');
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10) - 1; // JS Month is 0-indexed

      const results = await getArticlesByMonth(year, month);
      setArticles(results);
      setCurrentPage(1); // Reset page
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArchive(selectedMonth);
  }, []); // Initial load

  const handleFilter = () => {
    loadArchive(selectedMonth);
  };

  // Calculate Pagination
  const totalPages = Math.ceil(articles.length / ITEMS_PER_PAGE);
  const currentArticles = articles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[600px]">
      <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
             <div className="flex items-center gap-2 mb-1 text-primary">
                <Archive size={20} />
                <span className="font-bold uppercase tracking-wider text-xs">Archive News</span>
             </div>
             <h1 className="text-2xl font-serif font-bold text-gray-900">Arsip Berita</h1>
             <p className="text-xs text-gray-500 mt-1">Telusuri berita berdasarkan bulan penerbitan.</p>
          </div>
          
          {/* Month Filter */}
          <div className="w-full md:w-auto flex items-center space-x-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200">
            <div className="flex items-center px-2 text-gray-500">
                <Calendar size={16} className="mr-2" />
                <span className="text-xs font-medium">Bulan:</span>
            </div>
            <input 
                type="month" 
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-transparent text-sm outline-none text-gray-800 p-1 min-w-[140px]" 
            />
            <button 
                onClick={handleFilter}
                className="bg-primary text-white p-1.5 px-3 rounded text-xs font-bold hover:bg-primary-light transition-colors"
            >
                Tampilkan
            </button>
          </div>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {loading ? (
           <div className="p-12 text-center text-gray-500 flex flex-col items-center justify-center h-64">
             <Loader2 className="animate-spin mx-auto mb-3 h-8 w-8 text-primary" />
             <p>Memuat arsip berita...</p>
           </div>
        ) : articles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center h-64">
                <AlertCircle className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-gray-900 font-bold mb-1">Tidak ada berita</h3>
                <p className="text-gray-500 text-sm">Tidak ditemukan berita pada bulan yang dipilih.</p>
                <p className="text-gray-400 text-xs mt-2">(Coba Oktober 2023 untuk data contoh)</p>
            </div>
        ) : (
           currentArticles.map((article, idx) => (
             <div 
                key={`${article.id}-${idx}`} 
                onClick={() => navigate(`/article/${article.id}`, { state: { article } })}
                className="p-4 md:p-5 hover:bg-gray-50 transition-colors cursor-pointer group flex gap-4 items-start"
             >
                {/* Content */}
                <div className="flex-1">
                   <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold text-primary uppercase border border-primary/20 px-2 py-0.5 rounded-full bg-red-50">
                        {article.category}
                      </span>
                      <span className="text-gray-400 text-[10px] flex items-center">
                        <Calendar size={10} className="mr-1"/>
                        {article.publishedAt}
                      </span>
                   </div>
                   <h3 className="font-serif font-bold text-gray-800 group-hover:text-primary transition-colors text-base leading-snug mb-1">
                     {article.title}
                   </h3>
                   <p className="text-xs text-gray-500 line-clamp-2">
                     {article.excerpt}
                   </p>
                </div>
                
                <ChevronRight size={18} className="text-gray-300 group-hover:text-primary mt-2 flex-shrink-0" />
             </div>
           ))
        )}
      </div>
      
      {!loading && articles.length > ITEMS_PER_PAGE && (
        <div className="p-4 border-t border-gray-100">
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
        </div>
      )}
      
      {!loading && articles.length > 0 && (
        <div className="p-6 border-t border-gray-100 bg-gray-50 text-center">
          <p className="text-xs text-gray-400 italic">Menampilkan {currentArticles.length} dari {articles.length} artikel</p>
        </div>
      )}
    </div>
  );
};