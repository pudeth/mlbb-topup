import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AiAssistant from './AiAssistant';
import ScrollNavigator from './ScrollNavigator';
import MobileBottomNav from './MobileBottomNav';

const Layout = ({ children }) => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const isAuthPath = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  // Automatically scroll to top or target hash on route changes
  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
        return;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname, location.search, location.hash]);

  if (isAdminPath) {
    return (
      <div className="min-h-screen bg-dark-bg text-slate-100 relative">
        <main className="relative z-10">{children}</main>
      </div>
    );
  }

  const hideFooter =
    location.pathname.startsWith('/topup') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/register');

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow"></div>
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" style={{ animationDelay: '2s' }}></div>
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Background subtle gaming grid */}
      <div className="fixed inset-0 bg-gaming-grid pointer-events-none opacity-40"></div>

      <Navbar />
      <main className="flex-grow relative z-10 pb-20 lg:pb-0">
        {children}
      </main>
      <AiAssistant />
      <ScrollNavigator />
      {!isAuthPath && <MobileBottomNav />}
      {!hideFooter && <Footer />}
    </div>
  );
};

export default Layout;
