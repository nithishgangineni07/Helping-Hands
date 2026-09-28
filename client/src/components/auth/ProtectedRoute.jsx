import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user, token, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-charcoal-600">Verifying session credentials...</p>
      </div>
    );
  }

  if (!token || !user) {
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/secure-admin-login" replace />;
    }
    if (allowedRoles.includes('trust')) {
      return <Navigate to="/trust/login" replace />;
    }
    return <Navigate to="/" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // If trust tries to access admin or admin tries to access trust
    if (user.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user.role === 'trust') {
      return <Navigate to="/trust/dashboard" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children ? children : <Outlet />;
};

export default ProtectedRoute;
