import React from 'react';
import { FileText } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
       <div className="p-8 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <FileText size={20} />
             </div>
             <h1 className="text-3xl font-serif font-bold text-gray-900">Syarat & Ketentuan</h1>
          </div>

          <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
             <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}</p>

             <h3>1. Ketentuan Umum</h3>
             <p>
                Dengan mengakses dan menggunakan situs web TB-News Polresta Sorong Kota, Anda menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari ketentuan ini, mohon untuk tidak menggunakan layanan kami.
             </p>

             <h3>2. Hak Kekayaan Intelektual</h3>
             <p>
                Konten yang dipublikasikan di situs ini (termasuk teks, gambar, video, dan logo) adalah milik Polresta Sorong Kota atau pemegang lisensinya. Anda tidak diperkenankan menyalin, mendistribusikan, atau memodifikasi konten tanpa izin tertulis, kecuali untuk penggunaan pribadi atau jurnalistik dengan mencantumkan sumber.
             </p>

             <h3>3. Etika Pengguna</h3>
             <p>Saat menggunakan situs ini, Anda dilarang untuk:</p>
             <ul>
                <li>Memposting komentar yang mengandung ujaran kebencian, SARA, pornografi, atau ancaman kekerasan.</li>
                <li>Menyebarkan informasi palsu (hoaks) di kolom komentar.</li>
                <li>Melakukan tindakan yang dapat merusak integritas sistem keamanan situs.</li>
             </ul>
             <p>
                Kami berhak untuk menghapus komentar yang melanggar ketentuan ini tanpa pemberitahuan sebelumnya.
             </p>

             <h3>4. Penafian (Disclaimer)</h3>
             <p>
                Informasi yang disajikan dalam situs ini bertujuan untuk memberikan informasi umum kepada publik. Meskipun kami berupaya menyajikan data yang akurat, kami tidak menjamin kelengkapan atau keakuratan informasi setiap saat. Penggunaan informasi dari situs ini adalah risiko pengguna sendiri.
             </p>

             <h3>5. Perubahan Layanan</h3>
             <p>
                Kami berhak untuk mengubah, menangguhkan, atau menghentikan layanan situs web ini kapan saja tanpa pemberitahuan sebelumnya.
             </p>

             <h3>6. Hukum yang Berlaku</h3>
             <p>
                Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum yang berlaku di Republik Indonesia.
             </p>

             <h3>7. Hubungi Kami</h3>
             <p>
                Untuk pertanyaan mengenai Syarat dan Ketentuan ini, silakan hubungi Seksi Humas Polresta Sorong Kota.
             </p>
          </div>
       </div>
    </div>
  );
};