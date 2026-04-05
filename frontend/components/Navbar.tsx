
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, User, LogOut, Menu, X, BookOpen, Search } from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  navigate: (path: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ navigate }) => {
  const { user, logout, cart } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-book-100 z-50">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-2 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="bg-book-700 p-1.5 rounded-lg text-white group-hover:bg-book-800 transition-colors">
            <BookOpen size={24} />
          </div>
          <span className="font-serif text-2xl font-bold text-book-900 hidden sm:block">Bound to Books</span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {user?.role !== UserRole.ADMIN && (
            <button onClick={() => navigate('/')} className="text-book-700 hover:text-book-900 font-medium">Browse</button>
          )}
          {user?.role !== UserRole.ADMIN && (
            <button onClick={() => navigate('/sell')} className="text-book-700 hover:text-book-900 font-medium">Sell / Donate</button>
          )}
          {user?.role === UserRole.ADMIN && (
            <button onClick={() => navigate('/admin')} className="text-book-800 font-bold bg-book-100 px-3 py-1 rounded-full text-sm">Admin Dashboard</button>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">

          <button 
            onClick={() => navigate('/cart')} 
            className="relative p-2 text-book-700 hover:bg-book-50 rounded-full"
          >
            <ShoppingCart size={22} />
            {cart.length > 0 && (
              <span className="absolute top-0 right-0 bg-vintage-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                {cart.length}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate(user.role === UserRole.ADMIN ? '/admin' : '/dashboard')}
                className="flex items-center gap-2 bg-book-900 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-book-800 transition-colors"
              >
                <User size={18} />
                <span className="hidden lg:block">Hi, {user.name.split(' ')[0]}</span>
              </button>
              <button 
                onClick={logout}
                className="p-2 text-book-500 hover:text-red-500 rounded-full transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="bg-book-900 text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-book-800 transition-all"
            >
              Log In
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-book-900"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-book-100 p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top duration-300">
          {user?.role !== UserRole.ADMIN && (
            <button onClick={() => { navigate('/'); setIsMenuOpen(false); }} className="text-left py-2 font-medium">Browse Books</button>
          )}
          {user?.role !== UserRole.ADMIN && (
            <button onClick={() => { navigate('/sell'); setIsMenuOpen(false); }} className="text-left py-2 font-medium">Sell / Donate</button>
          )}
          {user?.role === UserRole.ADMIN && (
            <button onClick={() => { navigate('/admin'); setIsMenuOpen(false); }} className="text-left py-2 font-bold text-book-700">Admin Panel</button>
          )}
          <button onClick={() => { navigate(user?.role === UserRole.ADMIN ? '/admin' : '/dashboard'); setIsMenuOpen(false); }} className="text-left py-2 font-medium">My Account</button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
