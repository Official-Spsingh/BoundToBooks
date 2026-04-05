
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Plus, Trash2, AlertTriangle } from 'lucide-react';
import { RequestType, BookCondition, BookItem, RequestStatus, UserRole } from '../types';
import BookForm from '../components/BookForm';

interface SellDonateProps {
  navigate: (path: string) => void;
}

const SellDonate: React.FC<SellDonateProps> = ({ navigate }) => {
  const { user, setRequests } = useAppContext();
  const [requestType, setRequestType] = useState<RequestType>(RequestType.SELL);
  const [books, setBooks] = useState<Partial<BookItem>[]>([{
    id: '1',
    name: '',
    author: '',
    condition: BookCondition.USED,
    description: '',
    expectedPrice: 0,
    images: []
  }]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === UserRole.ADMIN) {
      // Admins are not allowed to sell or donate
    }
  }, [user]);

  if (user?.role === UserRole.ADMIN) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <div className="bg-red-50 p-12 rounded-3xl border border-red-100 shadow-xl flex flex-col items-center">
          <div className="bg-red-100 p-6 rounded-full text-red-600 mb-8">
            <AlertTriangle size={64} />
          </div>
          <h1 className="font-serif text-4xl font-bold text-book-900 mb-4">Access Restricted</h1>
          <p className="text-book-500 mb-8 max-w-md">
            As an administrator, you cannot participate in selling or donating books. Please use the Admin Dashboard to manage user requests and inventory.
          </p>
          <button 
            onClick={() => navigate('/admin')}
            className="px-8 py-3 bg-book-900 text-white rounded-full font-bold hover:bg-book-800 transition-all shadow-lg"
          >
            Go to Admin Dashboard
          </button>
        </div>
      </div>
    );
  }

  const addBookField = () => {
    setBooks([...books, {
      id: Math.random().toString(36).substr(2, 9),
      name: '',
      author: '',
      condition: BookCondition.USED,
      description: '',
      expectedPrice: 0,
      images: []
    }]);
  };

  const removeBookField = (id: string) => {
    if (books.length === 1) return;
    setBooks(books.filter(b => b.id !== id));
  };

  const updateBook = (id: string, data: any) => {
    setBooks(books.map(b => b.id === id ? { 
      ...b, 
      ...data,
      name: data.title,
      expectedPrice: data.price 
    } : b));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    
    setSubmitting(true);
    setTimeout(() => {
      const newRequest = {
        id: Math.random().toString(36).substr(2, 9),
        userId: user.id,
        userName: user.name,
        type: requestType,
        books: books.map(b => ({
          ...b,
          images: b.images?.length ? b.images : [`https://picsum.photos/seed/${Math.random()}/400/600`]
        })) as BookItem[],
        status: RequestStatus.PENDING,
        createdAt: new Date().toISOString()
      };

      setRequests(prev => [newRequest, ...prev]);
      setSubmitting(false);
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="font-serif text-4xl font-bold text-book-900 mb-4">Pass on the Story</h1>
        <p className="text-book-500 text-lg">Whether you're selling or donating, we ensure your books find a loving new owner.</p>
      </div>

      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setRequestType(RequestType.SELL)}
          className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
            requestType === RequestType.SELL 
            ? 'border-book-800 bg-book-800 text-white shadow-lg' 
            : 'border-book-100 bg-white text-book-700 hover:border-book-300'
          }`}
        >
          <span className="font-bold text-lg">Sell Books</span>
          <span className={`text-xs ${requestType === RequestType.SELL ? 'text-book-300' : 'text-book-400'}`}>Earn money for your collection</span>
        </button>
        <button 
          onClick={() => setRequestType(RequestType.DONATE)}
          className={`flex-1 py-4 px-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${
            requestType === RequestType.DONATE 
            ? 'border-book-800 bg-book-800 text-white shadow-lg' 
            : 'border-book-100 bg-white text-book-700 hover:border-book-300'
          }`}
        >
          <span className="font-bold text-lg">Donate Books</span>
          <span className={`text-xs ${requestType === RequestType.DONATE ? 'text-book-300' : 'text-book-400'}`}>Give back to the community</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {books.map((book, index) => (
          <BookForm
            key={book.id}
            mode={requestType}
            index={index}
            initialData={book}
            onChange={(data) => updateBook(book.id!, data)}
            onRemove={books.length > 1 ? () => removeBookField(book.id!) : undefined}
            showSubmitButton={false}
          />
        ))}

        <button type="button" onClick={addBookField} className="w-full py-4 border-2 border-dashed border-book-200 rounded-3xl text-book-500 hover:text-book-800 transition-all font-bold flex items-center justify-center gap-2">
          <Plus size={20} /> Add Another Book
        </button>

        <button type="submit" disabled={submitting} className="w-full py-5 bg-book-900 text-white rounded-3xl font-bold text-lg hover:bg-book-800 transition-all shadow-xl disabled:opacity-50">
          {submitting ? 'Submitting...' : `Submit ${requestType === RequestType.SELL ? 'Selling' : 'Donation'} Request`}
        </button>
      </form>
    </div>
  );
};

export default SellDonate;
