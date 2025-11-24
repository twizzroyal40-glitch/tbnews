import React from 'react';
import { ServerCrash, Loader2 } from 'lucide-react';

interface MaintenancePageProps {
  onRetry: () => void;
  isRetrying: boolean;
}

export const MaintenancePage: React.FC<MaintenancePageProps> = ({ onRetry, isRetrying }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center text-center p-6 font-sans">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100 max-w-lg">
        <div className="w-20 h-20 bg-red-50 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <ServerCrash size={48} strokeWidth={1.5} />
        </div>
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">
          Situs Sedang Dalam Perbaikan
        </h1>
        <p className="text-gray-600 leading-relaxed mb-8">
          Kami mohon maaf atas ketidaknyamanannya. Saat ini kami sedang mengalami masalah koneksi ke server database. Tim kami sedang bekerja untuk menyelesaikannya.
        </p>
        <button
          onClick={onRetry}
          disabled={isRetrying}
          className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 w-full sm:w-auto"
        >
          {isRetrying ? <Loader2 className="animate-spin" size={20} /> : null}
          {isRetrying ? 'Mencoba lagi...' : 'Coba Lagi'}
        </button>
        <p className="text-xs text-gray-400 mt-6">
          Jika masalah berlanjut, silakan kembali lagi nanti.
        </p>
      </div>
    </div>
  );
};
