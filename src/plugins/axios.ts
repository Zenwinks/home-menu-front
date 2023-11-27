import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

api.interceptors.response.use((response) => response, (error) => {
  if(error.response.status === 401) {
    localStorage.removeItem('user');
    window.location.href = '/login'; // bad but can't access the router
  }
});

export default api;