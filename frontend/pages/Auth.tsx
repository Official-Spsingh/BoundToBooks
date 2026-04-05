
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, User as UserIcon, BookOpen, AlertCircle } from 'lucide-react';
import { UserRole } from '../types';

interface AuthProps {
  mode: 'login' | 'register';
  navigate: (path: string) => void;
}

const Auth: React.FC<AuthProps> = ({ mode, navigate }) => {
  const { setUser } = useAppContext();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulation of Auth API with requested hardcoded users
    setTimeout(() => {
      const email = formData.email.toLowerCase();
      const password = formData.password;

      let authenticatedUser = null;

      if (email === 'admin@admin.com' && password === 'admin') {
        authenticatedUser = {
          id: 'admin-id',
          name: 'System Admin',
          email: 'admin@admin.com',
          role: UserRole.ADMIN,
          profileImage: 'https://ui-avatars.com/api/?name=Admin&background=3d2b2b&color=fff'
        };
      } else if (email === 'spsingh@gmail.com' && password === 'spsingh') {
        authenticatedUser = {
          id: 'user-sp-id',
          name: 'S.P. Singh',
          email: 'spsingh@gmail.com',
          role: UserRole.USER,
          profileImage: 'https://ui-avatars.com/api/?name=SP+Singh&background=random'
        };
      } else if (email === 'tonystark@ironman.com' && password === 'loveyou3000') {
        authenticatedUser = {
          id: 'user-tony-id',
          name: 'Tony Stark',
          email: 'tonystark@ironman.com',
          role: UserRole.USER,
          profileImage: 'https://ui-avatars.com/api/?name=Tony+Stark&background=E23636&color=fff'
        };
      }

      if (authenticatedUser) {
        setUser(authenticatedUser);
        setLoading(false);
        navigate(authenticatedUser.role === UserRole.ADMIN ? '/admin' : '/dashboard');
      } else {
        // Fallback for new registration simulation or failed login
        if (mode === 'login') {
          setError('Invalid credentials. Hint: admin@admin.com / admin');
          setLoading(false);
        } else {
          // Register logic
          if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
          }
          const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name: formData.name,
            email: email,
            role: email.includes('admin') ? UserRole.ADMIN : UserRole.USER,
            profileImage: `https://ui-avatars.com/api/?name=${formData.name}&background=random`
          };
          setUser(newUser);
          setLoading(false);
          navigate(newUser.role === UserRole.ADMIN ? '/admin' : '/dashboard');
        }
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-book-50 relative overflow-hidden">
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-book-200 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-vintage-accent/20 rounded-full blur-3xl opacity-50"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 md:p-12 relative z-10 border border-book-100">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-book-700 p-3 rounded-2xl text-white mb-4 cursor-pointer" onClick={() => navigate('/')}>
            <BookOpen size={32} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-book-900">
            {mode === 'login' ? 'Welcome Back' : 'Join the Story'}
          </h2>
          <p className="text-book-500 mt-2 text-center font-light">
            {mode === 'login' ? 'Your bookshelf is waiting for you.' : 'Create an account to start your journey.'}
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300" size={18} />
              <input
                type="text" required placeholder="Full Name"
                className="w-full pl-12 pr-4 py-3 bg-book-50 border border-book-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-book-700/20"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300" size={18} />
            <input
              type="email" required placeholder="Email Address"
              className="w-full pl-12 pr-4 py-3 bg-book-50 border border-book-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-book-700/20"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300" size={18} />
            <input
              type="password" required placeholder="Password"
              className="w-full pl-12 pr-4 py-3 bg-book-50 border border-book-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-book-700/20"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {mode === 'register' && (
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300" size={18} />
              <input
                type="password" required placeholder="Confirm Password"
                className="w-full pl-12 pr-4 py-3 bg-book-50 border border-book-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-book-700/20"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          )}

          <button
            type="submit" disabled={loading}
            className="w-full py-4 bg-book-900 text-white rounded-xl font-bold hover:bg-book-800 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <span className="text-book-500">{mode === 'login' ? "Don't have an account? " : "Already have an account? "}</span>
          <button onClick={() => navigate(mode === 'login' ? '/register' : '/login')} className="text-book-800 font-bold hover:underline">
            {mode === 'login' ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
