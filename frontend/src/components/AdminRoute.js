import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#07090E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!isAuthenticated() || !isAdmin()) {
    // Strictly bounce any hacker or unauthorized visitor to storefront home without revealing the secret login link
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
