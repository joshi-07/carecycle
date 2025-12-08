import axios from 'axios';

const API_URL = 'https://carecycle-2.onrender.com/api/admin'; // Update with your actual API URL

// Set auth token in headers
const setAuthToken = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    localStorage.setItem('adminToken', token);
  } else {
    delete axios.defaults.headers.common['Authorization'];
    localStorage.removeItem('adminToken');
  }
};

export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    const { token, admin } = response.data;
    setAuthToken(token);
    return admin;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const verifyAdmin = async () => {
  const token = localStorage.getItem('adminToken');
  if (!token) return null;

  try {
    setAuthToken(token);
    const response = await axios.get(`${API_URL}/verify`);
    return response.data.admin;
  } catch (error) {
    setAuthToken(null);
    return null;
  }
};

export const logout = () => {
  setAuthToken(null);
};
