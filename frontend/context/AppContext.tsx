
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, BookRequest, BookListing, Order, 
  CartItem 
} from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  requests: BookRequest[];
  setRequests: React.Dispatch<React.SetStateAction<BookRequest[]>>;
  listings: BookListing[];
  setListings: React.Dispatch<React.SetStateAction<BookListing[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  cart: CartItem[];
  addToCart: (listing: BookListing) => void;
  removeFromCart: (listingId: string) => void;
  clearCart: () => void;
  logout: () => void;
  addListing: (listing: Omit<BookListing, 'id' | 'isAvailable' | 'sourceRequestId'>) => void;
  updateOrderStatus: (orderId: string, status: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Initial Mock Data
const INITIAL_LISTINGS: BookListing[] = [
  {
    id: 'l1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic tale of the roaring twenties and the American dream.',
    price: 15.99,
    condition: 'Like New' as any,
    images: ['https://picsum.photos/seed/gatsby/400/600'],
    isAvailable: true,
    sourceRequestId: 'r0',
    category: 'Classic Literature'
  },
  {
    id: 'l2',
    title: 'Atomic Habits',
    author: 'James Clear',
    description: 'An easy and proven way to build good habits and break bad ones.',
    price: 12.50,
    condition: 'New' as any,
    images: ['https://picsum.photos/seed/habits/400/600'],
    isAvailable: true,
    sourceRequestId: 'r0',
    category: 'Self-Help'
  },
  {
    id: 'l3',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    description: 'Between life and death there is a library.',
    price: 9.99,
    condition: 'Used' as any,
    images: ['https://picsum.photos/seed/library/400/600'],
    isAvailable: true,
    sourceRequestId: 'r0',
    category: 'Fiction'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('btb_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [requests, setRequests] = useState<BookRequest[]>(() => {
    const saved = localStorage.getItem('btb_requests');
    return saved ? JSON.parse(saved) : [];
  });

  const [listings, setListings] = useState<BookListing[]>(() => {
    const saved = localStorage.getItem('btb_listings');
    return saved ? JSON.parse(saved) : INITIAL_LISTINGS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('btb_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('btb_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('btb_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('btb_requests', JSON.stringify(requests));
  }, [requests]);

  useEffect(() => {
    localStorage.setItem('btb_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('btb_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('btb_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (listing: BookListing) => {
    setCart(prev => {
      const exists = prev.find(item => item.listing.id === listing.id);
      if (exists) return prev;
      return [...prev, { listing, quantity: 1 }];
    });
  };

  const removeFromCart = (listingId: string) => {
    setCart(prev => prev.filter(item => item.listing.id !== listingId));
  };

  const clearCart = () => setCart([]);

  const logout = () => {
    setUser(null);
    clearCart();
    localStorage.removeItem('btb_user');
  };

  const addListing = (listing: Omit<BookListing, 'id' | 'isAvailable' | 'sourceRequestId'>) => {
    const newListing: BookListing = {
      ...listing,
      id: Math.random().toString(36).substr(2, 9),
      isAvailable: true,
      sourceRequestId: 'ADMIN_MANUAL'
    };
    setListings(prev => [...prev, newListing]);
  };
  
  const updateOrderStatus = (orderId: string, status: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  return (
    <AppContext.Provider value={{ 
      user, setUser, 
      requests, setRequests, 
      listings, setListings, 
      orders, setOrders,
      cart, addToCart, removeFromCart, clearCart,
      logout, addListing, updateOrderStatus
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};
