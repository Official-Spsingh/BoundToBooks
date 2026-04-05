
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Truck, MapPin, Phone, CreditCard, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { OrderStatus } from '../types';

interface CheckoutProps {
  navigate: (path: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ navigate }) => {
  const { user, cart, clearCart, setOrders } = useAppContext();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    address: '',
    city: '',
    zip: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + (item.listing.price * item.quantity), 0);
  const total = subtotal + 5.99;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simulate payment/order processing
    setTimeout(() => {
      const newOrder = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user!.id,
        userName: user!.name,
        items: cart.map(item => ({
          listingId: item.listing.id,
          title: item.listing.title,
          price: item.listing.price,
          image: item.listing.images[0]
        })),
        totalPrice: total,
        address: `${formData.address}, ${formData.city}, ${formData.zip}`,
        phone: formData.phone,
        status: OrderStatus.PENDING,
        createdAt: new Date().toISOString()
      };

      setOrders(prev => [newOrder, ...prev]);
      setSubmitting(false);
      clearCart();
      navigate('/order-success');
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="font-serif text-4xl font-bold text-book-900 mb-12">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Shipping Form */}
        <form onSubmit={handleSubmit} className="flex-grow space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-book-100 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-book-900 mb-8 flex items-center gap-2">
              <Truck className="text-book-700" />
              Shipping Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-book-700">Full Name</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-book-50 border border-book-100 rounded-xl"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-book-700">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300" size={18} />
                  <input 
                    type="tel" required
                    className="w-full pl-12 pr-4 py-3 bg-book-50 border border-book-100 rounded-xl"
                    placeholder="123-456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-book-700">Email Address</label>
                <input 
                  type="email" readOnly
                  className="w-full px-4 py-3 bg-book-100 border border-book-100 rounded-xl text-book-400 cursor-not-allowed"
                  value={user?.email}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-book-700">Street Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-book-300" size={18} />
                  <input 
                    type="text" required
                    className="w-full pl-12 pr-4 py-3 bg-book-50 border border-book-100 rounded-xl"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-book-700">City</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-book-50 border border-book-100 rounded-xl"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-book-700">ZIP Code</label>
                <input 
                  type="text" required
                  className="w-full px-4 py-3 bg-book-50 border border-book-100 rounded-xl"
                  value={formData.zip}
                  onChange={(e) => setFormData({...formData, zip: e.target.value})}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-book-100 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-book-900 mb-8 flex items-center gap-2">
              <CreditCard className="text-book-700" />
              Payment Method
            </h2>
            <div className="p-4 border-2 border-book-800 bg-book-50 rounded-2xl flex items-center gap-4">
              <div className="bg-book-800 text-white p-2 rounded-lg">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="font-bold text-book-900">Cash on Delivery (COD)</p>
                <p className="text-xs text-book-500">Pay when you receive your package.</p>
              </div>
              <div className="ml-auto">
                <CheckCircle2 className="text-book-800" size={24} />
              </div>
            </div>
            <p className="text-xs text-book-400 mt-4 italic">Note: Online payment methods are currently being integrated for a more seamless experience.</p>
          </div>

          <button 
            type="submit"
            disabled={submitting}
            className="w-full py-5 bg-book-900 text-white rounded-3xl font-bold text-lg hover:bg-book-800 transition-all shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {submitting ? (
              <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Place Order'
            )}
          </button>
        </form>

        {/* Order Details Panel */}
        <div className="w-full lg:w-96">
          <div className="bg-white p-8 rounded-3xl border border-book-100 shadow-sm sticky top-24">
            <h2 className="font-serif text-2xl font-bold text-book-900 mb-6">Review Items</h2>
            <div className="space-y-4 mb-8">
              {cart.map(item => (
                <div key={item.listing.id} className="flex gap-4">
                  <div className="w-12 h-16 rounded-lg bg-book-50 flex-shrink-0 overflow-hidden">
                    <img src={item.listing.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow min-w-0">
                    <p className="text-sm font-bold text-book-900 truncate leading-tight">{item.listing.title}</p>
                    <p className="text-[10px] text-book-500">{item.listing.author}</p>
                  </div>
                  <span className="text-sm font-bold">₹{item.listing.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-6 border-t border-book-100">
              <div className="flex justify-between text-sm text-book-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-book-500">
                <span>Shipping Fee</span>
                <span>₹500</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-book-900 pt-2">
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-book-100 space-y-4">
              <div className="flex items-center gap-3 text-xs text-book-500">
                <ShieldCheck size={16} className="text-green-600" />
                Secure Checkout Guarantee
              </div>
              <div className="flex items-center gap-3 text-xs text-book-500">
                <Truck size={16} className="text-blue-600" />
                Estimated Delivery: {new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
