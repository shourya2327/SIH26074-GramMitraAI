import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gm_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    // Default demo logged-in farmer
    return {
      id: 1,
      fullName: "Ramesh Patel",
      mobileNumber: "9876543210",
      email: "ramesh.farmer@grammitra.ai",
      role: "ROLE_FARMER",
      preferredLanguage: "hi",
      state: "Central Region",
      district: "Local District",
      block: "Local Block",
      panchayat: "Local Panchayat"
    };
  });

  const [token, setToken] = useState(() => localStorage.getItem('gm_token') || 'demo-jwt-token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('gm_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('gm_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('gm_token', token);
    } else {
      localStorage.removeItem('gm_token');
    }
  }, [token]);

  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken || 'mock-jwt-token-active');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('gm_user');
    localStorage.removeItem('gm_token');
  };

  const switchRole = (newRole) => {
    if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
