import React from 'react';
import { HOTLINE_NUMBER } from '../data/mockData';
import { Award, ShieldCheck, PhoneCall, MapPin, Truck, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-100 text-amber-900 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Established 2026</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-black text-zinc-900 tracking-tight">
          About London Style
        </h1>
        <p className="text-amber-800 text-sm font-semibold tracking-widest uppercase">
          Dress Smart. Live in Style.
        </p>
        <p className="text-zinc-600 text-base leading-relaxed">
          Born out of a passion for timeless British sartorial craftsmanship, London Style combines Jermyn Street tailored elegance with modern comfort fabrics.
        </p>
      </div>

      {/* Brand Values */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-zinc-900">Bespoke Quality</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Every Oxford shirt, blazer, and leather shoe is crafted using 100% Egyptian Giza cotton, Australian Merino wool, and full-grain Italian calfskin.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <Truck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-zinc-900">Pan-India Direct Delivery</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Fast dispatch across 28,000+ Indian pincodes with doorstep returns, size exchanges, and real-time BlueDart tracking.
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-zinc-200 text-center space-y-3 shadow-2xs">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-lg text-zinc-900">Toll-Free Customer Desk</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Our support helpline <strong className="font-mono text-amber-700">{HOTLINE_NUMBER}</strong> operates around the clock for order support, complaints, and bulk purchase quotes.
          </p>
        </div>
      </div>
    </div>
  );
};
