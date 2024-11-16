import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ClientList from './components/ClientList';
import ClientForm from './components/ClientForm';
import ClientDetail from './components/ClientDetail';
import ProjectList from './components/ProjectList';
import ProjectForm from './components/ProjectForm';
import ProjectDetail from './components/ProjectDetail';
import LoginForm from './components/auth/LoginForm';
import UserProfile from './components/auth/UserProfile';
import UserList from './components/auth/UserList';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminDashboard from './components/subscription/AdminDashboard';
import { Loader2 } from 'lucide-react';

function App() {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate auth check completion
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        {isAuthenticated && <Sidebar />}
        <main className={`flex-1 ${isAuthenticated ? 'ml-64' : ''}`}>
          <Routes>
            <Route 
              path="/login" 
              element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />} 
            />
            
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/users" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <UserList />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/subscription" 
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/clients" 
              element={
                <ProtectedRoute>
                  <ClientList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/clients/new" 
              element={
                <ProtectedRoute requiredRole="manager">
                  <ClientForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/clients/:id" 
              element={
                <ProtectedRoute>
                  <ClientDetail />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/projects" 
              element={
                <ProtectedRoute>
                  <ProjectList />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/projects/new" 
              element={
                <ProtectedRoute requiredRole="manager">
                  <ProjectForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/projects/:id" 
              element={
                <ProtectedRoute>
                  <ProjectDetail />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;