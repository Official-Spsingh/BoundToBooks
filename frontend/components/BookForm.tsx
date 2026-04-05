
import React, { useState } from 'react';
import { Camera, Plus, Trash2, BookIcon } from 'lucide-react';
import { BookCondition, RequestType } from '../types';
import { BOOK_CATEGORIES } from '../constants';

interface BookFormProps {
  mode: RequestType | 'ADMIN';
  index?: number;
  initialData?: any;
  onChange?: (data: any) => void;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  onRemove?: () => void;
  showSubmitButton?: boolean;
  submitLabel?: string;
}

const BookForm: React.FC<BookFormProps> = ({ 
  mode, 
  index, 
  initialData = {}, 
  onChange,
  onSubmit, 
  onCancel, 
  onRemove,
  showSubmitButton = true,
  submitLabel
}) => {
  const [formData, setFormData] = useState({
    title: (initialData as any).title || (initialData as any).name || '',
    author: (initialData as any).author || '',
    category: (initialData as any).category || BOOK_CATEGORIES[0],
    condition: (initialData as any).condition || BookCondition.USED,
    price: (initialData as any).price || (initialData as any).expectedPrice || 0,
    description: (initialData as any).description || '',
    image: ((initialData as any).images?.[0]) || (initialData as any).image || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const finalValue = name === 'price' ? parseFloat(value) : value;
    const newData = { ...formData, [name]: finalValue };
    setFormData(newData);
    if (onChange) {
      onChange(newData);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-book-100 shadow-sm relative group">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-serif text-xl font-bold text-book-800 flex items-center gap-2">
          {index !== undefined && (
            <span className="bg-book-50 text-book-700 w-8 h-8 rounded-full flex items-center justify-center text-sm">{index + 1}</span>
          )}
          <BookIcon size={20} className="text-book-400" />
          {mode === 'ADMIN' ? 'Inventory Details' : 'Book Details'}
        </h3>
        {onRemove && (
          <button 
            type="button" 
            onClick={onRemove}
            className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-book-500 uppercase tracking-wider">Book Title</label>
            <input 
              name="title" required type="text" 
              value={formData.title} onChange={handleChange}
              className="w-full bg-book-50 border border-book-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-book-700/20 text-book-900 focus:outline-none" 
              placeholder="e.g. The Hobbit" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-book-500 uppercase tracking-wider">Author</label>
            <input 
              name="author" required type="text" 
              value={formData.author} onChange={handleChange}
              className="w-full bg-book-50 border border-book-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-book-700/20 text-book-900 focus:outline-none" 
              placeholder="e.g. J.R.R. Tolkien" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-book-500 uppercase tracking-wider">Category</label>
            <select 
              name="category" required 
              value={formData.category} onChange={handleChange}
              className="w-full bg-book-50 border border-book-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-book-700/20 text-book-900 appearance-none focus:outline-none cursor-pointer"
            >
              {BOOK_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-book-500 uppercase tracking-wider">Condition</label>
            <select 
              name="condition" required 
              value={formData.condition} onChange={handleChange}
              className="w-full bg-book-50 border border-book-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-book-700/20 text-book-900 appearance-none focus:outline-none cursor-pointer"
            >
              {Object.values(BookCondition).map(cond => <option key={cond} value={cond}>{cond}</option>)}
            </select>
          </div>

          {mode !== RequestType.DONATE && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-book-500 uppercase tracking-wider">
                {mode === 'ADMIN' ? 'Final Selling Price (₹)' : 'Expected Price (₹)'}
              </label>
              <input 
                name="price" required type="number" step="0.01" min="0" 
                value={formData.price} onChange={handleChange}
                className="w-full bg-book-50 border border-book-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-book-700/20 text-book-900 focus:outline-none" 
                placeholder="0.00" 
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-book-500 uppercase tracking-wider">
              {mode === 'ADMIN' ? 'Image URL' : 'Cover Image'}
            </label>
            {mode === 'ADMIN' ? (
              <input 
                name="image" type="text" 
                value={formData.image} onChange={handleChange}
                className="w-full bg-book-50 border border-book-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-book-700/20 text-book-900 focus:outline-none" 
                placeholder="Optional: https://..." 
              />
            ) : (
              <div className="flex flex-wrap gap-4 pt-1">
                <div className="w-20 h-28 border-2 border-dashed border-book-200 rounded-xl flex flex-col items-center justify-center text-book-400 bg-book-50">
                  <Camera size={20} />
                  <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Capture</span>
                </div>
                <div className="w-20 h-28 border-2 border-dashed border-book-200 rounded-xl flex flex-col items-center justify-center text-book-400 bg-book-50">
                  <Plus size={20} />
                  <span className="text-[9px] mt-1 font-bold uppercase tracking-tighter">Add</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-book-500 uppercase tracking-wider">Description</label>
          <textarea 
            name="description" required rows={3} 
            value={formData.description} onChange={handleChange}
            className="w-full bg-book-50 border border-book-100 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-book-700/20 text-book-900 h-24 focus:outline-none" 
            placeholder="Tell us more about the condition or importance of this book..."
          ></textarea>
        </div>

        {showSubmitButton && (
          <div className="pt-4 flex gap-4">
            {onCancel && (
              <button 
                type="button" 
                onClick={onCancel} 
                className="flex-1 px-6 py-3 border border-book-100 rounded-xl text-sm font-bold text-book-600 hover:bg-book-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="flex-1 px-6 py-3 bg-book-900 text-white rounded-xl text-sm font-bold hover:bg-book-800 transition-all shadow-lg shadow-book-900/20"
            >
              {submitLabel || (mode === 'ADMIN' ? 'Add to Inventory' : 'Confirm Book Details')}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default BookForm;
