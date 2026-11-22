import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PrismCometPreloader from '@/components/ui/prism-comet-preloader';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientDashboard from './pages/client/ClientDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

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

export default function App() {
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <AuthProvider>
      {!hasEntered ? (
        /* Standalone 1st Page: Cinematic Splash Screen Gate */
        <div className="fixed inset-0 z-[99999] w-screen h-screen overflow-hidden bg-[#080402]">
          <PrismCometPreloader
            word="Paverasa Tech Growth"
            caption="PTG, a brand of Paverasa Private Limited."
            durationMs={4500}
            palette={{
              background: "#080402",
              blue: "#9a3412",
              violet: "#ea580c",
              magenta: "#f97316",
              cyan: "#fdba74",
              gold: "#fed7aa",
            }}
            speed={1.5}
            grid={true}
            hud={true}
            onComplete={() => setHasEntered(true)}
          >
            <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
              <h1 className="text-3xl font-extrabold text-white font-['Outfit']">
                Paverasa Tech Growth
              </h1>
              <p className="text-sm text-orange-200 mt-2">Entering site...</p>
            </div>
          </PrismCometPreloader>
        </div>
      ) : (
        /* 2nd Stage: The Full Responsive Website */
        <Router>
          <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800 font-sans selection:bg-orange-500 selection:text-white animate-in fade-in duration-500">
            <Navbar />
            <main className="flex-1">
              <Routes>
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
            </main>
            <Footer />
          </div>
        </Router>
      )}
    </AuthProvider>
  );
}
