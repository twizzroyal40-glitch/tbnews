import React from 'react';
import { Shield, Target, Users, CheckCircle } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-20 px-6 text-center">
         <div className="absolute inset-0 bg-primary/20 mix-blend-multiply"></div>
         <div className="relative z-10 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6">Tentang TB-News</h1>
            <p className="text-lg md:text-xl text-gray-200 font-light leading-relaxed">
              Portal berita resmi Polresta Sorong Kota. Sumber informasi terpercaya, akurat, dan transparan untuk masyarakat Papua Barat Daya.
            </p>
         </div>
      </div>

      <div className="p-6 md:p-12 max-w-5xl mx-auto space-y-16">
        
        {/* Profile Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
           <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 border-l-4 border-primary pl-4">Profil Singkat</h2>
              <div className="prose text-gray-600 leading-relaxed text-justify">
                <p className="mb-4">
                  TB-News (Tribrata News) Polresta Sorong Kota adalah platform media digital yang dikelola oleh Seksi Humas Polresta Sorong Kota. Kami hadir sebagai jembatan informasi antara Kepolisian Republik Indonesia dengan masyarakat, khususnya di wilayah hukum Kota Sorong.
                </p>
                <p>
                  Di era digitalisasi ini, kami berkomitmen untuk menyajikan berita terkini seputar kegiatan kepolisian, situasi keamanan dan ketertiban masyarakat (Kamtibmas), pengungkapan kasus kriminal, serta berbagai himbauan dan edukasi hukum yang relevan.
                </p>
              </div>
           </div>
           <div className="relative h-64 md:h-full min-h-[300px] bg-gray-100 rounded-xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                alt="Polresta Sorong Kota" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                 <p className="text-white font-bold">Mako Polresta Sorong Kota</p>
              </div>
           </div>
        </section>

        {/* Visi & Misi */}
        <section>
           <div className="bg-slate-50 rounded-2xl p-8 md:p-12 border border-gray-100">
              <div className="text-center mb-10">
                 <span className="text-primary font-bold tracking-widest uppercase text-xs">Arah & Tujuan</span>
                 <h2 className="text-3xl font-serif font-bold text-gray-900 mt-2">Visi & Misi</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                       <Target size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Visi</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Terwujudnya pelayanan informasi publik yang modern, transparan, dan akuntabel guna mendukung terciptanya Keamanan dan Ketertiban Masyarakat (Kamtibmas) yang kondusif di wilayah Kota Sorong.
                    </p>
                 </div>

                 <div className="bg-white p-8 rounded-xl shadow-sm">
                    <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-4">
                       <Shield size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Misi</h3>
                    <ul className="space-y-3 text-gray-600">
                       <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>Menyajikan informasi kepolisian yang cepat, tepat, dan akurat.</span>
                       </li>
                       <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>Memberikan edukasi hukum dan kamtibmas kepada masyarakat.</span>
                       </li>
                       <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>Membangun kemitraan dan kepercayaan publik terhadap Polri.</span>
                       </li>
                       <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                          <span>Menangkal berita bohong (hoaks) yang dapat meresahkan masyarakat.</span>
                       </li>
                    </ul>
                 </div>
              </div>
           </div>
        </section>

        {/* Why Trust Us */}
        <section className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Nilai-Nilai Kami</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        <Shield size={32} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Terpercaya</h4>
                    <p className="text-sm text-gray-500">Informasi bersumber langsung dari data resmi kepolisian.</p>
                </div>
                <div className="p-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        <Users size={32} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Humanis</h4>
                    <p className="text-sm text-gray-500">Penyajian berita yang mengedepankan sisi kemanusiaan dan edukasi.</p>
                </div>
                <div className="p-4">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                        <Target size={32} />
                    </div>
                    <h4 className="font-bold text-gray-900 mb-2">Presisi</h4>
                    <p className="text-sm text-gray-500">Prediktif, Responsibilitas, dan Transparansi Berkeadilan.</p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
};