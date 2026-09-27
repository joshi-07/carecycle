import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();
const API_URL = process.env.REACT_APP_API_BASE_URL || process.env.REACT_APP_API_URL || 'https://carecycle-2.onrender.com/api/v1';

const getErrorMessage = (err, fallback) => {
  const error = err.response?.data?.error || err.response?.data?.message || err.message;
  return Array.isArray(error) ? error.join(', ') : error || fallback;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const setAuthToken = (newToken) => {
    if (newToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
      localStorage.setItem('token', newToken);
    } else {
      delete axios.defaults.headers.common.Authorization;
      localStorage.removeItem('token');
    }
  };

  const loadUser = async () => {
    try {
      setAuthToken(token);
      const res = await axios.get(`${API_URL}/auth/me`);
      setUser(res.data.user || res.data.data);
    } catch (err) {
      setToken('');
      setAuthToken('');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: getErrorMessage(err, 'Registration failed')
      };
    }
  };

  const login = async (formData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, formData);
      setToken(res.data.token);
      setAuthToken(res.data.token);
      setUser(res.data.user);
      navigate('/dashboard');
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: getErrorMessage(err, 'Login failed')
      };
    }
  };

  const logout = () => {
    setToken('');
    setAuthToken('');
    setUser(null);
    navigate('/login');
  };

  const isAuthenticated = () => !!token;
  const hasRole = (role) => user?.role === role;

  useEffect(() => {
    if (token) {
      loadUser();
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        register,
        login,
        logout,
        isAuthenticated,
        hasRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
