import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, Search, ShieldCheck, ChevronRight, 
  Home, Siren, Shield, Calendar, Sparkles, FileText,
  Facebook, Instagram, Twitter, Youtube, List, Bell,
  ChevronUp, Archive
} from 'lucide-react';
import { NavItem, Category } from '../types';

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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false); // Close search on navigation
  }, [location]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
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
            <a href="#" className="hover:text-red-200 transition-colors">Tentang Kami</a>
            <a href="#" className="hover:text-red-200 transition-colors">Kontak</a>
            <a href="#" className="hover:text-red-200 transition-colors">Redaksi</a>
            <div className="flex space-x-3 border-l border-white/20 pl-6">
               <Facebook size={14} className="cursor-pointer hover:text-red-200" />
               <Twitter size={14} className="cursor-pointer hover:text-red-200" />
               <Instagram size={14} className="cursor-pointer hover:text-red-200" />
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
                <div className="relative flex items-center">
                    {/* Expandable Search Bar */}
                    <form 
                      onSubmit={handleSearchSubmit}
                      className={`absolute right-0 top-1/2 -translate-y-1/2 flex items-center transition-all duration-300 overflow-hidden bg-white ${
                        isSearchOpen ? 'w-64 opacity-100 shadow-lg border border-gray-200 rounded-full mr-10' : 'w-0 opacity-0'
                      }`}
                    >
                       <input 
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Cari berita..."
                          className="w-full h-full px-4 py-2 text-sm outline-none text-gray-700 bg-transparent"
                       />
                    </form>

                    <button 
                      onClick={() => {
                        if (isSearchOpen && searchQuery) {
                           handleSearchSubmit({ preventDefault: () => {} } as React.FormEvent);
                        } else {
                           setIsSearchOpen(!isSearchOpen);
                        }
                      }}
                      className={`p-2 hover:text-primary hover:bg-red-50 rounded-full transition-all relative z-10 ${isSearchOpen ? 'text-primary bg-red-50' : 'text-gray-400'}`}
                    >
                      {isSearchOpen ? <X size={20} strokeWidth={2} /> : <Search size={20} strokeWidth={2} />}
                    </button>
                </div>

                <button className="p-2 text-gray-400 hover:text-primary hover:bg-red-50 rounded-full transition-all relative">
                   <Bell size={20} strokeWidth={2} />
                   <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden p-2 text-gray-800 focus:outline-none hover:text-primary transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={28} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </header>

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
             {/* Search */}
             <div className="mb-8">
                 <form onSubmit={handleSearchSubmit} className="relative group">
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Cari berita..." 
                      className="w-full bg-gray-50 border border-gray-200 rounded-full py-3 px-5 pl-12 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all shadow-sm text-sm"
                    />
                    <button type="submit" className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-primary transition-colors">
                      <Search size={18} />
                    </button>
                 </form>
             </div>

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
                 <a href="#" className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">Tentang</a>
                 <a href="#" className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">Redaksi</a>
                 <a href="#" className="text-xs font-medium text-gray-500 hover:text-primary transition-colors">Kontak</a>
             </div>
             
             <div className="flex justify-center space-x-8 text-gray-400 mb-4">
                <Facebook size={20} className="hover:text-blue-600 cursor-pointer transition-colors" />
                <Instagram size={20} className="hover:text-pink-600 cursor-pointer transition-colors" />
                <Twitter size={20} className="hover:text-blue-400 cursor-pointer transition-colors" />
                <Youtube size={20} className="hover:text-red-600 cursor-pointer transition-colors" />
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
              
              {/* Ad Slot 1 - 1:1 */}
              <div className="bg-gray-200 border border-gray-300 rounded-lg w-full aspect-square flex flex-col items-center justify-center text-gray-400 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 opacity-50"></div>
                <span className="font-bold text-lg relative z-10">IKLAN SPACE</span>
                <span className="text-sm relative z-10">1 : 1</span>
              </div>

              {/* Trending / Popular Widget */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-primary px-5 py-3 flex justify-between items-center">
                  <h3 className="font-bold text-white flex items-center text-sm uppercase tracking-wider">
                    <span className="mr-2">🔥</span> Terpopuler
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group" onClick={() => navigate('/')}>
                      <div className="flex gap-3">
                         <span className="text-2xl font-black text-gray-200 group-hover:text-primary/30 font-serif transition-colors">0{i}</span>
                         <div>
                            <h4 className="text-sm font-bold text-gray-800 group-hover:text-primary leading-snug line-clamp-2 mb-1 transition-colors">
                              Kapolresta Sorong Kota Pimpin Apel Gelar Pasukan
                            </h4>
                            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Kegiatan • 2 Jam lalu</span>
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

               {/* Ad Slot 2 (Sticky) - 4:5 */}
              <div className="sticky top-24 bg-gray-200 border border-gray-300 rounded-lg w-full aspect-[4/5] flex flex-col items-center justify-center text-gray-400 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300 opacity-50"></div>
                <span className="font-bold text-lg relative z-10">IKLAN SPACE</span>
                <span className="text-sm relative z-10">4 : 5</span>
              </div>

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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
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

             <div>
              <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-white/30 pl-3">Langganan</h4>
              <p className="text-red-100/70 text-sm mb-4">Dapatkan berita terbaru langsung di inbox Anda.</p>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Email Anda" 
                  className="bg-red-900/30 border border-red-800 text-white px-4 py-2 w-full text-sm focus:outline-none focus:border-white rounded-l-md placeholder-red-200/50" 
                />
                <button className="bg-white text-primary-dark hover:bg-gray-100 px-4 py-2 font-bold text-sm rounded-r-md transition-colors">
                  Daftar
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-red-200/60">
            <p>&copy; {new Date().getFullYear()} Polresta Sorong Kota. Hak Cipta Dilindungi.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
              <NavLink to="/tbnewssorkot" className="hover:text-white transition-colors">TB News Sorkot</NavLink>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};