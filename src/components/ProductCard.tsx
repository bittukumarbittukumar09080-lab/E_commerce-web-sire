import React, { useState } from 'react';
import { Product, SizeType } from '../types';
import { useShop } from '../context/ShopContext';
import { Heart, Star, ShoppingBag, Eye, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { 
    setSelectedProduct, 
    setActiveTab, 
    addToCart, 
    toggleWishlist, 
    isInWishlist 
  } = useShop();

  const [selectedSize, setSelectedSize] = useState<SizeType>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || 'Default');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const inWish = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1500);
  };

  const handleCardClick = () => {
    setSelectedProduct(product);
    setActiveTab('ProductDetails');
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Product Image Container */}
      <div className="relative aspect-3/4 bg-zinc-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Secondary image on hover if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.discount > 0 && product.stock > 0 && (
            <span className="bg-amber-500 text-zinc-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-sm shadow-xs">
              {product.discount}% OFF
            </span>
          )}
          {product.stock === 0 ? (
            <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-sm shadow-xs">
              Out of Stock
            </span>
          ) : (
            <>
              {product.isTodayDeal && (
                <span className="bg-red-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-sm shadow-xs">
                  Deal of Day
                </span>
              )}
              {product.isNewArrival && (
                <span className="bg-zinc-900 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-sm shadow-xs">
                  New
                </span>
              )}
            </>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-2.5 right-2.5 p-2 rounded-full transition-all z-10 shadow-md ${
            inWish 
              ? 'bg-red-50 text-red-600 scale-110' 
              : 'bg-white/90 text-zinc-600 hover:text-red-500 hover:bg-white'
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWish ? 'fill-red-600' : ''}`} />
        </button>

        {/* Quick View overlay prompt */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <span className="text-white text-xs font-semibold flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5" /> Quick View Details
          </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-700">
            {product.brand}
          </div>
          <h3 className="font-medium text-sm text-zinc-900 group-hover:text-amber-800 transition-colors line-clamp-1">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-zinc-500">
            <div className="flex items-center gap-0.5 text-amber-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-bold text-zinc-800 text-[11px]">{product.rating}</span>
            </div>
            <span>•</span>
            <span className="text-[11px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & Stock */}
        <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-zinc-950 font-mono">
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-zinc-400 line-through font-mono">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.stock === 0 ? (
              <span className="text-[10px] font-bold text-red-600 block uppercase tracking-wider">
                Out of Stock
              </span>
            ) : product.stock <= 5 ? (
              <span className="text-[10px] font-semibold text-red-600 block">
                Only {product.stock} left in stock!
              </span>
            ) : (
              <span className="text-[10px] text-zinc-400 block">
                Category: {product.category}
              </span>
            )}
          </div>

          {/* Quick Add to Cart Button */}
          <button
            onClick={product.stock > 0 ? handleQuickAdd : (e) => e.stopPropagation()}
            disabled={product.stock === 0}
            className={`p-2 rounded-lg transition-all ${
              product.stock === 0
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                : addedAnimation 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-zinc-900 hover:bg-amber-500 hover:text-zinc-950 text-white'
            }`}
            title={product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          >
            {addedAnimation ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
