import React from 'react';
import { Shield, MapPin, Phone, Mail, User, Users, Award } from 'lucide-react';

export const RedaksiPage: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header Image / Banner */}
      <div className="relative bg-primary-dark text-white py-16 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
           <Shield className="w-16 h-16 mx-auto mb-4 text-red-400" />
           <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">Redaksi TB-News</h1>
           <p className="text-red-100 text-lg font-light">Polresta Sorong Kota</p>
           <div className="w-24 h-1 bg-red-500 mx-auto mt-6"></div>
        </div>
      </div>

      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        
        {/* Visi Misi Singkat */}
        <div className="text-center mb-12">
            <p className="text-gray-600 italic text-lg leading-relaxed">
              "Menyajikan informasi yang akurat, terpercaya, dan humanis sebagai wujud transparansi Polri Presisi kepada masyarakat Kota Sorong dan sekitarnya."
            </p>
        </div>

        {/* Susunan Redaksi */}
        <div className="space-y-10">
            {/* Pimpinan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-xl border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                        <Award size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-1">Pelindung</h3>
                    <p className="text-lg font-serif font-bold text-primary">Kapolresta Sorong Kota</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-xl border border-gray-100 text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 text-primary">
                        <Award size={24} />
                    </div>
                    <h3 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-1">Penanggung Jawab</h3>
                    <p className="text-lg font-serif font-bold text-primary">Wakapolresta Sorong Kota</p>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* Tim Pelaksana */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Tim Pelaksana</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Pemimpin Redaksi */}
                    <div className="group bg-white p-5 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
                        <div className="mb-3">
                             <User className="w-10 h-10 mx-auto text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <h4 className="font-bold text-gray-800">Kasi Humas</h4>
                        <p className="text-xs text-primary font-bold uppercase mt-1">Pemimpin Redaksi</p>
                    </div>

                    {/* Redaktur */}
                    <div className="group bg-white p-5 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
                        <div className="mb-3">
                             <User className="w-10 h-10 mx-auto text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <h4 className="font-bold text-gray-800">Kasubsi Penmas</h4>
                        <p className="text-xs text-primary font-bold uppercase mt-1">Redaktur Pelaksana</p>
                    </div>

                    {/* Editor */}
                    <div className="group bg-white p-5 rounded-lg border border-gray-200 hover:border-primary hover:shadow-md transition-all">
                        <div className="mb-3">
                             <User className="w-10 h-10 mx-auto text-gray-400 group-hover:text-primary transition-colors" />
                        </div>
                        <h4 className="font-bold text-gray-800">Tim Multimedia</h4>
                        <p className="text-xs text-primary font-bold uppercase mt-1">Editor & Desain</p>
                    </div>
                </div>
            </div>

            {/* Tim Liputan List */}
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6 justify-center">
                    <Users className="text-primary" />
                    <h3 className="text-xl font-bold text-gray-900">Tim Liputan & Fotografer</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-center md:text-left max-w-2xl mx-auto">
                    <div className="bg-white p-3 rounded shadow-sm text-sm text-gray-700 font-medium text-center">Personil Si Humas 1</div>
                    <div className="bg-white p-3 rounded shadow-sm text-sm text-gray-700 font-medium text-center">Personil Si Humas 2</div>
                    <div className="bg-white p-3 rounded shadow-sm text-sm text-gray-700 font-medium text-center">Personil Si Humas 3</div>
                    <div className="bg-white p-3 rounded shadow-sm text-sm text-gray-700 font-medium text-center">Personil Si Humas 4</div>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-8"></div>

            {/* Kontak Info */}
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center font-serif">Kantor Redaksi</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 bg-red-50 text-primary rounded-full flex items-center justify-center mb-3">
                            <MapPin size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Alamat</h4>
                        <p className="text-sm text-gray-600">
                            Jl. Jend. A. Yani, No. 1<br/>
                            Kota Sorong, Papua Barat Daya
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 bg-red-50 text-primary rounded-full flex items-center justify-center mb-3">
                            <Mail size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Email</h4>
                        <p className="text-sm text-gray-600">
                            humas@polrestasorongkota.com<br/>
                            tbnews.sorkot@gmail.com
                        </p>
                    </div>

                    <div className="flex flex-col items-center text-center p-4">
                        <div className="w-12 h-12 bg-red-50 text-primary rounded-full flex items-center justify-center mb-3">
                            <Phone size={24} />
                        </div>
                        <h4 className="font-bold text-gray-900 mb-2">Telepon</h4>
                        <p className="text-sm text-gray-600">
                            (0951) 321xxx<br/>
                            Call Center 110
                        </p>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};