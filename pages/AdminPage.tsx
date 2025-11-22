import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category } from '../types';
import { createArticle } from '../services/geminiService';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut, User } from 'firebase/auth';
import { Upload, Save, Image as ImageIcon, ArrowLeft, CheckCircle, Lock, LogOut, Loader2, AlertCircle } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Form State
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: Category.KEGIATAN,
    author: 'Admin Polresta',
    imageUrl: '',
  });

  // Check Auth Status
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Auth listener will update user state
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
         setLoginError('Email atau password salah.');
      } else {
         setLoginError('Terjadi kesalahan saat login. Coba lagi nanti.');
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use a default placeholder if no image provided
      const finalData = {
        ...formData,
        imageUrl: formData.imageUrl.trim() || `https://picsum.photos/seed/${Date.now()}/800/600`
      };

      await createArticle(finalData);
      
      setIsSuccess(true);
      // Reset form partially
      setFormData(prev => ({ ...prev, title: '', excerpt: '', content: '', imageUrl: '' }));
      
      // Redirect after delay
      setTimeout(() => {
        navigate('/');
      }, 1500);
      
    } catch (error) {
      console.error("Failed to create article", error);
      alert("Gagal menyimpan berita. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- RENDERING ---

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // LOGIN VIEW
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
           <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                 <Lock size={32} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
              <p className="text-gray-500 text-sm">Masuk untuk mengelola berita TB News.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center">
                   <AlertCircle size={16} className="mr-2" />
                   {loginError}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoggingIn}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-light transition-colors flex justify-center items-center"
              >
                {isLoggingIn ? <Loader2 className="animate-spin" size={20} /> : 'Masuk Dashboard'}
              </button>
           </form>
           
           <div className="mt-6 text-center">
              <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600">
                Kembali ke Beranda
              </button>
           </div>
        </div>
      </div>
    );
  }

  // SUCCESS VIEW
  if (isSuccess) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Berita Berhasil Diunggah!</h2>
        <p className="text-gray-500 mb-6">Artikel Anda telah diterbitkan ke halaman utama.</p>
        <button 
          onClick={() => setIsSuccess(false)} 
          className="text-primary font-bold hover:underline"
        >
          Upload Lagi
        </button>
      </div>
    );
  }

  // ADMIN FORM VIEW
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Upload Berita Baru</h1>
            <p className="text-gray-500 text-sm">Dashboard Admin: {user.email}</p>
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 space-y-6">
        
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Judul Berita *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Contoh: Kapolresta Pimpin Apel Pasukan..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kategori *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              {Object.values(Category).map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Author */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Penulis *</label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">URL Gambar Header</label>
          <div className="flex gap-2">
             <div className="relative flex-grow">
                <ImageIcon className="absolute left-3 top-3.5 text-gray-400 w-5 h-5" />
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg (Kosongkan untuk gambar acak)"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
             </div>
          </div>
          <p className="text-xs text-gray-400 mt-1">*Disarankan rasio 16:9. Jika kosong, sistem akan membuat gambar placeholder.</p>
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Ringkasan (Excerpt) *</label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            required
            rows={2}
            placeholder="Tulis ringkasan singkat untuk tampilan kartu berita..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Isi Berita *</label>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-3 text-xs text-blue-800 flex items-start">
            <ImageIcon size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Tips:</strong> Untuk menyisipkan gambar di antara paragraf, gunakan format: <br/>
              <code className="bg-white px-1 py-0.5 rounded border border-blue-200 font-mono mt-1 inline-block">[IMAGE:url_gambar_anda]</code>
              <br/>Pastikan kode berada di baris baru sendiri.
            </div>
          </div>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={12}
            placeholder="Tulis isi berita lengkap di sini..."
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-serif leading-relaxed"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 py-3 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-colors flex items-center shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Menyimpan...' : (
              <>
                <Save size={18} className="mr-2" />
                Terbitkan Berita
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};