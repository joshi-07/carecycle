import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'https://carecycle-2.onrender.com/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for auth token and logging
api.interceptors.request.use(
  (config) => {
    // Attach auth token if available (axios.create() does not inherit axios.defaults)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const createDonation = (data) => api.post('/donations', data);
export const getDonations = () => api.get('/donations');
export const verifyDonation = (id) => api.patch(`/donations/${id}/verify`);
export const deleteDonation = (id) => api.delete(`/donations/${id}`);

export default api;
