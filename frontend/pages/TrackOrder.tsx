import React from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  CheckCircle, Package, Truck, 
  MapPin, Calendar, ArrowLeft, ShoppingBag, 
  Clock, ShieldCheck
} from 'lucide-react';
import { OrderStatus } from '../types';

interface TrackOrderProps {
  orderId: string;
  navigate: (path: string) => void;
}

const TrackOrder: React.FC<TrackOrderProps> = ({ orderId, navigate }) => {
  const { orders } = useAppContext();
  
  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-book-900 mb-4">Order not found</h2>
        <button onClick={() => navigate('/dashboard')} className="text-book-700 font-bold hover:underline">Back to Dashboard</button>
      </div>
    );
  }

  const steps = [
    { status: OrderStatus.PENDING, label: 'Order Placed', icon: <ShoppingBag size={20} />, desc: 'We have received your order' },
    { status: OrderStatus.ORDER_CONFIRMED, label: 'Confirmed', icon: <ShieldCheck size={20} />, desc: 'Your order has been confirmed' },
    { status: OrderStatus.SHIPPED, label: 'Shipped', icon: <Package size={20} />, desc: 'Your books are on the way' },
    { status: OrderStatus.OUT_FOR_DELIVERY, label: 'Out for Delivery', icon: <Truck size={20} />, desc: 'Courier is arriving today' },
    { status: OrderStatus.DELIVERED, label: 'Delivered', icon: <CheckCircle size={20} />, desc: 'Enjoy your new stories!' },
  ];

  const currentStepIndex = steps.findIndex(s => s.status === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-book-500 hover:text-book-900 transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Orders
      </button>

      <div className="bg-white rounded-3xl border border-book-100 shadow-xl overflow-hidden mb-8">
        <div className="p-8 border-b border-book-50 bg-book-50/30">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="text-xs font-bold text-book-400 uppercase tracking-widest mb-1">Order Tracking</div>
              <h1 className="font-serif text-3xl font-bold text-book-900">Order #{order.id.substr(0, 8)}</h1>
              <p className="text-sm text-book-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-book-400 uppercase tracking-widest mb-1">Total Amount</div>
              <div className="text-3xl font-bold text-book-900">${order.totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {/* Tracking Stepper */}
        <div className="p-8 md:p-12">
          <div className="relative flex flex-col gap-12 md:flex-row md:justify-between md:gap-0">
            {/* Background Line (Desktop) */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-book-50 hidden md:block"></div>
            
            {steps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              
              return (
                <div key={step.status} className="relative flex md:flex-col items-center md:items-center gap-4 md:gap-6 flex-1">
                  {/* Progress Line (Desktop) */}
                  {idx < steps.length - 1 && isCompleted && idx < currentStepIndex && (
                    <div className="absolute top-6 left-[50%] w-full h-0.5 bg-book-900 z-0 hidden md:block"></div>
                  )}
                  
                  {/* Step Icon */}
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center z-10 transition-all duration-500
                    ${isCompleted ? 'bg-book-900 text-white shadow-lg shadow-book-900/20' : 'bg-book-50 text-book-300'}
                    ${isCurrent ? 'ring-4 ring-book-100' : ''}
                  `}>
                    {isCompleted && idx < currentStepIndex ? <CheckCircle size={20} /> : step.icon}
                  </div>

                  {/* Step Info */}
                  <div className="flex flex-col md:items-center text-left md:text-center">
                    <h3 className={`font-bold text-sm ${isCompleted ? 'text-book-900' : 'text-book-300'}`}>
                      {step.label}
                    </h3>
                    <p className={`text-[11px] mt-1 hidden md:block max-w-[120px] ${isCompleted ? 'text-book-500' : 'text-book-200'}`}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-book-50/50 p-8 border-t border-book-50 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h4 className="font-bold text-book-900 flex items-center gap-2">
              <MapPin size={18} className="text-book-400" />
              Delivery Address
            </h4>
            <p className="text-sm text-book-600 leading-relaxed whitespace-pre-line">
              {order.address}
            </p>
            <p className="text-sm font-bold text-book-900">{order.phone}</p>
          </div>
          <div className="space-y-4">
            <h4 className="font-bold text-book-900 flex items-center gap-2">
              <ShoppingBag size={18} className="text-book-400" />
              Order Items
            </h4>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <img src={item.image} className="w-10 h-14 object-cover rounded shadow-sm" alt="" />
                  <div>
                    <div className="text-sm font-bold text-book-800 underline decoraton-book-100">{item.title}</div>
                    <div className="text-xs text-book-500">${item.price.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-book-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-white/10 p-4 rounded-2xl">
            <Clock size={32} className="text-book-100 animate-pulse" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Estimated Delivery</h3>
            <p className="text-book-300 text-sm">Your items will arrive within 2-3 business days.</p>
          </div>
        </div>
        <button className="bg-vintage-accent hover:bg-orange-600 px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-105">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default TrackOrder;
