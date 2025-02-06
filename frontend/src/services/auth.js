import api from './api';

export const login = async (email, senha) => {
  const response = await api.post('/api/auth/login', { email, senha }); // Adicionado /api
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const getToken = () => localStorage.getItem('token');