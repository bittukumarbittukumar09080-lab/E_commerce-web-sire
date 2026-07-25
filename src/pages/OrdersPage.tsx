import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { OrderTracking } from '../components/OrderTracking';
import { InvoiceModal } from '../components/InvoiceModal';
import { ComplaintCategory, ComplaintStatus, Order } from '../types';
import { HOTLINE_NUMBER } from '../data/mockData';
import { 
  Package, 
  ArrowRight, 
  PhoneCall, 
  MessageSquare, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Building2, 
  User, 
  MapPin, 
  X, 
  ShieldCheck,
  Send,
  HelpCircle,
  FileText,
  Sparkles,
  Printer,
  Download
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { 
    orders, 
    complaints,
    userBulkEnquiries,
    user, 
    selectedOrder, 
    setSelectedOrder, 
    setIsOtpModalOpen, 
    setOtpModalTargetRole,
    setActiveTab,
    submitComplaint
  } = useShop();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'complaints' | 'bulkEnquiries' | 'profile'>('orders');
  const [complaintFilter, setComplaintFilter] = useState<'All' | 'Active' | 'Resolved'>('All');
  const [isNewComplaintOpen, setIsNewComplaintOpen] = useState(false);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // New Complaint Form State
  const [newComplaintForm, setNewComplaintForm] = useState({
    orderNumber: '',
    category: 'Order Issue' as ComplaintCategory,
    subject: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent'
  });
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [complaintSuccessMessage, setComplaintSuccessMessage] = useState('');

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
          <Package className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">Customer Profile & Support Dashboard</h2>
          <p className="text-xs text-zinc-500">
            Please log in with your mobile OTP to view active orders, track complaints, and manage bulk quotes.
          </p>
        </div>
        <button
          onClick={() => {
            setOtpModalTargetRole('customer');
            setIsOtpModalOpen(true);
          }}
          className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          Login via Mobile OTP
        </button>
      </div>
    );
  }

  if (selectedOrder) {
    return (
      <div className="space-y-4 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <OrderTracking order={selectedOrder} />
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h4 className="font-bold text-xs text-amber-950">Having issues with Order #{selectedOrder.orderNumber}?</h4>
              <p className="text-[11px] text-amber-800">Submit a support ticket or request an exchange directly.</p>
            </div>
          </div>
          <button
            onClick={() => {
              setNewComplaintForm(prev => ({ ...prev, orderNumber: selectedOrder.orderNumber }));
              setSelectedOrder(null);
              setActiveSubTab('complaints');
              setIsNewComplaintOpen(true);
            }}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase shrink-0"
          >
            Raise Issue for this Order
          </button>
        </div>
      </div>
    );
  }

  const handleCreateComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintForm.subject.trim() || !newComplaintForm.description.trim()) return;

    setIsSubmittingComplaint(true);
    const success = await submitComplaint({
      orderNumber: newComplaintForm.orderNumber || undefined,
      category: newComplaintForm.category,
      subject: newComplaintForm.subject,
      description: newComplaintForm.description,
      priority: newComplaintForm.priority
    });

    setIsSubmittingComplaint(false);

    if (success) {
      setComplaintSuccessMessage('Your support ticket has been logged successfully! Our team will respond shortly.');
      setNewComplaintForm({
        orderNumber: '',
        category: 'Order Issue',
        subject: '',
        description: '',
        priority: 'Medium'
      });
      setTimeout(() => {
        setIsNewComplaintOpen(false);
        setComplaintSuccessMessage('');
      }, 2500);
    }
  };

  const filteredComplaints = complaints.filter(c => {
    if (complaintFilter === 'Active') return c.status === 'Open' || c.status === 'In Progress';
    if (complaintFilter === 'Resolved') return c.status === 'Resolved' || c.status === 'Closed';
    return true;
  });

  const getStatusBadge = (status: ComplaintStatus) => {
    switch (status) {
      case 'Open':
        return <span className="bg-blue-100 text-blue-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> Ticket Open</span>;
      case 'In Progress':
        return <span className="bg-amber-100 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><AlertCircle className="w-3 h-3" /> In Progress</span>;
      case 'Resolved':
        return <span className="bg-emerald-100 text-emerald-900 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Resolved</span>;
      case 'Closed':
        return <span className="bg-zinc-100 text-zinc-700 text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">Closed</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-800 to-amber-950 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-700/60 pb-4">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block">Customer Dashboard</span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                Welcome back, {user.name}
              </h1>
              <p className="text-xs text-zinc-300 mt-0.5">
                📞 Registered Phone: <span className="font-mono font-semibold text-amber-300">{user.phone}</span>
              </p>
            </div>
            <a
              href={`tel:${HOTLINE_NUMBER}`}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 self-start sm:self-center transition-all shadow-sm"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Helpline: {HOTLINE_NUMBER}</span>
            </a>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-zinc-300 uppercase tracking-wider block">Total Orders</span>
              <span className="text-xl font-bold font-mono text-amber-400">{orders.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-zinc-300 uppercase tracking-wider block">Support Tickets</span>
              <span className="text-xl font-bold font-mono text-amber-400">{complaints.length}</span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-zinc-300 uppercase tracking-wider block">Active Issues</span>
              <span className="text-xl font-bold font-mono text-amber-400">
                {complaints.filter(c => c.status === 'Open' || c.status === 'In Progress').length}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10">
              <span className="text-[10px] text-zinc-300 uppercase tracking-wider block">Bulk Enquiries</span>
              <span className="text-xl font-bold font-mono text-amber-400">{userBulkEnquiries.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-zinc-200 overflow-x-auto no-scrollbar gap-2 sm:gap-6">
        {[
          { id: 'orders', label: 'My Orders', icon: Package, count: orders.length },
          { id: 'complaints', label: 'Track Complaints', icon: MessageSquare, count: complaints.length },
          { id: 'bulkEnquiries', label: 'Bulk Inquiries', icon: Building2, count: userBulkEnquiries.length },
          { id: 'profile', label: 'Profile Settings', icon: User }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`py-3 px-4 text-xs font-bold uppercase tracking-wider whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
                isActive
                  ? 'border-amber-600 text-zinc-950 font-black'
                  : 'border-transparent text-zinc-500 hover:text-zinc-900 hover:border-zinc-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-600' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-amber-100 text-amber-900' : 'bg-zinc-100 text-zinc-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Invoice Modal Popup */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

      {/* SUB-TAB 1: ORDERS */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-lg font-bold text-zinc-900">Order History ({orders.length})</h2>
            <button
              onClick={() => setActiveTab('Shop')}
              className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center space-y-4">
              <Package className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-zinc-900">No Active Orders Placed</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Explore our handcrafted British shirts, blazers, and luxury leather accessories.
              </p>
              <button
                onClick={() => setActiveTab('Shop')}
                className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(ord => (
                <div
                  key={ord.id}
                  className="bg-white p-6 rounded-2xl border border-zinc-200 hover:border-amber-500 transition-all shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-50 text-amber-800 font-bold font-mono text-xs rounded-lg">
                        #{ord.orderNumber}
                      </div>
                      <span className="text-xs text-zinc-500">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full uppercase">
                        {ord.orderStatus}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-950">
                        ₹{ord.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Items summary */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {ord.items.slice(0, 3).map((it, i) => (
                        <img key={i} src={it.productImage} alt={it.productName} className="w-12 h-16 object-cover rounded-lg bg-zinc-100" />
                      ))}
                      <div>
                        <span className="font-bold text-xs text-zinc-900 block">
                          {ord.items[0].productName} {ord.items.length > 1 && `+ ${ord.items.length - 1} more items`}
                        </span>
                        <span className="text-[11px] text-zinc-500 block mt-0.5">Est. Delivery: {ord.estimatedDelivery}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap self-end sm:self-center">
                      <button
                        onClick={() => setSelectedInvoiceOrder(ord)}
                        className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer border border-amber-300"
                        title="View & Print Official GST Tax Receipt / Bill"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>View Bill / Receipt</span>
                      </button>

                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Track Status</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          setNewComplaintForm(prev => ({ ...prev, orderNumber: ord.orderNumber }));
                          setActiveSubTab('complaints');
                          setIsNewComplaintOpen(true);
                        }}
                        className="border border-zinc-300 hover:border-zinc-900 text-zinc-700 hover:text-zinc-900 font-bold px-3 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        title="Raise Support Complaint"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                        <span>Help</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: TRACK COMPLAINTS & SUPPORT */}
      {activeSubTab === 'complaints' && (
        <div className="space-y-6">
          {/* Top Bar for Complaints */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-amber-50/70 border border-amber-200 p-6 rounded-2xl">
            <div>
              <span className="text-amber-800 font-bold text-xs uppercase tracking-widest block">Helpdesk & Support</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-zinc-900 mt-0.5">
                Track Complaints & Support Tickets
              </h2>
              <p className="text-xs text-zinc-600 max-w-lg mt-1">
                View real-time status of your submitted order issues, size exchange requests, payment queries, or bulk inquiries.
              </p>
            </div>
            <button
              onClick={() => setIsNewComplaintOpen(true)}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 shadow-sm transition-all"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Raise Support Ticket</span>
            </button>
          </div>

          {/* New Complaint Form Drawer/Modal */}
          {isNewComplaintOpen && (
            <div className="bg-white border-2 border-amber-500/40 rounded-2xl p-6 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-zinc-900">Lodge Support Ticket / Complaint</h3>
                    <p className="text-xs text-zinc-500">Our customer care specialist will respond within 2 to 4 hours.</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsNewComplaintOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {complaintSuccessMessage && (
                <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 p-4 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{complaintSuccessMessage}</span>
                </div>
              )}

              <form onSubmit={handleCreateComplaint} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Issue Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={newComplaintForm.category}
                      onChange={(e) => setNewComplaintForm(prev => ({ ...prev, category: e.target.value as ComplaintCategory }))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-amber-600"
                    >
                      <option value="Wrong Size / Color">Wrong Size / Color Exchange</option>
                      <option value="Delivery Delay">Delivery Delay / Logistics Follow-up</option>
                      <option value="Damaged / Defective Item">Damaged / Defective Item Received</option>
                      <option value="Refund & Payment">Refund & Payment Query</option>
                      <option value="Bulk Order Inquiry">Bulk Order & Wholesale Status</option>
                      <option value="General Issue">General Support Query</option>
                    </select>
                  </div>

                  {/* Order Number link */}
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Associated Order (Optional)
                    </label>
                    <select
                      value={newComplaintForm.orderNumber}
                      onChange={(e) => setNewComplaintForm(prev => ({ ...prev, orderNumber: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-amber-600 font-mono"
                    >
                      <option value="">-- General / Non-order Query --</option>
                      {orders.map(o => (
                        <option key={o.id} value={o.orderNumber}>
                          Order #{o.orderNumber} ({new Date(o.createdAt).toLocaleDateString()} - ₹{o.totalAmount})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Priority & Subject */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Subject / Brief Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Need XL exchange for White Oxford Shirt"
                      value={newComplaintForm.subject}
                      onChange={(e) => setNewComplaintForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-hidden focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                      Urgency Level
                    </label>
                    <select
                      value={newComplaintForm.priority}
                      onChange={(e) => setNewComplaintForm(prev => ({ ...prev, priority: e.target.value as any }))}
                      className="w-full bg-zinc-50 border border-zinc-300 rounded-xl px-3 py-2.5 text-xs text-zinc-900 focus:outline-hidden"
                    >
                      <option value="Low">Low - Normal response</option>
                      <option value="Medium">Medium - Fast track</option>
                      <option value="High">High - Urgent dispatch</option>
                      <option value="Urgent">Urgent - Express call</option>
                    </select>
                  </div>
                </div>

                {/* Detailed Description */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase tracking-wider mb-1">
                    Detailed Message & Issue Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Provide details about your query or grievance..."
                    value={newComplaintForm.description}
                    onChange={(e) => setNewComplaintForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-xl p-3 text-xs text-zinc-900 focus:outline-hidden focus:border-amber-600"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewComplaintOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-zinc-300 text-xs font-bold text-zinc-700 hover:bg-zinc-100 uppercase"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingComplaint}
                    className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isSubmittingComplaint ? 'Registering Ticket...' : 'Submit Support Ticket'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Filter Status:</span>
              {(['All', 'Active', 'Resolved'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setComplaintFilter(f)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    complaintFilter === f
                      ? 'bg-zinc-900 text-amber-400'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <span className="text-xs text-zinc-500">
              Showing <strong className="text-zinc-900 font-mono">{filteredComplaints.length}</strong> tickets
            </span>
          </div>

          {/* Complaints List */}
          {filteredComplaints.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-serif font-bold text-base text-zinc-900">No Support Complaints Found</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                All your orders and queries are currently in good standing. Click "Raise Support Ticket" if you need any assistance.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredComplaints.map(cmp => (
                <div
                  key={cmp.id}
                  className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xs hover:border-amber-500 transition-all space-y-4"
                >
                  {/* Top Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs bg-zinc-900 text-amber-400 px-2.5 py-1 rounded-md">
                        #{cmp.ticketNumber}
                      </span>
                      {cmp.orderNumber && (
                        <span className="font-mono text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Order: #{cmp.orderNumber}
                        </span>
                      )}
                      <span className="text-xs text-zinc-400">
                        Log Date: {new Date(cmp.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {cmp.priority && (
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          cmp.priority === 'Urgent' || cmp.priority === 'High' ? 'bg-red-100 text-red-800' : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {cmp.priority} Priority
                        </span>
                      )}
                      {getStatusBadge(cmp.status)}
                    </div>
                  </div>

                  {/* Subject & Category */}
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-amber-700 block">
                      {cmp.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-zinc-900 mt-0.5">
                      {cmp.subject}
                    </h3>
                    <p className="text-xs text-zinc-600 mt-2 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                      "{cmp.description}"
                    </p>
                  </div>

                  {/* Official Response Box */}
                  {cmp.adminResponse && (
                    <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-amber-700 text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                            LS
                          </div>
                          <span className="font-bold text-xs text-amber-950">London Style Customer Service Reply</span>
                        </div>
                        <span className="text-[10px] text-amber-800 font-mono">
                          {cmp.updatedAt ? new Date(cmp.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Updated'}
                        </span>
                      </div>
                      <p className="text-xs text-amber-900 font-medium pl-8">
                        {cmp.adminResponse}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 3: BULK PURCHASE INQUIRIES */}
      {activeSubTab === 'bulkEnquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 text-white p-6 rounded-2xl">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-widest block">B2B & Wholesale</span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-white mt-0.5">
                Bulk Purchase & Corporate Quotes ({userBulkEnquiries.length})
              </h2>
              <p className="text-xs text-zinc-300 mt-1">
                Track status of custom corporate uniforms, bulk wedding orders, and wholesale swatches.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('BulkPurchase')}
              className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all shadow-sm"
            >
              <Building2 className="w-4 h-4" />
              <span>Submit New Bulk Request</span>
            </button>
          </div>

          {userBulkEnquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-zinc-200 text-center space-y-3">
              <Building2 className="w-12 h-12 text-zinc-400 mx-auto" />
              <h3 className="font-serif font-bold text-base text-zinc-900">No Bulk Enquiries Submitted</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                Need 50+ custom embroidered Oxford shirts or blazers for your corporate event? Request wholesale tier pricing.
              </p>
              <button
                onClick={() => setActiveTab('BulkPurchase')}
                className="bg-zinc-900 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider"
              >
                Request Corporate Quote
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {userBulkEnquiries.map(b => (
                <div key={b.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xs space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs bg-amber-100 text-amber-900 px-2.5 py-1 rounded-md">
                        #{b.id}
                      </span>
                      <span className="font-bold text-xs text-zinc-900">
                        {b.companyName || 'Individual Bulk Quote'}
                      </span>
                      <span className="text-xs text-zinc-400">
                        {new Date(b.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase ${
                      b.status === 'Contacted' ? 'bg-emerald-100 text-emerald-900' : 'bg-amber-100 text-amber-900'
                    }`}>
                      {b.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Category</span>
                      <span className="font-semibold text-zinc-900">{b.category}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Estimated Qty</span>
                      <span className="font-mono font-bold text-amber-700">{b.estimatedQuantity} Units</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-400 uppercase font-bold block">Contact Details</span>
                      <span className="font-medium text-zinc-800">{b.email} ({b.phone})</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-600 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                    "{b.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: PROFILE SETTINGS */}
      {activeSubTab === 'profile' && (
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 border-b border-zinc-200 pb-6">
            <div className="w-16 h-16 bg-zinc-900 text-amber-400 rounded-2xl flex items-center justify-center font-serif font-bold text-2xl shadow-sm">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-serif font-bold text-2xl text-zinc-900">{user.name}</h2>
              <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                <span>📞 Mobile: <strong className="text-zinc-800 font-mono">{user.phone}</strong></span>
                <span>•</span>
                <span>Role: <strong className="text-amber-700 uppercase font-bold">{user.role}</strong></span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>OTP Verified Identity</span>
                </h3>
                <span className="text-[10px] uppercase font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs text-zinc-500">
                Your account is authenticated via 2-factor mobile OTP to ensure high security for orders and payments.
              </p>
            </div>

            <div className="bg-zinc-50 p-5 rounded-2xl border border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-zinc-900 flex items-center gap-2">
                  <PhoneCall className="w-4 h-4 text-amber-600" />
                  <span>London Style Support</span>
                </h3>
              </div>
              <p className="text-xs text-zinc-500">
                Need urgent assistance? Call our direct hotline anytime at <strong className="text-zinc-900 font-mono">{HOTLINE_NUMBER}</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
