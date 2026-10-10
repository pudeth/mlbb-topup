import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[#07090E]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/K#99" state={{ from: location.pathname }} replace />;
  }

  if (!isAdmin()) {
    return <Navigate to="/K#99" state={{ from: location.pathname, requireAdmin: true }} replace />;
  }

  return children;
};

export default AdminRoute;
