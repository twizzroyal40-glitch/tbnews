import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, ShieldCheck, ChevronRight, 
  Home, Siren, Shield, Calendar, Sparkles, FileText,
  Facebook, Instagram, Twitter, Youtube, List,
  ChevronUp, Archive, Eye
} from 'lucide-react';
import { NavItem, Category, Article, AdConfig } from '../types';
import { getPopularArticles, getAds } from '../services/geminiService';

const navItems: NavItem[] = [
  { label: 'Kriminal', path: '/kriminal', category: Category.KRIMINAL },
  { label: 'Keamanan', path: '/keamanan', category: Category.KEAMANAN },
  { label: 'Kegiatan', path: '/kegiatan', category: Category.KEGIATAN },
  { label: 'Inspirasi', path: '/inspirasi', category: Category.INSPIRASI },
  { label: 'Press Release', path: '/press-release', category: Category.PRESS_RELEASE },
];

const getNavIcon = (category: Category | null) => {
  if (!category) return <List size={20} />;
  switch (category) {
    case Category.HOME: return <Home size={20} />;
    case Category.KRIMINAL: return <Siren size={20} />;
    case Category.KEAMANAN: return <Shield size={20} />;
    case Category.KEGIATAN: return <Calendar size={20} />;
    case Category.INSPIRASI: return <Sparkles size={20} />;
    case Category.PRESS_RELEASE: return <FileText size={20} />;
    default: return <ShieldCheck size={20} />;
  }
};

export const Layout: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Popular Articles State
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [loadingPopular, setLoadingPopular] = useState(false);

  // Ads State
  const [ads, setAds] = useState<AdConfig[]>([]);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 20);
      setShowScrollTop(scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch Data on Mount
  useEffect(() => {
    const fetchData = async () => {
        setLoadingPopular(true);
        try {
            const [popularData, adsData] = await Promise.all([
                getPopularArticles(),
                getAds()
            ]);
            setPopularArticles(popularData);
            setAds(adsData);
        } catch (error) {
            console.error("Failed to load initial data", error);
        } finally {
            setLoadingPopular(false);
        }
    };
    fetchData();
  }, [location.pathname]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Handle route change: Scroll to top & Close menus
  useEffect(() => {
    window.scrollTo(0, 0); // Always start from top on navigation
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false); 
  }, [location.pathname]);

  // Prevent body scroll when menu or search is open
  useEffect(() => {
    if (isMobileMenuOpen || isSearchOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen, isSearchOpen]);

  // Focus search input when opened and handle Escape key
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
    
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isSearchOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setIsMobileMenuOpen(false);
      setSearchQuery('');
    }
  };

  const handleArticleClick = (article: Article) => {
      navigate(`/article/${article.id}`, { state: { article } });
  };

  const getAdByPosition = (position: string) => {
      return ads.find(ad => ad.position === position && ad.isActive);
  };

  // Helper to ensure URL works (adds https if missing)
  const formatAdUrl = (url: string) => {
    if (!url) return '#';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
      return url;
    }
    return `https://${url}`;
  };

  const sidebarTopAd = getAdByPosition('sidebar_top');
  const sidebarMiddleAd = getAdByPosition('sidebar_middle');
  const sidebarBottomAd = getAdByPosition('sidebar_bottom');

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 relative">
      {/* Top Bar - Elegant Dark Red */}
      <div className="bg-primary-dark text-white py-2 hidden md:block border-b border-white/10">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center text-[11px] tracking-wide font-medium">
          <div className="flex items-center space-x-6">
             <span className="flex items-center opacity-90">
               {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
             </span>
             <span className="w-px h-3 bg-white/20"></span>
             <span className="opacity-90">Kota Sorong, Papua Barat Daya</span>
          </div>
          <div className="flex items-center space-x-6">
            <NavLink to="/tentang" className="hover:text-red-200 transition-colors">Tentang Kami</NavLink>
            <NavLink to="/kontak" className="hover:text-red-200 transition-colors">Kontak</NavLink>
            <NavLink to="/redaksi" className="hover:text-red-200 transition-colors">Redaksi</NavLink>
            <div className="flex space-x-3 border-l border-white/20 pl-6">
               <a href="https://www.facebook.com/profile.php?id=100087469704963" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                 <Facebook size={14} className="cursor-pointer hover:text-red-200" />
               </a>
               <a href="https://x.com/humas_sorkot" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                 <Twitter size={14} className="cursor-pointer hover:text-red-200" />
               </a>
               <a href="https://www.instagram.com/polrestasorongkota/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                 <Instagram size={14} className="cursor-pointer hover:text-red-200" />
               </a>
               <a href="https://www.youtube.com/@humaspolrestasorongkota" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                 <Youtube size={14} className="cursor-pointer hover:text-red-200" />
               </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navbar - Clean & Elegant */}
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-500 border-b ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-md border-gray-200 py-2' 
            : 'bg-white border-gray-100 py-5'
        }`}
      >
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between">
            {/* Logo Image */}
            <NavLink to="/" className="flex items-center group">
              <img 
                src="https://raw.githubusercontent.com/esport-restasorkot/imagesrc/main/TBNewsSorkot.png" 
                alt="TB-News Logo" 
                className={`transition-all duration-500 object-contain ${isScrolled ? 'h-12' : 'h-16 md:h-20'}`}
              />
            </NavLink>

            {/* Desktop Nav - Minimalist */}
            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `relative text-lg font-medium tracking-wide transition-all duration-300 hover:text-primary py-2 group ${
                      isActive ? 'text-primary' : 'text-gray-600'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item.label}
                      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 origin-left ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`}/>
                    </>
                  )}
                </NavLink>
              ))}
              
              <div className="w-px h-6 bg-gray-200 mx-2"></div>

              <div className="flex items-center gap-2">
                 {/* Trigger Search Button */}
                 <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-full transition-all transform hover:scale-105"
                    aria-label="Cari Berita"
                  >
                    <Search size={22} strokeWidth={2} />
                  </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-800 hover:text-primary transition-colors"
              >
                <Search size={24} strokeWidth={1.5} />
              </button>
              <button 
                className="p-2 text-gray-800 focus:outline-none hover:text-primary transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu size={28} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* FULL SCREEN SEARCH OVERLAY - ELEGANT & MODERN */}
      <div 
        className={`fixed inset-0 bg-white/95 backdrop-blur-xl z-[60] flex flex-col items-center justify-center transition-all duration-500 ${
            isSearchOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        {/* Close Button */}
        <button 
            onClick={() => setIsSearchOpen(false)} 
            className="absolute top-8 right-8 p-3 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all transform hover:rotate-90 duration-300"
        >
            <X size={32} strokeWidth={1.5} />
        </button>

        <div className="w-full max-w-3xl px-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <h2 className="text-center text-primary font-bold tracking-widest uppercase text-sm mb-8">Pencarian Berita</h2>
            <form onSubmit={handleSearchSubmit} className="relative w-full group">
                <input 
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ketik kata kunci..."
                    className="w-full bg-transparent text-3xl md:text-5xl font-serif font-bold text-gray-900 placeholder:text-gray-300 border-b-2 border-gray-200 focus:border-primary py-6 outline-none transition-all text-center"
                />
                <button 
                    type="submit" 
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-4 text-gray-300 group-focus-within:text-primary hover:text-primary transition-colors duration-300"
                >
                     <Search size={32} />
                </button>
            </form>
            <p className="text-center text-gray-400 mt-6 text-sm font-light">Tekan <span className="font-medium text-gray-500">Enter</span> untuk mencari</p>
            
            {/* Quick Suggestions (Optional) */}
            <div className="mt-12 flex flex-wrap justify-center gap-3">
               <span className="text-sm text-gray-400 mr-2">Populer:</span>
               {['Kriminal', 'Laka Lantas', 'Narkoba', 'Pilkada', 'Kapolresta'].map(tag => (
                   <button 
                     key={tag}
                     onClick={() => {
                        setSearchQuery(tag);
                        navigate(`/search?q=${encodeURIComponent(tag)}`);
                        setIsSearchOpen(false);
                     }}
                     className="text-sm px-3 py-1 rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white transition-colors"
                   >
                       {tag}
                   </button>
               ))}
            </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`} 
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* Side Drawer */}
      <div 
        className={`fixed top-0 right-0 w-[85%] max-w-xs h-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
         {/* Drawer Header */}
         <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-primary text-white">
             <div className="flex items-center bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                <img 
                  src="https://raw.githubusercontent.com/esport-restasorkot/imagesrc/main/TBNewsSorkotWhite.png" 
                  alt="TB-News" 
                  className="h-8 w-auto" 
                />
             </div>
             <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
             >
                <X size={24} />
             </button>
         </div>

         {/* Drawer Content */}
         <div className="flex-1 overflow-y-auto p-6">
             {/* Nav Links */}
             <nav className="space-y-2">
                 {navItems.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-red-50 text-primary font-bold shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary font-medium'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-4">
                             <span className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}>
                                {getNavIcon(item.category)}
                             </span>
                             <span>{item.label}</span>
                          </div>
                          <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </>
                      )}
                    </NavLink>
                  ))}

                  {/* Archive Link Mobile */}
                  <NavLink
                      to="/archive"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between p-4 rounded-xl transition-all duration-200 group ${
                          isActive 
                            ? 'bg-red-50 text-primary font-bold shadow-sm' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-primary font-medium'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-4">
                             <span className={isActive ? 'text-primary' : 'text-gray-400 group-hover:text-primary'}>
                                <Archive size={20} />
                             </span>
                             <span>Archive</span>
                          </div>
                          <ChevronRight size={16} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        </>
                      )}
                    </NavLink>
             </nav>
         </div>

         {/* Drawer Footer */}
         <div className="p-6 border-t border-gray-100 bg-gray-50/50">
             <div className="grid grid-cols-3 gap-2 mb-6 text-center">
                 <NavLink to="/tentang" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">Tentang</NavLink>
                 <NavLink to="/redaksi" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">Redaksi</NavLink>
                 <NavLink to="/kontak" onClick={() => setIsMobileMenuOpen(false)} className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">Kontak</NavLink>
             </div>
             
             <div className="flex justify-center space-x-8 text-gray-400 mb-4">
                <a href="https://www.facebook.com/profile.php?id=100087469704963" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <Facebook size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
                </a>
                <a href="https://www.instagram.com/polrestasorongkota/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <Instagram size={20} className="hover:text-pink-600 cursor-pointer transition-colors" />
                </a>
                <a href="https://x.com/humas_sorkot" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                  <Twitter size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
                </a>
                <a href="https://www.youtube.com/@humaspolrestasorongkota" target="_blank" rel="noopener noreferrer" aria-label="Youtube">
                  <Youtube size={20} className="hover:text-red-600 cursor-pointer transition-colors" />
                </a>
             </div>
             <p className="text-[10px] text-center text-gray-400">
                &copy; {new Date().getFullYear()} Polresta Sorong Kota.
             </p>
             {/* Admin Link Mobile */}
              <div className="mt-4 text-center">
                <NavLink to="/tbnewssorkot" className="text-[10px] text-gray-300 hover:text-gray-500 transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                  TB News Sorkot
                </NavLink>
              </div>
         </div>
      </div>

      {/* Content with Sidebar Layout */}
      <div className="flex-grow bg-slate-50">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Main Content Area (70%) */}
            <main className="w-full lg:w-[70%]">
              <Outlet />
            </main>

            {/* Sidebar / Ads Area (30%) */}
            <aside className="w-full lg:w-[30%] space-y-8">
              
              {/* Ad Slot 1 - 4:5 (Top) - Only show if active and has image */}
              {sidebarTopAd && sidebarTopAd.imageUrl && (
                 <a 
                    href={formatAdUrl(sidebarTopAd.linkUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full aspect-[4/5] rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative"
                  >
                    <img src={sidebarTopAd.imageUrl} alt={sidebarTopAd.title} className="w-full h-full object-cover" />
                 </a>
              )}

              {/* Trending / Popular Widget */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary px-5 py-3 flex justify-between items-center">
                  <h3 className="font-bold text-white flex items-center text-sm uppercase tracking-wider">
                    <span className="mr-2">🔥</span> Terpopuler
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {loadingPopular ? (
                     <div className="p-8 flex justify-center">
                        <div className="w-6 h-6 border-2 border-gray-200 border-t-primary rounded-full animate-spin"></div>
                     </div>
                  ) : popularArticles.length > 0 ? (
                    popularArticles.map((article, i) => (
                      <div 
                        key={article.id} 
                        className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group" 
                        onClick={() => handleArticleClick(article)}
                      >
                        <div className="flex gap-3">
                           <span className="text-2xl font-black text-gray-200 group-hover:text-primary/30 font-serif transition-colors w-8 flex-shrink-0 text-center">0{i + 1}</span>
                           <div>
                              <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary leading-snug line-clamp-2 mb-1 transition-colors">
                                {article.title}
                              </h4>
                              <div className="flex items-center gap-3">
                                 <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-red-50 px-1.5 rounded">{article.category}</span>
                                 <span className="text-[10px] text-gray-400 flex items-center">
                                    <Eye size={10} className="mr-1" /> {article.views}
                                 </span>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-400 text-xs">
                        Belum ada artikel populer
                    </div>
                  )}
                </div>
              </div>

               {/* Ad Slot 3 - 4:5 (Middle - NEW) - Only show if active and has image */}
               {sidebarMiddleAd && sidebarMiddleAd.imageUrl && (
                 <a 
                    href={formatAdUrl(sidebarMiddleAd.linkUrl)} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="block w-full aspect-[4/5] rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative"
                  >
                     <img src={sidebarMiddleAd.imageUrl} alt={sidebarMiddleAd.title} className="w-full h-full object-cover" />
                 </a>
               )}

               {/* Ad Slot 2 (Sticky) - 1:1 (Bottom) - Only show if active and has image */}
               {sidebarBottomAd && sidebarBottomAd.imageUrl && (
                 <div className="sticky top-24">
                     <a 
                        href={formatAdUrl(sidebarBottomAd.linkUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="block w-full aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-shadow relative"
                     >
                        <img src={sidebarBottomAd.imageUrl} alt={sidebarBottomAd.title} className="w-full h-full object-cover" />
                     </a>
                 </div>
               )}

            </aside>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary-light transition-all duration-500 transform ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'
        }`}
        aria-label="Kembali ke atas"
      >
        <ChevronUp size={24} strokeWidth={2.5} />
      </button>

      {/* Footer */}
      <footer className="bg-primary-dark text-white pt-16 pb-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="mb-6">
                <img src="https://raw.githubusercontent.com/esport-restasorkot/imagesrc/main/TBNewsSorkotWhite.png" alt="TB-News" className="h-12 w-auto" />
              </div>
              <p className="text-red-100/80 text-sm leading-relaxed mb-6">
                Menyajikan informasi terkini, akurat, dan terpercaya seputar keamanan, kriminalitas, dan inspirasi bagi masyarakat Kota Sorong dan sekitarnya.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-white/30 pl-3">Kategori</h4>
              <ul className="space-y-3 text-sm text-red-100/70">
                {navItems.map(item => (
                  <li key={item.path}>
                    <NavLink to={item.path} className="hover:text-white transition-colors block py-1">
                      {item.label}
                    </NavLink>
                  </li>
                ))}
                {/* Archive Link Footer */}
                <li>
                  <NavLink to="/archive" className="hover:text-white transition-colors block py-1">
                    Archive
                  </NavLink>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-white/30 pl-3">Hubungi Kami</h4>
              <ul className="space-y-3 text-sm text-red-100/70">
                <li>Jl. Jend. A. Yani, No.1</li>
                <li>Kota Sorong, Papua Barat Daya</li>
                <li>humas@polrestasorongkota.com</li>
                <li>(0951) 321xxx</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-red-200/60">
            <p>&copy; {new Date().getFullYear()} Polresta Sorong Kota. Hak Cipta Dilindungi.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <NavLink to="/privacy" className="hover:text-white">Privacy Policy</NavLink>
              <NavLink to="/terms" className="hover:text-white">Terms of Service</NavLink>
              <NavLink to="/tbnewssorkot" className="hover:text-white transition-colors">TB News Sorkot</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};