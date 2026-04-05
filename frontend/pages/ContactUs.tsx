
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, User, AtSign, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';

interface ContactUsProps {
  navigate: (path: string) => void;
}

const ContactUs: React.FC<ContactUsProps> = ({ navigate }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setTimeout(() => {
      setStatus('sent');
    }, 1500);
  };

  if (status === 'sent') {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-green-50 rounded-full text-green-500 mb-4">
          <CheckCircle size={48} />
        </div>
        <h1 className="font-serif text-4xl font-bold text-book-900">Message Sent!</h1>
        <p className="text-book-500 leading-relaxed">
          Thank you for reaching out to Bound to Books. Our team has received your message and will get back to you within 24 hours.
        </p>
        <div className="pt-8">
          <Button variant="outline" size="lg" onClick={() => navigate('/')}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
        {/* Info Side */}
        <div className="space-y-12">
          <div className="space-y-6">
            <h1 className="font-serif text-5xl md:text-6xl font-bold text-book-900 leading-tight">
              Let's Start a Conversation.
            </h1>
            <p className="text-xl text-book-500 font-light leading-relaxed">
              Have a question, feedback, or just want to talk about your favorite book? We'd love to hear from you.
            </p>
          </div>

          <div className="space-y-8">
            {[
              { icon: <Mail size={24} className="text-blue-500" />, label: 'Email Us', val: 'support@boundtobooks.com' },
              { icon: <Phone size={24} className="text-orange-500" />, label: 'Call Us', val: '+1 (555) 000-0000' },
              { icon: <MapPin size={24} className="text-green-500" />, label: 'Visit Us', val: '123 Bookworm Lane, NY 10001' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-6 group cursor-default">
                <div className="p-4 bg-book-50 rounded-2xl group-hover:bg-book-900 group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-book-400 uppercase tracking-widest mb-1">{item.label}</div>
                  <div className="text-lg font-bold text-book-900">{item.val}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-book-50 rounded-[40px] border border-book-100 flex items-center justify-between gap-6 overflow-hidden relative">
            <div className="absolute -right-8 top-0 text-book-100 opacity-50 rotate-12">
              <MessageSquare size={120} />
            </div>
            <div className="relative z-10">
              <h4 className="font-bold text-book-900 mb-1">Live Support</h4>
              <p className="text-sm text-book-500">Available 9am to 6pm EST</p>
            </div>
            <Button variant="secondary" className="relative z-10">Chat Now</Button>
          </div>
        </div>

        {/* Form Side */}
        <div className="bg-white p-12 rounded-[48px] border border-book-100 shadow-2xl shadow-book-900/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-vintage-accent to-green-500"></div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                  <User size={14} className="text-book-400" /> Full Name
                </label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all placeholder:text-book-300" 
                  placeholder="Jane Doe" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                  <AtSign size={14} className="text-book-400" /> Email Address
                </label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all placeholder:text-book-300" 
                  placeholder="jane@example.com" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                <Send size={14} className="text-book-400" /> Subject
              </label>
              <input 
                required
                type="text" 
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all placeholder:text-book-300" 
                placeholder="I have a question about..." 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-book-500 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare size={14} className="text-book-400" /> Your Message
              </label>
              <textarea 
                required
                rows={6} 
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-book-50 border-none rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-book-200 outline-none transition-all placeholder:text-book-300 resize-none" 
                placeholder="How can we help you?"
              ></textarea>
            </div>
            <Button 
              type="submit" 
              loading={status === 'sending'} 
              className="w-full py-5 text-base"
            >
              Send Message <Send size={20} className="ml-2" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
