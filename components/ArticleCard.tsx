import React from 'react';
import { Article } from '../types';
import { Calendar, User, Eye, MessageCircle, Share2 } from 'lucide-react';

interface ArticleCardProps {
  article: Article;
  onClick: (id: string) => void;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, onClick, featured = false }) => {
  return (
    <div 
      onClick={() => onClick(article.id)}
      className={`group cursor-pointer bg-white overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col h-full ${featured ? 'md:grid md:grid-cols-2 md:gap-6' : ''}`}
    >
      <div className={`relative overflow-hidden ${featured ? 'h-64 md:h-full' : 'h-48'}`}>
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4 bg-primary text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">
          {article.category}
        </div>
      </div>
      
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
            <span className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              {article.publishedAt}
            </span>
            <span className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              {article.author}
            </span>
          </div>
          <h3 className={`font-serif font-bold text-gray-900 group-hover:text-primary transition-colors ${featured ? 'text-2xl md:text-3xl mb-4' : 'text-lg mb-2'}`}>
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
            {article.excerpt}
          </p>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <span className="text-primary font-semibold text-sm flex items-center group-hover:underline">
            Baca Selengkapnya
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
          </span>

          {/* Metrics */}
          <div className="flex items-center gap-3 text-gray-400 text-xs">
             <div className="flex items-center" title="Jumlah Pembaca">
               <Eye size={14} className="mr-1" />
               {article.views}
             </div>
             <div className="flex items-center" title="Komentar">
               <MessageCircle size={14} className="mr-1" />
               {article.commentCount}
             </div>
             <div className="flex items-center" title="Bagikan">
               <Share2 size={14} className="mr-1" />
               {article.shareCount}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};