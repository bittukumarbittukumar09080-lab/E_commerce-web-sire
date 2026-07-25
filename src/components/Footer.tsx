import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { HOTLINE_NUMBER } from '../data/mockData';
import { PhoneCall, Mail, MapPin, Headphones, ShieldCheck, Truck, RefreshCw, Award, CheckCircle2, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveTab, setSelectedCategoryFilter } = useShop();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribed(true);
  };

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategoryFilter(categoryName);
    setActiveTab('Shop');
  };

  return (
    <footer className="bg-zinc-950 text-zinc-300 pt-16 pb-8 border-t border-zinc-800">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center shrink-0">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Free Shipping</h4>
            <p className="text-zinc-400 text-xs">On orders above ₹1,499 across India</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center shrink-0">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">15-Day Easy Returns</h4>
            <p className="text-zinc-400 text-xs">Hassle-free exchange & doorstep pickup</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">100% Authentic</h4>
            <p className="text-zinc-400 text-xs">Handcrafted British tailored designs</p>
          </div>
        </div>

        <div className="flex items-center gap-3 justify-center md:justify-start">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-full flex items-center justify-center shrink-0">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Toll-Free Support</h4>
            <p className="text-amber-400 text-xs font-semibold">📞 {HOTLINE_NUMBER}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12">
        {/* Column 1: Brand & Hotline Info */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500 text-zinc-950 rounded-sm flex items-center justify-center font-serif font-bold text-xl">
              LS
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-widest text-white block">
                LONDON STYLE
              </span>
              <span className="text-[10px] tracking-widest text-amber-400 font-semibold uppercase">
                Dress Smart. Live in Style.
              </span>
            </div>
          </div>

          <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
            London Style brings timeless British tailoring, sharp silhouettes, and contemporary menswear directly to your doorstep. Crafted for discerning gentlemen.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl space-y-2 max-w-sm">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <PhoneCall className="w-4 h-4" />
              <span>Customer Care & Complaints Hotline</span>
            </div>
            <div className="text-xl font-black text-white font-mono tracking-wider">
              {HOTLINE_NUMBER}
            </div>
            <p className="text-[11px] text-zinc-400">
              Operational 24/7 for order tracking, complaints, and bulk purchase quotes.
            </p>
          </div>
        </div>

        {/* Column 2: Categories */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">
            Categories
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            {['Shirts', 'T-Shirts', 'Jeans', 'Trousers', 'Blazers', 'Jackets', 'Shoes', 'Watches', 'Perfumes'].map(cat => (
              <li key={cat}>
                <button 
                  onClick={() => handleCategoryClick(cat)}
                  className="hover:text-amber-400 transition-colors"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Links */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-zinc-800 pb-2">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <button 
                type="button"
                onClick={() => { setSelectedCategoryFilter('All'); setActiveTab('Home'); window.scrollTo(0, 0); }} 
                className="hover:text-amber-400 transition-colors text-left w-full cursor-pointer"
              >
                Home Page
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setSelectedCategoryFilter('All'); setActiveTab('Shop'); window.scrollTo(0, 0); }} 
                className="hover:text-amber-400 transition-colors text-left w-full cursor-pointer"
              >
                Shop All Products
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setActiveTab('Offers'); window.scrollTo(0, 0); }} 
                className="hover:text-amber-400 transition-colors text-left w-full cursor-pointer"
              >
                Offers & Promo Codes
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setActiveTab('BulkPurchase'); window.scrollTo(0, 0); }} 
                className="hover:text-amber-400 transition-colors text-left w-full cursor-pointer"
              >
                Bulk & Wholesale Enquiries
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setActiveTab('Orders'); window.scrollTo(0, 0); }} 
                className="hover:text-amber-400 transition-colors text-left w-full cursor-pointer"
              >
                Order Tracking & Customer Dashboard
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setActiveTab('About'); window.scrollTo(0, 0); }} 
                className="hover:text-amber-400 transition-colors text-left w-full cursor-pointer"
              >
                About London Style
              </button>
            </li>
            <li>
              <button 
                type="button"
                onClick={() => { setActiveTab('Contact'); window.scrollTo(0, 0); }} 
                className="hover:text-amber-400 transition-colors text-left w-full cursor-pointer"
              >
                Contact Us & Support
              </button>
            </li>
            <li className="pt-1 border-t border-zinc-900">
              <button 
                type="button"
                onClick={() => { setActiveTab('Admin'); window.scrollTo(0, 0); }} 
                className="text-amber-400 font-semibold hover:text-amber-300 transition-colors text-left w-full cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Panel</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div className="space-y-3">
          <h4 className="text-white text-xs font-bold uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Gentlemen's Club</span>
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Subscribe to receive exclusive access to new arrivals, seasonal sales, and private styling previews.
          </p>

          {isSubscribed ? (
            <div className="bg-emerald-950/80 border border-emerald-600/50 p-3.5 rounded-xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Welcome to the Club!</span>
              </div>
              <p className="text-emerald-200 text-[11px]">
                Subscription confirmed for <strong className="text-white font-mono">{newsletterEmail}</strong>.
              </p>
              <div className="bg-zinc-950 p-2 rounded-lg border border-emerald-800/40 text-[10px] text-amber-400 font-mono font-bold text-center">
                🎁 10% OFF Code: <span className="text-white underline">LONDONCLUB10</span>
              </div>
              <button
                type="button"
                onClick={() => { setIsSubscribed(false); setNewsletterEmail(''); }}
                className="text-[10px] text-zinc-400 hover:text-white underline block text-center w-full pt-1"
              >
                Subscribe another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-hidden focus:border-amber-500"
              />
              <button 
                type="submit" 
                className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold py-2 rounded-lg transition-colors uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10 cursor-pointer"
              >
                <span>Subscribe Now</span>
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-zinc-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
        <div>
          © 2026 London Style Men's Fashion Pvt Ltd. All rights reserved. Registered Helpline: {HOTLINE_NUMBER}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-zinc-400 font-medium">Secured Payments:</span>
          <span className="bg-zinc-900 px-2.5 py-1 rounded-xs border border-zinc-800 text-[10px] text-zinc-300 font-mono">Razorpay</span>
          <span className="bg-zinc-900 px-2.5 py-1 rounded-xs border border-zinc-800 text-[10px] text-zinc-300 font-mono">UPI / GPay</span>
          <span className="bg-zinc-900 px-2.5 py-1 rounded-xs border border-zinc-800 text-[10px] text-zinc-300 font-mono">Visa / MC</span>
          <span className="bg-zinc-900 px-2.5 py-1 rounded-xs border border-zinc-800 text-[10px] text-zinc-300 font-mono">COD</span>
        </div>
      </div>
    </footer>
  );
};
