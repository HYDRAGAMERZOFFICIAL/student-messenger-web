import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import { useAuth } from './hooks/useAuth';
import { AuthProvider } from './context/AuthContext';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen font-medium text-gray-500">Loading Messenger...</div>;
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen font-medium text-gray-500">Loading Messenger...</div>;
  return !isAuthenticated ? <>{children}</> : <Navigate to="/chat" replace />;
};

function AppContent() {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/register"
        element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        }
      />

      {/* Protected Routes */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />

      {/* Default Redirects */}
      <Route path="/" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/chat" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
