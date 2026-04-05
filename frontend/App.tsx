
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import Navbar from './components/Navbar';
import Marketplace from './pages/Marketplace';
import BookDetail from './pages/BookDetail';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import SellDonate from './pages/SellDonate';
import TrackOrder from './pages/TrackOrder';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { user } = useAppContext();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace('#', '');
    return hash || '/';
  });

  // Simple router simulation
  React.useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentPath(hash || '/');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (path: string) => {
    window.location.hash = path;
  };

  const renderRoute = () => {
    // Admin Redirection Logic
    if (user?.role === UserRole.ADMIN) {
      if (['/', '/dashboard', '/sell', '/cart', '/checkout'].includes(currentPath) || currentPath.startsWith('/book/')) {
        return <AdminDashboard navigate={navigate} />;
      }
    }

    if (currentPath === '/') return <Marketplace navigate={navigate} />;
    if (currentPath.startsWith('/book/')) {
      const id = currentPath.split('/')[2];
      return <BookDetail id={id} navigate={navigate} />;
    }
    if (currentPath === '/login' || currentPath === '/register') return <Auth mode={currentPath === '/login' ? 'login' : 'register'} navigate={navigate} />;
    
    // Protected Routes
    if (!user) {
      if (['/dashboard', '/sell', '/cart', '/checkout', '/admin'].includes(currentPath)) {
        return <Auth mode="login" navigate={navigate} />;
      }
    }

    if (currentPath === '/dashboard') return <Dashboard navigate={navigate} />;
    if (currentPath === '/sell') return <SellDonate navigate={navigate} />;
    if (currentPath === '/cart') return <Cart navigate={navigate} />;
    if (currentPath === '/checkout') return <Checkout navigate={navigate} />;
    
    if (currentPath.startsWith('/track/')) {
      const orderId = currentPath.split('/')[2];
      return <TrackOrder orderId={orderId} navigate={navigate} />;
    }
    if (currentPath.startsWith('/admin')) {
      if (user?.role !== UserRole.ADMIN) return <Marketplace navigate={navigate} />;
      return <AdminDashboard navigate={navigate} />;
    }

    return <Marketplace navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar navigate={navigate} />
      <main className="flex-grow pt-16">
        {renderRoute()}
      </main>
      <footer className="bg-book-900 text-book-100 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="font-serif text-2xl font-bold mb-4">Bound to Books</h2>
            <p className="text-book-400 max-w-sm">
              We believe every book has a soul and deserves to be read again. 
              Join our community of book lovers in recirculating the magic of stories.
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Platform</h3>
            <ul className="space-y-2 text-book-400">
              <li><button onClick={() => navigate('/')}>Marketplace</button></li>
              <li><button onClick={() => navigate('/sell')}>Sell Books</button></li>
              <li><button onClick={() => navigate('/sell')}>Donate Books</button></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-4">Support</h3>
            <ul className="space-y-2 text-book-400">
              <li><a href="#">Shipping Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-book-800 text-center text-book-500 text-sm">
          &copy; {new Date().getFullYear()} Bound to Books. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
