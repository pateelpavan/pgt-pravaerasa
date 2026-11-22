import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientDashboard from './pages/client/ClientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Automatically scroll to top on page navigation
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

// Client route protector
function ProtectedClientRoute({ children }) {
  const { loading, isAuthenticated, isClient } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isClient) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

// Admin route protector (Role-based access control)
function ProtectedAdminRoute({ children }) {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Animated Page Router that opens pages smoothly from the side with instant response
function AnimatedPageRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 18 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -18 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
        className="w-full flex-1"
      >
        <Routes location={location}>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Client Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedClientRoute>
                <ClientDashboard />
              </ProtectedClientRoute>
            }
          />

          {/* Protected Admin Console */}
          <Route
            path="/admin"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans selection:bg-orange-500 selection:text-white w-full overflow-x-hidden">
          <Navbar />
          <main className="flex-1 w-full flex flex-col">
            <AnimatedPageRoutes />
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
