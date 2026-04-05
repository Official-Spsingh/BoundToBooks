import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Package, Truck, Clock, CheckCircle, ChevronRight, Settings, ShoppingBag, Heart } from 'lucide-react';
import { RequestStatus } from '../types';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface DashboardProps {
  navigate: (path: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { user, requests, orders, wishlist, listings } = useAppContext();
  const [showAllOrders, setShowAllOrders] = React.useState(false);
  const [viewingRequest, setViewingRequest] = React.useState<any>(null);

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
    <>
      <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="flex items-center gap-6">
          <div className="relative group cursor-pointer" onClick={() => navigate('/profile-settings')}>
            <img src={user?.profileImage} alt={user?.name} className="w-24 h-24 rounded-[32px] border-4 border-white shadow-xl transition-transform group-hover:scale-105" />
            <div className="absolute -bottom-2 -right-2 bg-book-900 text-white p-2 rounded-xl border-4 border-white shadow-lg">
              <Settings size={16} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="font-serif text-4xl font-bold text-book-900">{user?.name}</h1>
              <Badge variant="primary">Member</Badge>
            </div>
            <p className="text-book-500 font-medium">{user?.email}</p>
          </div>
        </div>
        <div className="flex-grow"></div>
        <div className="flex gap-4">
          <Button variant="outline" size="md" onClick={() => navigate('/profile-settings')}>
            <Settings size={18} className="mr-2" />
            Edit Profile
          </Button>
          <Button variant="primary" size="md" onClick={() => navigate('/sell')}>
            Sell / Donate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Books Sold', val: userRequests.filter(r => r.status === RequestStatus.COMPLETED).length, icon: <Package className="text-blue-500" /> },
            { label: 'Donations', val: userRequests.filter(r => r.type === 'DONATE' as any).length, icon: <CheckCircle className="text-green-500" /> },
            { label: 'Wishlist Items', val: wishlist.length, icon: <Heart className="text-red-500" /> },
            { label: 'Orders placed', val: userOrders.length, icon: <ShoppingBag className="text-purple-500" /> },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] border border-book-100 shadow-sm flex items-center gap-4 hover:shadow-lg transition-all">
              <div className="p-3 bg-book-50 rounded-xl">{stat.icon}</div>
              <div>
                <div className="text-2xl font-bold text-book-900">{stat.val}</div>
                <div className="text-xs text-book-400 font-bold uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Requests Tracker */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[32px] border border-book-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-book-50 flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-book-900">Book Requests</h2>
              <button 
                onClick={() => navigate('/sell')}
                className="text-vintage-accent font-bold hover:underline flex items-center gap-2"
              >
                + New Request
              </button>
            </div>
            <div className="divide-y divide-book-50">
              {userRequests.length > 0 ? userRequests.map((req) => (
                <div key={req.id} className="p-8 hover:bg-book-50 transition-colors">
                  <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                    <div className="flex gap-6">
                      <div className="w-16 h-20 bg-book-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="text-book-300" />
                      </div>
                      <div>
                        <h3 className="font-bold text-book-900 text-lg leading-tight mb-1">{req.books[0].name} {req.books.length > 1 ? `+ ${req.books.length - 1} more` : ''}</h3>
                        <p className="text-xs text-book-400 font-medium">{new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                        <div className="mt-3 flex items-center gap-3">
                          <Badge variant={req.status === RequestStatus.COMPLETED ? 'success' : 'warning'}>{req.status}</Badge>
                          <Badge variant="outline">{req.type}</Badge>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => setViewingRequest(req)}
                      className="flex items-center gap-2 text-sm font-bold text-book-700 hover:text-book-900 bg-book-50 px-4 py-2 rounded-xl transition-all"
                    >
                      View Details
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-20 text-center text-book-400 space-y-4">
                  <div className="w-16 h-16 bg-book-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Package size={32} className="opacity-30" />
                  </div>
                  <p className="text-lg">No requests yet. Why not give a story a new home?</p>
                  <Button variant="outline" size="sm" onClick={() => navigate('/sell')}>Start Selling</Button>
                </div>
              )}
            </div>
          </div>
          
          {/* Wishlist Snapshot */}
          <div className="bg-white rounded-[32px] border border-book-100 shadow-sm overflow-hidden p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-serif text-2xl font-bold text-book-900 flex items-center gap-3">
                <Heart size={24} className="text-red-500" />
                Your Wishlist
              </h2>
              <button 
                onClick={() => navigate('/wishlist')}
                className="text-book-700 font-bold hover:underline text-sm"
              >
                View Full Wishlist
              </button>
            </div>
            {wishlist.length > 0 ? (
              <div className="flex flex-wrap gap-4">
                {listings.filter(l => wishlist.includes(l.id)).slice(0, 5).map(item => (
                  <div 
                    key={item.id} 
                    onClick={() => navigate(`/book/${item.id}`)}
                    className="w-16 h-24 rounded-lg bg-book-100 overflow-hidden cursor-pointer hover:ring-4 hover:ring-book-100 transition-all shadow-sm"
                  >
                    <img src={item.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
                {wishlist.length > 5 && (
                  <div 
                    onClick={() => navigate('/wishlist')}
                    className="w-16 h-24 rounded-lg bg-book-50 flex items-center justify-center cursor-pointer text-book-400 font-bold text-sm border-2 border-dashed border-book-100"
                  >
                    +{wishlist.length - 5}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-book-400 text-sm italic">You haven't saved any books yet.</p>
            )}
          </div>
        </div>

        {/* Orders Tracker */}
        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-book-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-book-50">
              <h2 className="font-serif text-2xl font-bold text-book-900 flex items-center gap-3">
                <ShoppingBag size={24} className="text-book-700" />
                Recent Orders
              </h2>
            </div>
            <div className="divide-y divide-book-50">
              {userOrders.length > 0 ? (showAllOrders ? userOrders : userOrders.slice(0, 3)).map((order) => (
                <div key={order.id} className="p-6 hover:bg-book-50 transition-colors group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold text-book-300 uppercase tracking-widest">#{order.id.substr(0, 8)}</span>
                    <span className="text-sm font-bold text-book-900">₹{order.totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-sm text-book-600 font-medium truncate mb-4 group-hover:text-book-900 transition-colors">
                    {order.items.map(i => i.title).join(', ')}
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant={order.status === 'DELIVERED' as any ? 'success' : 'primary'}>
                      {order.status.replace(/_/g, ' ')}
                    </Badge>
                    <button 
                      onClick={() => navigate(`/track/${order.id}`)}
                      className="text-xs text-vintage-accent font-bold hover:underline"
                    >
                      Track Shipment
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center text-book-400">
                  <ShoppingBag size={32} className="mx-auto mb-4 opacity-20" />
                  <p>No orders yet.</p>
                </div>
              )}
            </div>
            {userOrders.length > 3 && (
              <div className="p-6 bg-book-50/50 text-center border-t border-book-50">
                <button 
                  onClick={() => setShowAllOrders(!showAllOrders)}
                  className="text-sm font-bold text-book-700 hover:text-book-900 transition-colors"
                >
                  {showAllOrders ? 'Show Recent Only' : 'View All Order History'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* Viewing Request Modal (User Case) */}
    {viewingRequest && (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-book-900/60 backdrop-blur-sm" onClick={() => setViewingRequest(null)}></div>
        <div className="bg-white rounded-[40px] w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
          <div className="p-8 border-b border-book-100 flex justify-between items-center bg-book-50/30">
            <div>
              <h2 className="font-serif text-2xl font-bold text-book-900">Book Request Details</h2>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={viewingRequest.type === 'SELL' ? 'primary' : 'success'}>{viewingRequest.type}</Badge>
                <span className="text-xs text-book-300 font-bold uppercase tracking-widest">•</span>
                <Badge variant="outline">{viewingRequest.status}</Badge>
              </div>
            </div>
            <button onClick={() => setViewingRequest(null)} className="p-3 hover:bg-book-100 rounded-2xl transition-all">
              <span className="sr-only">Close</span>
              <svg className="w-5 h-5 text-book-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="p-8 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Request Status</h4>
                  <div className={`p-4 rounded-2xl border ${
                    viewingRequest.status === 'PENDING' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' : 
                    viewingRequest.status === 'ACCEPTED' ? 'bg-blue-50 border-blue-100 text-blue-700' : 
                    viewingRequest.status === 'COMPLETED' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                  }`}>
                    <div className="flex items-center gap-3">
                      {viewingRequest.status === 'PENDING' && <Clock size={20} />}
                      {viewingRequest.status === 'ACCEPTED' && <Truck size={20} />}
                      {viewingRequest.status === 'COMPLETED' && <CheckCircle size={20} />}
                      <span className="font-bold">{viewingRequest.status}</span>
                    </div>
                    <p className="text-xs mt-2 opacity-80">
                      {viewingRequest.status === 'PENDING' && 'Our team is currently reviewing your request. This usually takes 24-48 hours.'}
                      {viewingRequest.status === 'ACCEPTED' && 'Your request has been approved! Our logistics partner will contact you soon for pick-up.'}
                      {viewingRequest.status === 'COMPLETED' && 'Request completed. Your books are now part of our magical library!'}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Book Information</h4>
                  <h3 className="font-serif text-2xl font-bold text-book-900 mb-1">{viewingRequest.books[0].name}</h3>
                  <p className="text-lg text-book-500 italic mb-4">by {viewingRequest.books[0].author}</p>
                  
                  <div className="space-y-3">
                     <div className="p-4 bg-book-50 rounded-2xl">
                       <span className="text-book-400 font-bold uppercase tracking-widest text-[10px] block mb-2">Description / Condition Notes</span>
                       <p className="text-sm text-book-600 italic leading-relaxed">
                         "{viewingRequest.books[0].description || 'No description provided.'}"
                       </p>
                     </div>
                  </div>
                </div>
              </div>

              <div>
                 <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Book Snapshot</h4>
                 <div className="aspect-[3/4] bg-book-100 rounded-3xl overflow-hidden border border-book-100 shadow-inner">
                    {viewingRequest.books[0].images?.[0] ? (
                      <img src={viewingRequest.books[0].images[0]} className="w-full h-full object-cover" alt="" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-book-200">
                        <Package size={64} />
                      </div>
                    )}
                 </div>
              </div>
            </div>
          </div>
          <div className="p-8 bg-book-50/50 border-t border-book-100">
            <Button onClick={() => setViewingRequest(null)} className="w-full">Done</Button>
          </div>
        </div>
      </div>
      )}
    </>
  );
};

export default Dashboard;
