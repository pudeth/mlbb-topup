import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Import pages
import Home from './pages/Home';
import TopUp from './pages/TopUp';
import OrderStatus from './pages/OrderStatus';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Support from './pages/Support';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ApiDocs from './pages/ApiDocs';
import AdminRoute from './components/AdminRoute';
import Layout from './components/Layout';

// Seamless Player Login Redirect: when customers visit /login, navigate to home and pop up Player Login
function PlayerLoginRedirect() {
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate('/', { replace: true });
    const timer = setTimeout(() => {
      window.dispatchEvent(new CustomEvent('open-player-login'));
    }, 150);
    return () => clearTimeout(timer);
  }, [navigate]);

  return null;
}

// Strict Secret Admin Login Gate: ONLY allows access if the exact secret hash (#99) is present in the URL
function StrictSecretAdminLogin() {
  const [isAuthorized, setIsAuthorized] = React.useState(() => {
    if (typeof window === 'undefined') return false;
    const h = (window.location.hash || '').toLowerCase();
    return h === '#99' || h === '#99/';
  });

  React.useEffect(() => {
    const checkHash = () => {
      const h = (window.location.hash || '').toLowerCase();
      setIsAuthorized(h === '#99' || h === '#99/');
    };

    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (!isAuthorized) {
    // If hacker or developer opens /K or /k without #99, silently bounce them to Storefront Home
    return <Navigate to="/" replace />;
  }

  return <Login />;
}

// Subdomain-aware Home: If accessing through an admin subdomain (e.g. admin.*), routes directly to /admin
function SmartHome() {
  const isSubdomainAdmin = typeof window !== 'undefined' && 
    (window.location.hostname.startsWith('admin.') || window.location.hostname.startsWith('adm.'));

  if (isSubdomainAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Home />;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              {/* Storefront routes */}
              <Route path="/" element={<SmartHome />} />
              <Route path="/topup" element={<TopUp />} />
              <Route path="/order-status/:orderId" element={<OrderStatus />} />
              
              {/* Player Login redirect: visitors browsing /login are safely directed to storefront with player login modal */}
              <Route path="/login" element={<PlayerLoginRedirect />} />
              <Route path="/register" element={<Register />} />
              <Route path="/support" element={<Support />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<PrivacyPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              
              {/* API Documentation */}
              <Route path="/api-docs" element={<ApiDocs />} />
              <Route path="/api-docs/*" element={<ApiDocs />} />
              <Route path="/docs/freefire" element={<ApiDocs />} />

              {/* Player Profile & Order History */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/order-history" element={<OrderHistory />} />
              <Route path="/player-login" element={<OrderHistory />} />
              
              {/* STRICT SECRET ADMIN LOGIN GATE: ONLY allows access via https://mlbb-topup-jet.vercel.app/K#99 */}
              <Route path="/K" element={<StrictSecretAdminLogin />} />
              <Route path="/k" element={<StrictSecretAdminLogin />} />

              {/* Anti-Hacker Decoys: If hackers try /admin-login, /admin/login, or workarounds, silently bounce to Storefront Home */}
              <Route path="/admin-login" element={<Navigate to="/" replace />} />
              <Route path="/admin/login" element={<Navigate to="/" replace />} />
              <Route path="/topup/admin-login" element={<Navigate to="/" replace />} />
              <Route path="/topup/admin/login" element={<Navigate to="/" replace />} />
              <Route path="/K99" element={<Navigate to="/" replace />} />
              <Route path="/k99" element={<Navigate to="/" replace />} />
              <Route path="/K-99" element={<Navigate to="/" replace />} />
              <Route path="/k-99" element={<Navigate to="/" replace />} />

              {/* Admin Dashboard Protected routes: If not authenticated/admin, AdminRoute silently bounces to / */}
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/topup/admin" element={<Navigate to="/" replace />} />
              <Route path="/topup/admin/*" element={<Navigate to="/" replace />} />
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

