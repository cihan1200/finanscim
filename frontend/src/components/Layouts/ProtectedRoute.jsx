// src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  // 1. Token'ı kontrol et
  const token = localStorage.getItem("user");

  // 2. Token yoksa Login sayfasına yönlendir ("replace" geçmişi temizler)
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 3. Token varsa alt rotaları (Dashboard vb.) göster
  return <Outlet />;
}