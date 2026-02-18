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
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
      setIsBootstrapping(false);
    };
    loadSession();
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

  if (isBootstrapping) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <Navbar user={user} onLogout={handleLogout} onViewChange={setView} currentView={view} />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        {view === 'login' && <LoginPage onLogin={handleLogin} />}
        {view === 'public' && <PublicMarketplace />}
        {view === 'dashboard' && user && user.role !== Role.VIEWER && <Dashboard user={user} />}
        {view === 'users' && user && user.role === Role.ADMIN && <UserManagement currentUser={user} />}
      </main>
      {view !== 'login' && <ChatWidget />}
    </div>
  );
}
