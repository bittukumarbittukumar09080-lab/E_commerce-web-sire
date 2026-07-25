import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { HOTLINE_NUMBER } from '../data/mockData';
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Star, 
  Building2, 
  PhoneCall, 
  ShoppingBag,
  Award,
  ChevronRight
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, categories, setActiveTab, setSelectedCategoryFilter, setSelectedProduct } = useShop();

  const trendingProducts = products.filter(p => p.isTrending).slice(0, 4);
  const todayDeals = products.filter(p => p.isTodayDeal).slice(0, 4);
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 4);

  const handleCategorySelect = (catName: string) => {
    setSelectedCategoryFilter(catName);
    setActiveTab('Shop');
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-zinc-950 text-white overflow-hidden min-h-[520px] lg:min-h-[600px] flex items-center">
        {/* Background Image overlay */}
        <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity">
          <img
            src="https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=1920"
            alt="London Style Menswear"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 grid lg:grid-cols-2 items-center gap-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-400 text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autumn / Winter 2026 Collection</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl font-black text-white leading-tight tracking-wide">
              NEW ARRIVALS
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg max-w-lg font-light leading-relaxed">
              Premium Men's Collection handcrafted with authentic British tailoring heritage. <strong className="text-amber-400 font-semibold">Dress Smart. Live in Style.</strong>
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => { setSelectedCategoryFilter('All'); setActiveTab('Shop'); }}
                className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-8 py-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-3 shadow-lg shadow-amber-500/20"
              >
                <span>Shop Modern Collection</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('Offers')}
                className="bg-zinc-900/80 hover:bg-zinc-800 text-white border border-zinc-700 font-bold px-6 py-4 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2"
              >
                <span>View Today's Deals</span>
              </button>
            </div>

            {/* Hotline banner strip */}
            <div className="pt-4 flex items-center gap-3 text-xs text-zinc-400 border-t border-zinc-800">
              <PhoneCall className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Toll Free Orders & Complaints Hotline: <strong className="text-white font-mono">{HOTLINE_NUMBER}</strong></span>
            </div>
          </div>

          {/* Featured Hero Product Card Preview */}
          <div className="hidden lg:block">
            {products[0] && (
              <div 
                onClick={() => { setSelectedProduct(products[0]); setActiveTab('ProductDetails'); }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/15 max-w-sm ml-auto space-y-4 hover:border-amber-400/50 transition-all cursor-pointer group shadow-2xl"
              >
                <div className="aspect-4/3 rounded-xl overflow-hidden bg-zinc-900">
                  <img src={products[0].images[0]} alt={products[0].name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Featured Handcrafted Item</span>
                  <h3 className="text-white font-serif font-bold text-lg group-hover:text-amber-300 transition-colors">{products[0].name}</h3>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xl font-bold font-mono text-amber-400">₹{products[0].price}</span>
                    <span className="text-xs text-zinc-400 line-through font-mono">₹{products[0].originalPrice}</span>
                    <span className="text-xs text-zinc-200 underline font-medium">Explore Details →</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Category Circles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Curated Men's Wardrobe</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">Explore Product Categories</h2>
          </div>
          <button 
            onClick={() => setActiveTab('Categories')}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All ({categories.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.slice(0, 12).map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleCategorySelect(cat.name)}
              className="group bg-white p-4 rounded-2xl border border-zinc-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer text-center space-y-3"
            >
              <div className="w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-100 border-2 border-zinc-100 group-hover:border-amber-500 transition-colors">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-zinc-900 group-hover:text-amber-800 transition-colors">{cat.name}</h3>
                <span className="text-[10px] text-zinc-400">{cat.itemCount}+ Items</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Deals Section */}
      <section className="bg-amber-50/60 py-12 border-y border-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 text-zinc-950 rounded-xl">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-amber-800 text-xs font-bold uppercase tracking-widest block">Limited Time Offers</span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">Today's Flash Deals</h2>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('Offers')}
              className="bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold px-4 py-2.5 rounded-lg uppercase tracking-wider"
            >
              All Deals & Coupons
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {todayDeals.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Gentlemen's Preference</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">Trending Right Now</h2>
          </div>
          <button 
            onClick={() => { setSelectedCategoryFilter('All'); setActiveTab('Shop'); }}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider flex items-center gap-1"
          >
            <span>Explore Shop</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {trendingProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Wholesale & Bulk Enquiries Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden border border-amber-500/30 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
              <Building2 className="w-4 h-4" />
              <span>Corporate & Wholesale Desk</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold leading-tight">
              Bulk Orders & Custom Tailoring Requirements?
            </h2>
            <p className="text-zinc-300 text-sm leading-relaxed">
              Equip your corporate team or wedding entourage with London Style custom tailored shirts, blazers, and luxury leather accessories at discounted wholesale rates.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <div className="text-amber-400 font-mono font-black text-lg">
                📞 Hotline: {HOTLINE_NUMBER}
              </div>
            </div>
          </div>

          <div className="shrink-0 space-y-3 text-center md:text-right">
            <button
              onClick={() => setActiveTab('BulkPurchase')}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-8 py-4 rounded-xl text-xs uppercase tracking-widest transition-all shadow-lg shadow-amber-500/20 block w-full md:w-auto"
            >
              Submit Bulk Request
            </button>
            <span className="text-[11px] text-zinc-400 block">Direct quotation response within 2 hours</span>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-end justify-between border-b border-zinc-200 pb-4">
          <div>
            <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Fresh Out Of Atelier</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">New Arrivals</h2>
          </div>
          <button 
            onClick={() => { setSelectedCategoryFilter('All'); setActiveTab('Shop'); }}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 uppercase tracking-wider flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Customer Reviews & Testimonials */}
      <section className="bg-zinc-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Verified Customer Testimonials</span>
            <h2 className="font-serif text-3xl font-bold">Loved By Discerning Gentlemen</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Vikram Malhotra',
                city: 'Mumbai',
                comment: 'The Savile Row Royal Oxford shirt fits like a bespoke dream. Delivered right on time for my board meeting!',
                rating: 5,
                product: 'Royal Oxford Shirt'
              },
              {
                name: 'Siddharth Roy',
                city: 'Bengaluru',
                comment: 'Called customer care line 9507457956 for bulk size exchange and it was resolved within 24 hours. Stellar service!',
                rating: 5,
                product: 'Mayfair Blazer'
              },
              {
                name: 'Karan Singhania',
                city: 'Delhi',
                comment: 'The leather Oxfords are made with authentic calfskin leather. Premium packaging and quick shipping.',
                rating: 5,
                product: 'Leather Oxfords'
              }
            ].map((rev, i) => (
              <div key={i} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(rev.rating)].map((_, idx) => (
                    <Star key={idx} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-zinc-300 text-xs leading-relaxed italic">"{rev.comment}"</p>
                <div className="pt-2 border-t border-zinc-900 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-white block">{rev.name}</span>
                    <span className="text-zinc-500 text-[10px]">{rev.city}</span>
                  </div>
                  <span className="bg-amber-500/10 text-amber-400 text-[10px] px-2 py-0.5 rounded-sm">
                    Verified Buyer
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
