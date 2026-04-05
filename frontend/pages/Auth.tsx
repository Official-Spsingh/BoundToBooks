import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Lock, User as UserIcon, BookOpen, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { UserRole } from '../types';
import Button from '../components/ui/Button';

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
      {/* Abstract Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 border-4 border-book-900 rounded-[64px] rotate-12"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 border-8 border-vintage-accent rounded-full -rotate-12"></div>
        <div className="absolute top-1/2 left-1/3 w-32 h-32 bg-book-900 rounded-2xl rotate-45"></div>
      </div>
      
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-book-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-vintage-accent/20 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-xl w-full flex flex-col md:flex-row bg-white rounded-[48px] shadow-2xl overflow-hidden relative z-10 border border-book-100">
        {/* Decorative Side Panel */}
        <div className="hidden md:flex md:w-2/5 bg-book-900 p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <div className="bg-white/10 w-12 h-12 rounded-xl flex items-center justify-center mb-12">
               <BookOpen size={24} />
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight mb-4">Every reader is a traveler.</h2>
            <p className="text-book-300 text-sm font-light">Join our community of book lovers and start your next journey today.</p>
          </div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold text-book-400">
            <Sparkles size={14} className="text-vintage-accent" />
            Curated by Readers
          </div>
        </div>

        {/* Form Side */}
        <div className="flex-grow p-8 md:p-12">
          <div className="flex flex-col items-center md:items-start mb-8 text-center md:text-left">
            <h2 className="font-serif text-3xl font-bold text-book-900">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-book-500 mt-2 text-sm font-light">
              {mode === 'login' ? 'Continue your literary adventure.' : 'Begin your sustainable reading journey.'}
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-xs flex items-center gap-2 animate-in slide-in-from-top-2 duration-300">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="relative group">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300 group-focus-within:text-book-900 transition-colors" size={18} />
                <input
                  type="text" required placeholder="Full Name"
                  className="w-full pl-12 pr-4 py-4 bg-book-50/50 border border-book-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-book-900/5 focus:bg-white transition-all text-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300 group-focus-within:text-book-900 transition-colors" size={18} />
              <input
                type="email" required placeholder="Email Address"
                className="w-full pl-12 pr-4 py-4 bg-book-50/50 border border-book-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-book-900/5 focus:bg-white transition-all text-sm"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300 group-focus-within:text-book-900 transition-colors" size={18} />
              <input
                type="password" required placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-book-50/50 border border-book-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-book-900/5 focus:bg-white transition-all text-sm"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {mode === 'register' && (
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300 group-focus-within:text-book-900 transition-colors" size={18} />
                <input
                  type="password" required placeholder="Confirm Password"
                  className="w-full pl-12 pr-4 py-4 bg-book-50/50 border border-book-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-book-900/5 focus:bg-white transition-all text-sm"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
              </div>
            )}

            <Button
              type="submit" loading={loading}
              className="w-full py-4 text-base mt-2"
            >
              {mode === 'login' ? 'Sign In' : 'Join Now'} <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>

          <div className="mt-8 text-center md:text-left text-sm">
            <span className="text-book-400 font-light">{mode === 'login' ? "New here? " : "Joined already? "}</span>
            <button onClick={() => navigate(mode === 'login' ? '/register' : '/login')} className="text-book-900 font-bold hover:underline transition-all">
              {mode === 'login' ? 'Create an account' : 'Log in to your shelf'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
