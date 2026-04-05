
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, Truck, Clock, CheckCircle, ChevronRight, Settings, ShoppingBag } from 'lucide-react';
import { RequestStatus } from '../types';

interface DashboardProps {
  navigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { user, requests, orders } = useAppContext();

  const userRequests = requests.filter(r => r.userId === user?.id);
  const userOrders = orders.filter(o => o.userId === user?.id);

  const getStatusStyle = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
      case RequestStatus.ACCEPTED: return 'bg-blue-100 text-blue-700';
      case RequestStatus.REJECTED: return 'bg-red-100 text-red-700';
      case RequestStatus.COMPLETED: return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="flex items-center gap-4">
          <img src={user?.profileImage} alt={user?.name} className="w-20 h-20 rounded-full border-4 border-white shadow-lg" />
          <div>
            <h1 className="font-serif text-3xl font-bold text-book-900">{user?.name}</h1>
            <p className="text-book-500">{user?.email}</p>
          </div>
        </div>
        <div className="flex-grow"></div>
        <button className="flex items-center gap-2 bg-white border border-book-100 px-4 py-2 rounded-xl text-book-700 hover:bg-book-50 transition-colors">
          <Settings size={18} />
          Profile Settings
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Books Sold', val: userRequests.filter(r => r.status === RequestStatus.COMPLETED).length, icon: <Package className="text-blue-500" /> },
            { label: 'Donations', val: userRequests.filter(r => r.type === 'DONATE' as any).length, icon: <CheckCircle className="text-green-500" /> },
            { label: 'Active Orders', val: userOrders.filter(o => o.status !== 'DELIVERED' as any).length, icon: <Truck className="text-orange-500" /> },
            { label: 'Points Earned', val: '250', icon: <Clock className="text-purple-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-book-100 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-book-50 rounded-xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-book-900">{stat.val}</div>
                <div className="text-sm text-book-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Requests Tracker */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-book-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-book-50 flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-book-900">Your Book Requests</h2>
              <button 
                onClick={() => navigate('/sell')}
                className="text-book-700 font-bold hover:underline"
              >
                + New Request
              </button>
            </div>
            <div className="divide-y divide-book-50">
              {userRequests.length > 0 ? userRequests.map((req) => (
                <div key={req.id} className="p-6 hover:bg-book-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="flex gap-4">
                      <div className="w-16 h-20 bg-book-100 rounded-lg flex items-center justify-center">
                        <Package className="text-book-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-book-900">{req.books[0].name} {req.books.length > 1 ? `+ ${req.books.length - 1} more` : ''}</h3>
                        <p className="text-sm text-book-500">{new Date(req.createdAt).toLocaleDateString()}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getStatusStyle(req.status)}`}>
                            {req.status}
                          </span>
                          <span className="text-[10px] bg-book-100 text-book-700 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
                            {req.type}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {req.takeoverDate && (
                        <div className="text-xs text-right text-blue-600 font-medium">
                          Pickup: {new Date(req.takeoverDate).toLocaleDateString()}
                        </div>
                      )}
                      <button className="flex items-center gap-1 text-sm text-book-400 hover:text-book-900">
                        View Details
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-book-400">
                  No requests yet. Why not give a story a new home?
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Orders Tracker */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-book-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-book-50">
              <h2 className="font-serif text-2xl font-bold text-book-900 flex items-center gap-2">
                <ShoppingBag size={24} />
                Recent Orders
              </h2>
            </div>
            <div className="divide-y divide-book-50">
              {userOrders.length > 0 ? userOrders.map((order) => (
                <div key={order.id} className="p-4 hover:bg-book-50 transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-mono text-book-400">#{order.id.substr(0, 8)}</span>
                    <span className="text-xs font-bold text-book-900">${order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-book-600 truncate mb-2">
                    {order.items.map(i => i.title).join(', ')}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                      {order.status}
                    </span>
                    <button 
                      onClick={() => navigate(`/track/${order.id}`)}
                      className="text-xs text-book-700 font-bold hover:underline"
                    >
                      Track
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-book-400">
                  You haven't ordered any books yet.
                </div>
              )}
            </div>
            {userOrders.length > 0 && (
              <div className="p-4 bg-book-50 text-center">
                <button className="text-sm font-bold text-book-700">View All Orders</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
