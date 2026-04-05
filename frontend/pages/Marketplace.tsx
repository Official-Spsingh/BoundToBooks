import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Filter, Star, BookOpen, Clock, Tag, Search, Heart, ChevronDown } from 'lucide-react';
import { BookListing } from '../types';
import { BOOK_CATEGORIES } from '../constants';

interface MarketplaceProps {
  navigate: (path: string) => void;
}

const Marketplace: React.FC<MarketplaceProps> = ({ navigate }) => {
  const { listings, wishlist, toggleWishlist, reviews } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest');
  const [activeCondition, setActiveCondition] = useState('All');
  
  const categories = ['All', ...BOOK_CATEGORIES];

  const filteredListings = listings.filter(l => {
    const matchesCategory = activeCategory === 'All' || l.category === activeCategory;
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         l.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCondition = activeCondition === 'All' || l.condition === activeCondition;
    return matchesCategory && matchesSearch && matchesCondition && l.isAvailable;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0; // Newest first would require a createdAt date on listings, currently using default order
  });

  const getRating = (bookId: string) => {
    const bookReviews = reviews.filter(r => r.bookId === bookId);
    if (bookReviews.length === 0) return 0;
    return bookReviews.reduce((acc, r) => acc + r.rating, 0) / bookReviews.length;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="relative h-[400px] rounded-3xl overflow-hidden mb-16">
        <img 
          src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
          className="absolute inset-0 w-full h-full object-cover"
          alt="Library"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-book-900/80 to-transparent flex items-center p-8 md:p-16">
          <div className="max-w-xl text-white">
            <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6 leading-tight">Every Book Has a Story to Tell.</h1>
            <p className="text-lg text-book-100 mb-8 font-light">
              Discover unique pre-loved books, give your old stories a new home, and join a community of mindful readers.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => navigate('/sell')}
                className="bg-vintage-accent hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105"
              >
                Sell Your Books
              </button>
              <button 
                className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white px-8 py-3 rounded-full font-bold transition-all"
                onClick={() => navigate('/about')}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
        {[
          { icon: <BookOpen className="text-book-500" />, label: "Quality Checked", desc: "Every book is vetted" },
          { icon: <Clock className="text-book-500" />, label: "Fast Shipping", desc: "Within 48 hours" },
          { icon: <Tag className="text-book-500" />, label: "Low Prices", desc: "Up to 70% off retail" },
          { icon: <Star className="text-book-500" />, label: "Community First", desc: "Support local literacy" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-book-100 flex flex-col items-center text-center">
            <div className="mb-3">{stat.icon}</div>
            <h3 className="font-bold text-book-900">{stat.label}</h3>
            <p className="text-xs text-book-500 mt-1">{stat.desc}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Product Grid */}
        <div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-12">
            <div className="flex items-baseline gap-3">
              <h2 className="font-serif text-3xl font-bold text-book-900">
                {activeCategory} {activeCategory === 'All' ? 'Books' : ''}
              </h2>
              <span className="text-sm text-book-400 font-bold bg-book-50 px-2 py-0.5 rounded-lg">{filteredListings.length} total</span>
            </div>

            {/* Unified Filter Bar: Search -> Sort -> Filters (Category, Condition) */}
            <div className="flex flex-wrap lg:flex-nowrap items-center bg-white border border-book-100 rounded-2xl p-1.5 gap-2 shadow-sm">
              
              {/* Search Input (Leftmost) */}
              <div className="relative flex-grow min-w-[280px]">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-book-400" size={16} />
                <input 
                  type="text"
                  placeholder="Search titles or authors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none rounded-xl pl-11 pr-4 py-2 text-sm focus:ring-0 focus:outline-none text-book-900 transition-all font-medium placeholder:text-book-300"
                />
              </div>

              <div className="hidden lg:block w-px h-6 bg-book-100 mx-1"></div>

              {/* Sort Dropdown */}
              <div className="relative min-w-[150px] flex-grow lg:flex-grow-0">
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="w-full bg-book-50/50 hover:bg-book-50 border-none rounded-xl pl-3 pr-8 py-2 text-xs font-bold text-book-600 focus:ring-2 focus:ring-book-100 focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low \u2192 High</option>
                  <option value="price-high">Price: High \u2192 Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-book-300" size={14} />
              </div>

              <div className="hidden lg:block w-px h-6 bg-book-100 mx-1"></div>

              {/* Category Filter */}
              <div className="relative min-w-[160px] flex-grow lg:flex-grow-0">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-book-400" size={14} />
                <select 
                  value={activeCategory}
                  onChange={(e) => setActiveCategory(e.target.value)}
                  className="w-full bg-transparent border-none rounded-xl pl-9 pr-8 py-2 text-sm font-bold text-book-900 focus:ring-0 focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-book-300" size={14} />
              </div>

              <div className="hidden lg:block w-px h-6 bg-book-100 mx-1"></div>

              {/* Condition Filter */}
              <div className="relative min-w-[160px] flex-grow lg:flex-grow-0">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-book-400" size={14} />
                <select 
                  value={activeCondition}
                  onChange={(e) => setActiveCondition(e.target.value)}
                  className="w-full bg-transparent border-none rounded-xl pl-9 pr-8 py-2 text-sm font-bold text-book-900 focus:ring-0 focus:outline-none appearance-none cursor-pointer transition-all"
                >
                  <option value="All">All Conditions</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Used">Used</option>
                  <option value="Poor">Poor</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-book-300" size={14} />
              </div>
            </div>
          </div>

          {filteredListings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {filteredListings.map((listing) => {
                const rating = getRating(listing.id);
                return (
                  <div 
                    key={listing.id}
                    onClick={() => navigate(`/book/${listing.id}`)}
                    className="group bg-white rounded-2xl overflow-hidden border border-book-100 hover:shadow-xl transition-all cursor-pointer relative"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img 
                        src={listing.images[0]} 
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                        <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-book-700 border border-book-100 uppercase tracking-wider pointer-events-auto">
                          {listing.condition}
                        </span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWishlist(listing.id);
                          }}
                          className={`p-2 rounded-full shadow-lg transition-all pointer-events-auto ${
                            wishlist.includes(listing.id) 
                              ? 'bg-red-500 text-white' 
                              : 'bg-white/90 text-book-400 hover:text-red-500'
                          }`}
                        >
                          <Heart size={16} fill={wishlist.includes(listing.id) ? "currentColor" : "none"} />
                        </button>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-1">
                        <div className="text-[10px] text-book-400 font-bold uppercase tracking-widest">{listing.category}</div>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <Star size={12} fill={rating > 0 ? "currentColor" : "none"} />
                          <span className="text-xs font-bold text-book-700">{rating > 0 ? rating.toFixed(1) : '0.0'}</span>
                        </div>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-book-900 truncate mb-1">{listing.title}</h3>
                      <p className="text-sm text-book-500 mb-4">{listing.author}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-book-900">₹{listing.price.toFixed(2)}</span>
                        <button className="bg-book-50 text-book-700 hover:bg-book-900 hover:text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-book-50 p-6 rounded-full mb-4">
                <BookOpen size={48} className="text-book-300" />
              </div>
              <h3 className="text-xl font-bold text-book-900">No books found</h3>
              <p className="text-book-500 mt-2">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
