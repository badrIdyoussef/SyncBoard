import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import './index.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  return user ? <Dashboard /> : <Login />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </StrictMode>,
);
