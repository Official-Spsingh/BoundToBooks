
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Heart, ShoppingBag, Trash2, ArrowRight, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface WishlistProps {
  navigate: (path: string) => void;
}

const Wishlist: React.FC<WishlistProps> = ({ navigate }) => {
  const { wishlist, listings, toggleWishlist, addToCart } = useAppContext();
  
  const wishlistItems = listings.filter(l => wishlist.includes(l.id));

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
        <div className="space-y-4">
          <Badge variant="secondary">My Favorites</Badge>
          <h1 className="font-serif text-5xl font-bold text-book-900">Your Wishlist</h1>
          <p className="text-xl text-book-500 font-light max-w-xl">
            A curated collection of stories you're waiting to bring home. {wishlistItems.length} items saved.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/')}>
          Keep Exploring <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {wishlistItems.map((item) => (
            <div 
              key={item.id} 
              className="group bg-white rounded-[32px] border border-book-100 hover:shadow-2xl transition-all relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-[32px]">
                <img 
                  src={item.images[0]} 
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(item.id);
                  }}
                  className="absolute top-4 right-4 p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-lg"
                >
                  <Heart size={20} fill="currentColor" />
                </button>
              </div>
              
              <div className="p-8">
                <div className="text-xs text-book-400 font-bold uppercase tracking-widest mb-2">{item.category}</div>
                <h3 className="font-serif text-xl font-bold text-book-900 mb-1 truncate">{item.title}</h3>
                <p className="text-sm text-book-500 mb-6">{item.author}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-book-900">₹{item.price.toFixed(2)}</div>
                  <button 
                    onClick={() => addToCart(item)}
                    className="p-4 bg-book-900 text-white rounded-2xl hover:bg-book-800 transition-all shadow-lg shadow-book-900/20"
                  >
                    <ShoppingBag size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-book-50/50 rounded-[64px] border border-dashed border-book-100">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-[32px] text-book-200 mb-8 shadow-xl">
            <Heart size={48} />
          </div>
          <h2 className="font-serif text-3xl font-bold text-book-900 mb-4">Your Wishlist is Empty</h2>
          <p className="text-book-500 max-w-md mx-auto mb-10 text-lg">
            Every great story starts with a first step. Find the books that speak to you and save them here.
          </p>
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            Explore Books <ArrowRight size={20} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Wishlist;
