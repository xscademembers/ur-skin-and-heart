import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { DermatologyPage } from './pages/Dermatology';
import { CardiologyPage } from './pages/Cardiology';
import { BlogPage } from './pages/Blog';
import { ContactPage } from './pages/Contact';
import { GalleryPage } from './pages/Gallery';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginPage } from './pages/Login';
import { BlogDetailPage } from './pages/BlogDetail';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const App: React.FC = () => {
  const location = useLocation();
  const isCardiology = location.pathname.includes('/cardiology');
  const path = location.pathname.toLowerCase();
  const isPrivate = /^\/(admin|login)(\/|$)/.test(path);

  return (
    <div className={`flex flex-col min-h-screen font-sans antialiased selection:bg-brand-blue selection:text-white ${isCardiology ? 'text-brand-blue' : 'text-brand-darkBlue'}`}>
      <ScrollToTop />
      {!isPrivate && <Header />}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<DermatologyPage />} />
          <Route path="/cardiology" element={<CardiologyPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      {!isPrivate && <Footer />}
    </div>
  );
};

export default App;