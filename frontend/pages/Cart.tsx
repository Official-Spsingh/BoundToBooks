
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';

interface CartProps {
  navigate: (path: string) => void;
}

const Cart: React.FC<CartProps> = ({ navigate }) => {
  const { cart, removeFromCart } = useAppContext();

  const subtotal = cart.reduce((acc, item) => acc + (item.listing.price * item.quantity), 0);
  const shipping = cart.length > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-book-900 mb-12">Your Reading List</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Cart Items */}
        <div className="flex-grow space-y-6">
          {cart.length > 0 ? (
            <>
              <div className="divide-y divide-book-100 bg-white rounded-3xl border border-book-100 shadow-sm overflow-hidden">
                {cart.map((item) => (
                  <div key={item.listing.id} className="p-6 flex gap-6 hover:bg-book-50 transition-colors">
                    <div className="w-24 h-32 flex-shrink-0 rounded-xl overflow-hidden bg-book-100">
                      <img src={item.listing.images[0]} alt={item.listing.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg text-book-900 leading-tight">{item.listing.title}</h3>
                          <p className="text-sm text-book-500">{item.listing.author}</p>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-book-100 text-book-700 px-2 py-0.5 rounded-full mt-2 inline-block">
                            {item.listing.condition}
                          </span>
                        </div>
                        <span className="font-bold text-book-900">${item.listing.price.toFixed(2)}</span>
                      </div>
                      <div className="flex items-center justify-between mt-6">
                        <div className="flex items-center gap-4 bg-book-50 px-3 py-1 rounded-full">
                          <span className="text-sm font-bold">Qty: {item.quantity}</span>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.listing.id)}
                          className="text-red-300 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 text-book-500 hover:text-book-900 font-bold transition-colors"
              >
                <ArrowLeft size={18} />
                Continue Browsing
              </button>
            </>
          ) : (
            <div className="bg-white rounded-3xl border border-book-100 shadow-sm p-20 flex flex-col items-center justify-center text-center">
              <div className="bg-book-50 p-6 rounded-full mb-6">
                <ShoppingBag size={48} className="text-book-200" />
              </div>
              <h3 className="text-2xl font-serif font-bold text-book-900">Your cart is empty</h3>
              <p className="text-book-500 mt-2 mb-8 max-w-sm">Looks like you haven't started your next adventure yet. Let's find some books!</p>
              <button 
                onClick={() => navigate('/')}
                className="bg-book-900 text-white px-8 py-3 rounded-full font-bold hover:bg-book-800 transition-all"
              >
                Start Browsing
              </button>
            </div>
          )}
        </div>

        {/* Summary */}
        {cart.length > 0 && (
          <div className="w-full lg:w-96">
            <div className="bg-white p-8 rounded-3xl border border-book-100 shadow-sm sticky top-24">
              <h2 className="font-serif text-2xl font-bold text-book-900 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-book-600">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-book-600">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-book-600">
                  <span>Estimated Tax</span>
                  <span>$0.00</span>
                </div>
                <div className="h-px bg-book-100"></div>
                <div className="flex justify-between text-xl font-bold text-book-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-green-700 text-xs mb-6">
                <p className="font-bold mb-1">Eco-Friendly Shipping</p>
                <p>We use recycled packaging materials for every order to reduce our environmental impact.</p>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-book-900 text-white rounded-2xl font-bold text-lg hover:bg-book-800 transition-all flex items-center justify-center gap-2 shadow-xl"
              >
                Proceed to Checkout
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
