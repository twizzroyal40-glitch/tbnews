import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { CategoryPage } from './pages/CategoryPage';
import { ArticleDetail } from './pages/ArticleDetail';
import { IndexPage } from './pages/IndexPage';
import { SearchPage } from './pages/SearchPage';
import { LatestNewsPage } from './pages/LatestNewsPage';
import { AdminPage } from './pages/AdminPage';
import { RedaksiPage } from './pages/RedaksiPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { Category } from './types';
import { checkSupabaseConnection } from './services/geminiService';
import { MaintenancePage } from './pages/MaintenancePage';
import { Loader2 } from 'lucide-react';

function App() {
  const [isChecking, setIsChecking] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const runConnectionCheck = async () => {
    setIsChecking(true);
    const connectionStatus = await checkSupabaseConnection();
    setIsConnected(connectionStatus);
    setIsChecking(false);
  };

  useEffect(() => {
    // Memberi sedikit jeda agar animasi loading terlihat
    const timer = setTimeout(() => {
        runConnectionCheck();
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

  if (isChecking && !isConnected) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <img 
          src="https://raw.githubusercontent.com/esport-restasorkot/imagesrc/main/TBNewsSorkot.png" 
          alt="TB-News Logo" 
          className="h-24 mb-6"
        />
        <div className="flex items-center text-gray-500 font-serif italic">
            <Loader2 className="w-5 h-5 animate-spin mr-3" />
            Memeriksa koneksi ke server...
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return <MaintenancePage onRetry={runConnectionCheck} isRetrying={isChecking} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          
          <Route 
            path="kriminal" 
            element={
              <CategoryPage 
                category={Category.KRIMINAL} 
                title="Kriminalitas" 
                subtitle="Berita terkini seputar pengungkapan kasus dan tindak pidana."
              />
            } 
          />
          
          <Route 
            path="keamanan" 
            element={
              <CategoryPage 
                category={Category.KEAMANAN} 
                title="Keamanan & Ketertiban" 
                subtitle="Informasi situasi keamanan dan ketertiban masyarakat (Kamtibmas)."
              />
            } 
          />
          
          <Route 
            path="kegiatan" 
            element={
              <CategoryPage 
                category={Category.KEGIATAN} 
                title="Kegiatan" 
                subtitle="Agenda dan dokumentasi kegiatan resmi kepolisian dan kemasyarakatan."
              />
            } 
          />
          
          <Route 
            path="inspirasi" 
            element={
              <CategoryPage 
                category={Category.INSPIRASI} 
                title="Inspirasi" 
                subtitle="Profil dan kisah inspiratif membangun bangsa."
              />
            } 
          />

          <Route 
            path="press-release" 
            element={
              <CategoryPage 
                category={Category.PRESS_RELEASE} 
                title="Press Release" 
                subtitle="Pernyataan resmi dan rilis pers untuk media."
              />
            } 
          />

          <Route path="article/:id" element={<ArticleDetail />} />
          <Route path="archive" element={<IndexPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="terkini" element={<LatestNewsPage />} />
          <Route path="redaksi" element={<RedaksiPage />} />
          <Route path="tentang" element={<AboutPage />} />
          <Route path="kontak" element={<ContactPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="tbnewssorkot" element={<AdminPage />} />
          
          {/* Catch-all route: Redirects any unknown URL back to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
