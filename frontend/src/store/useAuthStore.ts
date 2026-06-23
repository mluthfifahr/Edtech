import { create } from 'zustand';
import { api } from '../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem('admin_token'),
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('admin_token', token);
    set({ user, token, error: null });
  },

  logout: async () => {
    try {
      await api.post('/logout');
    } catch (e) {
      // Abaikan jika token sudah tidak valid di server
    }
    localStorage.removeItem('admin_token');
    set({ user: null, token: null });
  },

  checkAuth: async () => {
    const token = localStorage.getItem('admin_token');
    if (!token) return;

    set({ isLoading: true });
    try {
      const response = await api.get('/user');
      set({ user: response.data, isLoading: false });
    } catch (err) {
      localStorage.removeItem('admin_token');
      set({ user: null, token: null, isLoading: false });
    }
  }
}));
