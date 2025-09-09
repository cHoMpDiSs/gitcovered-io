import axios from 'axios';

const API_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const loginWithGoogle = () => {
  window.location.href = `${API_URL}/login`;
};

export const getUserProfile = async () => {
  const response = await api.get('/dashboard');
  return response.data;
};

export const logout = async () => {
  await api.get('/logout');
};
