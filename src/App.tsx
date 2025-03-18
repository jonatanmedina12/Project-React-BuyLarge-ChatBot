// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import es_ES from 'antd/lib/locale/es_ES';

// Componentes principales
import AppLayout from './components/layout/AppLayout';
import ChatbotPage from './pages/ChatbotPage';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';

// Contexto para la autenticación
import { AuthProvider } from './context/AuthContext';

import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={es_ES}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AppLayout />}>
              <Route index element={<ChatbotPage />} />
              <Route path="productos" element={<ProductsPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;