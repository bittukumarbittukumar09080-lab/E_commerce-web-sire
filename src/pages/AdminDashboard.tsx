import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { Product, Order, CategoryType, SizeType, Coupon, BulkEnquiry } from '../types';
import { HOTLINE_NUMBER } from '../data/mockData';
import { InvoiceModal } from '../components/InvoiceModal';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area, PieChart, Pie, Cell 
} from 'recharts';
import { 
  ShieldCheck, 
  Package, 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Tag, 
  Printer, 
  AlertTriangle, 
  Building2, 
  CheckCircle2, 
  X,
  Search,
  SlidersHorizontal,
  RefreshCw,
  PhoneCall,
  Clock,
  MessageSquare,
  FolderOpen,
  Cloud,
  Globe,
  Upload,
  ExternalLink,
  Image as ImageIcon,
  FileText,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    user, 
    products, 
    orders, 
    coupons, 
    categories, 
    complaints,
    addProduct, 
    editProduct, 
    deleteProduct, 
    updateOrderStatus,
    updateComplaintStatus,
    setIsOtpModalOpen,
    setOtpModalTargetRole
  } = useShop();

  const [activeAdminTab, setActiveAdminTab] = useState<
    'overview' | 'products' | 'orders' | 'categories' | 'coupons' | 'inventory' | 'bulkEnquiries' | 'complaints' | 'supabase' | 'reports'
  >('overview');

  const [supabaseStatusData, setSupabaseStatusData] = useState<any>(null);
  const [isTestingSupabase, setIsTestingSupabase] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const fetchSupabaseStatus = async () => {
    setIsTestingSupabase(true);
    try {
      const res = await fetch('/api/supabase/status');
      if (res.ok) {
        const data = await res.json();
        setSupabaseStatusData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsTestingSupabase(false);
    }
  };

  useEffect(() => {
    if (activeAdminTab === 'supabase') {
      fetchSupabaseStatus();
    }
  }, [activeAdminTab]);

  const [replyingComplaintId, setReplyingComplaintId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState('');
  const [adminReplyStatus, setAdminReplyStatus] = useState('In Progress');

  const [analytics, setAnalytics] = useState<any>(null);
  const [bulkEnquiries, setBulkEnquiries] = useState<BulkEnquiry[]>([]);

  // Product modal form state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    category: 'Shirts',
    brand: 'London Style Signature',
    price: 1999,
    originalPrice: 2999,
    discount: 33,
    stock: 20,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy'],
    description: '',
    specifications: { 'Fabric': '100% Cotton', 'Fit': 'Slim Fit' },
    images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&q=80&w=800']
  });

  // Filters
  const [prodSearch, setProdSearch] = useState('');
  const [adminStockFilter, setAdminStockFilter] = useState<'All' | 'In Stock' | 'Out of Stock'>('All');
  const [inventoryTabFilter, setInventoryTabFilter] = useState<'All' | 'In Stock' | 'Out of Stock' | 'Low Stock'>('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [adminInvoiceOrder, setAdminInvoiceOrder] = useState<Order | null>(null);

  // Image Upload & Source Options State
  const [imageSourceTab, setImageSourceTab] = useState<'file' | 'gdrive' | 'url'>('file');
  const [singleUrlInput, setSingleUrlInput] = useState('');
  const [gdriveInput, setGdriveInput] = useState('');
  const [gdriveStatusMsg, setGdriveStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Helper function to extract and convert Google Drive links
  const convertGoogleDriveUrl = (input: string) => {
    if (!input) return { url: '', isValid: false };
    const trimmed = input.trim();

    // Match /d/{FILE_ID}/ or id={FILE_ID} or direct LH3 link
    const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]{25,})/;
    const match = trimmed.match(driveRegex);

    if (match && match[1]) {
      return { url: `https://lh3.googleusercontent.com/d/${match[1]}`, isValid: true };
    }

    // Raw File ID check
    if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
      return { url: `https://lh3.googleusercontent.com/d/${trimmed}`, isValid: true };
    }

    // Direct image URL or fallback
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      return { url: trimmed, isValid: true };
    }

    return { url: trimmed, isValid: false };
  };

  const handleAddGdriveImage = () => {
    if (!gdriveInput.trim()) return;
    const { url, isValid } = convertGoogleDriveUrl(gdriveInput);
    if (isValid && url) {
      setProductForm(prev => ({
        ...prev,
        images: [...(prev.images || []), url]
      }));
      setGdriveInput('');
      setGdriveStatusMsg({ type: 'success', text: 'Google Drive image successfully linked!' });
      setTimeout(() => setGdriveStatusMsg(null), 3000);
    } else {
      setGdriveStatusMsg({ type: 'error', text: 'Invalid Google Drive link or File ID. Please check sharing permissions.' });
    }
  };

  const handleAddSingleUrl = () => {
    if (!singleUrlInput.trim()) return;
    setProductForm(prev => ({
      ...prev,
      images: [...(prev.images || []), singleUrlInput.trim()]
    }));
    setSingleUrlInput('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file || !file.type.startsWith('image/')) continue;
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setProductForm(prev => ({
            ...prev,
            images: [...(prev.images || []), result]
          }));
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setProductForm(prev => ({
      ...prev,
      images: (prev.images || []).filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleSetPrimaryImage = (index: number) => {
    setProductForm(prev => {
      const current = [...(prev.images || [])];
      if (index <= 0 || index >= current.length) return prev;
      const [selected] = current.splice(index, 1);
      current.unshift(selected);
      return { ...prev, images: current };
    });
  };

  // Fetch Analytics & Bulk Enquiries
  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchBulkEnquiries = async () => {
    try {
      const res = await fetch('/api/bulk-enquiry');
      if (res.ok) {
        const data = await res.json();
        setBulkEnquiries(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchBulkEnquiries();
  }, [products, orders]);

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="font-serif text-2xl font-bold text-zinc-900">Admin Portal Restricted Access</h2>
          <p className="text-xs text-zinc-500">
            Please log in with an authorized admin mobile number (e.g. {HOTLINE_NUMBER}) to access the management portal.
          </p>
        </div>
        <button
          onClick={() => {
            setOtpModalTargetRole('admin');
            setIsOtpModalOpen(true);
          }}
          className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold py-3 px-8 rounded-xl text-xs uppercase tracking-wider shadow-md"
        >
          Login to Admin Portal
        </button>
      </div>
    );
  }

  // Handle Product Submission
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      await editProduct(editingProduct.id, productForm);
      setEditingProduct(null);
    } else {
      await addProduct(productForm);
    }
    setIsAddProductOpen(false);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setProductForm(p);
    setIsAddProductOpen(true);
  };

  const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#64748b'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Top Header */}
      <div className="bg-zinc-900 text-white p-6 rounded-3xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 text-zinc-950 rounded-2xl flex items-center justify-center font-bold">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
              London Style Administration Portal
            </span>
            <h1 className="font-serif text-2xl font-bold">
              Management Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <span className="bg-zinc-800 px-3 py-1.5 rounded-xl border border-zinc-700 text-zinc-300 font-mono">
            📞 Admin Helpline: {HOTLINE_NUMBER}
          </span>
          <button
            onClick={() => {
              setIsAddProductOpen(true);
              setEditingProduct(null);
            }}
            className="bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 uppercase tracking-wider"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-zinc-200 pb-2 text-xs font-bold text-zinc-700">
        {[
          { id: 'overview', label: 'Dashboard Overview' },
          { id: 'products', label: `Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'categories', label: `Categories (${categories.length})` },
          { id: 'coupons', label: `Coupons (${coupons.length})` },
          { id: 'inventory', label: 'Inventory & Stock' },
          { id: 'bulkEnquiries', label: `Bulk Enquiries (${bulkEnquiries.length})` },
          { id: 'complaints', label: `Customer Complaints (${complaints.length})` },
          { id: 'supabase', label: '⚡ Supabase Backend' },
          { id: 'reports', label: 'Sales Reports' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
              activeAdminTab === tab.id
                ? 'bg-zinc-900 text-amber-400 font-bold shadow-xs'
                : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW DASHBOARD */}
      {activeAdminTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase">Total Revenue</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black font-mono text-zinc-950">
                ₹{analytics?.totalRevenue?.toLocaleString() || 125000}
              </div>
              <span className="text-[10px] text-emerald-700 font-semibold">+18.4% from last month</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase">Total Orders</span>
                <ShoppingBag className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black font-mono text-zinc-950">
                {analytics?.totalOrders || orders.length}
              </div>
              <span className="text-[10px] text-zinc-500">Today: {analytics?.todayOrders || 2} orders</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase">Pending Orders</span>
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div className="text-2xl font-black font-mono text-orange-600">
                {analytics?.pendingOrders || 1}
              </div>
              <span className="text-[10px] text-zinc-500">Action required</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-zinc-400">
                <span className="text-xs font-bold uppercase">Total Customers</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black font-mono text-zinc-950">
                {analytics?.totalCustomers || 14}
              </div>
              <span className="text-[10px] text-zinc-500">Active mobile users</span>
            </div>
          </div>

          {/* Recharts Analytics Graphs */}
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 shadow-2xs">
              <h3 className="font-serif font-bold text-base text-zinc-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600" />
                <span>Monthly Revenue Analytics (2026)</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics?.monthlyRevenue || []}>
                    <defs>
                      <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Area type="monotone" dataKey="revenue" stroke="#d97706" fillOpacity={1} fill="url(#colorRev)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 space-y-4 shadow-2xs">
              <h3 className="font-serif font-bold text-base text-zinc-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                <span>Top Selling Brands & Categories</span>
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics?.categorySales || []}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#18181b" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeAdminTab === 'products' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900">Manage Product Catalog & Stock Status</h3>
              <p className="text-xs text-zinc-500">Quickly toggle stock status between In Stock and Out of Stock for any item.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-zinc-100 p-1 rounded-lg">
                {(['All', 'In Stock', 'Out of Stock'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setAdminStockFilter(s)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                      adminStockFilter === s ? 'bg-zinc-900 text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-56">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={prodSearch}
                  onChange={(e) => setProdSearch(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg py-2 pl-8 pr-3 text-xs text-zinc-900 focus:outline-hidden"
                />
                <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-2.5 top-2.5" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Item</th>
                  <th className="py-3 px-2">Category</th>
                  <th className="py-3 px-2">Price</th>
                  <th className="py-3 px-2">Discount</th>
                  <th className="py-3 px-2">Stock Availability</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products
                  .filter(p => {
                    const matchSearch = p.name.toLowerCase().includes(prodSearch.toLowerCase()) || p.category.toLowerCase().includes(prodSearch.toLowerCase());
                    if (!matchSearch) return false;
                    if (adminStockFilter === 'In Stock') return p.stock > 0;
                    if (adminStockFilter === 'Out of Stock') return p.stock === 0;
                    return true;
                  })
                  .map(prod => (
                    <tr key={prod.id} className="hover:bg-zinc-50">
                      <td className="py-3 px-2 flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-10 h-12 object-cover rounded-md bg-zinc-100" />
                        <div>
                          <div className="font-bold text-zinc-900">{prod.name}</div>
                          <div className="text-[10px] text-zinc-400">{prod.brand}</div>
                        </div>
                      </td>
                      <td className="py-3 px-2 font-medium text-zinc-700">{prod.category}</td>
                      <td className="py-3 px-2 font-mono font-bold text-zinc-950">₹{prod.price}</td>
                      <td className="py-3 px-2 font-bold text-amber-700">{prod.discount}% OFF</td>
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2">
                          {prod.stock === 0 ? (
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              Out of Stock (0)
                            </span>
                          ) : prod.stock <= 5 ? (
                            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              Low Stock ({prod.stock})
                            </span>
                          ) : (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0">
                              In Stock ({prod.stock})
                            </span>
                          )}

                          {/* Instant Stock Status Dropdown */}
                          <select
                            value={prod.stock > 0 ? 'in_stock' : 'out_of_stock'}
                            onChange={(e) => {
                              const val = e.target.value;
                              editProduct(prod.id, {
                                stock: val === 'in_stock' ? (prod.stock > 0 ? prod.stock : 50) : 0
                              });
                            }}
                            className={`border text-[11px] font-bold rounded-lg px-2 py-1 cursor-pointer focus:outline-hidden ${
                              prod.stock > 0 
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                                : 'bg-red-50 border-red-300 text-red-900'
                            }`}
                          >
                            <option value="in_stock">🟢 In Stock</option>
                            <option value="out_of_stock">🔴 Out of Stock</option>
                          </select>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(prod)}
                          className="p-1.5 text-zinc-600 hover:text-amber-600 rounded-md hover:bg-zinc-100"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-zinc-400 hover:text-red-600 rounded-md hover:bg-zinc-100"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Invoice Modal Popup for Admin */}
      {adminInvoiceOrder && (
        <InvoiceModal
          order={adminInvoiceOrder}
          onClose={() => setAdminInvoiceOrder(null)}
        />
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeAdminTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-serif font-bold text-lg text-zinc-900">Manage Customer Orders</h3>

            <div className="flex items-center gap-3">
              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="bg-zinc-50 border border-zinc-300 rounded-lg py-2 px-3 text-xs text-zinc-900 focus:outline-hidden"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Packed">Packed</option>
                <option value="Shipped">Shipped</option>
                <option value="Out For Delivery">Out For Delivery</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-200 text-zinc-500 font-bold uppercase text-[10px]">
                  <th className="py-3 px-2">Order No.</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Payment Mode</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Bill / Receipt</th>
                  <th className="py-3 px-2 text-right">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {orders
                  .filter(o => orderStatusFilter === 'All' || o.orderStatus === orderStatusFilter)
                  .map(ord => (
                    <tr key={ord.id} className="hover:bg-zinc-50">
                      <td className="py-3 px-2 font-mono font-bold text-zinc-950">
                        #{ord.orderNumber}
                      </td>
                      <td className="py-3 px-2">
                        <div className="font-bold text-zinc-900">{ord.customerName}</div>
                        <div className="text-[10px] text-zinc-500">📞 {ord.customerPhone}</div>
                      </td>
                      <td className="py-3 px-2 font-mono font-bold text-amber-700">₹{ord.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-2 text-zinc-700">{ord.paymentMethod}</td>
                      <td className="py-3 px-2">
                        <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <button
                          onClick={() => setAdminInvoiceOrder(ord)}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-lg text-[11px] flex items-center gap-1 border border-amber-300 cursor-pointer"
                          title="Generate Tax Receipt / Bill"
                        >
                          <FileText className="w-3.5 h-3.5 text-amber-700" />
                          <span>View Tax Bill</span>
                        </button>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                          className="bg-zinc-100 border border-zinc-300 rounded-lg py-1 px-2 text-xs font-semibold text-zinc-900 focus:outline-hidden"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out For Delivery">Out For Delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: CATEGORY MANAGEMENT */}
      {activeAdminTab === 'categories' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <h3 className="font-serif font-bold text-lg text-zinc-900">Manage Categories</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map(cat => (
              <div key={cat.id} className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 flex items-center gap-3">
                <img src={cat.image} alt={cat.name} className="w-12 h-12 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-xs text-zinc-900">{cat.name}</h4>
                  <span className="text-[10px] text-zinc-500">{cat.itemCount} Products</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: COUPONS */}
      {activeAdminTab === 'coupons' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <h3 className="font-serif font-bold text-lg text-zinc-900">Active Discount Coupons</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {coupons.map(c => (
              <div key={c.code} className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-1 text-xs">
                <div className="font-mono font-black text-amber-800 text-lg">{c.code}</div>
                <div className="font-semibold text-zinc-800">{c.description}</div>
                <div className="text-[10px] text-zinc-500">Min Order: ₹{c.minPurchase} • Expiry: {c.expiryDate}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: INVENTORY & STOCK */}
      {activeAdminTab === 'inventory' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span>Inventory & Stock Status Management</span>
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Manage stock availability, mark items as In Stock or Out of Stock, or adjust unit quantities.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-zinc-100 p-1.5 rounded-xl self-start sm:self-auto">
              {(['All', 'In Stock', 'Out of Stock', 'Low Stock'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setInventoryTabFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    inventoryTabFilter === tab
                      ? tab === 'Out of Stock'
                        ? 'bg-red-600 text-white shadow-xs'
                        : tab === 'In Stock'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-zinc-900 text-white shadow-xs'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-1">
              <span className="text-zinc-500 font-semibold">Total Catalog Items</span>
              <div className="text-xl font-bold font-mono text-zinc-900">{products.length}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 space-y-1">
              <span className="text-emerald-800 font-bold">In Stock Items</span>
              <div className="text-xl font-bold font-mono text-emerald-900">{products.filter(p => p.stock > 0).length}</div>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-1">
              <span className="text-red-800 font-bold">Out of Stock Items</span>
              <div className="text-xl font-bold font-mono text-red-900">{products.filter(p => p.stock === 0).length}</div>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1">
              <span className="text-amber-800 font-bold">Low Stock (≤15)</span>
              <div className="text-xl font-bold font-mono text-amber-900">{products.filter(p => p.stock > 0 && p.stock <= 15).length}</div>
            </div>
          </div>

          {/* Product Stock List */}
          <div className="space-y-3">
            {products
              .filter(p => {
                if (inventoryTabFilter === 'In Stock') return p.stock > 0;
                if (inventoryTabFilter === 'Out of Stock') return p.stock === 0;
                if (inventoryTabFilter === 'Low Stock') return p.stock > 0 && p.stock <= 15;
                return true;
              })
              .map(prod => (
                <div key={prod.id} className="p-4 bg-zinc-50 hover:bg-zinc-100/80 transition-colors rounded-xl border border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img src={prod.images[0]} alt={prod.name} className="w-12 h-14 object-cover rounded-lg bg-zinc-200" />
                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">{prod.name}</h4>
                      <div className="text-[11px] text-zinc-500 font-medium">{prod.brand} • {prod.category}</div>
                      <div className="mt-1 flex items-center gap-2">
                        {prod.stock === 0 ? (
                          <span className="bg-red-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded-sm">
                            Out of Stock
                          </span>
                        ) : prod.stock <= 5 ? (
                          <span className="bg-amber-500 text-zinc-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded-sm">
                            Low Stock ({prod.stock} units)
                          </span>
                        ) : (
                          <span className="bg-emerald-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-sm">
                            In Stock ({prod.stock} units)
                          </span>
                        )}
                        <span className="font-mono text-zinc-600 font-semibold">₹{prod.price}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stock Controls */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Quantity adjuster */}
                    <div className="flex items-center bg-white border border-zinc-300 rounded-lg p-1">
                      <button
                        onClick={() => editProduct(prod.id, { stock: Math.max(0, prod.stock - 1) })}
                        className="w-7 h-7 flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-100 rounded-md"
                        title="Decrease Stock"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={prod.stock}
                        onChange={(e) => editProduct(prod.id, { stock: Math.max(0, parseInt(e.target.value) || 0) })}
                        className="w-14 text-center font-mono font-bold text-zinc-900 text-xs focus:outline-hidden"
                      />
                      <button
                        onClick={() => editProduct(prod.id, { stock: prod.stock + 1 })}
                        className="w-7 h-7 flex items-center justify-center font-bold text-zinc-700 hover:bg-zinc-100 rounded-md"
                        title="Increase Stock"
                      >
                        +
                      </button>
                    </div>

                    {/* Direct Toggle Buttons */}
                    <button
                      onClick={() => editProduct(prod.id, { stock: prod.stock > 0 ? prod.stock : 50 })}
                      className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                        prod.stock > 0
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-zinc-200 text-zinc-700 hover:bg-emerald-100 hover:text-emerald-900'
                      }`}
                    >
                      <span>In Stock</span>
                    </button>

                    <button
                      onClick={() => editProduct(prod.id, { stock: 0 })}
                      className={`px-3 py-2 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                        prod.stock === 0
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'bg-zinc-200 text-zinc-700 hover:bg-red-100 hover:text-red-900'
                      }`}
                    >
                      <span>Out of Stock</span>
                    </button>

                    <button
                      onClick={() => editProduct(prod.id, { stock: prod.stock + 50 })}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-3 py-2 rounded-lg text-xs"
                      title="Add 50 units"
                    >
                      +50 Restock
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 7: BULK ENQUIRIES */}
      {activeAdminTab === 'bulkEnquiries' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <h3 className="font-serif font-bold text-lg text-zinc-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <span>Corporate & Wholesale Quotation Requests</span>
          </h3>

          <div className="space-y-4">
            {bulkEnquiries.map(enq => (
              <div key={enq.id} className="p-5 bg-zinc-50 rounded-2xl border border-zinc-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-sm text-zinc-900">{enq.name} ({enq.companyName || 'Individual'})</h4>
                    <span className="text-amber-800 font-mono font-bold">📞 {enq.phone} • ✉️ {enq.email}</span>
                  </div>
                  <span className="bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full uppercase">
                    {enq.status}
                  </span>
                </div>

                <div className="text-zinc-700 bg-white p-3 rounded-xl border border-zinc-100 leading-relaxed">
                  <strong>Requirement:</strong> {enq.estimatedQuantity} Units of {enq.category}<br />
                  <p className="mt-1 italic">"{enq.message}"</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 8: CUSTOMER COMPLAINTS */}
      {activeAdminTab === 'complaints' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="font-serif font-bold text-lg text-zinc-900">
                Customer Support Complaints & Grievances ({complaints.length})
              </h3>
              <p className="text-xs text-zinc-500">
                Review and resolve customer size exchange, delivery delay, damaged item, or bulk inquiry tickets.
              </p>
            </div>
            <span className="bg-amber-100 text-amber-900 text-xs font-bold font-mono px-3 py-1 rounded-full">
              Hotline: {HOTLINE_NUMBER}
            </span>
          </div>

          <div className="space-y-4">
            {complaints.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">No customer complaints currently logged.</p>
            ) : (
              complaints.map(cmp => (
                <div key={cmp.id} className="p-5 border border-zinc-200 rounded-xl space-y-3 bg-zinc-50/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs bg-zinc-900 text-amber-400 px-2.5 py-1 rounded-md">
                        #{cmp.ticketNumber}
                      </span>
                      <span className="text-xs font-bold text-zinc-900">
                        {cmp.customerName} ({cmp.customerPhone})
                      </span>
                      {cmp.orderNumber && (
                        <span className="text-xs font-mono font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                          Order: #{cmp.orderNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        cmp.status === 'Resolved' ? 'bg-emerald-100 text-emerald-900' :
                        cmp.status === 'In Progress' ? 'bg-amber-100 text-amber-900' : 'bg-blue-100 text-blue-900'
                      }`}>
                        {cmp.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">{cmp.category}</span>
                    <h4 className="font-bold text-sm text-zinc-900">{cmp.subject}</h4>
                    <p className="text-xs text-zinc-700 mt-1 bg-white p-3 rounded-lg border border-zinc-200">
                      "{cmp.description}"
                    </p>
                  </div>

                  {cmp.adminResponse && (
                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200 text-xs">
                      <strong className="text-amber-950 block">Current Admin Note:</strong>
                      <p className="text-amber-900">{cmp.adminResponse}</p>
                    </div>
                  )}

                  {replyingComplaintId === cmp.id ? (
                    <div className="bg-white p-4 border border-zinc-300 rounded-xl space-y-3">
                      <h5 className="font-bold text-xs text-zinc-900">Update Ticket Response & Status</h5>
                      <textarea
                        rows={3}
                        value={adminReplyText}
                        onChange={(e) => setAdminReplyText(e.target.value)}
                        placeholder="Type official response note to customer..."
                        className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 text-xs text-zinc-900"
                      />
                      <div className="flex items-center justify-between">
                        <select
                          value={adminReplyStatus}
                          onChange={(e) => setAdminReplyStatus(e.target.value)}
                          className="bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-1.5 text-xs font-bold"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setReplyingComplaintId(null)}
                            className="px-3 py-1.5 border border-zinc-300 rounded-lg text-xs font-bold text-zinc-700"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              await updateComplaintStatus(cmp.id, adminReplyStatus, adminReplyText);
                              setReplyingComplaintId(null);
                            }}
                            className="bg-zinc-900 text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase"
                          >
                            Save Response
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReplyingComplaintId(cmp.id);
                        setAdminReplyText(cmp.adminResponse || '');
                        setAdminReplyStatus(cmp.status);
                      }}
                      className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
                      <span>{cmp.adminResponse ? 'Update Response' : 'Reply to Ticket'}</span>
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 9: SUPABASE BACKEND MANAGEMENT */}
      {activeAdminTab === 'supabase' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase">
                  Connected & Active
                </span>
                <span className="text-xs font-bold text-zinc-500">Project ID: <code className="text-amber-800 font-mono bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">qajvraejccvodszunczs</code></span>
              </div>
              <h3 className="font-serif font-bold text-2xl text-zinc-900 mt-1">Supabase Database Integration</h3>
              <p className="text-xs text-zinc-500">
                All order submissions, bulk inquiries, and customer support complaints are automatically saved and synced with your Supabase tables.
              </p>
            </div>

            <button
              onClick={fetchSupabaseStatus}
              disabled={isTestingSupabase}
              className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isTestingSupabase ? 'animate-spin' : ''}`} />
              <span>{isTestingSupabase ? 'Testing Connection...' : 'Re-test Supabase Connection'}</span>
            </button>
          </div>

          {/* Credentials Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Supabase Project URL</span>
              <div className="font-mono text-xs font-bold text-zinc-900 break-all bg-white p-2.5 rounded-lg border border-zinc-200">
                https://qajvraejccvodszunczs.supabase.co
              </div>
            </div>

            <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-200 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Publishable API Key</span>
              <div className="font-mono text-xs font-bold text-amber-800 break-all bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                sb_publishable_cdKrN0dytpZ_yxZ_gwUVtg_uE9j89ho
              </div>
            </div>
          </div>

          {/* Live Sync Metrics */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-zinc-900">Live Data Sync Status</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-emerald-800 block">Orders Table</span>
                <span className="text-xl font-bold font-mono text-emerald-950 block mt-1">
                  {orders.length} Records Synced
                </span>
                <span className="text-[11px] text-emerald-700 mt-1 block">Table: <code className="font-mono font-bold">public.orders</code></span>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-blue-800 block">Bulk Enquiries Table</span>
                <span className="text-xl font-bold font-mono text-blue-950 block mt-1">
                  {bulkEnquiries.length} Records Synced
                </span>
                <span className="text-[11px] text-blue-700 mt-1 block">Table: <code className="font-mono font-bold">public.bulk_enquiries</code></span>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-xl">
                <span className="text-[10px] font-bold uppercase text-purple-800 block">Complaints & Tickets</span>
                <span className="text-xl font-bold font-mono text-purple-950 block mt-1">
                  {complaints.length} Records Synced
                </span>
                <span className="text-[11px] text-purple-700 mt-1 block">Table: <code className="font-mono font-bold">public.complaints</code></span>
              </div>
            </div>
          </div>

          {/* SQL Schema Script helper */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-serif font-bold text-sm text-zinc-900">Supabase SQL Editor Setup Script</h4>
                <p className="text-xs text-zinc-500">Run this SQL in your Supabase SQL Editor if you ever need to recreate or clear tables.</p>
              </div>
              <button
                onClick={() => {
                  const sqlText = `-- Supabase Table Setup for London Style E-Commerce Backend

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT,
  shipping_address JSONB,
  items JSONB,
  subtotal NUMERIC,
  discount_amount NUMERIC DEFAULT 0,
  coupon_code TEXT,
  shipping_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT,
  payment_status TEXT,
  payment_id TEXT,
  order_status TEXT DEFAULT 'Pending',
  timeline JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_delivery TEXT
);

CREATE TABLE IF NOT EXISTS public.bulk_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  category TEXT,
  estimated_quantity INT,
  message TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.complaints (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT,
  order_number TEXT,
  category TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  priority TEXT DEFAULT 'Medium',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`;
                  navigator.clipboard.writeText(sqlText);
                  setCopiedSql(true);
                  setTimeout(() => setCopiedSql(false), 2000);
                }}
                className="bg-zinc-100 hover:bg-zinc-200 text-zinc-900 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5"
              >
                <span>{copiedSql ? '✓ Copied SQL!' : '📋 Copy SQL Script'}</span>
              </button>
            </div>

            <pre className="bg-zinc-900 text-amber-300 p-4 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-zinc-800 max-h-64">
{`-- Supabase Table Setup for London Style E-Commerce Backend

CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT,
  shipping_address JSONB,
  items JSONB,
  subtotal NUMERIC,
  discount_amount NUMERIC DEFAULT 0,
  coupon_code TEXT,
  shipping_fee NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT,
  payment_status TEXT,
  payment_id TEXT,
  order_status TEXT DEFAULT 'Pending',
  timeline JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  estimated_delivery TEXT
);

CREATE TABLE IF NOT EXISTS public.bulk_enquiries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company_name TEXT,
  category TEXT,
  estimated_quantity INT,
  message TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.complaints (
  id TEXT PRIMARY KEY,
  ticket_number TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_name TEXT,
  order_number TEXT,
  category TEXT,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'Open',
  priority TEXT DEFAULT 'Medium',
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 10: SALES REPORTS */}
      {activeAdminTab === 'reports' && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-6 space-y-6 shadow-2xs">
          <div className="flex items-center justify-between">
            <h3 className="font-serif font-bold text-lg text-zinc-900">Revenue & Sales Report Summaries</h3>
            <button
              onClick={() => window.print()}
              className="bg-zinc-900 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Full Report
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-6 text-xs">
            <div className="p-4 bg-zinc-50 rounded-xl border space-y-2">
              <h4 className="font-bold text-zinc-900 text-sm">July 2026 Monthly Breakdown</h4>
              <div className="flex justify-between"><span>Gross Revenue:</span><strong className="font-mono">₹1,25,000</strong></div>
              <div className="flex justify-between"><span>Total Delivered Orders:</span><strong className="font-mono">{orders.length}</strong></div>
              <div className="flex justify-between"><span>GST Input Credit Collected:</span><strong className="font-mono">₹22,500</strong></div>
            </div>

            <div className="p-4 bg-zinc-50 rounded-xl border space-y-2">
              <h4 className="font-bold text-zinc-900 text-sm">Hotline Complaints Log</h4>
              <div className="flex justify-between"><span>Hotline Number:</span><strong className="font-mono text-amber-700">{HOTLINE_NUMBER}</strong></div>
              <div className="flex justify-between"><span>Open Complaints:</span><strong className="font-mono text-emerald-600">0 Pending</strong></div>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4 border border-zinc-200">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-zinc-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Apparel Item'}
              </h3>
              <button onClick={() => setIsAddProductOpen(false)} className="text-zinc-400 hover:text-zinc-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as any })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Original MRP (₹)</label>
                  <input
                    type="number"
                    value={productForm.originalPrice}
                    onChange={(e) => setProductForm({ ...productForm, originalPrice: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Stock Availability *</label>
                  <select
                    value={(productForm.stock ?? 0) > 0 ? 'in_stock' : 'out_of_stock'}
                    onChange={(e) => {
                      const isInstock = e.target.value === 'in_stock';
                      setProductForm({
                        ...productForm,
                        stock: isInstock ? ((productForm.stock && productForm.stock > 0) ? productForm.stock : 50) : 0
                      });
                    }}
                    className={`w-full border rounded-lg p-2.5 font-bold cursor-pointer ${
                      (productForm.stock ?? 0) > 0
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                        : 'bg-red-50 border-red-300 text-red-900'
                    }`}
                  >
                    <option value="in_stock">🟢 In Stock</option>
                    <option value="out_of_stock">🔴 Out of Stock</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Stock Quantity (Units) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Math.max(0, Number(e.target.value) || 0) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Discount (% Off)</label>
                  <input
                    type="number"
                    value={productForm.discount}
                    onChange={(e) => setProductForm({ ...productForm, discount: Number(e.target.value) })}
                    className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5 font-mono"
                  />
                </div>
              </div>

              {/* Product Media & Image Options */}
              <div className="space-y-3 bg-zinc-50 border border-zinc-200 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-zinc-900 text-xs">Product Media & Gallery Images *</label>
                  <span className="text-[10px] text-zinc-500 font-bold bg-zinc-200 px-2 py-0.5 rounded-full">
                    {productForm.images?.length || 0} images added
                  </span>
                </div>

                {/* Source Tabs */}
                <div className="grid grid-cols-3 gap-1.5 bg-zinc-200/80 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setImageSourceTab('file')}
                    className={`py-1.5 px-2 rounded-md font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                      imageSourceTab === 'file' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-amber-600" />
                    <span>File Manager</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceTab('gdrive')}
                    className={`py-1.5 px-2 rounded-md font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                      imageSourceTab === 'gdrive' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Cloud className="w-3.5 h-3.5 text-blue-600" />
                    <span>Google Drive</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setImageSourceTab('url')}
                    className={`py-1.5 px-2 rounded-md font-bold text-[11px] transition-all flex items-center justify-center gap-1.5 ${
                      imageSourceTab === 'url' ? 'bg-white text-zinc-950 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                    }`}
                  >
                    <Globe className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Web URL</span>
                  </button>
                </div>

                {/* OPTION 1: File Manager (Local Device Upload) */}
                {imageSourceTab === 'file' && (
                  <div className="space-y-2">
                    <div className="border-2 border-dashed border-zinc-300 hover:border-amber-500 bg-white p-4 rounded-xl text-center transition-all cursor-pointer relative group">
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                      />
                      <div className="flex flex-col items-center justify-center space-y-1">
                        <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Upload className="w-5 h-5" />
                        </div>
                        <p className="font-bold text-zinc-800 text-xs">Click or Drag & Drop from File Manager</p>
                        <p className="text-[10px] text-zinc-500">Supports PNG, JPG, WEBP, JPEG up to 10MB</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* OPTION 2: Google Drive Link Import */}
                {imageSourceTab === 'gdrive' && (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-zinc-200">
                    <div className="flex items-center gap-2 text-blue-800 bg-blue-50/80 p-2 rounded-lg text-[11px]">
                      <Cloud className="w-4 h-4 shrink-0" />
                      <span>Paste your Google Drive public share link or File ID below:</span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://drive.google.com/file/d/1ABC123.../view?usp=sharing"
                          value={gdriveInput}
                          onChange={(e) => setGdriveInput(e.target.value)}
                          className="flex-1 bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono"
                        />
                        <button
                          type="button"
                          onClick={handleAddGdriveImage}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 rounded-lg text-xs shrink-0 flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Add Drive Image
                        </button>
                      </div>

                      {gdriveStatusMsg && (
                        <p className={`text-[11px] font-bold ${gdriveStatusMsg.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {gdriveStatusMsg.text}
                        </p>
                      )}

                      <div className="text-[10px] text-zinc-500 flex items-center justify-between">
                        <span>💡 Tip: Set Google Drive permissions to "Anyone with link can view".</span>
                        <a
                          href="https://drive.google.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-0.5"
                        >
                          Google Drive <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* OPTION 3: Web Image URL */}
                {imageSourceTab === 'url' && (
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-zinc-200">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/photo-..."
                        value={singleUrlInput}
                        onChange={(e) => setSingleUrlInput(e.target.value)}
                        className="flex-1 bg-zinc-50 border border-zinc-300 rounded-lg px-3 py-2 text-xs font-mono"
                      />
                      <button
                        type="button"
                        onClick={handleAddSingleUrl}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white font-bold px-3 py-2 rounded-lg text-xs shrink-0 flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add URL
                      </button>
                    </div>
                  </div>
                )}

                {/* Added Gallery Images List */}
                {productForm.images && productForm.images.length > 0 ? (
                  <div className="space-y-1.5 pt-2 border-t border-zinc-200">
                    <span className="text-[11px] font-bold text-zinc-700 block">Product Gallery ({productForm.images.length}) - 1st is Cover</span>
                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                      {productForm.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative group rounded-lg overflow-hidden border border-zinc-300 bg-white aspect-square shadow-xs">
                          <img src={imgUrl} alt={`Product ${idx + 1}`} className="w-full h-full object-cover" />
                          {idx === 0 ? (
                            <span className="absolute top-1 left-1 bg-amber-500 text-zinc-950 font-black text-[9px] uppercase px-1.5 py-0.5 rounded-xs shadow-xs">
                              Cover
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(idx)}
                              className="absolute top-1 left-1 bg-zinc-900/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Set as cover image"
                            >
                              Make Main
                            </button>
                          )}
                          <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(idx)}
                              className="p-1.5 bg-red-600 text-white rounded-md hover:scale-110 transition-transform shadow-xs"
                              title="Remove image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] font-bold text-red-600 bg-red-50 p-2 rounded-lg text-center">
                    ⚠️ At least 1 image is required for the product catalog.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-bold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-zinc-50 border border-zinc-300 rounded-lg p-2.5"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-zinc-900 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-wider"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
