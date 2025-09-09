import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { checkAuthStatus } from '../services/api';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        // Get token from URL params
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
          // Store token and set up axios headers
          localStorage.setItem('jwt_token', token);
          
          // Check auth status with the new token
          const auth = await checkAuthStatus();
          if (auth.authenticated) {
            navigate(auth.is_admin ? '/admin/dashboard' : '/dashboard');
          } else {
            navigate('/login');
          }
        } else {
          console.error('No token received');
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate, location]);

  return <div>Verifying authentication...</div>;
};

export default AuthCallback;