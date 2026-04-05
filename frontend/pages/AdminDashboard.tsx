import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { 
  X, Eye, EyeOff, Book, BookOpen, DollarSign, Package, CheckCircle, TrendingUp, XCircle, Settings, Users, BarChart3, ChevronRight, PlayCircle, Plus, ClipboardList, Search, ExternalLink, LayoutDashboard, User
} from 'lucide-react';
import { RequestStatus, RequestType, BookListing, OrderStatus, BookCondition, Order, BookRequest, User as UserType, UserRole } from '../types';
import BookForm from '../components/BookForm';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

interface AdminDashboardProps {
  navigate: (path: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ navigate }) => {
  const { 
    requests, setRequests, listings, setListings, orders, addListing, 
    updateOrderStatus, updateListing, deleteListing, allUsers,
    updateRequestStatus, toggleListingAvailability 
  } = useAppContext();
  const [activeTab, setActiveTab] = useState<'requests' | 'inventory' | 'orders' | 'analytics' | 'users'>('analytics');
  const [filterType, setFilterType] = useState<'ALL' | RequestType>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<BookListing | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [viewingRequest, setViewingRequest] = useState<BookRequest | null>(null);

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

  const handleCompleteRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    const newListings = request.books.map(book => ({
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
    updateRequestStatus(requestId, RequestStatus.COMPLETED);
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
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'users' ? 'bg-white/10 text-white' : 'text-book-400 hover:text-white hover:bg-white/5'}`}
          >
            <User size={20} /> Users
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
                <p className="text-4xl font-serif font-bold text-white">₹{metrics.totalSalesValue.toFixed(2)}</p>
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
                            <button onClick={() => handleCompleteRequest(req.id)} className="p-2 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg" title="Finalize and Add to Inventory"><PlayCircle size={18} /></button>
                          )}
                          <button onClick={() => setViewingRequest(req)} className="p-2 bg-book-50 text-book-700 hover:bg-book-100 rounded-lg" title="View Details"><Eye size={18} /></button>
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
                      <td className="px-6 py-4 text-sm font-bold text-book-900">₹{l.price.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${l.isAvailable ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                          {l.isAvailable ? 'AVAILABLE' : 'HIDDEN'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => setEditingListing(l)}
                            className="p-2 text-book-700 bg-book-50 hover:bg-book-100 rounded-xl"
                            title="Edit Listing"
                          >
                            <Settings size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this listing?')) {
                                deleteListing(l.id);
                              }
                            }}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl"
                            title="Delete Listing"
                          >
                            <XCircle size={18} />
                          </button>
                          <button 
                            onClick={() => toggleListingAvailability(l.id)}
                            className={`p-2 rounded-xl transition-all ${l.isAvailable ? 'text-blue-600 bg-blue-50 hover:bg-blue-100' : 'text-gray-400 bg-gray-100 hover:bg-gray-200'}`}
                            title={l.isAvailable ? 'Hide from Marketplace' : 'List on Marketplace'}
                          >
                            {l.isAvailable ? <Eye size={18} /> : <EyeOff size={18} />}
                          </button>
                        </div>
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
                     <td className="px-6 py-4 text-sm font-bold">₹{o.totalPrice.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
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
                          <button onClick={() => setViewingOrder(o)} className="p-2 text-book-700 hover:bg-book-50 rounded-lg">
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-3xl border border-book-100 shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-book-50 text-book-500 text-xs uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Contact</th>
                  <th className="px-6 py-4">Stats</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-book-50">
                {allUsers.map(u => (
                  <tr key={u.id} className="hover:bg-book-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-book-900 flex items-center justify-center text-white font-bold">
                          {u.name[0]}
                        </div>
                        <div className="font-bold text-book-900">{u.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={u.role === UserRole.ADMIN ? 'primary' : 'secondary'}>{u.role}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-book-500">{u.email}</td>
                    <td className="px-6 py-4 text-xs font-bold text-book-400 uppercase tracking-widest">
                      {requests.filter(r => r.userId === u.id).length} Requests • {orders.filter(o => o.userId === u.id).length} Orders
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {/* Viewing Order Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-book-900/60 backdrop-blur-sm" onClick={() => setViewingOrder(null)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-book-100 flex justify-between items-center bg-book-50/30">
              <div>
                <h2 className="font-serif text-2xl font-bold text-book-900">Order Details</h2>
                <p className="text-xs text-book-400 font-bold uppercase tracking-widest mt-1">#{viewingOrder.id.substr(0, 12)}</p>
              </div>
              <button onClick={() => setViewingOrder(null)} className="p-3 hover:bg-book-100 rounded-2xl transition-all">
                <X size={20} className="text-book-400" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Customer Information</h4>
                  <div className="flex items-center gap-4 p-4 bg-book-50 rounded-2xl border border-book-100">
                    <div className="w-12 h-12 rounded-xl bg-book-900 flex items-center justify-center text-white font-bold text-lg">
                      {viewingOrder.userName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-book-900">{viewingOrder.userName}</div>
                      <Badge variant="secondary" className="mt-1">{viewingOrder.status.replace(/_/g, ' ')}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Ordered Books</h4>
                  <div className="space-y-3">
                    {viewingOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-white border border-book-100 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-14 bg-book-50 rounded-lg overflow-hidden flex-shrink-0">
                            {/* In a real app, item would have an image URL */}
                            <div className="w-full h-full flex items-center justify-center text-book-200">
                              <Book size={20} />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-book-900 text-sm">{item.title}</div>
                            <div className="text-xs text-book-400 italic">Qty: {item.quantity}</div>
                          </div>
                        </div>
                        <div className="font-bold text-book-900">₹{item.price.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 border-t border-book-100">
                  <div className="flex justify-between items-center text-lg">
                    <span className="font-medium text-book-500">Order Total</span>
                    <span className="font-serif font-bold text-book-900 text-3xl">₹{viewingOrder.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-book-50/50 border-t border-book-100 flex gap-4">
              <Button onClick={() => setViewingOrder(null)} className="w-full">Done</Button>
            </div>
          </div>
        </div>
      )}

      {/* Viewing Request Modal */}
      {viewingRequest && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-book-900/60 backdrop-blur-sm" onClick={() => setViewingRequest(null)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-3xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-book-100 flex justify-between items-center bg-book-50/30">
              <div>
                <h2 className="font-serif text-2xl font-bold text-book-900">Book Request Details</h2>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={viewingRequest.type === RequestType.SELL ? 'primary' : 'success'}>{viewingRequest.type}</Badge>
                  <span className="text-xs text-book-300 font-bold uppercase tracking-widest">•</span>
                  <Badge variant="outline">{viewingRequest.status}</Badge>
                </div>
              </div>
              <button onClick={() => setViewingRequest(null)} className="p-3 hover:bg-book-100 rounded-2xl transition-all">
                <X size={20} className="text-book-400" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Requester</h4>
                    <div className="font-bold text-book-900 text-xl">{viewingRequest.userName}</div>
                    <div className="text-sm text-book-500 mt-1">Date: {new Date(viewingRequest.createdAt).toLocaleDateString()}</div>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Book Information</h4>
                    <h3 className="font-serif text-2xl font-bold text-book-900 mb-2">{viewingRequest.books[0].name}</h3>
                    <p className="text-lg text-book-500 italic mb-6">by {viewingRequest.books[0].author}</p>
                    
                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-sm p-4 bg-book-50 rounded-2xl">
                         <span className="text-book-400 font-bold uppercase tracking-widest text-[10px]">Condition</span>
                         <span className="font-bold text-book-900">{viewingRequest.books[0].condition}</span>
                       </div>
                       <div className="p-4 bg-book-50 rounded-2xl">
                         <span className="text-book-400 font-bold uppercase tracking-widest text-[10px] block mb-2">Description</span>
                         <p className="text-sm text-book-600 italic leading-relaxed">
                           "{viewingRequest.books[0].description || 'No description provided.'}"
                         </p>
                       </div>
                    </div>
                  </div>
                </div>

                <div>
                   <h4 className="text-xs font-bold text-book-400 uppercase tracking-widest mb-4">Book Snapshot</h4>
                   <div className="aspect-[3/4] bg-book-100 rounded-3xl overflow-hidden border border-book-100 shadow-inner group">
                      {viewingRequest.books[0].images?.[0] ? (
                        <img src={viewingRequest.books[0].images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-book-200 gap-4">
                          <BookOpen size={64} />
                          <span className="text-xs font-bold uppercase tracking-widest">No Photos</span>
                        </div>
                      )}
                   </div>
                </div>
              </div>
            </div>
            <div className="p-8 bg-book-50/50 border-t border-book-100 flex gap-4">
              <Button onClick={() => setViewingRequest(null)} className="flex-grow">Close</Button>
              {viewingRequest.status === RequestStatus.PENDING && (
                <Button variant="primary" onClick={() => {
                  updateRequestStatus(viewingRequest.id, RequestStatus.ACCEPTED);
                  setViewingRequest(null);
                }}>Quick Accept</Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Editing Listing Modal */}
      {editingListing && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-book-900/60 backdrop-blur-sm" onClick={() => setEditingListing(null)}></div>
          <div className="bg-white rounded-[40px] w-full max-w-2xl relative z-10 shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 border-b border-book-100 flex justify-between items-center bg-book-50/30">
              <h2 className="font-serif text-2xl font-bold text-book-900">Edit Inventory Listing</h2>
              <button onClick={() => setEditingListing(null)} className="p-3 hover:bg-book-100 rounded-2xl transition-all">
                <X size={20} className="text-book-400" />
              </button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto">
              <BookForm
                mode="ADMIN"
                initialData={{
                  title: editingListing.title,
                  author: editingListing.author,
                  category: editingListing.category,
                  condition: editingListing.condition as any,
                  price: editingListing.price,
                  description: editingListing.description,
                  image: editingListing.images[0]
                }}
                onSubmit={(data) => {
                  updateListing({
                    ...editingListing,
                    title: data.title,
                    author: data.author,
                    category: data.category,
                    condition: data.condition,
                    price: data.price,
                    description: data.description,
                    images: [data.image || editingListing.images[0]]
                  });
                  setEditingListing(null);
                }}
                onCancel={() => setEditingListing(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
