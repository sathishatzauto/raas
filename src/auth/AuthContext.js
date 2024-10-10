// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);

  // Load auth token from local storage on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken'); // Ensure it's a string
    const userData = JSON.parse(localStorage.getItem('user'));

    if (token) {
      setAuthToken(token);
      setUser(userData);
    }
  }, []);

  const login = (token, userData) => {
    setAuthToken(token);
    setUser(userData);
    localStorage.setItem('authToken', token); // Store token as a string
    localStorage.setItem('user', JSON.stringify(userData)); // Store user data as JSON
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ authToken, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
