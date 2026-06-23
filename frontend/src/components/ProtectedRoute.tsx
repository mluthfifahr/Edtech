import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useEffect } from 'react';

export default function ProtectedRoute() {
  const { token, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Jika tidak ada token di localStorage, tendang ke halaman login
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Jika ada token, render layout Admin (Outlet)
  return <Outlet />;
}
