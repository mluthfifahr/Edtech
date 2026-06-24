import axios from 'axios';

// Konfigurasi dasar untuk axios
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api', // Gunakan .env atau fallback ke localhost
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Setup interceptors (menyisipkan token Autentikasi Admin)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Jika mengirim FormData (File Upload), hapus Content-Type default
  // agar browser/axios bisa generate header multipart/form-data beserta boundary-nya otomatis.
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  return config;
});
