import React from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const { wishlist, setActiveTab } = useShop();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">Your Wishlist is Empty</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Save your favorite suits, shirts, shoes, and luxury fragrances to review anytime.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('Shop')}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Browse Catalog</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="border-b border-zinc-200 pb-4">
        <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Saved Favorites</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
          My Wishlist ({wishlist.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
