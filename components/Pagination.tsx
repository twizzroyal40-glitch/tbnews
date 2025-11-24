import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      // Scroll to top of the list/container smoothly
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-10 h-10 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center ${
            currentPage === i
              ? 'bg-primary text-white shadow-md transform scale-105'
              : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-primary hover:border-primary/30'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-10 mb-6">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft size={20} />
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};