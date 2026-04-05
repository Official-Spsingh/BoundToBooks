
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  Book, ClipboardList, CheckCircle, XCircle, 
  Search, ExternalLink, Plus, X,
  TrendingUp, DollarSign, Package, Eye, EyeOff, LayoutDashboard
} from 'lucide-react';
import { RequestStatus, RequestType, BookListing, OrderStatus, BookCondition } from '../types';
import BookForm from '../components/BookForm';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { requests, setRequests, listings, setListings, orders, addListing, updateOrderStatus } = useAppContext();
  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'orders' | 'analytics'>('analytics');
  const [filterType, setFilterType] = useState<'ALL' | RequestType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Analytics Calculations
  const metrics = useMemo(() => {
    const booksBought = requests
      .filter(r => r.status === RequestStatus.COMPLETED && r.type === RequestType.SELL)
      .reduce((acc, r) => acc + r.books.length, 0);
    
    const booksDonated = requests
      .filter(r => r.status === RequestStatus.COMPLETED && r.type === RequestType.DONATE)
      .reduce((acc, r) => acc + r.books.length, 0);
    
    const booksSold = orders
      .filter(o => o.status !== OrderStatus.CANCELLED)
      .reduce((acc, o) => acc + o.items.length, 0);
    
    const inStock = listings.filter(l => l.isAvailable).length;

    const totalSalesValue = orders
      .filter(o => o.status !== OrderStatus.CANCELLED)
      .reduce((acc, o) => acc + o.totalPrice, 0);

    return { booksBought, booksDonated, booksSold, inStock, totalSalesValue };
  }, [requests, orders, listings]);

  const filteredRequests = requests.filter(req => {
    const matchesSearch = req.userName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         req.books.some(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = filterType === 'ALL' || req.type === filterType;
    return matchesSearch && matchesType;
  });

  const filteredInventory = listings.filter(l => 
    l.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    l.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateStatus = (requestId: string, status: RequestStatus, takeoverDate?: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status, takeoverDate: takeoverDate || req.takeoverDate } 
        : req
    ));
  };

  const finalizeListing = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const newListings: BookListing[] = request.books.map(book => ({
      id: Math.random().toString(36).substr(2, 9),
      title: book.name,
      author: book.author,
      description: book.description,
      price: book.expectedPrice || 10,
      condition: book.condition,
      images: book.images,
      isAvailable: true,
      sourceRequestId: request.id,
      category: 'Uncategorized'
    }));

    setListings(prev => [...prev, ...newListings]);
    handleUpdateStatus(requestId, RequestStatus.COMPLETED);
  };

  const toggleListingAvailability = (id: string) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, isAvailable: !l.isAvailable } : l));
  };

  return (
    <div className="flex min-h-screen bg-book-50">
      {/* Sidebar */}
      <aside className="w-64 bg-book-900 text-book-100 hidden md:flex flex-col">
        <div className="p-8 border-b border-book-800">
          <h2 className="font-serif text-2xl font-bold">Bound to Books</h2>
          <p className="text-[10px] text-book-400 uppercase tracking-widest mt-1">Admin Console</p>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'analytics' ? 'bg-white/10 text-white' : 'text-book-400 hover:text-white hover:bg-white/5'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'requests' ? 'bg-white/10 text-white' : 'text-book-400 hover:text-white hover:bg-white/5'}`}
          >
            <ClipboardList size={20} /> Requests
            {requests.filter(r => r.status === RequestStatus.PENDING).length > 0 && (
              <span className="ml-auto bg-vintage-accent text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {requests.filter(r => r.status === RequestStatus.PENDING).length}
              </span>
            )}
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'inventory' ? 'bg-white/10 text-white' : 'text-book-400 hover:text-white hover:bg-white/5'}`}
          >
            <Book size={20} /> Inventory
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-white/10 text-white' : 'text-book-400 hover:text-white hover:bg-white/5'}`}
          >
            <Package size={20} /> Orders
          </button>
        </nav>
        <div className="p-4 border-t border-book-800">
          <button onClick={() => navigate('/')} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-book-400 hover:text-white transition-colors">
            <ExternalLink size={20} /> Public View
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-4 md:p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-book-900 capitalize">{activeTab}</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-book-400" size={18} />
              <input 
                type="text" 
                placeholder="Search database..."
                className="pl-10 pr-4 py-2 bg-white border border-book-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-book-700/20 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {activeTab === 'inventory' && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-book-900 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-book-800 transition-all shadow-lg shadow-book-900/20"
              >
                <Plus size={18} /> Add to Inventory
              </button>
            )}
          </div>
        </header>

        {/* Add Book Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-book-900/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)}></div>
            <div className="bg-white rounded-3xl w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
              <div className="p-6 border-b border-book-100 flex justify-between items-center bg-book-50/50">
                <h2 className="font-serif text-2xl font-bold text-book-900">Add New Book to Inventory</h2>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-book-100 rounded-full transition-colors">
                  <X size={20} className="text-book-400" />
                </button>
              </div>
              
              <div className="max-h-[70vh] overflow-y-auto">
                <BookForm
                  mode="ADMIN"
                  onSubmit={(data) => {
                    addListing({
                      title: data.title,
                      author: data.author,
                      category: data.category,
                      condition: data.condition,
                      price: data.price,
                      description: data.description,
                      images: [data.image || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'],
                    });
                    setIsAddModalOpen(false);
                  }}
                  onCancel={() => setIsAddModalOpen(false)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Books Bought', val: metrics.booksBought, icon: <Package size={20} className="text-blue-600" />, color: 'blue' },
                { label: 'Books Donated', val: metrics.booksDonated, icon: <CheckCircle size={20} className="text-green-600" />, color: 'green' },
                { label: 'Books Sold', val: metrics.booksSold, icon: <TrendingUp size={20} className="text-purple-600" />, color: 'purple' },
                { label: 'In Stock', val: metrics.inStock, icon: <Book size={20} className="text-orange-600" />, color: 'orange' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-book-100 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-book-50 rounded-2xl">{stat.icon}</div>
                  </div>
                  <div className="text-2xl font-bold text-book-900">{stat.val}</div>
                  <div className="text-sm text-book-500 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Custom Chart Section */}
            <div className="bg-white p-8 rounded-3xl border border-book-100 shadow-sm">
              <h2 className="font-serif text-xl font-bold text-book-900 mb-8">Platform Activity Overview</h2>
              <div className="flex items-end justify-around h-64 gap-4 px-8">
                {[
                  { label: 'Bought', val: metrics.booksBought, color: 'bg-blue-500' },
                  { label: 'Donated', val: metrics.booksDonated, color: 'bg-green-500' },
                  { label: 'Sold', val: metrics.booksSold, color: 'bg-purple-500' },
                  { label: 'In Stock', val: metrics.inStock, color: 'bg-orange-500' },
                ].map((item, idx) => {
                  const max = Math.max(metrics.booksBought, metrics.booksDonated, metrics.booksSold, metrics.inStock, 5);
                  const height = `${(item.val / max) * 100}%`;
                  return (
                    <div key={idx} className="flex flex-col items-center flex-1 max-w-[80px]">
                      <div className="w-full bg-book-50 rounded-t-lg relative flex items-end justify-center h-full overflow-hidden">
                        <div 
                          className={`w-full ${item.color} transition-all duration-1000 ease-out rounded-t-lg`} 
                          style={{ height: height }}
                        ></div>
                        <span className="absolute -top-6 text-xs font-bold text-book-900">{item.val}</span>
                      </div>
                      <span className="mt-4 text-xs font-medium text-book-500">{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-book-900 text-white p-8 rounded-3xl border border-book-800 shadow-xl flex items-center justify-between">
              <div>
                <h3 className="text-book-400 uppercase text-xs font-bold tracking-widest mb-1">Total Marketplace Value</h3>
                <p className="text-4xl font-serif font-bold text-white">${metrics.totalSalesValue.toFixed(2)}</p>
              </div>
              <DollarSign size={48} className="text-book-700 opacity-50" />
            </div>
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="space-y-6">
            <div className="flex gap-4 mb-4">
              <button onClick={() => setFilterType('ALL')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filterType === 'ALL' ? 'bg-book-800 text-white' : 'bg-white text-book-600 border border-book-100'}`}>All</button>
              <button onClick={() => setFilterType(RequestType.SELL)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filterType === RequestType.SELL ? 'bg-book-800 text-white' : 'bg-white text-book-600 border border-book-100'}`}>Sell</button>
              <button onClick={() => setFilterType(RequestType.DONATE)} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${filterType === RequestType.DONATE ? 'bg-book-800 text-white' : 'bg-white text-book-600 border border-book-100'}`}>Donations</button>
            </div>

            <div className="bg-white rounded-3xl border border-book-100 shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-book-50 text-book-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Requester</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-book-50">
                  {filteredRequests.map(req => (
                    <tr key={req.id} className="hover:bg-book-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-book-900">{req.userName}</div>
                        <div className="text-xs text-book-500">{new Date(req.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-book-700 font-medium">
                          {req.books[0].name} {req.books.length > 1 ? `(+${req.books.length - 1} more)` : ''}
                        </div>
                        <div className="text-xs text-book-400 italic truncate max-w-xs">{req.books[0].author}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${req.type === RequestType.SELL ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                          {req.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          req.status === RequestStatus.PENDING ? 'bg-yellow-50 text-yellow-600' : 
                          req.status === RequestStatus.ACCEPTED ? 'bg-blue-50 text-blue-600' : 
                          req.status === RequestStatus.COMPLETED ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {req.status === RequestStatus.PENDING && (
                            <>
                              <button onClick={() => handleUpdateStatus(req.id, RequestStatus.ACCEPTED, new Date().toISOString())} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg" title="Accept"><CheckCircle size={18} /></button>
                              <button onClick={() => handleUpdateStatus(req.id, RequestStatus.REJECTED)} className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg" title="Reject"><XCircle size={18} /></button>
                            </>
                          )}
                          {req.status === RequestStatus.ACCEPTED && (
                            <button onClick={() => finalizeListing(req.id)} className="px-3 py-1 bg-green-900 text-white text-xs rounded-lg hover:bg-green-800 font-bold">Finalize & List</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-book-100 shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-book-50 text-book-500 text-xs uppercase tracking-wider font-bold">
                    <th className="px-6 py-4">Book</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Visibility</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-book-50">
                  {filteredInventory.map(l => (
                    <tr key={l.id} className="hover:bg-book-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={l.images[0]} className="w-8 h-10 object-cover rounded shadow-sm" alt="" />
                          <span className="font-bold text-book-900 text-sm truncate max-w-xs">{l.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-book-600">{l.author}</td>
                      <td className="px-6 py-4 text-sm font-bold text-book-900">${l.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.isAvailable ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {l.isAvailable ? 'AVAILABLE' : 'HIDDEN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => toggleListingAvailability(l.id)}
                          className={`p-2 rounded-xl transition-all ${l.isAvailable ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                          title={l.isAvailable ? 'Hide from Marketplace' : 'List on Marketplace'}
                        >
                          {l.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
           <div className="bg-white rounded-3xl border border-book-100 shadow-sm overflow-hidden">
             <table className="w-full text-left">
               <thead>
                 <tr className="bg-book-50 text-book-500 text-xs uppercase tracking-wider font-bold">
                   <th className="px-6 py-4">Order ID</th>
                   <th className="px-6 py-4">Customer</th>
                   <th className="px-6 py-4">Items</th>
                   <th className="px-6 py-4">Total</th>
                   <th className="px-6 py-4">Status</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-book-50">
                 {orders.map(o => (
                   <tr key={o.id} className="hover:bg-book-50 transition-colors">
                     <td className="px-6 py-4 text-xs font-mono">#{o.id.substr(0,8)}</td>
                     <td className="px-6 py-4 text-sm font-bold">{o.userName}</td>
                     <td className="px-6 py-4 text-sm text-book-600">{o.items.length} books</td>
                     <td className="px-6 py-4 text-sm font-bold">${o.totalPrice.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <select 
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as OrderStatus)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-full border-none focus:ring-2 focus:ring-book-200 cursor-pointer appearance-none ${
                          o.status === OrderStatus.DELIVERED ? 'bg-green-50 text-green-600' : 
                          o.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status}>{status.replace(/_/g, ' ')}</option>
                        ))}
                      </select>
                    </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
