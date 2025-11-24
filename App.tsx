import React from 'react';
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

function App() {
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