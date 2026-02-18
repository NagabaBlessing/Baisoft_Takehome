import React, { useState, useEffect } from 'react';
import { User, Role } from './types';
import { authService } from './services/authService';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { PublicMarketplace } from './pages/PublicMarketplace';
import { LoginPage } from './pages/LoginPage';
import { UserManagement } from './pages/UserManagement';
import { ChatWidget } from './components/ChatWidget';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<'public' | 'dashboard' | 'users' | 'login'>('public');

  useEffect(() => {
    // Check for existing session
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView(loggedInUser.role === Role.VIEWER ? 'public' : 'dashboard');
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setView('login');
  };

  const navigate = (target: 'public' | 'dashboard' | 'users' | 'login') => {
    setView(target);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Navbar user={user} onLogout={handleLogout} onViewChange={navigate} currentView={view} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {view === 'login' && (
          <LoginPage onLogin={handleLogin} />
        )}

        {view === 'public' && (
          <PublicMarketplace />
        )}

        {view === 'dashboard' && user && user.role !== Role.VIEWER && (
          <Dashboard user={user} />
        )}

        {view === 'users' && user && user.role === Role.ADMIN && (
          <UserManagement currentUser={user} />
        )}
        
        {/* Redirect viewer trying to access dashboard/users back to public */}
        {((view === 'dashboard' && (!user || user.role === Role.VIEWER)) || (view === 'users' && (!user || user.role !== Role.ADMIN))) && (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-gray-700">Access Denied</h2>
            <p className="text-gray-500 mt-2">You do not have permission to view this page.</p>
            <button 
              onClick={() => setView('public')}
              className="mt-4 px-6 py-2 bg-glovo-yellow text-glovo-dark font-bold rounded-full shadow hover:bg-yellow-400 transition"
            >
              Go to Marketplace
            </button>
          </div>
        )}
      </main>

      {/* AI Chatbot is available everywhere except login */}
      {view !== 'login' && (
        <ChatWidget />
      )}
    </div>
  );
}