import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? 'https://getcovered-io-d59e2aaeeb96.herokuapp.com'
  : 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Add response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const reqUrl: string = error.config?.url || '';
      const isAuthAttempt = ['/api/login/password', '/api/signup', '/login'].some(p => reqUrl.includes(p));
      const isOnAuthPage = ['/login', '/signup'].includes(window.location.pathname);

      if (!isAuthAttempt && !isOnAuthPage) {
        localStorage.removeItem('jwt_token');
        window.location.href = '/login';
        return; // stop further processing since we're navigating
      }
    }
    return Promise.reject(error);
  }
);

// Add request interceptor to include JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  
  // Ensure headers object exists
  config.headers = config.headers || {};
  
  if (token) {
    // Set Authorization header with Bearer token
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    // If no token exists, check if we're on a protected route and redirect to login
    const protectedRoutes = ['/api/dashboard', '/api/admin/dashboard', '/api/profile', '/api/auth/status'];
    if (protectedRoutes.some(route => config.url?.includes(route))) {
      window.location.href = '/login';
    }
  }
  
  // Set Content-Type if not already set
  config.headers['Content-Type'] = config.headers['Content-Type'] || 'application/json';
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/login`;
};

export const signupWithEmail = async (email: string, password: string, fullName: string) => {
  try {
    const response = await api.post('/api/signup', {
      email,
      password,
      full_name: fullName
    });
    const { token } = response.data;
    localStorage.setItem('jwt_token', token);
    return response.data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  try {
    const response = await api.post('/api/login/password', {
      email,
      password
    });
    const { token } = response.data;
    localStorage.setItem('jwt_token', token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/api/auth/status');
    return response.data;
  } catch (error) {
    console.error('Auth status error:', error);
    return { authenticated: false, is_admin: false };
  }
};

export const getUserProfile = async () => {
  try {
    const response = await api.get('/api/dashboard');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

export const getAdminProfile = async () => {
  try {
    const response = await api.get('/api/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Get admin profile error:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('jwt_token');
  window.location.href = '/login';
};

export const getAdminUsers = async () => {
  try {
    const response = await api.get('/api/admin/users');
    return response.data;
  } catch (error) {
    console.error('Get admin users error:', error);
    throw error;
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await api.delete(`/api/admin/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Delete user error:', error);
    throw error;
  }
};

export const updateProfile = async (data: { fullName?: string; email: string; avatarUrl?: string }) => {
  try {
    const body: any = {
      email: data.email
    };
    if (typeof data.fullName === 'string') {
      body.full_name = data.fullName;
    }
    if (data.avatarUrl) {
      body.avatar_img = data.avatarUrl;
    }
    const response = await api.put('/api/profile', body);
    const { token } = response.data;
    localStorage.setItem('jwt_token', token);
    return response.data;
  } catch (error) {
    console.error('Update profile error:', error);
    throw error;
  }
};

export const deleteMyAccount = async () => {
  try {
    const response = await api.delete('/api/account');
    return response.data;
  } catch (error) {
    console.error('Delete my account error:', error);
    throw error;
  }
};