import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, X } from 'lucide-react';

export const CookieConsent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah pernah setuju sebelumnya
    const consent = localStorage.getItem('tbnews-cookie-consent');
    if (!consent) {
      // Delay sedikit agar animasi terlihat lebih smooth saat load awal
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    // Simpan status setuju di localStorage
    localStorage.setItem('tbnews-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in slide-in-from-bottom duration-700 pointer-events-none">
      <div className="max-w-5xl mx-auto bg-white/90 backdrop-blur-md rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/20 p-5 md:p-6 flex flex-col md:flex-row items-center gap-5 justify-between pointer-events-auto ring-1 ring-gray-900/5">
        <div className="flex items-start gap-4">
           <div className="bg-primary/10 p-3 rounded-xl text-primary hidden md:flex items-center justify-center shrink-0">
              <Cookie size={28} />
           </div>
           <div>
              <h4 className="font-bold text-gray-900 text-base mb-1 flex items-center gap-2">
                <span className="md:hidden text-primary"><Cookie size={16} /></span>
                Persetujuan Privasi & Cookie
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">
                Kami menggunakan cookie dan penyimpanan lokal (cache) untuk meningkatkan pengalaman Anda, menganalisis lalu lintas situs, dan menyimpan preferensi Anda. Dengan melanjutkan, Anda menyetujui <Link to="/privacy" className="text-primary font-medium hover:underline decoration-primary decoration-1 underline-offset-2">Kebijakan Privasi</Link> kami.
              </p>
           </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto shrink-0">
           <button
             onClick={handleAccept}
             className="flex-1 md:flex-none bg-primary text-white font-bold py-3 px-8 rounded-xl text-sm hover:bg-primary-light transition-all shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
           >
             Saya Setuju
           </button>
           <button
             onClick={() => setIsVisible(false)}
             className="md:hidden p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
             aria-label="Tutup"
           >
             <X size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};