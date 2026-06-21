import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ProtectedRoute({ children }) {
  const { isAdminAuthenticated } = useApp();

  if (!isAdminAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}
