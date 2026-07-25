import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { SizeType } from '../types';
import { ProductCard } from '../components/ProductCard';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft, 
  Check, 
  Ruler, 
  MessageSquare,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { HOTLINE_NUMBER } from '../data/mockData';

export const ProductDetailsPage: React.FC = () => {
  const { 
    selectedProduct, 
    setSelectedProduct, 
    setActiveTab, 
    addToCart, 
    toggleWishlist, 
    isInWishlist,
    products,
    addReviewToProduct
  } = useShop();

  if (!selectedProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">No product selected</h2>
        <button 
          onClick={() => setActiveTab('Shop')}
          className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  const [activeImage, setActiveImage] = useState<string>(selectedProduct.images[0]);
  const [selectedSize, setSelectedSize] = useState<SizeType>(selectedProduct.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(selectedProduct.colors[0] || 'Default');
  const [qty, setQty] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Review form state
  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const inWish = isInWishlist(selectedProduct.id);

  const handleAddToCart = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(selectedProduct, selectedSize, selectedColor, qty);
    setActiveTab('Cart');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setIsSubmittingReview(true);
    await addReviewToProduct(selectedProduct.id, newRating, newComment);
    setIsSubmittingReview(false);
    setNewComment('');
  };

  const relatedProducts = products
    .filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Back Button */}
      <button
        onClick={() => setActiveTab('Shop')}
        className="inline-flex items-center gap-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Shop Catalog
      </button>

      {/* Main Product Layout */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-3/4 rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 relative shadow-xs">
            <img 
              src={activeImage || selectedProduct.images[0]} 
              alt={selectedProduct.name} 
              className="w-full h-full object-cover"
            />
            {selectedProduct.discount > 0 && (
              <span className="absolute top-4 left-4 bg-amber-500 text-zinc-950 font-black text-xs uppercase px-3 py-1 rounded-sm shadow-md">
                {selectedProduct.discount}% OFF
              </span>
            )}
          </div>

          {/* Gallery Thumbnails */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            {selectedProduct.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                  activeImage === img ? 'border-amber-600 scale-105' : 'border-zinc-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`View ${idx}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Product Details & Purchase Actions */}
        <div className="space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest text-amber-700">
              {selectedProduct.brand}
            </div>
            <h1 className="font-serif text-3xl font-bold text-zinc-900 mt-1">
              {selectedProduct.name}
            </h1>

            {/* Rating & Review Counter */}
            <div className="flex items-center gap-3 mt-3 text-xs">
              <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{selectedProduct.rating}</span>
              </div>
              <span className="text-zinc-400">•</span>
              <span className="text-zinc-600 font-medium">
                {selectedProduct.reviewCount} Verified Customer Reviews
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">M.R.P. Inclusive of Taxes</div>
              <div className="flex items-baseline gap-3 mt-0.5">
                <span className="text-3xl font-bold font-mono text-zinc-950">
                  ₹{selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-sm text-zinc-400 line-through font-mono">
                    ₹{selectedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm">
                  Save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-right">
              {selectedProduct.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  In Stock ({selectedProduct.stock} units)
                </span>
              ) : (
                <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* Color Selection */}
          {selectedProduct.colors.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase text-zinc-700">
                Color Choice: <span className="text-amber-700">{selectedColor}</span>
              </label>
              <div className="flex items-center gap-2">
                {selectedProduct.colors.map(col => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedColor === col 
                        ? 'border-amber-600 bg-amber-50 text-amber-900 font-bold' 
                        : 'border-zinc-300 text-zinc-700 hover:border-zinc-400'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selection */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-zinc-700">
                Select Size: <span className="text-amber-700">{selectedSize}</span>
              </label>
              <button 
                onClick={() => setShowSizeGuide(!showSizeGuide)}
                className="text-xs text-amber-700 hover:underline flex items-center gap-1 font-semibold"
              >
                <Ruler className="w-3.5 h-3.5" /> Size Fitting Guide
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedProduct.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-12 h-12 rounded-xl text-xs font-bold border transition-all flex items-center justify-center ${
                    selectedSize === size
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                      : 'bg-white text-zinc-800 border-zinc-300 hover:border-amber-500'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Size Guide Info Dropdown */}
            {showSizeGuide && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-zinc-800 space-y-2">
                <div className="font-bold text-amber-900 flex items-center gap-1">
                  <Ruler className="w-4 h-4 text-amber-700" />
                  <span>British Tailoring Fitting Standards:</span>
                </div>
                <div className="grid grid-cols-4 gap-2 font-mono text-[11px] text-center bg-white p-2 rounded-lg border border-amber-100">
                  <div><strong>S:</strong> 38" Chest</div>
                  <div><strong>M:</strong> 40" Chest</div>
                  <div><strong>L:</strong> 42" Chest</div>
                  <div><strong>XL:</strong> 44" Chest</div>
                </div>
              </div>
            )}
          </div>

          {/* Quantity selector */}
          <div className="flex items-center gap-4">
            <label className="text-xs font-bold uppercase text-zinc-700">Quantity:</label>
            <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white">
              <button 
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 font-bold"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-xs font-bold font-mono text-zinc-900">{qty}</span>
              <button 
                onClick={() => setQty(qty + 1)}
                className="px-3 py-1.5 text-zinc-600 hover:bg-zinc-100 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={selectedProduct.stock === 0}
              className={`flex-1 font-bold py-3.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                selectedProduct.stock === 0
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed'
                  : added 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-zinc-900 hover:bg-zinc-800 text-white'
              }`}
            >
              {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4 text-amber-400" />}
              <span>{selectedProduct.stock === 0 ? 'Out of Stock' : added ? 'Added To Bag!' : 'Add To Shopping Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={selectedProduct.stock === 0}
              className={`flex-1 font-black py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all shadow-md ${
                selectedProduct.stock === 0
                  ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed shadow-none'
                  : 'bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-amber-500/20'
              }`}
            >
              {selectedProduct.stock === 0 ? 'Out of Stock' : 'Buy Now'}
            </button>

            <button
              onClick={() => toggleWishlist(selectedProduct)}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-center ${
                inWish 
                  ? 'bg-red-50 border-red-200 text-red-600' 
                  : 'border-zinc-300 text-zinc-700 hover:border-red-400'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWish ? 'fill-red-600' : ''}`} />
            </button>
          </div>

          {/* Product Guarantee Badges */}
          <div className="pt-4 border-t border-zinc-200 grid grid-cols-3 gap-3 text-center text-xs text-zinc-600">
            <div className="p-2 bg-zinc-50 rounded-xl space-y-1">
              <Truck className="w-4 h-4 mx-auto text-amber-600" />
              <span className="font-semibold block text-[11px]">Free Shipping</span>
            </div>
            <div className="p-2 bg-zinc-50 rounded-xl space-y-1">
              <RefreshCw className="w-4 h-4 mx-auto text-amber-600" />
              <span className="font-semibold block text-[11px]">15-Day Returns</span>
            </div>
            <div className="p-2 bg-zinc-50 rounded-xl space-y-1">
              <PhoneCall className="w-4 h-4 mx-auto text-amber-600" />
              <span className="font-semibold block text-[11px]">Hotline: {HOTLINE_NUMBER}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-6">
        <div className="border-b border-zinc-200 pb-3">
          <h2 className="font-serif text-xl font-bold text-zinc-900">
            Product Description & Craftsmanship
          </h2>
        </div>

        <p className="text-zinc-700 text-sm leading-relaxed">
          {selectedProduct.description}
        </p>

        {/* Specifications Table */}
        <div>
          <h3 className="font-serif font-bold text-sm text-zinc-900 mb-3">Garment Specifications</h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {Object.entries(selectedProduct.specifications || {}).map(([key, val]) => (
              <div key={key} className="flex justify-between p-3 bg-zinc-50 rounded-lg border border-zinc-100">
                <span className="font-bold text-zinc-500">{key}</span>
                <span className="font-medium text-zinc-900">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Reviews & Write Review Form */}
      <div className="bg-white rounded-2xl border border-zinc-200 p-6 sm:p-8 space-y-8">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
          <div>
            <h2 className="font-serif text-xl font-bold text-zinc-900">
              Customer Reviews ({selectedProduct.reviewCount})
            </h2>
            <p className="text-xs text-zinc-500 mt-1">Average Rating: ⭐ {selectedProduct.rating} / 5.0</p>
          </div>
        </div>

        {/* Write a Review Box */}
        <form onSubmit={handleSubmitReview} className="bg-amber-50/50 border border-amber-200 p-5 rounded-2xl space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-amber-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-700" />
            <span>Write a Product Review</span>
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-700">Your Rating:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setNewRating(star)}
                className="text-amber-500 p-1"
              >
                <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-zinc-300'}`} />
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            placeholder="Share your experience regarding fit, fabric quality, and delivery..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-white border border-amber-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-hidden focus:border-amber-600"
            required
          />

          <button
            type="submit"
            disabled={isSubmittingReview || !newComment.trim()}
            className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-2.5 px-6 rounded-xl text-xs uppercase tracking-wider transition-all"
          >
            {isSubmittingReview ? 'Submitting...' : 'Post Review'}
          </button>
        </form>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
            selectedProduct.reviews.map(rev => (
              <div key={rev.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-900">{rev.userName}</span>
                  <span className="text-[10px] text-zinc-400">{rev.date}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-zinc-700 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          ) : (
            <p className="text-xs text-zinc-500 italic">No reviews submitted yet for this product. Be the first to review!</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6">
          <h2 className="font-serif text-2xl font-bold text-zinc-900 border-b border-zinc-200 pb-3">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
