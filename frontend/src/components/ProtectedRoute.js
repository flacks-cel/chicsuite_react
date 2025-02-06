// frontend/src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const ProtectedRoute = ({ 
  children, 
  requiredPermission 
}) => {
  const { user, loading, can } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredPermission && !can(requiredPermission)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};