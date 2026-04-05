import React from 'react';
import { Heart, Globe, Shield, Zap, ArrowRight, BookOpen, Truck, LifeBuoy, Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAppContext } from '../context/AppContext';

interface AboutUsProps {
  navigate: (path: string) => void;
}

const AboutUs: React.FC<AboutUsProps> = ({ navigate }) => {
  const { user } = useAppContext();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-book-900">
          <img 
            src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-30 scale-110"
            alt="Library"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-white text-center">
          <h1 className="font-serif text-6xl md:text-8xl font-bold mb-6 animate-in slide-in-from-bottom duration-700">More Than Just a Bookshelf.</h1>
          <p className="text-xl md:text-2xl text-book-100 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
            We are building a sustainable home for every story ever written. Join us in recirculating the magic of books.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="secondary" size="lg" onClick={() => navigate('/')}>
              Explore the Marketplace <ArrowRight className="ml-2" size={20} />
            </Button>
            {!user && (
              <Button variant="outline" size="lg" className="text-white border-white/30 hover:bg-white/10" onClick={() => navigate('/register')}>
                Join the Movement
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-book-50/50 text-center md:text-left">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block px-4 py-1.5 bg-vintage-accent/10 text-vintage-accent rounded-full text-xs font-bold uppercase tracking-widest">
                Our Mission
              </div>
              <h2 className="font-serif text-4xl md:text-5xl font-bold text-book-900 leading-tight">
                Reading should be accessible, sustainable, and communal.
              </h2>
              <p className="text-lg text-book-600 leading-relaxed font-light">
                Founded in 2024, Bound to Books was born from a simple observation: millions of incredible books sit unread on shelves, while many readers struggle to find their next favorite story at an affordable price.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-book-50">
                  <div className="text-4xl font-bold text-book-900 mb-1">50k+</div>
                  <div className="text-[10px] text-book-400 uppercase tracking-widest font-black">Books Saved</div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-book-50">
                  <div className="text-4xl font-bold text-book-900 mb-1">12k+</div>
                  <div className="text-[10px] text-book-400 uppercase tracking-widest font-black">Mindful Readers</div>
                </div>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute inset-0 bg-book-900 rounded-[48px] rotate-3 scale-95 opacity-10 group-hover:rotate-6 transition-transform"></div>
              <img 
                src="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&q=80&w=1000" 
                className="rounded-[48px] shadow-2xl relative z-10 w-full aspect-square object-cover"
                alt="Books"
              />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-vintage-accent rounded-full -z-0 opacity-20 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="font-serif text-5xl font-bold text-book-900 mb-6">Values That Drive Us</h2>
            <p className="text-book-500 text-lg font-light leading-relaxed">We are committed to building a platform that honors both the reader and the story.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <Globe className="text-blue-500" />, title: "Sustainability", desc: "By reusing books, we significantly reduce the carbon footprint of the publishing industry and protect our forests." },
              { icon: <Heart className="text-red-500" />, title: "Community", desc: "We connect readers through shared stories, creating a global neighborhood of book lovers and local nodes." },
              { icon: <Shield className="text-green-500" />, title: "Quality", desc: "Every book donated or sold is hand-checked for quality, ensuring a premium reading experience every time." },
            ].map((v, i) => (
              <div key={i} className="p-12 rounded-[40px] bg-white border border-book-50 hover:border-book-100 hover:shadow-2xl transition-all group relative overflow-hidden">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-book-50 rounded-full opacity-50 group-hover:scale-150 transition-transform"></div>
                <div className="w-20 h-20 bg-book-50 rounded-3xl flex items-center justify-center mb-8 group-hover:rotate-6 transition-all shadow-sm">
                  {v.icon}
                </div>
                <h3 className="text-2xl font-bold text-book-900 mb-4">{v.title}</h3>
                <p className="text-book-600 leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-book-900 text-white overflow-hidden relative mx-4 md:mx-12 mb-12 rounded-[48px]">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-vintage-accent/10 skew-x-12 pointer-events-none"></div>
        <div className="container mx-auto px-12 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="font-serif text-4xl md:text-6xl font-bold mb-6">Ready to start your next chapter?</h2>
            <p className="text-book-300 text-xl font-light">Join us today and be part of the most mindful reading community on the planet.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {user ? (
              <Button variant="secondary" size="lg" onClick={() => navigate('/dashboard')} className="w-full sm:w-auto">
                Go to Dashboard <ArrowRight className="ml-2" size={20} />
              </Button>
            ) : (
              <Button variant="secondary" size="lg" onClick={() => navigate('/register')} className="w-full sm:w-auto">
                Join the Community
              </Button>
            )}
            <Button variant="outline" className="text-white border-white/20 hover:bg-white/10 w-full sm:w-auto" onClick={() => navigate('/')}>
              Browse Marketplace
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
