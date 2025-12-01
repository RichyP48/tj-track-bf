import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { authService } from '@/lib/auth-service';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { AppProvider } from '@/contexts/AppContext';
import './index.css'
import './App.css'
import LoginPage from '@/components/auth/pages/LoginPage';
import RegisterPage from '@/components/auth/pages/RegisterPage';
import VerifyOtpPage from '@/components/auth/pages/VerifyOtpPage';
import DashboardPage from '@/components/dashboard/page/DashboardPage';
import ComingSoonPage from '@/components/dashboard/page/UnderDevelopmentPage';
import LandingPage from '@/components/dashboard/page/LandingPage';
import UsersPage from '@/components/dashboard/page/UsersPageSimple';
import { StockDashboard } from '@/components/stock/StockDashboard';
import { EcommerceDashboard } from '@/components/ecommerce/EcommerceDashboard';
import { ProductCatalog } from '@/components/ecommerce/ProductCatalog';
import { ShoppingCartComponent } from '@/components/ecommerce/ShoppingCart';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  const currentPath = window.location.pathname;
  
  console.log('ProtectedRoute - isAuthenticated:', isAuthenticated);
  console.log('ProtectedRoute - currentPath:', currentPath);
  
  if (!isAuthenticated && currentPath !== '/auth/login') {
    return <Navigate to="/auth/login" replace />;
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth/login" replace />;
}

// Public Route Component (redirect if authenticated)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = authService.isAuthenticated();
  const currentPath = window.location.pathname;
  
  console.log('PublicRoute - isAuthenticated:', isAuthenticated);
  console.log('PublicRoute - currentPath:', currentPath);
  
  if (isAuthenticated && currentPath !== '/dashboard') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return !isAuthenticated ? <>{children}</> : <Navigate to="/dashboard" replace />;
}

// Landing Route Component (accessible to everyone)
function LandingRoute({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Semi-Protected Route (accessible but with limited features)
function SemiProtectedRoute({ children }: { children: React.ReactNode }) {
  // Accessible à tous, mais certaines fonctionnalités nécessiteront une connexion
  return <>{children}</>;
}

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-950 text-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <LandingRoute>
              <LandingPage />
            </LandingRoute>
          } />
          
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
          <Route path="/stock" element={
            <ProtectedRoute>
              <StockDashboard />
            </ProtectedRoute>
          } />
          <Route path="/ecommerce" element={
            <ProtectedRoute>
              <EcommerceDashboard />
            </ProtectedRoute>
          } />
          <Route path="/catalog" element={
            <LandingRoute>
              <ProductCatalog />
            </LandingRoute>
          } />
          <Route path="/cart" element={
            <LandingRoute>
              <ShoppingCartComponent />
            </LandingRoute>
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
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;