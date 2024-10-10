// src/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authToken } = useContext(AuthContext); // Use token from context

  return authToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
