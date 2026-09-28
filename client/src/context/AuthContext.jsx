import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hh_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (e) {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('hh_token') || null);
  const [loading, setLoading] = useState(true);

  // Set default auth header on app mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('hh_token');
      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        try {
          const res = await axios.get('/api/auth/me');
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('hh_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err?.response?.data?.message || err.message);
          // Only clear if 401
          if (err?.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const saveAuthSession = (authToken, authUser) => {
    setToken(authToken);
    setUser(authUser);
    localStorage.setItem('hh_token', authToken);
    localStorage.setItem('hh_user', JSON.stringify(authUser));
    axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
  };

  const loginAdmin = async (email, password) => {
    const res = await axios.post('/api/auth/admin/login', { email, password });
    if (res.data?.success && res.data?.token) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Admin login failed');
  };

  const loginTrust = async (email, password) => {
    const res = await axios.post('/api/auth/trust/login', { email, password });
    if (res.data?.success && res.data?.token) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Trust login failed');
  };

  const loginTrustGoogle = async (credential, trustData = null) => {
    const res = await axios.post('/api/auth/trust/google', { credential, trustData });
    if (res.data?.success && res.data?.token) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Google authentication failed');
  };

  const registerTrust = async (formData) => {
    // Note: formData can be a FormData object for multipart upload
    const res = await axios.post('/api/auth/trust/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    if (res.data?.success && res.data?.token) {
      saveAuthSession(res.data.token, res.data.user);
      return res.data;
    }
    throw new Error(res.data?.message || 'Trust registration failed');
  };

  const logout = async () => {
    try {
      await axios.post('/api/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('hh_token');
      localStorage.removeItem('hh_user');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const refreshUser = (updatedData) => {
    setUser((prev) => {
      const nextUser = { ...prev, ...updatedData };
      localStorage.setItem('hh_user', JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin: user?.role === 'admin',
        isTrust: user?.role === 'trust',
        loginAdmin,
        loginTrust,
        loginTrustGoogle,
        registerTrust,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
