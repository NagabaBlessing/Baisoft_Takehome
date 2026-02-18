import React, { useState } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { Icons } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    businessName: '',
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await authService.login(loginForm.username, loginForm.password);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const user = await authService.signupBusinessAdmin(signupForm);
      onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg border border-gray-100">
        <div className="text-center mb-8">
          <div className="inline-block p-4 rounded-full bg-yellow-100 text-glovo-yellow mb-4">
            <span className="transform scale-150 inline-block"><Icons.Store /></span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Marketplace Access</h1>
          <p className="text-gray-500 mt-2">Business admin signup + role-based user login</p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6 bg-gray-100 rounded-xl p-1">
          <button onClick={() => setMode('login')} className={`py-2 rounded-lg font-semibold ${mode === 'login' ? 'bg-white shadow' : ''}`}>Login</button>
          <button onClick={() => setMode('signup')} className={`py-2 rounded-lg font-semibold ${mode === 'signup' ? 'bg-white shadow' : ''}`}>Admin Signup</button>
        </div>

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <input className="w-full p-3 border rounded-lg" placeholder="Username (e.g. admin)" value={loginForm.username} onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })} required />
            <input type="password" className="w-full p-3 border rounded-lg" placeholder="Password" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} required />
            <button disabled={isSubmitting} className="w-full py-3 rounded-lg bg-glovo-yellow font-bold text-glovo-dark">{isSubmitting ? 'Signing in...' : 'Sign In'}</button>
          </form>
        ) : (
          <form onSubmit={handleSignup} className="space-y-3">
            <input className="w-full p-3 border rounded-lg" placeholder="Business name" value={signupForm.businessName} onChange={(e) => setSignupForm({ ...signupForm, businessName: e.target.value })} required />
            <div className="grid grid-cols-2 gap-3">
              <input className="w-full p-3 border rounded-lg" placeholder="First name" value={signupForm.firstName} onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })} required />
              <input className="w-full p-3 border rounded-lg" placeholder="Last name" value={signupForm.lastName} onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })} required />
            </div>
            <input className="w-full p-3 border rounded-lg" placeholder="Admin username" value={signupForm.username} onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })} required />
            <input type="email" className="w-full p-3 border rounded-lg" placeholder="Admin email" value={signupForm.email} onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} required />
            <input type="password" className="w-full p-3 border rounded-lg" placeholder="Password (min 8)" value={signupForm.password} onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} required />
            <button disabled={isSubmitting} className="w-full py-3 rounded-lg bg-glovo-green font-bold text-white">{isSubmitting ? 'Creating account...' : 'Create Business Admin'}</button>
          </form>
        )}

        {error && <p className="text-sm text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
};
