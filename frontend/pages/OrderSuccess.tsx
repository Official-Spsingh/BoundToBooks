
import React from 'react';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Heart, Star, Sparkles, Mail } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface OrderSuccessProps {
  navigate: (path: string) => void;
}

const OrderSuccess: React.FC<OrderSuccessProps> = ({ navigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-24 text-center">
      <div className="relative inline-block mb-12">
        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
        <div className="relative w-32 h-32 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl">
          <CheckCircle size={64} />
        </div>
        <div className="absolute -top-4 -right-4 bg-vintage-accent p-3 rounded-2xl animate-bounce">
          <Sparkles size={24} className="text-white" />
        </div>
      </div>

      <div className="space-y-6 mb-16">
        <Badge variant="success" className="px-4 py-1.5 text-xs">Order Confirmed</Badge>
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-book-900">Your Story Begins Now.</h1>
        <p className="text-xl text-book-500 font-light max-w-2xl mx-auto leading-relaxed">
          Thank you for choosing Bound to Books. Your order has been successfully placed and is being prepared with a little bit of magic.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: <Mail className="text-blue-500" />, title: "Check Your Inbox", desc: "We've sent a detailed receipt and summary to your email." },
          { icon: <Package className="text-orange-500" />, title: "Careful Packing", desc: "Our team is hand-checking and packing your books with love." },
          { icon: <ShoppingBag className="text-green-500" />, title: "Ready to Ship", desc: "You'll receive a tracking number as soon as it leaves us." },
        ].map((item, i) => (
          <div key={i} className="p-8 bg-white border border-book-50 rounded-[32px] hover:shadow-xl transition-all">
            <div className="w-12 h-12 bg-book-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              {item.icon}
            </div>
            <h3 className="font-bold text-book-900 mb-2">{item.title}</h3>
            <p className="text-xs text-book-500 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button variant="primary" size="lg" className="w-full sm:w-auto px-12" onClick={() => navigate('/dashboard')}>
           Track My Order <ArrowRight size={20} className="ml-2" />
        </Button>
        <Button variant="outline" size="lg" className="w-full sm:w-auto px-12" onClick={() => navigate('/')}>
          Keep Exploring
        </Button>
      </div>

      <div className="mt-24 py-12 border-t border-book-50">
        <h4 className="text-book-400 font-bold uppercase tracking-widest text-xs mb-8">While You Wait</h4>
        <div className="flex flex-wrap justify-center gap-8 opacity-60 hover:opacity-100 transition-opacity">
          <button className="flex items-center gap-2 text-book-900 font-bold hover:text-vintage-accent transition-colors">
            <Heart size={18} /> Join the Book Club
          </button>
          <button className="flex items-center gap-2 text-book-900 font-bold hover:text-vintage-accent transition-colors">
            <Star size={18} /> Leave a Review
          </button>
          <button className="flex items-center gap-2 text-book-900 font-bold hover:text-vintage-accent transition-colors">
            <Sparkles size={18} /> Share the Magic
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
