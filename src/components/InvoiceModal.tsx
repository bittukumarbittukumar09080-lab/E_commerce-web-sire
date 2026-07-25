import React from 'react';
import { Order } from '../types';
import { HOTLINE_NUMBER } from '../data/mockData';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  FileText, 
  QrCode,
  Sparkles
} from 'lucide-react';

interface InvoiceModalProps {
  order: Order | null;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const rawOrderNum = order?.orderNumber ? String(order.orderNumber) : String(order?.id || '');
  const digitsOnly = rawOrderNum.replace(/[^0-9]/g, '');
  const invoiceNumber = `INV-LS-2026-${digitsOnly || Math.floor(1000 + Math.random() * 9000)}`;

  const orderDate = order?.createdAt 
    ? new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  // Calculate GST (Inclusive 18% tax breakdown for invoice)
  const subtotal = Number(order?.subtotal || order?.totalAmount || 0);
  const taxableSubtotal = Math.round(subtotal / 1.18);
  const totalGst = subtotal - taxableSubtotal;
  const cgst = Math.round(totalGst / 2);
  const sgst = totalGst - cgst;

  const shippingAddress = order?.shippingAddress || {
    fullName: order?.customerName || 'Customer',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: order?.customerPhone || ''
  };

  const items = order?.items || [];
  const totalAmount = Number(order?.totalAmount || subtotal || 0);
  const shippingFee = Number(order?.shippingFee || 0);
  const discountAmount = Number(order?.discountAmount || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-zinc-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white text-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-zinc-200 my-auto print:shadow-none print:border-none print:m-0 print:w-full print:max-w-none">
        
        {/* Top Action Bar (Hidden when printing) */}
        <div className="bg-zinc-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="font-serif font-bold text-sm sm:text-base">Official Purchase Tax Invoice / Bill</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-3.5 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Container */}
        <div className="p-6 sm:p-8 space-y-6 text-xs bg-white text-zinc-900" id="printable-bill">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 border-b-2 border-zinc-900 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-black text-2xl text-zinc-950 tracking-tight">LONDON STYLE</span>
                <span className="bg-amber-100 text-amber-900 text-[9px] font-bold px-2 py-0.5 rounded-xs uppercase">Official Receipt</span>
              </div>
              <p className="text-[11px] text-zinc-600 font-medium mt-1">London Style Apparel Pvt. Ltd.</p>
              <p className="text-[10px] text-zinc-500">Reg. Office: 42 Regal Street, Fort, Mumbai - 400001</p>
              <p className="text-[10px] text-zinc-500 font-mono">GSTIN: 27AABCL1234F1Z0 • Support: {HOTLINE_NUMBER}</p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block bg-zinc-100 px-3 py-1 rounded-lg border border-zinc-200">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Tax Invoice No.</span>
                <span className="font-mono font-bold text-sm text-zinc-950">{invoiceNumber}</span>
              </div>
              <p className="text-[11px] text-zinc-600">Order ID: <strong className="font-mono text-zinc-950">#{rawOrderNum || 'LS-2026'}</strong></p>
              <p className="text-[11px] text-zinc-600">Date: <strong className="text-zinc-950">{orderDate}</strong></p>
            </div>
          </div>

          {/* Customer & Payment Meta Grid */}
          <div className="grid grid-cols-2 gap-4 bg-zinc-50 p-4 rounded-xl border border-zinc-200">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">Billed & Shipped To</span>
              <p className="font-bold text-zinc-950 text-xs">{shippingAddress.fullName}</p>
              <p className="text-zinc-600 text-[11px] leading-tight">{shippingAddress.street}</p>
              <p className="text-zinc-600 text-[11px]">{shippingAddress.city}{shippingAddress.state ? `, ${shippingAddress.state}` : ''} {shippingAddress.pincode ? `- ${shippingAddress.pincode}` : ''}</p>
              {shippingAddress.phone && (
                <p className="text-zinc-600 text-[11px] font-mono">📞 {shippingAddress.phone}</p>
              )}
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] font-bold uppercase text-amber-800 tracking-wider block">Payment Details</span>
              <p className="text-zinc-700">Mode: <strong className="text-zinc-950 font-bold">{order.paymentMethod || 'UPI / Card'}</strong></p>
              <p className="text-zinc-700">
                Status:{' '}
                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-sm text-[10px]">
                  <CheckCircle2 className="w-3 h-3" /> {order.paymentStatus || 'Paid'}
                </span>
              </p>
              {order.paymentId && (
                <p className="text-[10px] font-mono text-zinc-500">TXN: {order.paymentId}</p>
              )}
            </div>
          </div>

          {/* Purchased Products Table */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase text-zinc-700 tracking-wider">Itemized Purchase Summary</h4>
            <div className="border border-zinc-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-700 font-bold text-[11px] border-b border-zinc-200">
                    <th className="p-2.5">Item Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-[11px]">
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="p-2.5">
                        <div className="font-bold text-zinc-900">{item.productName}</div>
                        <div className="text-[10px] text-zinc-500">
                          Brand: {item.brand || 'London Style'} {item.selectedSize ? `• Size: ${item.selectedSize}` : ''} {item.selectedColor ? `• Color: ${item.selectedColor}` : ''}
                        </div>
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold">{item.quantity}</td>
                      <td className="p-2.5 text-right font-mono">₹{(item.price || 0).toLocaleString()}</td>
                      <td className="p-2.5 text-right font-mono font-bold text-zinc-950">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tax & Total Calculations */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-t border-zinc-200 pt-4">
            
            {/* Authenticity Stamp / Barcode */}
            <div className="space-y-2 max-w-xs">
              <div className="flex items-center gap-3 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <QrCode className="w-8 h-8 text-zinc-900 shrink-0" />
                <div>
                  <span className="font-bold text-[10px] text-amber-900 block uppercase">Digitally Verified Invoice</span>
                  <span className="text-[9px] text-amber-700 leading-none block">Scan barcode to verify GST tax compliance.</span>
                </div>
              </div>
              <div className="text-[9px] text-zinc-400 leading-tight">
                This is a computer generated tax receipt and does not require a physical signature.
              </div>
            </div>

            {/* Bill Summary Breakdown */}
            <div className="w-full sm:w-64 space-y-1.5 text-xs text-zinc-700 font-mono">
              <div className="flex justify-between">
                <span>Taxable Amount:</span>
                <span>₹{taxableSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>CGST (9%):</span>
                <span>₹{cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-500 text-[11px]">
                <span>SGST (9%):</span>
                <span>₹{sgst.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-amber-700 font-bold">
                  <span>Coupon Discount:</span>
                  <span>- ₹{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee:</span>
                <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-zinc-950 pt-2 border-t-2 border-zinc-900">
                <span>Grand Total Paid:</span>
                <span className="text-amber-700 font-black">₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* Footer Note */}
          <div className="border-t border-zinc-100 pt-4 text-center text-[10px] text-zinc-500 space-y-1">
            <p className="font-serif font-bold text-zinc-800 text-xs">Thank you for shopping with London Style!</p>
            <p>For return policies, warranty, or support inquiries, contact us at <span className="font-mono text-zinc-700">{HOTLINE_NUMBER}</span>.</p>
          </div>

        </div>

        {/* Bottom Modal Actions (Hidden when printing) */}
        <div className="bg-zinc-50 px-6 py-4 border-t border-zinc-200 flex flex-col sm:flex-row justify-between items-center gap-3 print:hidden">
          <span className="text-[11px] text-zinc-500">
            Need a copy for expense claim? Click <strong>Print / Save PDF</strong>.
          </span>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 sm:flex-none bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Bill</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold px-4 py-2 rounded-xl text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
