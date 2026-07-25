import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PaymentMethod, Address } from '../types';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  MapPin, 
  CheckCircle2, 
  PhoneCall, 
  Lock, 
  ArrowRight,
  QrCode,
  DollarSign
} from 'lucide-react';
import { HOTLINE_NUMBER } from '../data/mockData';

export const CheckoutPage: React.FC = () => {
  const { cart, user, placeOrder, setActiveTab, appliedCoupon } = useShop();

  const [address, setAddress] = useState<Address>({
    id: `addr-${Date.now()}`,
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    addressType: 'Home'
  });

  const [deliveryMethod, setDeliveryMethod] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRazorpayModal, setShowRazorpayModal] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  let shippingFee = deliveryMethod === 'Express' ? 149 : (subtotal > 1499 ? 0 : 99);

  if (appliedCoupon) {
    if (appliedCoupon.discountPercent === 100) {
      shippingFee = 0;
    } else {
      discountAmount = Math.round((subtotal * appliedCoupon.discountPercent) / 100);
    }
  }

  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handlePlaceOrderClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.street || !address.city || !address.pincode) {
      alert('Please fill all required address fields.');
      return;
    }

    if (paymentMethod === 'Credit Card' || paymentMethod === 'Debit Card' || paymentMethod === 'Net Banking' || paymentMethod === 'UPI') {
      // Show simulated Razorpay Gateway
      setShowRazorpayModal(true);
    } else {
      // Cash on Delivery
      executeFinalizeOrder();
    }
  };

  const executeFinalizeOrder = async (payId?: string) => {
    setIsProcessing(true);
    setShowRazorpayModal(false);
    await placeOrder(address, paymentMethod, payId || `pay_${paymentMethod}_${Date.now()}`);
    setIsProcessing(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-zinc-200 pb-4">
        <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">Secure Payment Gateway</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
          Checkout & Shipping Address
        </h1>
      </div>

      <form onSubmit={handlePlaceOrderClick} className="grid lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Address & Payment Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Shipping Address Form */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-amber-600" />
              <span>1. Delivery Address</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9507457956"
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-zinc-700 mb-1">Street Address / House No. / Landmark *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flat 402, Royal Residency, Near Victoria Terminus"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">City *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mumbai"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maharashtra"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Pincode *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="e.g. 400020"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-zinc-700 mb-1">Address Tag</label>
                <select
                  value={address.addressType}
                  onChange={(e) => setAddress({ ...address, addressType: e.target.value as any })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Office / Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-amber-600" />
              <span>2. Delivery Speed</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4 text-xs">
              <label 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryMethod === 'Standard' 
                    ? 'border-amber-600 bg-amber-50/50' 
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'Standard'}
                  onChange={() => setDeliveryMethod('Standard')}
                  className="mt-0.5 accent-amber-600"
                />
                <div>
                  <span className="font-bold text-zinc-900 block">Standard Delivery (3-5 Days)</span>
                  <span className="text-[11px] text-zinc-500">Free above ₹1,499. Reliable surface courier.</span>
                </div>
              </label>

              <label 
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                  deliveryMethod === 'Express' 
                    ? 'border-amber-600 bg-amber-50/50' 
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <input
                  type="radio"
                  name="delivery"
                  checked={deliveryMethod === 'Express'}
                  onChange={() => setDeliveryMethod('Express')}
                  className="mt-0.5 accent-amber-600"
                />
                <div>
                  <span className="font-bold text-zinc-900 block">Express Next-Day Air (₹149)</span>
                  <span className="text-[11px] text-zinc-500">Priority BlueDart Air dispatch within 24 Hours.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-600" />
              <span>3. Choose Payment Method</span>
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { id: 'UPI', label: 'UPI / Google Pay / PhonePe / Paytm / BHIM', desc: 'Instant QR Code scan or VPA payment via Razorpay', icon: <QrCode className="w-4 h-4 text-emerald-600" /> },
                { id: 'Credit Card', label: 'Credit Card (Visa, Mastercard, Amex)', desc: 'Secured 256-bit SSL encrypted credit card checkout', icon: <CreditCard className="w-4 h-4 text-blue-600" /> },
                { id: 'Debit Card', label: 'Debit Card', desc: 'All Indian bank debit cards supported', icon: <CreditCard className="w-4 h-4 text-indigo-600" /> },
                { id: 'Net Banking', label: 'Net Banking', desc: 'HDFC, ICICI, SBI, Axis, Kotak and 50+ banks', icon: <Lock className="w-4 h-4 text-purple-600" /> },
                { id: 'Cash on Delivery', label: 'Cash on Delivery (COD)', desc: 'Pay cash to delivery executive upon arrival', icon: <DollarSign className="w-4 h-4 text-amber-600" /> }
              ].map(method => (
                <label
                  key={method.id}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    paymentMethod === method.id 
                      ? 'border-amber-600 bg-amber-50/50' 
                      : 'border-zinc-200 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id as any)}
                      className="accent-amber-600"
                    />
                    <div>
                      <div className="font-bold text-zinc-900 flex items-center gap-2">
                        {method.icon}
                        <span>{method.label}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-0.5">{method.desc}</p>
                    </div>
                  </div>

                  {method.id === 'UPI' && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      Recommended
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Order Review Box */}
        <div className="bg-zinc-900 text-white p-6 rounded-2xl space-y-6 shadow-xl border border-zinc-800">
          <h3 className="font-serif font-bold text-lg border-b border-zinc-800 pb-3">
            Review Items ({cart.length})
          </h3>

          <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
            {cart.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs border-b border-zinc-800 pb-3 last:border-none">
                <img src={item.product.images[0]} alt={item.product.name} className="w-12 h-16 object-cover rounded-md bg-zinc-800 shrink-0" />
                <div className="overflow-hidden flex-1">
                  <span className="font-bold text-white block truncate">{item.product.name}</span>
                  <span className="text-zinc-400 text-[10px]">Size: {item.selectedSize} • Qty: {item.quantity}</span>
                  <div className="font-mono text-amber-400 font-bold mt-1">₹{(item.product.price * item.quantity).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs border-t border-zinc-800 pt-4 text-zinc-300">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-white">₹{subtotal.toLocaleString()}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-amber-400 font-semibold">
                <span>Discount</span>
                <span className="font-mono">- ₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Shipping Fee</span>
              <span className="font-mono text-white">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-between items-baseline">
            <span className="font-serif text-lg font-bold">Total Amount</span>
            <span className="text-2xl font-bold font-mono text-amber-400">
              ₹{grandTotal.toLocaleString()}
            </span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black py-4 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <span>{isProcessing ? 'Processing Order...' : `Pay ₹${grandTotal.toLocaleString()} & Place Order`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-[10px] text-zinc-400 text-center space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>256-Bit Encrypted Razorpay Security</span>
            </div>
            <div>Order support helpline: 📞 {HOTLINE_NUMBER}</div>
          </div>
        </div>
      </form>

      {/* Simulated Razorpay Online Payment Gateway Modal */}
      {showRazorpayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden border border-zinc-200">
            <div className="bg-zinc-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-xs text-white">
                  RZP
                </div>
                <div>
                  <h4 className="font-bold text-xs">Razorpay Secure Checkout</h4>
                  <p className="text-[10px] text-zinc-400">Merchant: London Style Men's Fashion</p>
                </div>
              </div>
              <span className="text-amber-400 font-mono font-bold text-sm">₹{grandTotal.toLocaleString()}</span>
            </div>

            <div className="p-6 space-y-4 text-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-pulse">
                <QrCode className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-zinc-900">Simulating Online Gateway...</h3>
                <p className="text-xs text-zinc-500 mt-1">
                  Click below to confirm test payment authorisation for <strong>₹{grandTotal.toLocaleString()}</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={() => executeFinalizeOrder()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider shadow-md"
              >
                Approve & Pay ₹{grandTotal.toLocaleString()}
              </button>

              <button
                type="button"
                onClick={() => setShowRazorpayModal(false)}
                className="text-xs text-zinc-500 underline"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
