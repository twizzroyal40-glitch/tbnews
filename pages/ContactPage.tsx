import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, Loader2, MessageSquare } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 md:p-12">
         <div className="text-center mb-12">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-4">Hubungi Kami</h1>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Memiliki pertanyaan, pengaduan, atau informasi penting? Jangan ragu untuk menghubungi kami. Tim Humas Polresta Sorong Kota siap melayani Anda.
            </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-8">
               <div className="bg-slate-50 p-8 rounded-2xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <MapPin className="mr-2 text-primary" size={20} />
                    Kantor Pusat
                  </h3>
                  <div className="space-y-6">
                      <div className="flex items-start">
                         <div className="w-8 mt-1 text-gray-400"><MapPin size={18} /></div>
                         <div>
                            <p className="font-medium text-gray-900">Polresta Sorong Kota</p>
                            <p className="text-gray-500 text-sm mt-1">
                               Jl. Jend. A. Yani, No. 1<br />
                               Kota Sorong, Papua Barat Daya 98416
                            </p>
                         </div>
                      </div>
                      <div className="flex items-start">
                         <div className="w-8 mt-1 text-gray-400"><Phone size={18} /></div>
                         <div>
                            <p className="font-medium text-gray-900">Telepon</p>
                            <p className="text-gray-500 text-sm mt-1">
                               (0951) 321xxx (Sentra Pelayanan)<br />
                               110 (Call Center Polri 24 Jam)
                            </p>
                         </div>
                      </div>
                      <div className="flex items-start">
                         <div className="w-8 mt-1 text-gray-400"><Mail size={18} /></div>
                         <div>
                            <p className="font-medium text-gray-900">Email</p>
                            <p className="text-gray-500 text-sm mt-1">
                               humas@polrestasorongkota.com<br />
                               pengaduan@polrestasorongkota.com
                            </p>
                         </div>
                      </div>
                  </div>
               </div>

               {/* Map Placeholder */}
               <div className="w-full h-64 bg-gray-200 rounded-2xl overflow-hidden relative shadow-inner">
                  <img 
                    src="https://imgs.search.brave.com/5w2qXk5p7qZ4qZ4qZ4qZ4qZ4qZ4qZ4qZ4qZ4qZ4qZ4/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9tYXJrcy5tYXBzLm1lL3FyLzExMDQ1NjEwNzE0NjIxNzQxMzk2LmpwZw" 
                    className="w-full h-full object-cover opacity-80"
                    alt="Peta Lokasi"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                     <a href="https://maps.google.com/?q=Polresta+Sorong+Kota" target="_blank" rel="noreferrer" className="bg-white text-primary px-4 py-2 rounded-lg font-bold shadow-lg hover:bg-gray-50 transition-colors flex items-center">
                        <MapPin size={16} className="mr-2" />
                        Buka di Google Maps
                     </a>
                  </div>
               </div>
            </div>

            {/* Contact Form */}
            <div>
               <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm h-full">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                     <MessageSquare className="mr-2 text-primary" size={20} />
                     Kirim Pesan
                  </h3>
                  
                  {submitted ? (
                     <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center h-64 flex flex-col items-center justify-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-green-600">
                           <Send size={32} />
                        </div>
                        <h4 className="text-xl font-bold text-green-800 mb-2">Pesan Terkirim!</h4>
                        <p className="text-green-600">Terima kasih. Kami akan segera merespons pesan Anda.</p>
                        <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-bold text-green-700 underline">
                           Kirim pesan lain
                        </button>
                     </div>
                  ) : (
                     <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                           <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
                              <input 
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                              />
                           </div>
                           <div>
                              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                              <input 
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                              />
                           </div>
                        </div>
                        
                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">Subjek</label>
                           <input 
                              type="text"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                           />
                        </div>

                        <div>
                           <label className="block text-sm font-bold text-gray-700 mb-1">Pesan</label>
                           <textarea 
                              name="message"
                              value={formData.message}
                              onChange={handleChange}
                              required
                              rows={5}
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                           ></textarea>
                        </div>

                        <button 
                           type="submit"
                           disabled={isSubmitting}
                           className="w-full bg-primary text-white font-bold py-3.5 rounded-lg hover:bg-primary-light transition-colors shadow-lg flex justify-center items-center disabled:opacity-70"
                        >
                           {isSubmitting ? <Loader2 className="animate-spin" /> : 'Kirim Pesan'}
                        </button>
                     </form>
                  )}
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};