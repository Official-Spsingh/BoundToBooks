
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, ArrowLeft, Heart, Share2, ShieldCheck, Truck, RefreshCw } from 'lucide-react';

interface BookDetailProps {
  id: string;
  navigate: (path: string) => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ id, navigate }) => {
  const { listings, addToCart } = useAppContext();
  const listing = listings.find(l => l.id === id);
  const [added, setAdded] = useState(false);

  if (!listing) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Book not found</h2>
      <button onClick={() => navigate('/')} className="text-book-700 mt-4 underline">Back to Marketplace</button>
    </div>
  );

  const handleAddToCart = () => {
    addToCart(listing);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-book-500 hover:text-book-900 mb-8 transition-colors"
      >
        <ArrowLeft size={18} />
        Back to Results
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] rounded-3xl overflow-hidden border border-book-100 bg-white">
            <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {listing.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden border border-book-100 bg-white cursor-pointer hover:opacity-80 transition-opacity">
                <img src={img} alt={`${listing.title} view ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-book-500 text-sm mb-2 uppercase tracking-widest font-bold">
            <span>{listing.category}</span>
            <span>•</span>
            <span className="text-vintage-accent">{listing.condition}</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-book-900 mb-2 leading-tight">
            {listing.title}
          </h1>
          <p className="text-xl text-book-600 mb-8 font-serif italic">by {listing.author}</p>

          <div className="flex items-end gap-4 mb-8">
            <span className="text-4xl font-bold text-book-900">${listing.price.toFixed(2)}</span>
            <span className="text-book-400 line-through mb-1.5 text-lg">$24.99</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full mb-2">35% OFF</span>
          </div>

          <p className="text-book-700 leading-relaxed mb-8 text-lg">
            {listing.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <button 
              onClick={handleAddToCart}
              className={`flex-grow flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all ${
                added 
                ? 'bg-green-600 text-white' 
                : 'bg-book-900 text-white hover:bg-book-800'
              }`}
            >
              <ShoppingCart size={20} />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-book-100 rounded-2xl text-book-700 hover:bg-book-50 transition-colors">
              <Heart size={20} />
            </button>
            <button className="flex items-center justify-center p-4 border-2 border-book-100 rounded-2xl text-book-700 hover:bg-book-50 transition-colors">
              <Share2 size={20} />
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-book-100">
            <div className="flex flex-col items-center text-center">
              <ShieldCheck className="text-book-500 mb-2" size={24} />
              <span className="text-xs font-bold text-book-900">Verified Quality</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <Truck className="text-book-500 mb-2" size={24} />
              <span className="text-xs font-bold text-book-900">Eco-Friendly Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center">
              <RefreshCw className="text-book-500 mb-2" size={24} />
              <span className="text-xs font-bold text-book-900">7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
