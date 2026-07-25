import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingBag, Trash2, Tag, ArrowRight, ArrowLeft, ShieldCheck, Truck, Sparkles } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { 
    cart, 
    updateCartQty, 
    removeFromCart, 
    setActiveTab, 
    applyCoupon, 
    removeCoupon, 
    appliedCoupon 
  } = useShop();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ success: boolean; text: string } | null>(null);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  let shippingFee = subtotal > 1499 ? 0 : 99;

  if (appliedCoupon) {
    if (appliedCoupon.discountPercent === 100) { // FREESHIP
      shippingFee = 0;
    } else {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }
  }

  const finalTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const res = applyCoupon(couponCodeInput);
    setCouponMsg({ success: res.success, text: res.message });
    if (res.success) setCouponCodeInput('');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">Your Shopping Bag is Empty</h2>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            Discover handcrafted British shirts, blazers, denim, and accessories in our latest collection.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('Shop')}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider inline-flex items-center gap-2"
        >
          <span>Explore Shop Catalog</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-zinc-200 pb-4 flex items-center justify-between">
        <div>
          <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Shopping Bag</span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
            Review Items ({cart.length})
          </h1>
        </div>
        <button
          onClick={() => setActiveTab('Shop')}
          className="text-xs font-bold text-zinc-600 hover:text-zinc-900 flex items-center gap-1 uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Continue Shopping
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {/* Free Shipping Progress Indicator */}
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl text-xs text-amber-900 flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-700 shrink-0" />
            <div className="flex-1">
              {subtotal >= 1499 ? (
                <span className="font-bold text-emerald-800">🎉 Congratulations! You unlocked FREE EXPRESS DELIVERY!</span>
              ) : (
                <span>
                  Add <strong className="font-mono text-amber-900">₹{(1499 - subtotal).toLocaleString()}</strong> more to get <strong>Free Delivery</strong>!
                </span>
              )}
              <div className="w-full bg-amber-200 h-1.5 rounded-full mt-1 overflow-hidden">
                <div 
                  className="bg-amber-600 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (subtotal / 1499) * 100)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-200 divide-y divide-zinc-100 overflow-hidden shadow-2xs">
            {cart.map((item, index) => (
              <div key={index} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-24 h-32 object-cover rounded-xl bg-zinc-100 shrink-0"
                />

                <div className="flex-1 space-y-1 text-center sm:text-left w-full">
                  <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                    {item.product.brand}
                  </span>
                  <h3 className="font-bold text-sm text-zinc-900">{item.product.name}</h3>

                  <div className="text-xs text-zinc-500 flex flex-wrap justify-center sm:justify-start gap-3 pt-1">
                    <span>Size: <strong className="text-zinc-800">{item.selectedSize}</strong></span>
                    <span>•</span>
                    <span>Color: <strong className="text-zinc-800">{item.selectedColor}</strong></span>
                  </div>

                  <div className="text-sm font-bold font-mono text-zinc-950 pt-1">
                    ₹{item.product.price.toLocaleString()}
                  </div>
                </div>

                {/* Quantity +/- Controls */}
                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex items-center border border-zinc-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, item.quantity - 1)}
                      className="px-3 py-1 text-zinc-600 hover:bg-zinc-100 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 font-bold text-xs font-mono">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.product.id, item.selectedSize, item.selectedColor, item.quantity + 1)}
                      className="px-3 py-1 text-zinc-600 hover:bg-zinc-100 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right font-mono font-bold text-sm text-zinc-950 w-20">
                    ₹{(item.product.price * item.quantity).toLocaleString()}
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedSize, item.selectedColor)}
                    className="p-2 text-zinc-400 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon Code */}
        <div className="space-y-6">
          {/* Coupon Promo Box */}
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 space-y-3 shadow-2xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Apply Discount Coupon</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900 font-semibold">
                <div>
                  <span className="block font-mono font-bold text-amber-800">{appliedCoupon.code}</span>
                  <span className="text-[10px] text-zinc-600">{appliedCoupon.description}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-bold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="NEW10 / SAVE20 / FREESHIP"
                  value={couponCodeInput}
                  onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono uppercase text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
                <button
                  type="submit"
                  className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-lg text-xs uppercase"
                >
                  Apply
                </button>
              </form>
            )}

            {couponMsg && (
              <p className={`text-[11px] font-semibold ${couponMsg.success ? 'text-emerald-700' : 'text-red-600'}`}>
                {couponMsg.text}
              </p>
            )}

            <div className="pt-2 text-[11px] text-zinc-400 space-y-1 border-t border-zinc-100">
              <div className="font-semibold text-zinc-600">Available Promo Codes:</div>
              <div>• <strong className="font-mono text-zinc-800">NEW10</strong>: 10% OFF above ₹999</div>
              <div>• <strong className="font-mono text-zinc-800">SAVE20</strong>: 20% OFF above ₹2,999</div>
              <div>• <strong className="font-mono text-zinc-800">FREESHIP</strong>: Free Shipping above ₹499</div>
            </div>
          </div>

          {/* Price Summary Breakdown */}
          <div className="bg-zinc-900 text-white p-6 rounded-2xl space-y-4 shadow-xl border border-zinc-800">
            <h3 className="font-serif font-bold text-lg border-b border-zinc-800 pb-3">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-zinc-300">
              <div className="flex justify-between">
                <span>Subtotal ({cart.length} items)</span>
                <span className="font-mono text-white">₹{subtotal.toLocaleString()}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-400 font-semibold">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-mono text-white">
                  {shippingFee === 0 ? <strong className="text-emerald-400">FREE</strong> : `₹${shippingFee}`}
                </span>
              </div>

              <div className="flex justify-between text-zinc-400 text-[11px]">
                <span>GST & Taxes</span>
                <span>Included in M.R.P</span>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-between items-baseline">
              <div>
                <span className="font-serif text-lg font-bold block text-white">Grand Total</span>
                <span className="text-[10px] text-zinc-400">Inclusive of all local taxes</span>
              </div>
              <span className="text-2xl font-bold font-mono text-amber-400">
                ₹{finalTotal.toLocaleString()}
              </span>
            </div>

            <button
              onClick={() => setActiveTab('Checkout')}
              className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
