
import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Book, Truck, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

interface FAQProps {
  navigate: (path: string) => void;
}

const FAQ: React.FC<FAQProps> = ({ navigate }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqData = [
    {
      category: "Selling & Donating",
      icon: <Book className="text-blue-500" />,
      questions: [
        { q: "How do I sell my books?", a: "Simply navigate to the 'Sell Books' page, fill out the form with your book's details, and upload clear photos. Once submitted, our team will review the request within 24-48 hours." },
        { q: "What condition do my books need to be in?", a: "We accept books in 'New', 'Like New', and 'Used' conditions. We generally do not accept books with missing pages, heavy water damage, or excessive marking." },
        { q: "Can I donate books instead of selling them?", a: "Absolutely! Choose the 'Donate' option on the Sell/Donate page. Donated books help us provide low-cost literature to schools and community centers." }
      ]
    },
    {
      category: "Shipping & Delivery",
      icon: <Truck className="text-orange-500" />,
      questions: [
        { q: "How much does shipping cost?", a: "We offer flat-rate shipping of ₹50 on all orders within India. Orders over ₹500 ship for free!" },
        { q: "When will I receive my order?", a: "Orders are typically processed within 1-2 business days. Shipping usually takes an additional 3-5 business days." },
        { q: "Do you ship internationally?", a: "Currently, we only ship within the United States, but we're working hard to bring Bound to Books to international readers soon." }
      ]
    },
    {
      category: "Safety & Security",
      icon: <ShieldCheck className="text-green-500" />,
      questions: [
        { q: "Is my payment information secure?", a: "Yes, we use industry-standard encryption and secure payment gateways to ensure your data is always protected." },
        { q: "What is your return policy?", a: "We offer a 14-day 'No Questions Asked' return policy if the book condition does not match the description on our marketplace." }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="font-serif text-5xl font-bold text-book-900 mb-4 flex items-center justify-center gap-4">
          <HelpCircle size={48} className="text-vintage-accent" />
          Common Questions
        </h1>
        <p className="text-book-500 max-w-lg mx-auto">
          Everything you need to know about buying, selling, and donating on Bound to Books.
        </p>
      </div>

      <div className="space-y-12">
        {faqData.map((section, idx) => (
          <div key={idx} className="space-y-6">
            <div className="flex items-center gap-3 px-4">
              <div className="p-2 bg-book-50 rounded-xl">{section.icon}</div>
              <h2 className="text-xl font-bold text-book-900">{section.category}</h2>
            </div>
            
            <div className="grid gap-4">
              {section.questions.map((item, qIdx) => {
                const uniqueIdx = idx * 10 + qIdx;
                const isOpen = openIndex === uniqueIdx;

                return (
                  <div 
                    key={qIdx} 
                    className={`bg-white border rounded-[24px] overflow-hidden transition-all duration-300 ${isOpen ? 'border-book-200 shadow-xl shadow-book-900/5' : 'border-book-50 hover:border-book-100 hover:shadow-lg'}`}
                  >
                    <button 
                      onClick={() => setOpenIndex(isOpen ? null : uniqueIdx)}
                      className="w-full p-6 text-left flex justify-between items-center group"
                    >
                      <span className={`font-bold transition-colors ${isOpen ? 'text-book-900' : 'text-book-600 group-hover:text-book-900'}`}>
                        {item.q}
                      </span>
                      <ChevronDown 
                        size={20} 
                        className={`text-book-300 transition-transform duration-500 ${isOpen ? 'rotate-180 text-vintage-accent' : ''}`} 
                      />
                    </button>
                    <div 
                      className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}
                    >
                      <div className="px-6 pb-6 text-book-500 leading-relaxed text-sm">
                        {item.a}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Support CTA */}
      <div className="mt-24 p-12 bg-book-900 rounded-[40px] text-white text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-full bg-vintage-accent/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          <div className="inline-block p-4 bg-white/10 rounded-2xl mb-2">
            <Mail size={32} className="opacity-80" />
          </div>
          <h2 className="font-serif text-3xl font-bold">Still have questions?</h2>
          <p className="text-book-300 text-sm">We are here to help! Our support team is available Monday through Friday, 9:00 AM - 6:00 PM EST.</p>
          <div className="pt-4">
            <Button variant="secondary" size="lg" onClick={() => navigate('/contact')}>
              Contact Support <ArrowRight size={18} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
