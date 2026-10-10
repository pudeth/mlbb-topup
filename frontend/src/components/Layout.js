import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DesktopSidebar from './DesktopSidebar';
import { PlayerLoginModal } from './PlayerLoginModal';
import ProfileModal from './ProfileModal';

const Layout = ({ children }) => {
  const location = useLocation();
  const [isPlayerLoginOpen, setIsPlayerLoginOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const handleOpen = () => setIsPlayerLoginOpen(true);
    const handleOpenProfile = () => setIsProfileModalOpen(true);

    window.addEventListener('open-player-login', handleOpen);
    window.addEventListener('open-player-profile', handleOpenProfile);

    return () => {
      window.removeEventListener('open-player-login', handleOpen);
      window.removeEventListener('open-player-profile', handleOpenProfile);
    };
  }, []);

  const isAdminDashboard = (location.pathname.startsWith('/admin') || location.pathname.startsWith('/topup/admin')) 
    && !location.pathname.includes('login');
  const isKAdminPath = (location.pathname.toLowerCase() === '/k' || location.pathname.toLowerCase().startsWith('/k/')) &&
    (location.hash.toLowerCase() === '#99' || location.hash.toLowerCase() === '#99/');

  const isAuthPath = location.pathname.startsWith('/login') || 
    location.pathname.startsWith('/register') || 
    isKAdminPath;

  // Automatically scroll to top ONLY on actual page (pathname) navigation, NOT on search params
  const prevPathnameRef = useRef(location.pathname);
  useEffect(() => {
    if (location.hash) {
      try {
        const el = document.querySelector(location.hash);
        if (el) {
          setTimeout(() => {
            el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
          return;
        }
      } catch (err) {
        // Silently ignore non-standard hash fragments such as #99
      }
    }
    // Only scroll to top if pathname changed (e.g. / to /topup), NEVER on query param changes
    if (prevPathnameRef.current !== location.pathname) {
      prevPathnameRef.current = location.pathname;
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);

  if (isAdminDashboard) {
    return (
      <div className="h-screen min-h-[100dvh] bg-[#07090E] text-slate-100 relative overflow-hidden">
        <main className="h-full relative z-10">{children}</main>
      </div>
    );
  }

  const hideFooter =
    location.pathname.startsWith('/topup') ||
    isAuthPath;

  return (
    <div className="min-h-screen flex flex-col bg-dark-bg text-slate-100 relative overflow-x-clip">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow"></div>
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none animate-pulseGlow" style={{ animationDelay: '2s' }}></div>
      <div className="fixed bottom-10 left-10 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
      
      {/* Background subtle gaming grid */}
      <div className="fixed inset-0 bg-gaming-grid pointer-events-none opacity-40"></div>

      {/* Desktop / Laptop Left Sidebar */}
      {!isAuthPath && <DesktopSidebar />}

      {/* Main Container shifted right on desktop / laptop */}
      <div className={`flex flex-col min-h-screen ${!isAuthPath ? 'lg:pl-60 xl:pl-64' : ''}`}>
        {!isAuthPath && <Navbar />}
        <main className={`flex-grow ${isAuthPath ? 'pb-0 flex flex-col justify-center' : 'pb-4 sm:pb-6'}`}>
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>

      {/* Global Player Login Modal Popup */}
      <PlayerLoginModal
        isOpen={isPlayerLoginOpen}
        onClose={() => setIsPlayerLoginOpen(false)}
      />

      {/* Global Player Profile Edit Modal Popup */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default Layout;
