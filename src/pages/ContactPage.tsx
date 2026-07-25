import React, { useState } from 'react';
import { HOTLINE_NUMBER } from '../data/mockData';
import { PhoneCall, Mail, MapPin, Headphones, Send, CheckCircle2, Building2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Support / Order Query', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <div className="border-b border-zinc-200 pb-4">
        <span className="text-amber-700 text-xs font-bold uppercase tracking-widest block">24/7 Customer Care</span>
        <h1 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-900">
          Contact Us & Support Helpline
        </h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left Column: Direct Hotline Cards */}
        <div className="space-y-6">
          <div className="bg-zinc-900 text-white p-8 rounded-3xl space-y-4 shadow-xl border border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-amber-500 text-zinc-950 rounded-2xl flex items-center justify-center font-bold">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase text-amber-400 tracking-wider">Toll-Free Customer Hotline</span>
                <h3 className="font-mono text-2xl font-black">{HOTLINE_NUMBER}</h3>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed border-t border-zinc-800 pt-3">
              Dial <strong>{HOTLINE_NUMBER}</strong> for immediate order tracking, complaints resolution, size exchange, or bulk corporate quotes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 shadow-2xs">
            <h3 className="font-serif font-bold text-base text-zinc-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>Head Office Address</span>
            </h3>

            <div className="text-xs text-zinc-600 space-y-2 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>London Style Flagship Store & Corporate Office</strong><br />
                  Plot 14, Savile Row Fashion Hub, Bandra Kurla Complex (BKC), Mumbai, Maharashtra - 400051
                </span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <Mail className="w-4 h-4 text-amber-700 shrink-0" />
                <span>support@londonstyle.in | complaints@londonstyle.in</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Complaints Form */}
        <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-6 shadow-2xs">
          <h3 className="font-serif font-bold text-xl text-zinc-900">Send Message or File Complaint</h3>

          {submitted ? (
            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-emerald-900">Message Received!</h4>
              <p className="text-xs text-emerald-800">
                Our support representative will contact you on <strong>{form.phone}</strong> within 1 hour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono text-zinc-900 focus:outline-hidden focus:border-amber-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Subject Category</label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden"
                >
                  <option value="Support / Order Query">Support / Order Query</option>
                  <option value="Complaint Registration">File Official Complaint</option>
                  <option value="Size Exchange Request">Size / Product Exchange</option>
                  <option value="Bulk Purchase Enquiry">Bulk / Wholesale Enquiry</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-zinc-700 mb-1">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue or order number..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-zinc-900 focus:outline-hidden focus:border-amber-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-6 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4 text-amber-400" />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
