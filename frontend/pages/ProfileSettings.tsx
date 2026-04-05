
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Camera, ShieldCheck, CheckCircle, ArrowRight, Settings, Info } from 'lucide-react';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

interface ProfileSettingsProps {
  navigate: (path: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ navigate }) => {
  const { user, updateProfile } = useAppContext();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    bio: user?.bio || '',
    profileImage: user?.profileImage || 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=400'
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      updateProfile(formData);
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16 px-4">
        <div className="space-y-4">
          <Badge variant="primary">Account Settings</Badge>
          <h1 className="font-serif text-5xl font-bold text-book-900">Personal Information</h1>
          <p className="text-xl text-book-500 font-light max-w-xl">
            Manage your profile, shipping details, and account preferences.
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
           Back to Profile <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>

      <div className="bg-white rounded-[48px] border border-book-100 shadow-2xl shadow-book-900/5 overflow-hidden">
        <div className="p-12 border-b border-book-50 flex flex-col md:flex-row items-center gap-12 bg-book-50/20">
          <div className="relative group">
            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-4 border-white shadow-xl">
              <img 
                src={formData.profileImage} 
                alt={formData.name}
                className="w-full h-full object-cover transition-all"
              />
            </div>
            <button 
              type="button"
              onClick={() => {
                const url = window.prompt('Enter Profile Image URL:', formData.profileImage);
                if (url) setFormData(prev => ({ ...prev, profileImage: url }));
              }}
              className="absolute -bottom-2 -right-2 p-3 bg-book-900 text-white rounded-2xl hover:bg-book-800 transition-all shadow-xl shadow-book-900/20"
            >
              <Camera size={20} />
            </button>
          </div>
          <div className="flex-grow space-y-2 text-center md:text-left">
            <h2 className="text-2xl font-bold text-book-900">{formData.name}</h2>
            <p className="text-book-500">{formData.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <Badge variant="success">Verified Member</Badge>
              <Badge variant="outline">Joined 2024</Badge>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                <User size={14} className="text-book-400" /> Full Name
              </label>
              <input 
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                <Mail size={14} className="text-book-400" /> Email Address
              </label>
              <input 
                readOnly
                type="email" 
                value={formData.email}
                className="w-full bg-book-50/50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-none outline-none transition-all opacity-70 cursor-not-allowed" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                <Phone size={14} className="text-book-400" /> Phone Number
              </label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                <MapPin size={14} className="text-book-400" /> Primary Address
              </label>
              <input 
                type="text" 
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all" 
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
              <Info size={14} className="text-book-400" /> Short Bio
            </label>
            <textarea 
              rows={4} 
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us a little bit about yourself..."
              className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all resize-none" 
            ></textarea>
          </div>

          <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 text-book-400 text-sm italic">
              <ShieldCheck size={18} />
              Your data is secured with AES-256 encryption.
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              {showSuccess && (
                <span className="flex items-center gap-2 text-green-500 font-bold text-sm animate-in fade-in slide-in-from-right-4">
                  <CheckCircle size={20} />
                  Changes Saved!
                </span>
              )}
              <Button 
                type="submit" 
                loading={isSaving} 
                className="flex-grow md:flex-none py-4 px-10"
              >
                Update Profile
              </Button>
            </div>
          </div>
        </form>
      </div>
      
      <div className="mt-12 p-8 rounded-[32px] bg-red-50/50 border border-red-100 flex items-center justify-between gap-6">
        <div className="space-y-1">
          <h4 className="font-bold text-red-900">Danger Zone</h4>
          <p className="text-sm text-red-600 opacity-80">Deleting your account is permanent. Please be certain.</p>
        </div>
        <Button variant="danger" size="sm">Deactivate Account</Button>
      </div>
    </div>
  );
};

export default ProfileSettings;
