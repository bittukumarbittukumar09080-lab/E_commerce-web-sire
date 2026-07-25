import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Tag, Sparkles, Copy, Check, Clock } from 'lucide-react';

export const OffersPage: React.FC = () => {
  const { coupons, products, setActiveTab, setSelectedCategoryFilter } = useShop();

  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const discountedProducts = products.filter(p => p.discount >= 30);

  const copyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Banner */}
      <div className="bg-amber-500 text-zinc-950 rounded-3xl p-8 sm:p-12 border border-amber-400 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-950 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Exclusive Promo Offers</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-black tracking-tight">
          Deals, Coupons & Flash Discounts
        </h1>
        <p className="text-zinc-900 text-sm max-w-xl font-medium">
          Save big on premium British tailored apparel. Copy any active code below and paste it at checkout.
        </p>
      </div>

      {/* Coupons Grid */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-zinc-900 flex items-center gap-2">
          <Tag className="w-5 h-5 text-amber-600" />
          <span>Active Promo Codes</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {coupons.map(coupon => (
            <div key={coupon.code} className="bg-white p-6 rounded-2xl border-2 border-dashed border-amber-400 relative overflow-hidden space-y-3 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xl font-black text-amber-700 tracking-wider">
                  {coupon.code}
                </span>
                <button
                  onClick={() => copyCoupon(coupon.code)}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedCode === coupon.code ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === coupon.code ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <p className="text-xs text-zinc-700 font-semibold">{coupon.description}</p>

              <div className="text-[10px] text-zinc-400 flex justify-between border-t border-zinc-100 pt-2 font-mono">
                <span>Min Order: ₹{coupon.minPurchase}</span>
                <span>Valid Till: {coupon.expiryDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Flash Sale Products (Discount >= 30%) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            <span>Heavy Discount Sale (30%+ OFF)</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {discountedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};
