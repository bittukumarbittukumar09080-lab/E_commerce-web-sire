import React, { useState } from 'react';
import { Order, OrderStatus } from '../types';
import { useShop } from '../context/ShopContext';
import { HOTLINE_NUMBER } from '../data/mockData';
import { InvoiceModal } from './InvoiceModal';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  MapPin, 
  PhoneCall, 
  Clock, 
  Calendar, 
  Printer, 
  ArrowLeft,
  XCircle,
  HelpCircle,
  FileText,
  Download,
  Receipt
} from 'lucide-react';

interface OrderTrackingProps {
  order: Order;
}

export const OrderTracking: React.FC<OrderTrackingProps> = ({ order }) => {
  const { setActiveTab } = useShop();
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const statuses: OrderStatus[] = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered'];

  const getCurrentIndex = () => {
    return statuses.indexOf(order.orderStatus);
  };

  const currentIndex = getCurrentIndex();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Invoice Modal */}
      {showInvoiceModal && (
        <InvoiceModal order={order} onClose={() => setShowInvoiceModal(false)} />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
        <div>
          <button
            onClick={() => setActiveTab('Orders')}
            className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 mb-2 uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back To My Orders List
          </button>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl font-bold text-zinc-900">
              Order #{order.orderNumber}
            </h1>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase font-mono">
              {order.orderStatus}
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowInvoiceModal(true)}
            className="bg-zinc-900 hover:bg-zinc-800 text-amber-400 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-xs cursor-pointer"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>View & Download Bill Receipt</span>
          </button>

          <a
            href={`tel:${HOTLINE_NUMBER}`}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Support: {HOTLINE_NUMBER}</span>
          </a>
        </div>
      </div>

      {/* Order Confirmation & Payment Receipt Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-zinc-900 to-amber-950 text-white p-5 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 border border-emerald-500/30">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 border border-emerald-500/40">
            <Receipt className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-white flex items-center gap-2">
              <span>Order Payment Confirmed</span>
              <span className="bg-emerald-500 text-zinc-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                {order.paymentStatus}
              </span>
            </h4>
            <p className="text-xs text-zinc-300 mt-0.5">
              Paid <strong className="text-amber-400 font-mono">₹{order.totalAmount.toLocaleString()}</strong> via {order.paymentMethod}. Your official tax bill is generated.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInvoiceModal(true)}
          className="bg-white hover:bg-amber-100 text-zinc-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-sm transition-all shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-amber-700" />
          <span>Get Tax Invoice Bill</span>
        </button>
      </div>

      {/* Live Visual Timeline Stepper */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-base text-zinc-900 flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-600" />
            <span>Live Order Status Tracking</span>
          </h3>
          <div className="text-xs text-amber-800 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Est. Delivery: {order.estimatedDelivery}
          </div>
        </div>

        {/* Stepper Bar */}
        <div className="relative pt-4 pb-2">
          {/* Connecting Line */}
          <div className="absolute top-8 left-4 right-4 h-1 bg-zinc-200 z-0">
            <div 
              className="h-full bg-amber-500 transition-all duration-700" 
              style={{ width: `${Math.max(0, (currentIndex / (statuses.length - 1)) * 100)}%` }}
            />
          </div>

          <div className="relative z-10 grid grid-cols-6 text-center">
            {statuses.map((st, idx) => {
              const isPassed = idx <= currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div key={st} className="flex flex-col items-center space-y-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                    isCurrent 
                      ? 'bg-amber-500 text-zinc-950 ring-4 ring-amber-100 scale-110' 
                      : isPassed 
                        ? 'bg-zinc-900 text-amber-400' 
                        : 'bg-zinc-100 text-zinc-400 border border-zinc-300'
                  }`}>
                    {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-semibold leading-tight max-w-[70px] ${
                    isCurrent ? 'text-amber-800 font-bold' : isPassed ? 'text-zinc-900' : 'text-zinc-400'
                  }`}>
                    {st}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Timeline Event Log */}
        <div className="pt-4 border-t border-zinc-100 space-y-2">
          <h4 className="text-xs font-bold uppercase text-zinc-500 tracking-wider">Status Log</h4>
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {order.timeline.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2 bg-zinc-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${entry.completed ? 'bg-amber-500' : 'bg-zinc-300'}`} />
                  <span className="font-semibold text-zinc-800">{entry.status}</span>
                  {entry.note && <span className="text-zinc-500">({entry.note})</span>}
                </div>
                <span className="font-mono text-zinc-400 text-[11px]">{entry.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Details Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Ordered Items */}
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4">
          <h3 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-600" />
            <span>Purchased Items ({order.items.length})</span>
          </h3>

          <div className="space-y-3">
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-3 text-xs border-b border-zinc-100 pb-3 last:border-none">
                <img src={item.productImage} alt={item.productName} className="w-14 h-18 object-cover rounded-lg bg-zinc-100" />
                <div className="flex-1 space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-amber-700">{item.brand}</span>
                  <h4 className="font-bold text-zinc-900">{item.productName}</h4>
                  <p className="text-zinc-500 text-[11px]">Size: {item.selectedSize} • Color: {item.selectedColor} • Qty: {item.quantity}</p>
                  <div className="font-mono font-bold text-zinc-950 pt-0.5">₹{(item.price * item.quantity).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-100 space-y-1 text-xs text-zinc-600 font-mono">
            <div className="flex justify-between"><span>Subtotal:</span><span>₹{order.subtotal.toLocaleString()}</span></div>
            {order.discountAmount > 0 && <div className="flex justify-between text-amber-700"><span>Discount:</span><span>- ₹{order.discountAmount.toLocaleString()}</span></div>}
            <div className="flex justify-between"><span>Shipping:</span><span>{order.shippingFee === 0 ? 'FREE' : `₹${order.shippingFee}`}</span></div>
            <div className="flex justify-between font-bold text-sm text-zinc-950 pt-1 border-t"><span>Total Paid:</span><span>₹{order.totalAmount.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Address & Payment Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-3 text-xs">
            <h3 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Shipping Address</span>
            </h3>

            <div className="space-y-1 text-zinc-700 leading-relaxed">
              <div className="font-bold text-zinc-950">{order.shippingAddress.fullName}</div>
              <div>📞 {order.shippingAddress.phone}</div>
              <div>{order.shippingAddress.street}</div>
              <div>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
              <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 bg-zinc-100 text-zinc-800 rounded-sm">
                Tag: {order.shippingAddress.addressType}
              </span>
            </div>
          </div>

          <div className="bg-zinc-900 text-white p-6 rounded-2xl space-y-3 text-xs">
            <h3 className="font-serif font-bold text-sm text-amber-400">Payment Information</h3>
            <div className="flex justify-between">
              <span>Payment Mode:</span>
              <strong className="text-white">{order.paymentMethod}</strong>
            </div>
            <div className="flex justify-between">
              <span>Payment Status:</span>
              <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-sm">
                {order.paymentStatus}
              </span>
            </div>
            {order.paymentId && (
              <div className="flex justify-between font-mono text-[10px] text-zinc-400">
                <span>Transaction ID:</span>
                <span>{order.paymentId}</span>
              </div>
            )}
            <p className="text-[11px] text-zinc-400 border-t border-zinc-800 pt-3">
              Need assistance or size exchange? Contact our hotline: <strong className="text-amber-400 font-mono">{HOTLINE_NUMBER}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
