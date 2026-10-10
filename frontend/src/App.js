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
              
              {/* Dedicated Secret Admin Login Routes: https://mlbb-topup-jet.vercel.app/K#99 */}
              <Route path="/K" element={<Login />} />
              <Route path="/k" element={<Login />} />
              <Route path="/K99" element={<Login />} />
              <Route path="/k99" element={<Login />} />
              <Route path="/K-99" element={<Login />} />
              <Route path="/k-99" element={<Login />} />
              <Route path="/admin-login" element={<Navigate to="/K#99" replace />} />
              <Route path="/admin/login" element={<Navigate to="/K#99" replace />} />
              <Route path="/topup/admin-login" element={<Navigate to="/K#99" replace />} />
              <Route path="/topup/admin/login" element={<Navigate to="/K#99" replace />} />

              {/* Admin Dashboard Protected routes */}
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
              <Route path="/topup/admin" element={<Navigate to="/admin" replace />} />
              <Route path="/topup/admin/*" element={<Navigate to="/admin" replace />} />
              <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
            </Routes>
          </Layout>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

