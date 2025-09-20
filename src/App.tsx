import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import DashboardLayout from './components/Layout/DashboardLayout';
import Calculations from './components/Calculations';
import Estimations from './components/Estimations';
import Recommendations from './components/Recommendations';
import CalculationHistory from './components/History/CalculationHistory';
import TariffManagement from './components/Admin/TariffManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Navigate to="/dashboard/calculations" replace />} />
            <Route path="calculations" element={<Calculations />} />
            <Route path="estimations" element={<Estimations />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="history" element={<CalculationHistory />} />
            <Route path="admin" element={
              <ProtectedRoute requireAdmin>
                <TariffManagement />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;