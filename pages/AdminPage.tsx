import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Category, Article, AdConfig } from '../types';
import { 
  createArticle, updateArticle, deleteArticle, uploadArticleImage, 
  getAllArticlesFromSupabase, getGalleryImages, deleteImage,
  getAds, saveAd
} from '../services/geminiService';
import { supabase } from '../utils/supabase';
import { 
  Upload, Save, Image as ImageIcon, ArrowLeft, CheckCircle, 
  Lock, LogOut, Loader2, AlertCircle, UserPlus, LogIn, Plus,
  LayoutDashboard, FileText, Trash2, Edit, Search, Eye, Images, Copy, Check, X, AlertTriangle, MonitorPlay
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const navigate = useNavigate();
  
  // --- AUTH STATE ---
  const [user, setUser] = useState<any | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(false);

  // --- DASHBOARD STATE ---
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'gallery' | 'ads'>('list');
  const [articles, setArticles] = useState<Article[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- DELETE CONFIRMATION STATE ---
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- GALLERY STATE ---
  const [galleryImages, setGalleryImages] = useState<{name: string, url: string}[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // --- ADS STATE ---
  const [ads, setAds] = useState<AdConfig[]>([]);
  const [loadingAds, setLoadingAds] = useState(false);
  const [savingAdId, setSavingAdId] = useState<string | null>(null); // tracks which ad is being saved

  // --- EDITOR FORM STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null); // Null means create new
  
  // Content Image Upload & Preview State
  const [isContentUploading, setIsContentUploading] = useState(false);
  const [contentViewMode, setContentViewMode] = useState<'write' | 'preview'>('write');
  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);
  const contentFileInputRef = useRef<HTMLInputElement>(null);
  const standaloneUploadRef = useRef<HTMLInputElement>(null);
  
  // Gallery Modal Selector State
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryItems, setSelectedGalleryItems] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: Category.KEGIATAN,
    author: 'Admin Polresta',
    imageUrl: '',
  });

  // --- INITIALIZATION ---

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setAuthLoading(false);
      if (session?.user) {
        fetchArticles();
        fetchGallery(); // Pre-load gallery for faster modal opening
        fetchAds();
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchArticles();
        fetchGallery();
        fetchAds();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchArticles = async () => {
    setDashboardLoading(true);
    try {
      const data = await getAllArticlesFromSupabase();
      setArticles(data);
    } catch (error) {
      console.error("Failed to load articles", error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const fetchGallery = async () => {
    // Only set loading if we don't already have images to avoid flicker, or if explicitly requested
    if (galleryImages.length === 0) setGalleryLoading(true);
    try {
      const images = await getGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error("Failed to load gallery", error);
    } finally {
      setGalleryLoading(false);
    }
  };

  const fetchAds = async () => {
    setLoadingAds(true);
    try {
      const data = await getAds();
      setAds(data);
    } catch (error) {
      console.error("Failed to load ads", error);
    } finally {
      setLoadingAds(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'gallery') {
        fetchGallery();
    }
    if (activeTab === 'ads') {
        fetchAds();
    }
  }, [activeTab]);

  // --- AUTH HANDLERS ---

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthProcessing(true);
    setAuthError('');

    try {
      if (isSignUpMode) {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Pendaftaran berhasil! Silakan cek email/login.");
        setIsSignUpMode(false);
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (error: any) {
      setAuthError(error.message || 'Terjadi kesalahan.');
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- GALLERY HANDLERS ---
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  const handleDeleteImage = async (name: string) => {
     if (confirm("Apakah Anda yakin ingin menghapus gambar ini secara permanen?")) {
        try {
            await deleteImage(name);
            setGalleryImages(prev => prev.filter(img => img.name !== name));
        } catch (e: any) {
            alert("Gagal menghapus: " + e.message);
        }
     }
  };

  const handleStandaloneUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setGalleryLoading(true);
        try {
           await uploadArticleImage(file);
           // Refresh list immediately after successful upload
           const images = await getGalleryImages();
           setGalleryImages(images);
        } catch (error: any) {
           alert("Gagal upload: " + error.message);
        } finally {
            setGalleryLoading(false);
            if (standaloneUploadRef.current) standaloneUploadRef.current.value = '';
        }
    }
  };

  // --- ADS HANDLERS ---
  const handleAdChange = (index: number, field: keyof AdConfig, value: any) => {
    const newAds = [...ads];
    newAds[index] = { ...newAds[index], [field]: value };
    setAds(newAds);
  };

  const handleAdImageUpload = async (index: number, file: File) => {
      setSavingAdId(ads[index].position); // Show generic loading state
      try {
          const url = await uploadArticleImage(file);
          if (url) {
              handleAdChange(index, 'imageUrl', url);
          }
      } catch (error: any) {
          alert("Gagal upload gambar iklan: " + error.message);
      } finally {
          setSavingAdId(null);
      }
  };

  const handleSaveAd = async (index: number) => {
      const ad = ads[index];
      setSavingAdId(ad.position);
      try {
          await saveAd(ad);
          alert(`Konfigurasi iklan "${ad.title}" berhasil disimpan.`);
      } catch (error: any) {
          alert(error.message);
      } finally {
          setSavingAdId(null);
      }
  };

  // --- EDITOR HANDLERS ---

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: Category.KEGIATAN,
      author: 'Admin Polresta',
      imageUrl: '',
    });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setIsSuccess(false);
    setContentViewMode('write');
  };

  const switchToCreate = () => {
    resetForm();
    setActiveTab('editor');
  };

  const switchToEdit = (article: Article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      category: article.category,
      author: article.author,
      imageUrl: article.imageUrl,
    });
    setImagePreview(article.imageUrl);
    setActiveTab('editor');
    setContentViewMode('write');
  };

  // Prompt to open the modal
  const promptDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  // Execute actual delete from modal
  const executeDelete = async () => {
    if (!deleteTargetId) return;
    
    setIsDeleting(true);
    try {
      await deleteArticle(deleteTargetId);
      setArticles(prev => prev.filter(a => a.id !== deleteTargetId));
      setDeleteTargetId(null); // Close modal on success
    } catch (error: any) {
      alert("Gagal menghapus: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = contentTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = formData.content;
      const newText = text.substring(0, start) + textToInsert + text.substring(end);
      setFormData(prev => ({ ...prev, content: newText }));
      
      // Restore focus and cursor
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
      }, 0);
    } else {
      setFormData(prev => ({ ...prev, content: prev.content + textToInsert }));
    }
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setIsContentUploading(true);
      try {
        const uploadedUrl = await uploadArticleImage(file);
        if (uploadedUrl) {
          const imageTag = `\n[IMAGE:${uploadedUrl}]\n`;
          insertTextAtCursor(imageTag);
        }
      } catch (error: any) {
        alert(`Gagal upload gambar konten: ${error.message}`);
      } finally {
        setIsContentUploading(false);
        if (contentFileInputRef.current) contentFileInputRef.current.value = '';
      }
    }
  };

  // Gallery Modal Logic
  const openGalleryModal = () => {
      fetchGallery();
      setSelectedGalleryItems([]);
      setIsGalleryModalOpen(true);
  };

  const toggleGallerySelection = (url: string) => {
      if (selectedGalleryItems.includes(url)) {
          setSelectedGalleryItems(prev => prev.filter(item => item !== url));
      } else {
          setSelectedGalleryItems(prev => [...prev, url]);
      }
  };

  const confirmGalleryInsertion = () => {
      if (selectedGalleryItems.length > 0) {
          const galleryTag = `\n[GALLERY:${selectedGalleryItems.join(',')}]\n`;
          insertTextAtCursor(galleryTag);
      }
      setIsGalleryModalOpen(false);
      setSelectedGalleryItems([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let finalImageUrl = formData.imageUrl;
      if (imageFile) {
        const uploadedUrl = await uploadArticleImage(imageFile);
        if (uploadedUrl) finalImageUrl = uploadedUrl;
      } else if (!finalImageUrl) {
        finalImageUrl = `https://picsum.photos/seed/${Date.now()}/800/600`;
      }

      const finalData = { ...formData, imageUrl: finalImageUrl };

      if (editingId) {
        await updateArticle(editingId, finalData);
      } else {
        await createArticle(finalData);
      }
      
      setIsSuccess(true);
      await fetchArticles(); // Refresh list
      
      // Delay before switching back
      setTimeout(() => {
        setIsSuccess(false);
        setActiveTab('list');
        resetForm();
      }, 1500);
      
    } catch (error: any) {
      console.error("Failed to save article", error);
      alert(`Gagal menyimpan berita: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- RENDER HELPERS ---

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- LOADING VIEW ---
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // --- LOGIN VIEW ---
  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-slate-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md">
           <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
                 {isSignUpMode ? <UserPlus size={32} /> : <Lock size={32} />}
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isSignUpMode ? 'Admin Registration' : 'TB-News Admin'}
              </h1>
              <p className="text-gray-500 text-sm mt-1 text-center">
                {isSignUpMode ? 'Daftar akun admin baru.' : 'Masuk untuk mengelola konten berita.'}
              </p>
           </div>

           <form onSubmit={handleAuth} className="space-y-4">
              {authError && (
                <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center">
                   <AlertCircle size={16} className="mr-2" />
                   {authError}
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
                  minLength={6}
                />
              </div>

              <button 
                type="submit" 
                disabled={isAuthProcessing}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-light transition-colors flex justify-center items-center shadow-md"
              >
                {isAuthProcessing ? <Loader2 className="animate-spin" size={20} /> : (isSignUpMode ? 'Daftar' : 'Masuk Dashboard')}
              </button>
           </form>
           
           <div className="mt-6 text-center space-y-4">
              <button onClick={() => { setIsSignUpMode(!isSignUpMode); setAuthError(''); }} className="text-sm text-primary font-semibold hover:underline">
                {isSignUpMode ? 'Kembali ke Login' : 'Belum punya akun? Daftar'}
              </button>
              <div className="pt-2">
                <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-gray-600">
                  Kembali ke Website
                </button>
              </div>
           </div>
        </div>
      </div>
    );
  }

  // --- MAIN DASHBOARD VIEW ---
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      
      {/* Top Navbar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 px-6 py-3 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
           <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-2 text-gray-500">
              <ArrowLeft size={20} />
           </button>
           <div>
             <h1 className="text-xl font-bold text-gray-800">CMS Dashboard</h1>
             <p className="text-xs text-gray-500">Selamat datang, {user.email}</p>
           </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>

      <div className="flex-1 container mx-auto p-4 md:p-6 max-w-7xl">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6 border-b border-gray-200 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'list' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutDashboard size={18} className="mr-2" />
            Kelola Berita
          </button>
          <button 
            onClick={switchToCreate}
            className={`flex items-center px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'editor' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Plus size={18} className="mr-2" />
            Tambah Baru
          </button>
           <button 
            onClick={() => setActiveTab('gallery')}
            className={`flex items-center px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'gallery' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Images size={18} className="mr-2" />
            Galeri Media
          </button>
          <button 
            onClick={() => setActiveTab('ads')}
            className={`flex items-center px-4 py-3 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
              activeTab === 'ads' 
                ? 'border-primary text-primary' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <MonitorPlay size={18} className="mr-2" />
            Kelola Iklan
          </button>
        </div>

        {/* --- LIST CONTENT --- */}
        {activeTab === 'list' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Artikel</p>
                       <h3 className="text-3xl font-bold text-gray-900 mt-1">{articles.length}</h3>
                    </div>
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><FileText size={20} /></div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Views</p>
                       <h3 className="text-3xl font-bold text-gray-900 mt-1">
                          {articles.reduce((acc, curr) => acc + (curr.views || 0), 0).toLocaleString()}
                       </h3>
                    </div>
                    <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Eye size={20} /></div>
                  </div>
               </div>
               <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center cursor-pointer hover:bg-gray-50 transition-colors" onClick={switchToCreate}>
                   <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-2">
                      <Plus size={24} />
                   </div>
                   <p className="font-bold text-primary text-sm">Buat Berita Baru</p>
               </div>
            </div>

            {/* Search & Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
               <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-96">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                     <input 
                       type="text" 
                       placeholder="Cari judul atau penulis..." 
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                     />
                  </div>
                  <span className="text-xs text-gray-500">
                    Menampilkan {filteredArticles.length} dari {articles.length} data
                  </span>
               </div>

               {dashboardLoading ? (
                 <div className="p-12 text-center">
                   <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                   <p className="text-gray-500 text-sm">Memuat data...</p>
                 </div>
               ) : (
                 <div className="overflow-x-auto">
                   <table className="w-full text-sm text-left">
                     <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                       <tr>
                         <th className="px-6 py-4">Judul Artikel</th>
                         <th className="px-6 py-4">Kategori</th>
                         <th className="px-6 py-4">Penulis</th>
                         <th className="px-6 py-4">Tanggal</th>
                         <th className="px-6 py-4 text-center">Aksi</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                       {filteredArticles.map((article) => (
                         <tr key={article.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 max-w-xs">
                             <p className="font-bold text-gray-900 truncate" title={article.title}>{article.title}</p>
                             <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                               <Eye size={12} /> {article.views} views
                             </div>
                           </td>
                           <td className="px-6 py-4">
                             <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                               {article.category}
                             </span>
                           </td>
                           <td className="px-6 py-4 text-gray-600">{article.author}</td>
                           <td className="px-6 py-4 text-gray-500 whitespace-nowrap">{article.publishedAt}</td>
                           <td className="px-6 py-4">
                             <div className="flex items-center justify-center gap-2">
                               <button 
                                 onClick={() => switchToEdit(article)}
                                 className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                 title="Edit"
                               >
                                 <Edit size={16} />
                               </button>
                               <button 
                                 onClick={() => promptDelete(article.id)}
                                 className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                 title="Hapus"
                               >
                                 <Trash2 size={16} />
                               </button>
                             </div>
                           </td>
                         </tr>
                       ))}
                       {filteredArticles.length === 0 && (
                         <tr>
                           <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                             Tidak ada data berita ditemukan.
                           </td>
                         </tr>
                       )}
                     </tbody>
                   </table>
                 </div>
               )}
            </div>
          </div>
        )}

        {/* --- ADS CONTENT --- */}
        {activeTab === 'ads' && (
            <div className="space-y-6 animate-in fade-in duration-300">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Manajemen Iklan</h2>
                        <p className="text-xs text-gray-500">Atur konten iklan yang muncul di sidebar website.</p>
                    </div>
                </div>

                {loadingAds ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {ads.map((ad, idx) => (
                            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                                        <MonitorPlay size={16} className="text-primary" />
                                        {ad.title}
                                    </h3>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${ad.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                                            {ad.isActive ? 'Aktif' : 'Nonaktif'}
                                        </span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                checked={ad.isActive} 
                                                onChange={(e) => handleAdChange(idx, 'isActive', e.target.checked)}
                                            />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    {/* Image Preview */}
                                    <div className={`w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200 relative group flex items-center justify-center ${ad.position === 'sidebar_top' ? 'aspect-[4/5]' : 'aspect-square'}`}>
                                        {ad.imageUrl ? (
                                            <img src={ad.imageUrl} alt="Ad Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="text-center p-4">
                                                <ImageIcon className="mx-auto w-12 h-12 text-gray-300 mb-2" />
                                                <p className="text-xs text-gray-400">Belum ada gambar</p>
                                            </div>
                                        )}
                                        <label className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
                                            <Upload className="text-white w-8 h-8 mb-2" />
                                            <span className="text-white text-xs font-bold">Ganti Gambar</span>
                                            <input type="file" hidden accept="image/*" onChange={(e) => e.target.files && handleAdImageUpload(idx, e.target.files[0])} />
                                        </label>
                                        {savingAdId === ad.position && (
                                             <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                                                 <Loader2 className="animate-spin text-primary" />
                                             </div>
                                        )}
                                    </div>

                                    {/* URL Input */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 mb-1">Link Tujuan (URL)</label>
                                        <input 
                                            type="text" 
                                            value={ad.linkUrl}
                                            onChange={(e) => handleAdChange(idx, 'linkUrl', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                        />
                                    </div>

                                    <button 
                                        onClick={() => handleSaveAd(idx)}
                                        disabled={savingAdId === ad.position}
                                        className="w-full bg-primary text-white py-2 rounded-lg text-sm font-bold hover:bg-primary-light transition-colors flex items-center justify-center"
                                    >
                                        {savingAdId === ad.position ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        )}

        {/* --- GALLERY CONTENT --- */}
        {activeTab === 'gallery' && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Media Library</h2>
                        <p className="text-xs text-gray-500">Kelola semua gambar yang tersimpan di server.</p>
                    </div>
                    <div>
                        <button 
                            onClick={() => standaloneUploadRef.current?.click()}
                            disabled={galleryLoading}
                            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-primary-light transition-colors"
                        >
                            {galleryLoading ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
                            {galleryLoading ? 'Mengupload...' : 'Upload Gambar'}
                        </button>
                        <input type="file" hidden ref={standaloneUploadRef} onChange={handleStandaloneUpload} accept="image/*" />
                    </div>
                </div>

                {galleryLoading && galleryImages.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {galleryImages.length === 0 ? (
                             <div className="col-span-full py-20 text-center text-gray-400 bg-white rounded-xl border border-dashed border-gray-200">
                                 <ImageIcon className="mx-auto w-12 h-12 mb-3 opacity-20" />
                                 <p>Belum ada gambar di galeri.</p>
                             </div>
                        ) : (
                            galleryImages.map((img, idx) => (
                                <div key={idx} className="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                    
                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        <button 
                                            onClick={() => handleCopyUrl(img.url)}
                                            className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-full flex items-center hover:bg-gray-100 w-full justify-center transform scale-95 hover:scale-100 transition-all"
                                        >
                                            {copiedUrl === img.url ? <Check size={14} className="mr-1 text-green-600" /> : <Copy size={14} className="mr-1" />}
                                            {copiedUrl === img.url ? 'Tersalin' : 'Salin URL'}
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteImage(img.name)}
                                            className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full flex items-center hover:bg-red-700 w-full justify-center transform scale-95 hover:scale-100 transition-all"
                                        >
                                            <Trash2 size={14} className="mr-1" />
                                            Hapus
                                        </button>
                                    </div>
                                    {/* File Name Label */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-1 text-[10px] text-gray-600 truncate text-center">
                                        {img.name.split('-').slice(1).join('-') || img.name}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        )}

        {/* --- EDITOR CONTENT --- */}
        {activeTab === 'editor' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8 animate-in slide-in-from-right duration-300">
             {isSuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h2>
                  <p className="text-gray-500">Artikel telah berhasil {editingId ? 'diperbarui' : 'diterbitkan'}.</p>
                </div>
             ) : (
               <form onSubmit={handleSubmit} className="space-y-6">
                 <div className="flex justify-between items-center pb-4 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-800">
                      {editingId ? 'Edit Artikel' : 'Buat Artikel Baru'}
                    </h2>
                    {editingId && (
                      <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-200">
                        Mode Edit
                      </span>
                    )}
                 </div>

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

                 {/* Image Upload */}
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Gambar Header (Thumbnail)</label>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors bg-gray-50">
                              <ImageIcon className="mx-auto h-10 w-10 text-gray-400 mb-2" />
                              <label htmlFor="file-upload" className="cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                                <span>Upload file gambar</span>
                                <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileChange} />
                              </label>
                              <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</p>
                            </div>
                            <input
                                type="text"
                                name="imageUrl"
                                value={formData.imageUrl}
                                onChange={handleChange}
                                placeholder="Atau URL gambar eksternal..."
                                className="w-full mt-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                disabled={!!imageFile}
                            />
                        </div>
                        {imagePreview && (
                           <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden relative group">
                              <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                              <button 
                                type="button" 
                                onClick={() => { setImageFile(null); setImagePreview(''); setFormData(p => ({...p, imageUrl: ''})) }}
                                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <LogOut size={12} />
                              </button>
                           </div>
                        )}
                    </div>
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
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    />
                 </div>

                 {/* Content with Image Insert & Preview Toggle */}
                 <div>
                    <div className="flex items-center justify-between mb-2">
                       <label className="block text-sm font-bold text-gray-700">Isi Berita *</label>
                       
                       <div className="flex items-center gap-3">
                           {/* View Mode Toggle */}
                           <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
                              <button
                                type="button"
                                onClick={() => setContentViewMode('write')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${contentViewMode === 'write' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                              >
                                Tulis
                              </button>
                              <button
                                type="button"
                                onClick={() => setContentViewMode('preview')}
                                className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${contentViewMode === 'preview' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                              >
                                Preview
                              </button>
                           </div>

                           <button
                             type="button"
                             onClick={() => {
                               if (contentViewMode === 'preview') setContentViewMode('write');
                               setTimeout(() => contentFileInputRef.current?.click(), 0);
                             }}
                             disabled={isContentUploading}
                             className="text-xs flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200 font-semibold"
                           >
                             {isContentUploading ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Plus size={14} className="mr-1.5" />}
                             Sisipkan Gambar
                           </button>

                           <button
                             type="button"
                             onClick={() => {
                               if (contentViewMode === 'preview') setContentViewMode('write');
                               openGalleryModal();
                             }}
                             className="text-xs flex items-center bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors border border-purple-200 font-semibold"
                           >
                             <Images size={14} className="mr-1.5" />
                             Sisipkan Galeri
                           </button>
                       </div>
                       <input type="file" hidden ref={contentFileInputRef} onChange={handleContentImageUpload} accept="image/*" />
                    </div>
                    
                    {contentViewMode === 'write' ? (
                        <>
                            <textarea
                              ref={contentTextareaRef}
                              name="content"
                              value={formData.content}
                              onChange={handleChange}
                              required
                              rows={15}
                              placeholder="Tulis konten berita di sini... Gunakan tombol 'Sisipkan Gambar' untuk menambahkan foto, atau 'Sisipkan Galeri' untuk banyak foto."
                              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-serif leading-relaxed"
                            />
                            <p className="text-[10px] text-gray-400 mt-1 italic">
                                * Tag [IMAGE:url] atau [GALLERY:url1,url2] akan otomatis diubah menjadi tampilan media.
                            </p>
                        </>
                    ) : (
                        <div className="w-full px-6 py-6 bg-white border border-gray-200 rounded-lg min-h-[400px] prose prose-slate max-w-none overflow-y-auto max-h-[600px]">
                            {formData.content ? formData.content.split('\n').map((paragraph, idx) => {
                                // Parse Image Tag
                                const imageMatch = paragraph.trim().match(/^\[IMAGE:(.*)\]$/);
                                if (imageMatch) {
                                    return (
                                        <div key={idx} className="my-6">
                                            <img 
                                                src={imageMatch[1]} 
                                                alt="Content Preview" 
                                                className="w-full h-auto rounded-lg shadow-sm border border-gray-100"
                                            />
                                        </div>
                                    );
                                }
                                
                                // Parse Gallery Tag
                                const galleryMatch = paragraph.trim().match(/^\[GALLERY:(.*)\]$/);
                                if (galleryMatch) {
                                   const urls = galleryMatch[1].split(',');
                                   return (
                                     <div key={idx} className="grid grid-cols-2 md:grid-cols-3 gap-2 my-6">
                                       {urls.map((url, i) => (
                                          <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-100">
                                            <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i}`} />
                                          </div>
                                       ))}
                                     </div>
                                   )
                                }

                                if (!paragraph.trim()) return <br key={idx} />;
                                return <p key={idx} className="mb-4 text-gray-700 leading-relaxed font-serif">{paragraph}</p>;
                            }) : (
                                <div className="flex flex-col items-center justify-center h-full text-gray-300">
                                    <FileText size={48} className="mb-2 opacity-20" />
                                    <p>Belum ada konten untuk ditampilkan.</p>
                                </div>
                            )}
                        </div>
                    )}
                 </div>

                 {/* Actions */}
                 <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => { resetForm(); setActiveTab('list'); }}
                      className="px-5 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-lg transition-colors text-sm"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 bg-primary text-white font-bold rounded-lg hover:bg-primary-light transition-colors flex items-center shadow-md disabled:opacity-70 text-sm"
                    >
                      {isSubmitting ? 'Memproses...' : (
                        <>
                          <Save size={16} className="mr-2" />
                          {editingId ? 'Simpan Perubahan' : 'Terbitkan'}
                        </>
                      )}
                    </button>
                 </div>
               </form>
             )}
          </div>
        )}
      </div>

      {/* --- DELETE CONFIRMATION MODAL --- */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                <div className="p-6 text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="text-red-600 w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus Berita?</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        Tindakan ini tidak dapat dibatalkan. Artikel akan dihapus secara permanen dari database.
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={() => setDeleteTargetId(null)}
                            className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                            Batal
                        </button>
                        <button 
                            onClick={executeDelete}
                            disabled={isDeleting}
                            className="flex-1 px-4 py-2.5 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors text-sm flex justify-center items-center"
                        >
                            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : 'Ya, Hapus'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

      {/* --- GALLERY SELECTOR MODAL --- */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
               {/* Header */}
               <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">Pilih Gambar Galeri</h3>
                    <p className="text-xs text-gray-500">Pilih satu atau lebih gambar untuk disisipkan.</p>
                  </div>
                  <button onClick={() => setIsGalleryModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500">
                     <X size={20} />
                  </button>
               </div>

               {/* Body Grid */}
               <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
                  {galleryLoading ? (
                     <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-primary" size={32} />
                     </div>
                  ) : galleryImages.length === 0 ? (
                     <p className="text-center text-gray-400 italic py-10">Belum ada gambar di galeri.</p>
                  ) : (
                     <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {galleryImages.map((img, idx) => {
                            const isSelected = selectedGalleryItems.includes(img.url);
                            return (
                                <div 
                                  key={idx} 
                                  onClick={() => toggleGallerySelection(img.url)}
                                  className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-4 ring-primary ring-offset-2' : 'hover:opacity-90 border border-gray-200'}`}
                                >
                                   <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                                   {isSelected && (
                                     <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-md">
                                        <Check size={14} strokeWidth={3} />
                                     </div>
                                   )}
                                </div>
                            )
                        })}
                     </div>
                  )}
               </div>

               {/* Footer */}
               <div className="p-4 border-t border-gray-100 bg-white flex justify-between items-center">
                   <span className="text-sm text-gray-500">
                      {selectedGalleryItems.length} gambar dipilih
                   </span>
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setIsGalleryModalOpen(false)}
                        className="px-4 py-2 text-gray-600 font-bold hover:bg-gray-100 rounded-lg text-sm"
                      >
                        Batal
                      </button>
                      <button 
                        onClick={confirmGalleryInsertion}
                        disabled={selectedGalleryItems.length === 0}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                      >
                        Sisipkan ke Berita
                      </button>
                   </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};