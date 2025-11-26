import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { authService } from '@/lib/auth-service';
import './index.css'
import './App.css'
import LoginPage from '@/components/auth/pages/LoginPage';
import RegisterPage from '@/components/auth/pages/RegisterPage';
import VerifyOtpPage from '@/components/auth/pages/VerifyOtpPage';
import DashboardPage from '@/components/dashboard/page/DashboardPage';
import ComingSoonPage from '@/components/dashboard/page/UnderDevelopmentPage';
import LandingPage from '@/components/dashboard/page/LandingPage';
import UsersPage from '@/components/dashboard/page/UsersPageSimple';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" />;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" />;
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-950 text-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes */}
          <Route path="/auth/login" element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          } />
          <Route path="/auth/register" element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          } />
          <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/products" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/deliveries" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/tracking" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <ComingSoonPage />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute>
              <UsersPage />
            </ProtectedRoute>
          } />
          
          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        
        <Toaster 
          position="top-right" 
          theme="dark"
          richColors
        />
      </div>
    </Router>
  );
}

export default App;