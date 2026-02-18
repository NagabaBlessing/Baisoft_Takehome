import React from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { Icons } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const users = authService.getAllUsers();

  const handleUserClick = (email: string) => {
    const user = authService.login(email);
    if (user) {
      onLogin(user);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-yellow-100 text-glovo-yellow mb-4">
             <span className="transform scale-150 inline-block"><Icons.Store /></span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Select a persona to simulate login</p>
        </div>

        <div className="space-y-3">
          {users.map((u) => (
            <button
              key={u.id}
              onClick={() => handleUserClick(u.email)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-glovo-yellow hover:bg-yellow-50 transition group"
            >
              <div className="flex flex-col items-start">
                <span className="font-bold text-gray-800 group-hover:text-glovo-dark">{u.name}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">{u.role}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-glovo-yellow group-hover:text-glovo-dark">
                <Icons.Check />
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 text-center text-xs text-gray-400">
          This is a demo application. No password required.
        </div>
      </div>
    </div>
  );
};