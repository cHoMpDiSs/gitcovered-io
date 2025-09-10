import React, { useEffect, useRef, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { checkAuthStatus } from '../services/api';
import toast from 'react-hot-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requireAdmin = false }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();
  const adminDeniedToastShown = useRef(false);

  useEffect(() => {
    const verifyAccess = async () => {
      try {
        const token = localStorage.getItem('jwt_token');
        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        const auth = await checkAuthStatus();
        setIsAuthenticated(auth.authenticated);
        setIsAdmin(auth.is_admin);
        setIsLoading(false);
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        setIsLoading(false);
        toast.error('Authentication failed. Please log in again.');
        localStorage.removeItem('jwt_token'); // Clear invalid token
      }
    };

    verifyAccess();
  }, []);

  // Show admin-only denial toast once
  useEffect(() => {
    if (
      !isLoading &&
      isAuthenticated &&
      requireAdmin &&
      !isAdmin &&
      !adminDeniedToastShown.current
    ) {
      adminDeniedToastShown.current = true;
      toast.error('You do not have permission to access this page');
    }
  }, [isLoading, isAuthenticated, isAdmin, requireAdmin]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
