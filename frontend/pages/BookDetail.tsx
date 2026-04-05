import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, ArrowLeft, Heart, Share2, ShieldCheck, Truck, RefreshCw, Star, MessageSquare, Send, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface BookDetailProps {
  id: string;
  navigate: (path: string) => void;
}

const BookDetail: React.FC<BookDetailProps> = ({ id, navigate }) => {
  const { listings, addToCart, wishlist, toggleWishlist, reviews, addReview, user, orders } = useAppContext();
  const listing = listings.find(l => l.id === id);
  const [added, setAdded] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });

  if (!listing) return (
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <h2 className="text-2xl font-bold">Book not found</h2>
      <button onClick={() => navigate('/')} className="text-book-700 mt-4 underline">Back to Marketplace</button>
    </div>
  );

  const bookReviews = reviews.filter(r => r.bookId === id);
  const averageRating = bookReviews.length > 0 
    ? bookReviews.reduce((acc, r) => acc + r.rating, 0) / bookReviews.length 
    : 0;

  const hasPurchased = orders.some(o => o.userId === user?.id && o.items.some(i => i.listingId === id));

  const handleAddToCart = () => {
    addToCart(listing);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addReview({
      bookId: id,
      userId: user.id,
      userName: user.name,
      rating: newReview.rating,
      comment: newReview.comment
    });
    setNewReview({ rating: 5, comment: '' });
    setShowReviewForm(false);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Check out ${listing.title} on BoundToBooks`,
          text: `I found this amazing book: ${listing.title} by ${listing.author}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-book-500 hover:text-book-900 mb-8 transition-colors group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Marketplace
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
        {/* Gallery */}
        <div className="space-y-6">
          <div className="aspect-[3/4] rounded-[48px] overflow-hidden border border-book-100 bg-white shadow-2xl shadow-book-900/5 group">
            <img 
              src={listing.images[0]} 
              alt={listing.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {listing.images.map((img, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-book-50 bg-white cursor-pointer hover:border-book-200 transition-all shadow-sm">
                <img src={img} alt={`${listing.title} view ${i}`} className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-col py-4">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Badge variant="primary">{listing.category}</Badge>
            <Badge variant="secondary">{listing.condition}</Badge>
            <div className="flex items-center gap-1.5 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-[10px] font-bold">
              <Star size={12} fill={averageRating > 0 ? "currentColor" : "none"} />
              {averageRating > 0 ? `${averageRating.toFixed(1)} (${bookReviews.length})` : 'No ratings yet'}
            </div>
          </div>
          
          <h1 className="font-serif text-5xl lg:text-6xl font-bold text-book-900 mb-4 leading-tight">
            {listing.title}
          </h1>
          <p className="text-2xl text-book-500 mb-8 font-serif italic">by {listing.author}</p>

          <div className="flex items-end gap-4 mb-10">
            <span className="text-5xl font-bold text-book-900">₹{listing.price.toFixed(2)}</span>
            <span className="text-book-300 line-through mb-2 text-xl font-light">₹2499</span>
            <Badge variant="success" className="mb-2">35% OFF</Badge>
          </div>

          <p className="text-book-600 leading-relaxed mb-12 text-lg font-light">
            {listing.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button 
              onClick={handleAddToCart}
              loading={added}
              className="flex-grow py-5 text-lg"
            >
              <ShoppingCart size={22} className="mr-2" />
              {added ? 'Added to Cart!' : 'Add to Cart'}
            </Button>
            
            <button 
              onClick={() => toggleWishlist(listing.id)}
              className={`p-5 border-2 rounded-2xl transition-all ${
                wishlist.includes(listing.id) 
                  ? 'bg-red-50 border-red-100 text-red-500' 
                  : 'border-book-100 text-book-400 hover:bg-book-50'
              }`}
            >
              <Heart size={24} fill={wishlist.includes(listing.id) ? "currentColor" : "none"} />
            </button>
            
            <button 
              onClick={handleShare}
              className="p-5 border-2 border-book-100 rounded-2xl text-book-700 hover:bg-book-50 transition-colors"
              title="Share Book"
            >
              <Share2 size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 py-10 border-t border-book-100">
            {[
              { icon: <ShieldCheck />, label: "Quality Verified" },
              { icon: <Truck />, label: "Eco Shipping" },
              { icon: <RefreshCw />, label: "7-Day Returns" },
            ].map((prop, i) => (
              <div key={i} className="flex items-center gap-4 text-book-700">
                <div className="text-book-400">{prop.icon}</div>
                <span className="text-xs font-bold uppercase tracking-wider">{prop.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Books */}
      <div className="border-t border-book-100 pt-24 mb-24">
        <div className="flex justify-between items-end mb-12">
          <div>
            <Badge variant="primary" className="mb-4">More for You</Badge>
            <h2 className="font-serif text-4xl font-bold text-book-900">Readers also enjoyed</h2>
          </div>
          <Button variant="ghost" onClick={() => navigate('/')}>
            View All Marketplace <ArrowRight size={18} className="ml-2" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {listings
            .filter(l => l.category === listing.category && l.id !== listing.id)
            .slice(0, 4)
            .map((book) => (
              <div 
                key={book.id}
                onClick={() => {
                  navigate(`/book/${book.id}`);
                  window.scrollTo(0, 0);
                }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] rounded-3xl overflow-hidden mb-4 border border-book-100 shadow-sm group-hover:shadow-xl transition-all">
                  <img src={book.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                </div>
                <h3 className="font-bold text-book-900 truncate">{book.title}</h3>
                <p className="text-sm text-book-500">₹{book.price.toFixed(2)}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="max-w-4xl border-t border-book-100 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h2 className="font-serif text-4xl font-bold text-book-900 mb-2">Reader Reviews</h2>
            <div className="flex items-center gap-4 text-book-500">
              <div className="flex text-yellow-500">
                {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= Math.round(averageRating) ? "currentColor" : "none"} />)}
              </div>
              <span className="font-bold text-book-900">{averageRating.toFixed(1)} out of 5</span>
              <span>•</span>
              <span>{bookReviews.length} reviews</span>
            </div>
          </div>
          
          {hasPurchased && !showReviewForm && (
            <Button variant="outline" onClick={() => setShowReviewForm(true)}>
              Write a Review
            </Button>
          )}
        </div>

        {showReviewForm && (
          <div className="bg-book-50/50 p-8 rounded-[32px] border border-book-100 mb-12 animate-in slide-in-from-top duration-500">
            <h3 className="font-bold text-book-900 text-xl mb-6">Share your reading experience</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-book-700">Rating:</span>
                <div className="flex gap-2 text-yellow-500">
                  {[1,2,3,4,5].map(s => (
                    <button 
                      key={s} 
                      type="button" 
                      onClick={() => setNewReview({...newReview, rating: s})}
                      className="hover:scale-110 transition-transform"
                    >
                      <Star size={32} fill={s <= newReview.rating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                required
                rows={4}
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                placeholder="What did you think about the story?"
                className="w-full bg-white border border-book-100 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all resize-none shadow-sm"
              ></textarea>
              <div className="flex gap-4">
                <Button type="submit">Submit Review <Send size={18} className="ml-2" /></Button>
                <Button variant="ghost" type="button" onClick={() => setShowReviewForm(false)}>Cancel</Button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-8">
          {bookReviews.length > 0 ? bookReviews.map((review) => (
            <div key={review.id} className="p-8 bg-white border border-book-50 rounded-[32px] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-book-900 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {review.userName[0]}
                  </div>
                  <div>
                    <h4 className="font-bold text-book-900">{review.userName}</h4>
                    <p className="text-[10px] text-book-400 font-bold uppercase tracking-widest">
                      {new Date(review.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </p>
                  </div>
                </div>
                <div className="flex text-yellow-500">
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "currentColor" : "none"} />)}
                </div>
              </div>
              <p className="text-book-600 leading-relaxed italic">"{review.comment}"</p>
            </div>
          )) : (
            <div className="text-center py-16 bg-book-50/20 rounded-[32px] border border-dashed border-book-100">
              <MessageSquare size={32} className="mx-auto mb-4 text-book-200" />
              <p className="text-book-500 italic">No reviews yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetail;
