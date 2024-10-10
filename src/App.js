// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import KnowledgeBase from './pages/KnowledgeBase';
import Settings from './pages/Settings';
import { AuthProvider } from './auth/AuthContext';
import ProtectedRoute from './auth/ProtectedRoute';
import './App.css';
import KnowledgeBaseView from './pages/KnowledgeBaseView';

const { Content } = Layout;

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Navbar />
          <Layout className="app-layout">
            <Content className="app-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/knowledge-base"
                  element={
                    <ProtectedRoute>
                      <KnowledgeBase />
                    </ProtectedRoute>
                  }
                />
            <Route path="/knowledge-base/:id" element={<KnowledgeBaseView />} />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                {/* Redirect "/" to "/knowledge-base" */}
                <Route path="/" element={<Navigate to="/knowledge-base" replace />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
