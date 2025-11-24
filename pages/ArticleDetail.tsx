import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Article, Comment } from '../types';
import { getCommentsByArticleId, createComment, incrementArticleView, incrementArticleShare } from '../services/geminiService';
import { ArrowLeft, Calendar, User, Tag, Facebook, Twitter, MessageCircle, Link as LinkIcon, Check, Send, MessageSquare, Eye, Share2, Loader2 } from 'lucide-react';

export const ArticleDetail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [copied, setCopied] = useState(false);
  
  // Use state passed from navigation.
  const articleData = location.state?.article as Article;
  
  // Local state for live metrics (View, Share, Comment counts)
  const [currentViews, setCurrentViews] = useState(articleData?.views || 0);
  const [currentShares, setCurrentShares] = useState(articleData?.shareCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', text: '' });

  // Increment Views on Mount
  useEffect(() => {
    const handleViewIncrement = async () => {
      if (articleData?.id) {
        const newViews = await incrementArticleView(articleData.id);
        if (newViews !== null) {
          setCurrentViews(newViews);
        }
      }
    };

    handleViewIncrement();
    // Intentionally empty dependency array to run once per mount
    // or depend on articleData.id to run when ID changes
  }, [articleData?.id]);

  useEffect(() => {
    const fetchComments = async () => {
      if (articleData?.id) {
        setLoadingComments(true);
        const data = await getCommentsByArticleId(articleData.id);
        setComments(data);
        setLoadingComments(false);
      }
    };

    fetchComments();
  }, [articleData?.id]);

  if (!articleData) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Artikel tidak ditemukan</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-light transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const currentUrl = window.location.href;
  const shareText = `${articleData.title} - Baca selengkapnya di TB-News`;

  const handleShare = async (platform: 'facebook' | 'twitter' | 'whatsapp' | 'copy') => {
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + currentUrl)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        // Fallthrough to increment share count for copy action too
        break;
    }

    if (platform !== 'copy') {
      window.open(url, '_blank');
    }

    // Increment share count in DB
    if (articleData.id) {
       const newShareCount = await incrementArticleShare(articleData.id);
       if (newShareCount !== null) {
          setCurrentShares(newShareCount);
       } else {
          // Optimistic update if API fails or is mock
          setCurrentShares(prev => prev + 1);
       }
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentForm.name || !commentForm.text) return;

    setSubmitting(true);
    try {
      const newComment = await createComment(articleData.id, commentForm.name, commentForm.email, commentForm.text);
      
      if (newComment) {
        setComments([newComment, ...comments]);
        setCommentForm({ name: '', email: '', text: '' });
      } else {
        // Fallback UI update if DB fails or using mock article
        alert("Komentar berhasil dikirim (Artikel Mock tidak disimpan ke DB).");
        const mockComment: Comment = {
          id: Date.now().toString(),
          articleId: articleData.id,
          name: commentForm.name,
          date: "Baru saja",
          text: commentForm.text,
          email: commentForm.email
        };
        setComments([mockComment, ...comments]);
        setCommentForm({ name: '', email: '', text: '' });
      }
    } catch (error) {
      console.error("Failed to post comment", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
      {/* Back Button */}
      <div className="p-6 pb-0">
        <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-500 hover:text-primary text-sm font-medium transition-colors"
        >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Kembali
        </button>
      </div>

      {/* Header */}
      <div className="p-6 md:p-8 pb-4">
          <div className="flex items-center space-x-3 mb-4">
             <span className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {articleData.category}
            </span>
            <span className="text-gray-400 text-sm">|</span>
            <span className="text-gray-500 text-sm flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {articleData.publishedAt}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 leading-tight mb-6">
            {articleData.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-6">
              <div className="flex items-center">
                 <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                     <User className="w-5 h-5 text-gray-500" />
                 </div>
                 <div>
                     <p className="text-sm font-bold text-gray-900">{articleData.author}</p>
                     <p className="text-xs text-gray-500">Jurnalis TB-News</p>
                 </div>
              </div>

              {/* Engagement Metrics (Live Updated) */}
              <div className="flex items-center gap-6 text-gray-500 text-sm">
                 <div className="flex items-center gap-2" title="Jumlah Pembaca">
                    <Eye size={18} className="text-gray-400" />
                    <span className="font-medium">{currentViews}</span>
                    <span className="hidden md:inline text-xs">Pembaca</span>
                 </div>
                 <div className="flex items-center gap-2" title="Jumlah Komentar">
                    <MessageCircle size={18} className="text-gray-400" />
                    <span className="font-medium">{comments.length > 0 ? comments.length : articleData.commentCount}</span>
                    <span className="hidden md:inline text-xs">Komentar</span>
                 </div>
                 <div className="flex items-center gap-2" title="Jumlah Share">
                    <Share2 size={18} className="text-gray-400" />
                    <span className="font-medium">{currentShares}</span>
                    <span className="hidden md:inline text-xs">Share</span>
                 </div>
              </div>
          </div>
      </div>

      {/* Main Image */}
      <div className="w-full h-64 md:h-96 bg-gray-100 relative">
         <img 
            src={articleData.imageUrl} 
            alt={articleData.title} 
            className="w-full h-full object-cover" 
            loading="lazy"
         />
      </div>

      {/* Content */}
      <div className="p-6 md:p-10">
        <div className="prose prose-lg prose-slate max-w-none text-gray-700 font-serif leading-loose first-letter:text-5xl first-letter:font-bold first-letter:text-primary first-letter:mr-2 first-letter:float-left">
            {articleData.content.split('\n').map((paragraph, idx) => {
                // Parse [IMAGE:url] tag
                const imageMatch = paragraph.trim().match(/^\[IMAGE:(.*)\]$/);
                
                if (imageMatch) {
                    const imageUrl = imageMatch[1];
                    return (
                        <figure key={idx} className="my-8 -mx-4 md:-mx-0">
                            <img 
                                src={imageUrl} 
                                alt="Ilustrasi Berita" 
                                className="w-full h-auto object-cover rounded-lg shadow-sm"
                                loading="lazy"
                            />
                            <figcaption className="text-center text-xs text-gray-500 mt-2 italic">
                                Dokumentasi: TB-News
                            </figcaption>
                        </figure>
                    );
                }

                // Parse [GALLERY:url1,url2] tag
                const galleryMatch = paragraph.trim().match(/^\[GALLERY:(.*)\]$/);
                if (galleryMatch) {
                   const urls = galleryMatch[1].split(',');
                   return (
                     <div key={idx} className="my-8">
                       <h4 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wider">Galeri Foto</h4>
                       <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                         {urls.map((url, i) => (
                            <div key={i} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity">
                              <img src={url} className="w-full h-full object-cover" alt={`Gallery ${i+1}`} loading="lazy" />
                            </div>
                         ))}
                       </div>
                       <figcaption className="text-center text-xs text-gray-500 mt-2 italic">
                          Galeri Dokumentasi Kegiatan
                       </figcaption>
                     </div>
                   )
                }

                // Skip empty lines to avoid excessive margin, assuming user might double space
                if (!paragraph.trim()) return null;

                return <p key={idx} className="mb-6">{paragraph}</p>;
            })}
        </div>

        {/* Footer & Tags */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
                <div className="flex items-center mr-2">
                    <Tag className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-500 text-sm">Tags:</span>
                </div>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200">Berita</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200">{articleData.category}</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs cursor-pointer hover:bg-gray-200">Viral</span>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
                <span className="text-sm font-bold text-gray-700 mr-2">Bagikan:</span>
                <div className="flex gap-2">
                    {/* Facebook */}
                    <button 
                        onClick={() => handleShare('facebook')}
                        className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:bg-[#1464cc] transition-colors"
                        title="Bagikan ke Facebook"
                    >
                        <Facebook className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                    </button>

                    {/* X / Twitter */}
                    <button 
                        onClick={() => handleShare('twitter')}
                        className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                        title="Bagikan ke X"
                    >
                        <Twitter className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                    </button>

                    {/* WhatsApp */}
                    <button 
                        onClick={() => handleShare('whatsapp')}
                        className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:bg-[#20ba5a] transition-colors"
                        title="Bagikan ke WhatsApp"
                    >
                        <MessageCircle className="w-5 h-5" fill="currentColor" strokeWidth={0} />
                    </button>

                    {/* Copy Link */}
                    <button 
                        onClick={() => handleShare('copy')}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border ${copied ? 'bg-green-50 border-green-500 text-green-600' : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'}`}
                        title="Salin Link"
                    >
                        {copied ? <Check className="w-5 h-5" /> : <LinkIcon className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* Comment Section */}
      <div className="bg-slate-50/50 border-t border-gray-100 p-6 md:p-10">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="text-primary" size={24} />
          <h3 className="text-xl font-bold text-gray-900">Komentar ({comments.length})</h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Form */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
            <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Tulis Komentar</h4>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <input 
                  type="text" 
                  placeholder="Nama Lengkap *" 
                  required
                  value={commentForm.name}
                  onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  disabled={submitting}
                />
              </div>
              <div>
                <input 
                  type="email" 
                  placeholder="Email (Opsional, tidak dipublikasikan)" 
                  value={commentForm.email}
                  onChange={(e) => setCommentForm({...commentForm, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                  disabled={submitting}
                />
              </div>
              <div>
                <textarea 
                  placeholder="Tulis komentar Anda di sini... *" 
                  required
                  rows={4}
                  value={commentForm.text}
                  onChange={(e) => setCommentForm({...commentForm, text: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm resize-none"
                  disabled={submitting}
                />
              </div>
              <button 
                type="submit"
                disabled={submitting}
                className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-light transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                {submitting ? 'Mengirim...' : 'Kirim Komentar'}
              </button>
            </form>
          </div>

          {/* Comment List - Scrollable */}
          <div>
             <h4 className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">Komentar Terbaru</h4>
             
             {loadingComments ? (
               <div className="flex justify-center py-10">
                 <Loader2 className="animate-spin text-gray-300" size={32} />
               </div>
             ) : (
               <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {comments.map((comment, idx) => (
                    <div key={comment.id || idx} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                       <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 font-bold uppercase">
                            {comment.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className="font-bold text-gray-900 text-sm">{comment.name}</span>
                                <span className="text-xs text-gray-400">{comment.date}</span>
                             </div>
                             <p className="text-sm text-gray-600 leading-relaxed">{comment.text}</p>
                          </div>
                       </div>
                    </div>
                  ))}
                  {comments.length === 0 && (
                    <p className="text-center text-gray-400 italic text-sm py-8">Belum ada komentar. Jadilah yang pertama berkomentar!</p>
                  )}
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Related News (Now at bottom) */}
      <div className="bg-white p-6 md:p-8 border-t border-gray-100">
          <h3 className="font-bold text-xl mb-6 text-gray-900">Baca Juga</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map(i => (
                <div key={i} className="flex gap-4 group cursor-pointer bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                    <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
                        <img src={`https://picsum.photos/seed/rel${i}/150/150`} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <span className="text-xs font-bold text-primary uppercase mb-1 block">{articleData.category}</span>
                        <h4 className="font-serif font-bold text-gray-800 group-hover:text-primary transition-colors text-sm leading-snug mb-2">
                            Artikel terkait {articleData.category} yang relevan dengan topik ini #{i}
                        </h4>
                        <span className="text-xs text-gray-400">3 Jam yang lalu</span>
                    </div>
                </div>
            ))}
          </div>
      </div>
    </article>
  );
};