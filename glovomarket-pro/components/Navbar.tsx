import React from 'react';
import { User, Role } from '../types';
import { Icons } from '../constants';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  onViewChange: (view: 'public' | 'dashboard' | 'users' | 'login') => void;
  currentView: string;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onLogout, onViewChange, currentView }) => {
  return (
    <nav className="bg-glovo-yellow shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer group"
            title="Go to marketplace"
            aria-label="Go to marketplace"
            onClick={() => onViewChange('public')}
          >
            <div className="bg-white p-1.5 rounded-full shadow-sm group-hover:scale-105 transition-transform">
               <span className="text-glovo-green"><Icons.Store /></span>
            </div>
            <span className="text-2xl font-bold text-glovo-dark tracking-tight">GlovoMarket</span>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="hidden md:block text-sm font-medium text-gray-800">
                  Hi, {user.name} <span className="opacity-60">({user.role})</span>
                </span>
                
                {user.role !== Role.VIEWER && (
                  <button
                    onClick={() => onViewChange('dashboard')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full font-semibold transition ${
                      currentView === 'dashboard' 
                        ? 'bg-white text-glovo-green shadow-inner' 
                        : 'text-glovo-dark hover:bg-yellow-400'
                    }`}
                  >
                    <Icons.LayoutDashboard />
                    <span className="hidden sm:inline">Dashboard</span>
                  </button>
                )}

                {user.role === Role.ADMIN && (
                   <button
                    onClick={() => onViewChange('users')}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full font-semibold transition ${
                      currentView === 'users' 
                        ? 'bg-white text-glovo-green shadow-inner' 
                        : 'text-glovo-dark hover:bg-yellow-400'
                    }`}
                  >
                    <Icons.Users />
                    <span className="hidden sm:inline">Users</span>
                  </button>
                )}

                <button
                  onClick={() => onViewChange('public')}
                   className={`flex items-center space-x-1 px-4 py-2 rounded-full font-semibold transition ${
                      currentView === 'public' 
                        ? 'bg-white text-glovo-green shadow-inner' 
                        : 'text-glovo-dark hover:bg-yellow-400'
                    }`}
                >
                  <Icons.Store />
                  <span className="hidden sm:inline">Market</span>
                </button>

                <button
                  onClick={onLogout}
                  className="p-2 text-glovo-dark hover:bg-red-100 hover:text-red-600 rounded-full transition"
                  title="Logout"
                  aria-label="Logout"
                >
                  <Icons.LogOut />
                </button>
              </>
            ) : (
              <button
                onClick={() => onViewChange('login')}
                className="bg-glovo-green text-white px-6 py-2 rounded-full font-bold shadow-lg hover:bg-green-700 transition transform hover:-translate-y-0.5"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};