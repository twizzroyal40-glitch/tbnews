import React from 'react';
import { Lock } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
       <div className="p-8 md:p-12 max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-6">
             <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <Lock size={20} />
             </div>
             <h1 className="text-3xl font-serif font-bold text-gray-900">Kebijakan Privasi</h1>
          </div>

          <div className="prose prose-slate max-w-none text-gray-700 leading-relaxed">
             <p>Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', {month: 'long', year: 'numeric'})}</p>

             <h3>1. Pendahuluan</h3>
             <p>
                Selamat datang di TB-News Polresta Sorong Kota. Kami menghargai privasi Anda dan berkomitmen untuk melindungi informasi pribadi Anda. 
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda mengakses situs web kami.
             </p>

             <h3>2. Informasi yang Kami Kumpulkan</h3>
             <p>Kami dapat mengumpulkan informasi berikut:</p>
             <ul>
                <li><strong>Informasi Non-Pribadi:</strong> Data log seperti alamat IP, jenis browser, halaman yang dikunjungi, dan waktu akses.</li>
                <li><strong>Informasi Pribadi:</strong> Nama dan alamat email (hanya jika Anda memberikannya secara sukarela melalui formulir komentar atau kontak).</li>
             </ul>

             <h3>3. Penggunaan Informasi</h3>
             <p>Informasi yang kami kumpulkan digunakan untuk:</p>
             <ul>
                <li>Menyediakan dan memelihara layanan situs web kami.</li>
                <li>Memantau penggunaan situs untuk tujuan analisis dan keamanan.</li>
                <li>Merespons komentar, pertanyaan, atau pengaduan yang Anda kirimkan.</li>
             </ul>

             <h3>4. Cookie</h3>
             <p>
                Situs web ini menggunakan cookie untuk meningkatkan pengalaman pengguna. Anda dapat mengatur browser Anda untuk menolak cookie, namun beberapa bagian situs mungkin tidak berfungsi dengan optimal.
             </p>

             <h3>5. Keamanan Data</h3>
             <p>
                Kami menerapkan langkah-langkah keamanan yang wajar untuk melindungi informasi Anda dari akses yang tidak sah. Namun, harap diingat bahwa tidak ada metode transmisi data melalui internet yang 100% aman.
             </p>

             <h3>6. Tautan ke Situs Pihak Ketiga</h3>
             <p>
                Layanan kami mungkin berisi tautan ke situs web lain yang tidak dioperasikan oleh kami. Kami tidak bertanggung jawab atas kebijakan privasi situs pihak ketiga tersebut.
             </p>

             <h3>7. Perubahan Kebijakan Privasi</h3>
             <p>
                Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan akan diposting di halaman ini dengan tanggal pembaruan yang baru.
             </p>

             <h3>8. Hubungi Kami</h3>
             <p>
                Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi kami melalui halaman <a href="#/kontak" className="text-primary underline">Kontak</a>.
             </p>
          </div>
       </div>
    </div>
  );
};