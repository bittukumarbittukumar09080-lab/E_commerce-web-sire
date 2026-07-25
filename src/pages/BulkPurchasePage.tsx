import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { HOTLINE_NUMBER } from '../data/mockData';
import { Building2, PhoneCall, Mail, CheckCircle2, Award, ShieldCheck, Send } from 'lucide-react';

export const BulkPurchasePage: React.FC = () => {
  const { submitBulkEnquiry } = useShop();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    companyName: '',
    category: 'Shirts',
    estimatedQuantity: 50,
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await submitBulkEnquiry(formData);
    setLoading(false);
    if (success) {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Banner */}
      <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 border border-amber-500/30 grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4" />
            <span>Corporate & Wholesale Department</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold leading-tight">
            Bulk Orders, Uniforms & Wholesale Enquiries
          </h1>
          <p className="text-zinc-300 text-sm leading-relaxed">
            Need high-volume formal shirts, blazers, trousers, or leather gift sets for corporate gifting, hotel staff, or special events? London Style offers direct manufacturer pricing with custom embroidery & monograms.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs">
            <a 
              href={`tel:${HOTLINE_NUMBER}`}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black px-6 py-3 rounded-xl flex items-center gap-2 transition-all font-mono"
            >
              <PhoneCall className="w-4 h-4" /> Direct Hotline: {HOTLINE_NUMBER}
            </a>
          </div>
        </div>

        <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 space-y-3 text-xs">
          <h3 className="font-serif font-bold text-amber-400 text-sm">Why Choose London Style Wholesale?</h3>
          <ul className="space-y-2 text-zinc-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Discounted tier pricing up to 45% OFF M.R.P</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Custom logo embroidery & bespoke sizing options</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>Dedicated account manager & priority sample dispatch</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              <span>GST Tax invoice with 100% input tax credit</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Quote Form */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-6 sm:p-10 max-w-3xl mx-auto shadow-2xs space-y-6">
        <div className="text-center space-y-1">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">Request Bulk Price Quotation</h2>
          <p className="text-xs text-zinc-500">
            Fill in your requirements below. Our commercial team will call you within 2 hours.
          </p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-emerald-900">Enquiry Received Successfully!</h3>
            <p className="text-xs text-emerald-800 max-w-md mx-auto">
              Thank you {formData.name}. Our wholesale manager will contact you on <strong>{formData.phone}</strong> shortly.
            </p>
            <div className="pt-2">
              <a
                href={`tel:${HOTLINE_NUMBER}`}
                className="inline-flex items-center gap-2 bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl font-mono"
              >
                <PhoneCall className="w-4 h-4" /> Call Hotline Directly: {HOTLINE_NUMBER}
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-zinc-700 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Mobile Phone Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="e.g. 9507457956"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rajesh@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Company / Organization Name</label>
                <input
                  type="text"
                  placeholder="e.g. LuxCorp Enterprises"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Product Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden"
                >
                  <option value="Shirts">Formal & Oxford Shirts</option>
                  <option value="T-Shirts">Polo & Supima T-Shirts</option>
                  <option value="Blazers">Wool & Linen Blazers</option>
                  <option value="Trousers">Chinos & Trousers</option>
                  <option value="Shoes">Leather Oxfords & Shoes</option>
                  <option value="Accessories">Cufflinks & Leather Belts</option>
                  <option value="Perfumes">Fragrances & Perfumes</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Estimated Quantity (Units) *</label>
                <input
                  type="number"
                  min={10}
                  required
                  value={formData.estimatedQuantity}
                  onChange={(e) => setFormData({ ...formData, estimatedQuantity: Number(e.target.value) })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-zinc-700 mb-1">Requirement Details & Notes</label>
              <textarea
                rows={3}
                placeholder="Mention specific colors, sizes, custom logo embroidery, or target delivery date..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-black py-3.5 px-6 rounded-xl text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-amber-400" />
              <span>{loading ? 'Submitting Quote Request...' : 'Submit Wholesale Quote Request'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
