import { Navigate } from 'react-router-dom';

const ADMIN_TOKEN_KEY = 'consultpro_admin_token';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);

  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

