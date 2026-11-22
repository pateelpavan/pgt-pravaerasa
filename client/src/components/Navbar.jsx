import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Code2, 
  Menu, 
  X, 
  LogIn, 
  UserPlus, 
  LayoutDashboard, 
  LogOut,
  ChevronRight,
  Shield
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/#services' },
    { name: 'How We Work', path: '/#how-we-work' },
    { name: 'Why Us', path: '/#why-us' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path.startsWith('/#')) return location.pathname === '/' && location.hash === path.substring(1);
    return location.pathname === path;
  };

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    if (path.startsWith('/#')) {
      if (location.pathname !== '/') {
        navigate('/');
        setTimeout(() => {
          const el = document.getElementById(path.substring(2));
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById(path.substring(2));
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all duration-300 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group active:scale-95 transition-transform">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-600 p-[2px] shadow-md shadow-orange-500/20 group-hover:shadow-orange-500/40 transition-all duration-300">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Code2 className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-1.5 font-['Outfit']">
                  PTG <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-50 text-orange-600 border border-orange-200 font-semibold">GROWTH</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                  Paverasa Tech Growth
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link.path)}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-200 active:scale-95 cursor-pointer ${
                    isActive(link.path)
                      ? 'text-orange-600 bg-orange-50 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </nav>

            {/* Auth Actions (Desktop) */}
            <div className="hidden lg:flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  {!isAdmin && (
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 text-sm font-bold transition-all shadow-sm active:scale-95"
                    >
                      <LayoutDashboard className="w-4 h-4 text-orange-600" />
                      Client Dashboard
                    </Link>
                  )}

                  <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{user?.name}</p>
                      <p className="text-[10px] text-orange-600 font-semibold">{user?.company || (isAdmin ? 'Admin Master' : '')}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      title="Logout"
                      className="p-2.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all active:scale-95 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2.5">
                  <Link
                    to="/login"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-slate-700 hover:text-orange-600 hover:bg-orange-50/70 transition-all border border-slate-200 hover:border-orange-300 active:scale-95"
                  >
                    <LogIn className="w-4 h-4 text-orange-500" />
                    Client Login
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/20 hover:shadow-orange-500/35 transition-all duration-300 active:scale-95"
                  >
                    <UserPlus className="w-4 h-4" />
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2.5 rounded-full text-slate-700 hover:text-orange-600 hover:bg-orange-50 transition-all active:scale-95 focus:outline-none border border-slate-200 cursor-pointer"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modern Slide-over Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop blur overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
          />

          {/* Drawer Panel - slides in from right side */}
          <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between p-6 z-10 overflow-y-auto animate-in slide-in-from-right duration-300">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-5 border-b border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-orange-500 p-[2px] flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-slate-900 font-['Outfit']">PTG Menu</span>
                    <p className="text-[10px] text-slate-500">Paverasa Tech Growth</p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-full text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all active:scale-90 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="py-5 space-y-1.5">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className={`w-full text-left px-4 py-3 rounded-full text-base font-semibold flex items-center justify-between transition-all duration-200 active:scale-95 cursor-pointer ${
                      isActive(link.path)
                        ? 'text-orange-600 bg-orange-50 font-bold shadow-xs'
                        : 'text-slate-700 hover:text-orange-600 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.name}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive(link.path) ? 'text-orange-500' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Auth Actions in Drawer */}
            <div className="pt-5 border-t border-slate-200 space-y-3">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-3 bg-orange-50/60 rounded-2xl border border-orange-100">
                    <p className="text-xs text-slate-500">Signed in as</p>
                    <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                    <p className="text-xs text-orange-600 font-medium truncate">{user?.email}</p>
                  </div>

                  {!isAdmin && (
                    <button
                      onClick={() => { setMobileMenuOpen(false); navigate('/dashboard'); }}
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 hover:bg-orange-700 transition-all active:scale-95 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Client Dashboard
                    </button>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-sm hover:bg-rose-100 transition-all active:scale-95 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="space-y-2.5">
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-sm hover:bg-slate-100 transition-all active:scale-95 cursor-pointer"
                  >
                    <LogIn className="w-4 h-4 text-orange-500" />
                    Client Login
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all active:scale-95 cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4" />
                    Get Started
                  </button>
                </div>
              )}

              <p className="text-[11px] text-center text-slate-400 pt-2">
                © 2026 Paverasa Private Limited
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
