import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/topup" element={<TopUp />} />
              <Route path="/order-status/:orderId" element={<OrderStatus />} />
              <Route path="/login" element={<Login />} />
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
              
              {/* Admin routes */}
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

